'use client';

import { UnifiedIssue, AuditSummary } from '@/lib/types';
import { IssueCard } from './IssueCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertTriangle } from 'lucide-react';

interface IssueListProps {
  issues: UnifiedIssue[];
  summary?: AuditSummary;
  filter?: (issue: UnifiedIssue) => boolean;
}

export function IssueList({ issues, summary, filter }: IssueListProps) {
  const filteredIssues = filter ? issues.filter(filter) : issues;

  // Handle Error State
  if (summary?.error || (summary?.score === 0 && issues.length === 0)) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20 glass-card bg-rose-500/5 border-rose-500/20"
      >
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Audit Interrupted</h3>
        <p className="text-slate-400 font-medium max-w-sm mx-auto mb-6">
          {summary?.error || "An unexpected error occurred during analysis. The target host might be unreachable."}
        </p>
        <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 text-left inline-block">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Troubleshooting Node</p>
          <ul className="text-xs text-slate-400 space-y-2 font-bold">
            <li>• Ensure the target URL is reachable from the production network.</li>
            <li>• Verify the site permits automated auditing (no CAPTCHA or JS-challenges).</li>
            <li>• Check the health and capacity of the internal scan cluster.</li>
            <li>• Review egress and firewall rules for the auditing environment.</li>
          </ul>
        </div>
      </motion.div>
    );
  }

  // Grouping logic: Group by issue_type and severity to reduce visual noise
  const groupedIssues = filteredIssues.reduce((acc, issue) => {
    const key = `${issue.issue_type}-${issue.severity}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(issue);
    return acc;
  }, {} as Record<string, UnifiedIssue[]>);

  const groups = Object.values(groupedIssues).sort((a, b) => {
    // Sort by severity (Critical first)
    const severityOrder = { 'critical': 0, 'serious': 1, 'moderate': 2, 'minor': 3 };
    const aSev = a[0].severity.toLowerCase() as keyof typeof severityOrder;
    const bSev = b[0].severity.toLowerCase() as keyof typeof severityOrder;
    return (severityOrder[aSev] ?? 99) - (severityOrder[bSev] ?? 99);
  });

  if (groups.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20 glass-card bg-emerald-500/5 border-emerald-500/20"
      >
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6">
          <Search size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Pristine Architecture</h3>
        <p className="text-slate-400 font-medium max-w-xs mx-auto">No accessibility barriers were detected by the active engines. Great job!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {groups.map((group, index) => (
          <motion.div
            key={`${group[0].issue_type}-${group[0].severity}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* @ts-ignore - Adapting IssueCard to handle groups */}
            <IssueCard issue={group[0]} group={group} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
