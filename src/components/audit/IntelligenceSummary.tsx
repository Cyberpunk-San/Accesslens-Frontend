import React from 'react';
import { Shield, Zap, Sparkles, AlertCircle, Info } from 'lucide-react';
import { AuditReport, IssueSeverity } from '@/lib/types';

interface IntelligenceSummaryProps {
  report: AuditReport;
}

export function IntelligenceSummary({ report }: IntelligenceSummaryProps) {
  const { summary, issues } = report;
  
  // Synthesize findings
  const criticalCount = summary.by_severity.critical || 0;
  const seriousCount = summary.by_severity.serious || 0;
  const totalBoringIssues = (summary.by_severity.moderate || 0) + (summary.by_severity.minor || 0);
  
  const mainFindings = [];
  
  if (criticalCount > 0) {
    mainFindings.push(`${criticalCount} critical barriers were identified that strictly block user workflows.`);
  }
  
  if (seriousCount > 0) {
    mainFindings.push(`${seriousCount} high-impact issues were detected affecting key interactive elements.`);
  }

  const topEngines = Object.entries(summary.by_source)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);

  return (
    <div className="glass-card p-10 border-white/5 bg-slate-900/40 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 text-brand-500/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
        <Sparkles size={120} />
      </div>

      <div className="relative z-10 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
            <Zap size={20} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Executive Synthesis</h2>
        </div>

        <div className="space-y-8">
          <p className="text-2xl font-black text-white leading-tight tracking-tight">
            Comprehensive audit reveals <span className="text-brand-400">{summary.total_issues} accessibility signals</span> across the digital architecture, with a global health index of <span className="text-brand-400">{summary.score}%</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-8 border-y border-white/5">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <Shield size={14} className="text-brand-500" />
                Structural Integrity
              </h3>
              <ul className="space-y-3">
                {mainFindings.map((finding, i) => (
                  <li key={i} className="text-sm text-slate-300 font-medium leading-relaxed flex gap-3">
                     <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0"></span>
                     {finding}
                  </li>
                ))}
                {mainFindings.length === 0 && (
                   <li className="text-sm text-slate-500 italic">No critical or serious structural barriers detected in the primary layer.</li>
                )}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <Sparkles size={14} className="text-amber-500" />
                Intelligence Attribution
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Analysis powered by {report.metadata.engines_run?.length || 0} active detectors. 
                The <span className="text-slate-200 capitalize">{topEngines[0]?.[0]} engine</span> was the most active contributor, identifying <span className="text-slate-200">{topEngines[0]?.[1]}</span> distinct patterns.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            <div className="flex items-center gap-4">
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors
                ${summary.score > 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                {summary.score > 80 ? 'Grade: Optimized' : 'Grade: Needs Intervention'}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-600">
                Confidence: {summary.confidence_avg}% (Aggregated)
              </span>
            </div>
            
            <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <Info size={14} />
              AI synthesized this briefing from {issues.length} data points.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
