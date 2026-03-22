'use client';

import { IssueSource } from '@/lib/types';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Layers, 
  Palette, 
  Sparkles, 
  Lightbulb, 
  Navigation, 
  FormInput, 
  Zap,
  Activity
} from 'lucide-react';
import React from 'react';

interface EngineBreakdownProps {
  data: Record<string, number>;
}

export function EngineBreakdown({ data }: EngineBreakdownProps) {
  const engineInfo: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    wcag: { label: 'WCAG Rules', color: 'bg-emerald-500', icon: <ShieldCheck size={14} /> },
    structural: { label: 'Structural', color: 'bg-sky-500', icon: <Layers size={14} /> },
    contrast: { label: 'Contrast', color: 'bg-purple-500', icon: <Palette size={14} /> },
    ai: { label: 'AI Intelligence', color: 'bg-amber-500', icon: <Sparkles size={14} /> },
    heuristic: { label: 'Heuristic', color: 'bg-indigo-500', icon: <Lightbulb size={14} /> },
    navigation: { label: 'Navigation', color: 'bg-rose-500', icon: <Navigation size={14} /> },
    form: { label: 'Form logic', color: 'bg-cyan-500', icon: <FormInput size={14} /> },
    performance: { label: 'Performance', color: 'bg-orange-500', icon: <Zap size={14} /> },
  };

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <div className="glass-card p-10 border-white/5 h-full relative overflow-hidden group">
      <div className="flex items-center gap-3 text-slate-500 mb-10">
        <Activity size={20} className="text-brand-400" />
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Engine Specificity</h2>
      </div>
      
      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-700">
           <ShieldCheck size={56} className="mb-4 opacity-10" />
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">No Intelligence Data</p>
        </div>
      ) : (
        <div className="space-y-8">
          {(Object.entries(data)).map(([engine, count], index) => {
            if (count === 0) return null;
            const percentage = (count / total) * 100;
            const info = engineInfo[engine] || { 
              label: engine.replace(/_/g, ' '), 
              color: 'bg-slate-500', 
              icon: <Activity size={16} /> 
            };
            
            return (
              <div key={engine} className="relative">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest mb-3">
                  <div className="flex items-center gap-3 text-slate-200">
                    <span className={`p-1.5 rounded-lg bg-slate-950 border border-white/5 ${info.color.replace('bg-', 'text-')} shadow-lg`}>
                      {info.icon}
                    </span>
                    <span className="tracking-[0.1em]">{info.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">{count}</span>
                    <span className="text-slate-500 font-bold">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 border border-white/5 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className={`${info.color} h-full relative`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Background Decorative Element */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
