'use client';

import React, { useState } from 'react';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuditDetails } from '@/hooks/use-audits';
import {
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Search,
  History,
  Info,
  Layers,
  Sparkles,
  Globe,
  Target,
  Maximize2,
  Table,
  ShieldCheck,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntelligenceSummary } from '@/components/audit/IntelligenceSummary';
import { ScoreCard } from '@/components/audit/ScoreCard';
import { IssueList } from '@/components/audit/IssueList';
import { SeverityChart } from '@/components/charts/SeverityChart';
import { CoverageComparator } from '@/components/charts/CoverageComparator';
import { HeatmapOverlay } from '@/components/audit/HeatmapOverlay';
import { ConfidenceGauge } from '@/components/charts/ConfidenceGauge';
import { AuditLoading } from '@/components/ui/AuditLoading';
import { AuditMeditation } from '@/components/ui/AuditMeditation';
import { TreeVisualizer } from '@/components/audit/TreeVisualizer';
import { EngineBreakdown } from '@/components/charts/EngineBreakdown';
import { ContrastPatternGallery } from '@/components/audit/ContrastPatternGallery';
import { RemediationHub } from '@/components/audit/RemediationHub';

export default function AuditResultsPage() {
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<'issues' | 'heatmap' | 'tree' | 'analytics' | 'remediation'>('issues');

  const { data: report, isPending, isError, refetch } = useAuditDetails(id);

  if (isPending) {
    return <AuditLoading />;
  }

  if (isError || !report) {
    return <AuditMeditation id={id} onRetry={() => refetch()} />;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-24 relative overflow-hidden">
      {/* HUD Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl">
        <div className="container-custom py-6 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 glow-brand">
              <Globe className="text-white" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-2xl font-black tracking-tight truncate max-w-[400px] text-white underline decoration-brand-500/30 underline-offset-8 decoration-2">
                  {report.request.url}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase tracking-widest animate-pulse-slow">
                  Live
                </span>
              </div>
              <p className="mt-2 text-xs font-bold uppercase text-slate-500 tracking-[0.2em]">
                Analyzed {new Date(report.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex flex-nowrap overflow-x-auto scrollbar-hide bg-slate-900/40 p-1.5 md:p-2 rounded-2xl md:rounded-[22px] border border-white/5 shadow-inner max-w-full">
            <TabButton
              active={activeTab === 'issues'}
              onClick={() => setActiveTab('issues')}
              icon={<Table size={18} />}
              label="Issue Matrix"
            />
            <TabButton
              active={activeTab === 'heatmap'}
              onClick={() => setActiveTab('heatmap')}
              icon={<Target size={18} />}
              label="Spatial Map"
            />
            <TabButton
              active={activeTab === 'tree'}
              onClick={() => setActiveTab('tree')}
              icon={<Database size={18} />}
              label="Tree Map"
            />
            <TabButton
              active={activeTab === 'remediation'}
              onClick={() => setActiveTab('remediation')}
              icon={<Sparkles size={18} />}
              label="Remediation"
            />
            <TabButton
              active={activeTab === 'analytics'}
              onClick={() => setActiveTab('analytics')}
              icon={<History size={18} />}
              label="Intelligence"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `accesslens-report-${id.substring(0, 8)}.json`;
                a.click();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/20 transition-all shadow-xl"
            >
              <Maximize2 size={14} />
              Export JSON
            </button>
          </div>
        </div>
      </header>

      <div className="container-custom mt-16">
        <AnimatePresence mode="wait">
          {activeTab === 'issues' && (
            <motion.div
              key="issues"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              {/* Metric Pulse */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <ScoreCard
                  title="Health Index"
                  value={`${report.summary.score}%`}
                  icon={<ShieldCheck className="text-brand-400" size={24} />}
                  trend="+4.2%"
                  color="from-brand-500/20 to-brand-600/20"
                  tooltip="Deductions are based on unique issue types (not instances), weighted by severity, and scaled by engine confidence. Maximum deduction is capped at 70 points for clarity."
                />
                <ScoreCard
                  title="Critical Barriers"
                  value={report.summary.total_issues}
                  icon={<AlertCircle className="text-rose-500" size={24} />}
                  color="from-rose-500/20 to-rose-600/20"
                />
                <ScoreCard
                  title="Intelligence Confidence"
                  value={`${report.summary.confidence_avg}%`}
                  icon={<Sparkles className="text-amber-500" size={24} />}
                  color="from-amber-500/20 to-amber-600/20"
                  tooltip="Weighted average of the detection reliability across all active engines (Axe, Contrast, Structural, etc.)."
                />
                <ScoreCard
                  title="WCAG Compliance"
                  value={report.summary.by_wcag_level.AA || 0}
                  icon={<CheckCircle2 className="text-indigo-500" size={24} />}
                  subtitle="Grade AA Validated"
                  color="from-indigo-500/20 to-indigo-600/20"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
                <div className="lg:col-span-2 space-y-10">
                  <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">Barrier Manifest</h2>
                    <div className="flex gap-3">
                      <span className="px-4 py-1.5 bg-slate-900/50 rounded-full border border-white/5 text-[10px] font-black uppercase text-slate-400 tracking-widest shadow-inner">
                        Filter: All Detectors
                      </span>
                    </div>
                  </div>
                  <IssueList issues={report.issues} />
                </div>
                <div className="space-y-12 lg:sticky lg:top-32">
                  <SeverityChart data={report.summary.by_severity} />
                  <ConfidenceGauge confidence={report.summary.confidence_avg} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'heatmap' && (
            <motion.div
              key="heatmap"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="mb-8">
                <h2 className="text-4xl font-display font-black text-white tracking-tight uppercase mb-2">Spatial Distribution</h2>
                <p className="text-brand-400/60 font-mono font-bold tracking-widest uppercase text-[9px] flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-brand-500 animate-pulse" />
                  Geometric Barrier Mapping // Viewport Matrix
                </p>
              </div>
              <HeatmapOverlay
                issues={report.issues}
                screenshot={report.metadata.full_screenshot}
                viewportWidth={report.request.viewport?.width || 1280}
              />
            </motion.div>
          )}

          {activeTab === 'tree' && (
            <motion.div
              key="tree"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <div className="mb-8">
                <h2 className="text-4xl font-display font-black text-white tracking-tight uppercase mb-2">Accessibility Tree</h2>
                <p className="text-brand-400/60 font-mono font-bold tracking-widest uppercase text-[9px] flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-brand-500 animate-pulse" />
                  Architectural Synthesis // Virtual DOM Trace
                </p>
              </div>
              <TreeVisualizer
                tree={report.accessibility_tree || { nodes: [] }}
                issues={report.issues}
              />
            </motion.div>
          )}

          {activeTab === 'remediation' && (
            <motion.div
              key="remediation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-8">
                <h2 className="text-4xl font-display font-black text-white tracking-tight uppercase mb-2">Remediation Hub</h2>
                <p className="text-brand-400/60 font-mono font-bold tracking-widest uppercase text-[9px] flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-brand-500 animate-pulse" />
                  AI Structural Evolution // Adaptive Patching
                </p>
              </div>
              <RemediationHub issues={report.issues} />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <IntelligenceSummary report={report} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                  <EngineBreakdown data={report.summary.by_source as any} />

                  {report.summary.contrast_patterns && report.summary.contrast_patterns.length > 0 && (
                    <ContrastPatternGallery patterns={report.summary.contrast_patterns} />
                  )}
                </div>

                <div className="space-y-12">
                  <CoverageComparator summary={report.summary} />

                  <div className="glass-card p-10 border-white/5 bg-slate-900/40">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-10 border-b border-white/5 pb-4">Audit Telemetry</h2>
                    <dl className="space-y-4">
                      <TelemetryItem label="Scan Duration" value={`${report.metadata.duration_seconds}s`} />
                      <TelemetryItem label="Complex Nodes" value={report.accessibility_tree?.node_count || report.metadata.total_elements || 'Unknown'} />
                      <TelemetryItem label="Detectors Active" value={report.metadata.engines_run?.join(', ')} />
                      <TelemetryItem label="Core Entropy" value={id.substring(0, 12).toUpperCase()} />
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-3 md:px-6 py-2 rounded-xl flex items-center gap-2 md:gap-3 transition-all duration-300 flex-shrink-0
        ${active ? 'text-white' : 'text-slate-500 hover:text-slate-300'}
      `}
    >
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-brand-500/10 border border-brand-500/20 rounded-xl"
        />
      )}
      <span className="relative z-10 shrink-0">{icon}</span>
      <span className="relative z-10 text-[9px] md:text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function TelemetryItem({ label, value }: { label: string, value: any }) {
  return (
    <div className="flex justify-between items-baseline py-4 border-b border-slate-900 last:border-0">
      <dt className="text-[10px] font-black uppercase tracking-widest text-slate-600">{label}</dt>
      <dd className="text-sm font-bold text-white">{value}</dd>
    </div>
  );
}
