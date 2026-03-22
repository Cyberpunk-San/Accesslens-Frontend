'use client';

import { useState } from 'react';
import { UnifiedIssue } from '@/lib/types';
import { SeverityBadge } from './SeverityBadge';
import { ChevronDown, Code, MapPin, ExternalLink, Info, Terminal, Sparkles, Lightbulb, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IssueCardProps {
  issue: UnifiedIssue;
  group?: UnifiedIssue[];
}

export function IssueCard({ issue, group }: IssueCardProps) {
  const [expanded, setExpanded] = useState(false);
  const instances = group || [issue];
  const isGroup = instances.length > 1;

  return (
    <motion.div 
      layout
      className={`glass-card mb-6 overflow-hidden border-white/5 transition-all duration-500 ${expanded ? 'bg-slate-900/60 ring-2 ring-brand-500/20 shadow-brand-500/10' : 'hover:bg-slate-900/50'}`}
    >
      <div
        className="p-6 cursor-pointer flex items-start justify-between group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <SeverityBadge severity={issue.severity} />
            
            {isGroup && (
              <span className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 shadow-glow-sm flex items-center gap-1.5 animate-pulse-slow">
                <Layers size={10} />
                {instances.length} Instances Detected
              </span>
            )}

            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-white/10 bg-slate-950 text-slate-400 shadow-inner">
              {issue.engine_name.replace(/_/g, ' ')}
            </span>
            
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-brand-500/40 animate-pulse"></span>
              Avg Confidence: <span className="text-slate-300">
                {Math.round(instances.reduce((acc, i) => acc + i.confidence_score, 0) / instances.length)}%
              </span>
            </div>
          </div>
          <h3 className="text-xl font-black text-white group-hover:text-brand-400 transition-colors leading-snug tracking-tight">{issue.title}</h3>
        </div>
        <div className={`ml-6 p-2.5 rounded-xl transition-all duration-500 ${expanded ? 'bg-brand-500 text-white rotate-180 shadow-lg shadow-brand-500/20' : 'bg-slate-950 text-slate-600 group-hover:text-slate-400 border border-white/5'}`}>
          <ChevronDown size={22} />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-10 pt-4 border-t border-white/5 bg-slate-950/40">
              <p className="text-slate-300 mb-10 text-base leading-relaxed font-medium max-w-4xl">{issue.description}</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-8">
                  {issue.evidence?.screenshot && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                        <MapPin size={16} /> Representative Evidence
                      </h4>
                      <div className="rounded-2xl border border-white/10 bg-black overflow-hidden shadow-2xl group/evidence glow-brand/10 transition-all duration-500 hover:border-brand-500/30">
                        <img 
                          src={issue.evidence.screenshot.startsWith('data:') ? issue.evidence.screenshot : `data:image/png;base64,${issue.evidence.screenshot}`} 
                          alt="Issue evidence"
                          className="w-full h-auto object-cover opacity-90 group-hover/evidence:opacity-100 transition-opacity duration-700"
                        />
                      </div>
                    </div>
                  )}

                  {isGroup && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                        <Terminal size={16} /> Affected Locations ({instances.length})
                      </h4>
                      <div className="max-h-64 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                        {instances.map((inst, idx) => (
                          <div key={inst.id} className="p-3 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-between group/loc hover:border-brand-500/30 transition-colors">
                            <code className="text-[11px] text-slate-400 font-mono truncate max-w-[250px]">
                              {inst.location?.selector || 'Unknown selector'}
                            </code>
                            <span className="text-[9px] font-black text-slate-600">Locus #{idx + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!isGroup && issue.location && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                        <Terminal size={16} /> Affected Element
                      </h4>
                      <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 shadow-inner ring-1 ring-white/5">
                        <code className="text-[13px] text-brand-400 font-mono break-all whitespace-pre-wrap leading-relaxed block py-1">
                          {issue.location.selector}
                        </code>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-8">
                  {(issue.location?.html || issue.remediation?.code_after) && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                        <Code size={16} /> Code Evolution
                      </h4>
                      <div className="rounded-[28px] border border-white/5 bg-slate-950 p-1.5 divide-y divide-white/5 overflow-hidden shadow-2xl">
                        {issue.location?.html && (
                          <div className="p-6 bg-rose-500/5">
                            <div className="text-[10px] font-black uppercase text-rose-500/80 mb-3 tracking-widest">Current implementation</div>
                            <pre className="text-xs font-mono text-rose-200/90 overflow-x-auto whitespace-pre-wrap leading-relaxed italic">
                              <code>{issue.location.html}</code>
                            </pre>
                          </div>
                        )}
                        {issue.remediation?.code_after && (
                          <div className="p-6 bg-emerald-500/5">
                            <div className="text-[10px] font-black uppercase text-emerald-500/80 mb-3 tracking-widest">AI Recommended fix</div>
                            <pre className="text-xs font-mono text-emerald-100 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                              <code>{issue.remediation.code_after}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {issue.evidence?.ai_reasoning && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 flex items-center gap-2">
                        <Sparkles size={16} /> AI Contextual Insight
                      </h4>
                      <div className="bg-amber-500/5 rounded-[28px] border border-amber-500/20 p-6 shadow-inner relative overflow-hidden group/insight">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover/insight:opacity-20 transition-opacity duration-1000">
                          <Sparkles size={60} />
                        </div>
                        <p className="text-sm text-amber-100/90 italic leading-relaxed relative z-10 font-bold">
                          "{issue.evidence.ai_reasoning}"
                        </p>
                      </div>
                    </div>
                  )}

                  {issue.remediation && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
                        <Lightbulb size={16} /> Remediation Strategy
                      </h4>
                      <div className="bg-emerald-500/5 rounded-[28px] border border-emerald-500/20 p-6 shadow-inner">
                        <p className="text-sm text-slate-100 font-bold leading-relaxed tracking-tight">
                          {issue.remediation.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter text-slate-600 mt-8 pt-4 border-t border-slate-800">
                <div className="flex gap-4">
                  <span>Signatures: {instances.length} unique nodes</span>
                  <span>Type: {issue.issue_type}</span>
                </div>
                {issue.wcag_criteria.length > 0 && (
                   <div className="flex gap-2">
                      {issue.wcag_criteria.map(c => (
                        <span key={c.id} className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 text-brand-400">WCAG {c.id}</span>
                      ))}
                   </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
