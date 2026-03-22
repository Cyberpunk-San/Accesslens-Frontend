'use client';

import { UnifiedIssue } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Target, AlertCircle, Info, Maximize2, MousePointer2, Layers, Flame, ScatterChart } from 'lucide-react';

interface HeatmapOverlayProps {
  issues: UnifiedIssue[];
  screenshot?: string;
  viewportWidth?: number;
}

interface Cluster {
  id: string;
  x: number;
  y: number;
  issues: UnifiedIssue[];
  severity: string;
}

export function HeatmapOverlay({ issues, screenshot, viewportWidth = 1280 }: HeatmapOverlayProps) {
  const [hoveredCluster, setHoveredCluster] = useState<Cluster | null>(null);
  const [mode, setMode] = useState<'cluster' | 'heatmap'>('cluster');

  const locatableIssues = useMemo(() => issues.filter(i => i.location?.bounding_box), [issues]);

  // Simple Distance-based Clustering
  const clusters = useMemo(() => {
    const items: Cluster[] = [];
    const radius = 50; // px

    locatableIssues.forEach(issue => {
      const box = issue.location!.bounding_box!;
      const foundIdx = items.findIndex(c => {
        const dx = c.x - box.x;
        const dy = c.y - box.y;
        return Math.sqrt(dx * dx + dy * dy) < radius;
      });

      if (foundIdx > -1) {
        items[foundIdx].issues.push(issue);
        // Elevate severity if needed
        const sevOrder = { 'critical': 0, 'serious': 1, 'moderate': 2, 'minor': 3 };
        const currentSev = items[foundIdx].severity.toLowerCase() as keyof typeof sevOrder;
        const newSev = issue.severity.toLowerCase() as keyof typeof sevOrder;
        if ((sevOrder[newSev] ?? 99) < (sevOrder[currentSev] ?? 99)) {
          items[foundIdx].severity = issue.severity;
        }
      } else {
        items.push({
          id: `cluster-${issue.id}`,
          x: box.x,
          y: box.y,
          issues: [issue],
          severity: issue.severity
        });
      }
    });

    return items;
  }, [locatableIssues]);

  if (!screenshot && locatableIssues.length === 0) {
    return (
      <div className="glass-card p-24 text-center border-white/5">
        <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-700 mx-auto mb-8 shadow-inner">
          <Target size={40} />
        </div>
        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-4">No Spatial Data</h3>
        <p className="text-slate-500 max-w-sm mx-auto font-medium">Visual mapping requires element coordinates which were not present in this audit trace.</p>
      </div>
    );
  }

  return (
    <div className="relative glass-card border-white/5 overflow-hidden bg-slate-950 shadow-2xl">
      {/* Analytical Header */}
      <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
              <Target size={20} />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Spatial Barrier Intelligence</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                Mapped {locatableIssues.length} coordinates into {clusters.length} analytical clusters
              </p>
            </div>
          </div>

          <div className="h-8 w-px bg-white/5 mx-2" />

          <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
             <button 
               onClick={() => setMode('cluster')}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'cluster' ? 'bg-brand-500 text-white shadow-glow-sm' : 'text-slate-500 hover:text-slate-300'}`}
             >
               <ScatterChart size={12} />
               Clustered
             </button>
             <button 
               onClick={() => setMode('heatmap')}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'heatmap' ? 'bg-brand-500 text-white shadow-glow-sm' : 'text-slate-500 hover:text-slate-300'}`}
             >
               <Flame size={12} />
               Heatmap
             </button>
          </div>
        </div>

        <div className="flex gap-6">
          <LegendItem color="bg-rose-500" label="Critical Area" />
          <LegendItem color="bg-orange-500" label="Major Density" />
          <LegendItem color="bg-amber-500" label="Standard Area" />
        </div>
      </div>

      {/* Map Container */}
      <div className="relative overflow-auto max-h-[800px] bg-slate-950 group/map">
        <div className="relative mx-auto" style={{ width: '100%', maxWidth: '1280px' }}>
          {screenshot && (
            <div className="relative">
              <img 
                src={`data:image/jpeg;base64,${screenshot}`} 
                alt="Page Scan" 
                className={`w-full h-auto transition-all duration-700 ${mode === 'heatmap' ? 'opacity-20 grayscale brightness-50' : 'opacity-30 brightness-[0.4] contrast-125 group-hover/map:opacity-50 group-hover/map:brightness-[0.6]'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />
            </div>
          )}

          {/* Heatmap Layer */}
          <AnimatePresence>
            {mode === 'heatmap' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-0 pointer-events-none"
              >
                {locatableIssues.map((issue, idx) => {
                  const box = issue.location!.bounding_box!;
                  const severityColor = {
                    critical: 'rgba(244, 63, 94, 0.4)',
                    serious: 'rgba(249, 115, 22, 0.3)',
                    moderate: 'rgba(245, 158, 11, 0.2)',
                    minor: 'rgba(59, 130, 246, 0.1)'
                  }[issue.severity];

                  return (
                    <div 
                      key={`heat-${idx}`}
                      className="absolute rounded-full blur-[40px]"
                      style={{
                        left: `${(box.x / viewportWidth) * 100}%`,
                        top: `${box.y}px`,
                        width: '120px',
                        height: '120px',
                        backgroundColor: severityColor,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cluster Markers */}
          {mode === 'cluster' && clusters.map((cluster) => {
            const severityColor = {
              critical: 'bg-rose-500',
              serious: 'bg-orange-500',
              moderate: 'bg-amber-500',
              minor: 'bg-blue-500'
            }[cluster.severity];

            const ringColor = {
               critical: 'ring-rose-500/40 border-rose-400/50',
               serious: 'ring-orange-500/40 border-orange-400/50',
               moderate: 'ring-amber-500/40 border-amber-400/50',
               minor: 'ring-blue-500/40 border-blue-400/50'
            }[cluster.severity];

            return (
              <div
                key={cluster.id}
                className="absolute z-10"
                style={{
                  left: `${(cluster.x / viewportWidth) * 100}%`,
                  top: `${cluster.y}px`, 
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="relative">
                   {/* Ping Animation for Large Clusters */}
                   {cluster.issues.length > 3 && (
                     <motion.div 
                       animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                       transition={{ duration: 1.5, repeat: Infinity }}
                       className={`absolute inset-0 rounded-full ${severityColor}`}
                     />
                   )}
                   
                   <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.2, zIndex: 100 }}
                    onMouseEnter={() => setHoveredCluster(cluster)}
                    onMouseLeave={() => setHoveredCluster(null)}
                    className={`
                      cursor-crosshair border-2 shadow-[0_0_20px_rgba(0,0,0,0.6)] 
                      ring-4 transition-all duration-300 flex items-center justify-center
                      ${severityColor} ${ringColor} rounded-full
                      ${cluster.issues.length > 5 ? 'w-10 h-10' : cluster.issues.length > 1 ? 'w-8 h-8' : 'w-6 h-6'}
                    `}
                  >
                    {cluster.issues.length > 1 && (
                      <span className="text-[10px] font-black text-white">{cluster.issues.length}</span>
                    )}
                  </motion.div>
                </div>
              </div>
            );
          })}

          {/* Precision Crosshair on Hover */}
          <AnimatePresence>
            {hoveredCluster && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none z-0"
              >
                 <div 
                   className="absolute border-l border-brand-500/30 h-full" 
                   style={{ left: `${(hoveredCluster.x / viewportWidth) * 100}%` }} 
                 />
                 <div 
                   className="absolute border-t border-brand-500/30 w-full" 
                   style={{ top: `${hoveredCluster.y}px` }} 
                 />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Hover Portal */}
          <AnimatePresence mode="wait">
            {hoveredCluster && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] w-[450px] glass-card p-1 pb-1 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden"
              >
                <div className={`h-1.5 w-full ${
                  hoveredCluster.severity === 'critical' ? 'bg-rose-500' :
                  hoveredCluster.severity === 'serious' ? 'bg-orange-500' : 'bg-amber-500'
                }`} />
                
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          hoveredCluster.severity === 'critical' ? 'text-rose-400' : 'text-orange-400'
                        }`}>
                          {hoveredCluster.severity} Analytical Region
                        </span>
                        <span className="text-slate-600 font-bold">•</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                           {hoveredCluster.issues.length} Intersecting Violations
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white italic tracking-tight leading-none pt-1">
                        {hoveredCluster.issues[0].title} {hoveredCluster.issues.length > 1 && `& More`}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 shrink-0 border border-white/5">
                      <Layers size={18} />
                    </div>
                  </div>

                  <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 space-y-3">
                    {hoveredCluster.issues.slice(0, 3).map((issue, idx) => (
                      <div key={issue.id} className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-300 truncate max-w-[300px]">{issue.title}</span>
                        <span className="text-slate-600 font-mono">#{idx + 1}</span>
                      </div>
                    ))}
                    {hoveredCluster.issues.length > 3 && (
                      <div className="text-[9px] font-black text-brand-500 text-center uppercase tracking-widest pt-1 border-t border-white/5">
                        + {hoveredCluster.issues.length - 3} additional signatures in region
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="p-5 bg-slate-900/40 backdrop-blur-md border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Info size={14} className="text-brand-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
            Cluster Resolution: 50px • Spatial Optimization Active
          </span>
        </div>
        <div className="flex items-center gap-4">
           <LegendItem color="bg-rose-500/50 blur-[2px]" label="Heat Focus" />
           <LegendItem color="bg-brand-500/20" label="Active Region" />
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5 group">
      <div className={`w-3 h-3 rounded-full ${color} shadow-lg ring-2 ring-transparent group-hover:ring-white/10 transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]`}></div>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">
        {label}
      </span>
    </div>
  );
}
