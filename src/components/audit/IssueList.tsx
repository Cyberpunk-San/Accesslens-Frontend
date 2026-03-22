'use client';

import { UnifiedIssue } from '@/lib/types';
import { IssueCard } from './IssueCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

interface IssueListProps {
  issues: UnifiedIssue[];
  filter?: (issue: UnifiedIssue) => boolean;
}

export function IssueList({ issues, filter }: IssueListProps) {
  const filteredIssues = filter ? issues.filter(filter) : issues;

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
