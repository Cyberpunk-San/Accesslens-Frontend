'use client';

import { UnifiedIssue } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Sparkles, Code, CheckCircle2, AlertCircle, ArrowRight, Zap, Copy, ExternalLink, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface RemediationHubProps {
  issues: UnifiedIssue[];
}

export function RemediationHub({ issues }: RemediationHubProps) {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(issues.find(i => i.remediation)?.id || null);

  const remediableIssues = issues.filter(i => i.remediation && i.remediation.code_after);
  const selectedIssue = remediableIssues.find(i => i.id === selectedIssueId);

  if (remediableIssues.length === 0) {
    return (
      <div className="glass-card p-24 text-center border-white/5 bg-slate-900/40">
        <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-700 mx-auto mb-8 shadow-inner">
          <Zap size={40} className="opacity-20" />
        </div>
        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-4">No Remediation Data</h3>
        <p className="text-slate-500 max-w-sm mx-auto font-medium">Synthetic fix generation requires AI Engine analysis which was not enabled or did not find complex structural violations.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[700px]">
      {/* Sidebar: Remediation Queue */}
      <div className="w-full lg:w-96 space-y-6">
        <div className="glass-card p-6 border-white/5 bg-slate-950/40 backdrop-blur-3xl overflow-hidden relative group">
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
            <Sparkles size={16} className="text-brand-400" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Suggested Repairs</h3>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-premium">
            {remediableIssues.map((issue) => (
              <button
                key={issue.id}
                onClick={() => setSelectedIssueId(issue.id)}
                className={`
                  w-full text-left p-4 rounded-2xl transition-all duration-300 border
                  ${selectedIssueId === issue.id
                    ? 'bg-brand-500/10 border-brand-500/30'
                    : 'bg-slate-900/40 border-transparent hover:bg-white/5'}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${issue.severity === 'critical' ? 'text-rose-400' : 'text-orange-400'
                    }`}>
                    {issue.severity}
                  </span>
                  {selectedIssueId === issue.id && <ArrowRight size={12} className="text-brand-500" />}
                </div>
                <h4 className="text-xs font-black text-white tracking-tight truncate uppercase italic">{issue.title}</h4>
                <p className="text-[9px] font-bold text-slate-500 uppercase mt-1 tracking-widest">{issue.engine_name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 border-white/5 bg-slate-900/40">
          <div className="flex items-center gap-3 mb-4">
            <Zap size={14} className="text-brand-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white">Direct Integration</span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
            These repairs are synthesized from our multi-agent LLM analysis. Review changes before committing to codebase.
          </p>
        </div>
      </div>

      {/* Main Diff Editor View */}
      <div className="flex-1 space-y-8">
        <AnimatePresence mode="wait">
          {selectedIssue ? (
            <motion.div
              key={selectedIssue.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="glass-card p-10 border-white/5 bg-slate-950/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-brand-500/5 rotate-12 pointer-events-none">
                  <Code size={180} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-lg glow-emerald">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">AI Refactoring Strategy</h2>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">{selectedIssue.title}</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 mb-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 flex items-center gap-2">
                      <Info size={14} /> The Problem
                    </h3>
                    <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
                      "{selectedIssue.remediation?.description || selectedIssue.description}"
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                      <Code size={14} /> Synthetic Code Patch
                    </h3>

                    <div className="rounded-[28px] border border-white/5 bg-slate-950 overflow-hidden shadow-2xl relative">
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedIssue.remediation!.code_after!)}
                        className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-500 hover:text-white hover:border-white/20 transition-all z-20 group/copy"
                      >
                        <Copy size={14} className="group-hover/copy:scale-110 transition-transform" />
                      </button>

                      <div className="grid grid-cols-1 divide-y divide-white/5">
                        {selectedIssue.location?.html && (
                          <div className="p-8 bg-rose-500/5">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-[10px] font-black uppercase tracking-widest text-rose-500/80">Legacy implementation</span>
                              <AlertCircle size={14} className="text-rose-500/40" />
                            </div>
                            <pre className="text-xs font-mono text-rose-200/90 overflow-x-auto whitespace-pre-wrap leading-relaxed italic pr-12">
                              <code>{selectedIssue.location.html}</code>
                            </pre>
                          </div>
                        )}

                        <div className="p-8 bg-emerald-500/5">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Proposed evolution</span>
                            <CheckCircle2 size={14} className="text-emerald-500/40" />
                          </div>
                          <pre className="text-xs font-mono text-emerald-100 overflow-x-auto whitespace-pre-wrap leading-relaxed pr-12">
                            <code>{selectedIssue.remediation!.code_after}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center glass-card border-white/5 opacity-50">
              <span className="text-sm font-black uppercase tracking-widest text-slate-700 italic">Target Node Required</span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
