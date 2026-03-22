'use client';
import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Search, 
  History, 
  ArrowRight, 
  ShieldAlert, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Database,
  AlertCircle
} from 'lucide-react';
import { AuditReport } from '@/lib/types';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

import { useRecentAudits } from '@/hooks/use-audits';

export default function DashboardPage() {
  const { data: reports, isLoading } = useRecentAudits(20, 0);

  const stats = {
    totalAudits: reports?.length || 0,
    avgScore: reports?.length 
      ? Math.round(reports.reduce((acc, r) => acc + (r.score || 0), 0) / reports.length) 
      : 0,
    totalIssues: reports?.reduce((acc, r) => acc + (r.total_issues || 0), 0) || 0,
  };

  return (
    <main className="min-h-screen bg-slate-950 pt-32 pb-24 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-600/5 rounded-full blur-[100px] -z-10"></div>

      <div className="container-custom">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 text-brand-400 mb-6"
          >
            <div className="relative w-12 h-12 flex items-center justify-center group/intel">
              <div className="absolute inset-0 bg-brand-500/20 cyber-hex border border-brand-500/40 group-hover/intel:scale-110 transition-transform duration-500"></div>
              <div className="absolute inset-[3px] bg-brand-500/10 cyber-hex border border-brand-500/20"></div>
              <Database size={20} className="relative z-10 text-brand-400" />
              <div className="scanner-line"></div>
            </div>
            <span className="text-[10px] font-display font-black uppercase tracking-[0.4em] text-brand-400/80">Intelligence Center // Arch-Base</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-9xl font-display font-black text-white tracking-tight leading-none mb-6 uppercase"
          >
            Audit <span className="text-brand-500">Dashboard</span>
          </motion.h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl leading-relaxed">
            Synthesized accessibility intelligence across your digital architecture.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <StatCard 
            label="Total Audits" 
            value={stats.totalAudits} 
            icon={<History className="text-indigo-400" size={28} />} 
            delay={0.1}
          />
          <StatCard 
            label="Average Health" 
            value={`${stats.avgScore}%`} 
            icon={<ShieldAlert className="text-emerald-400" size={28} />} 
            delay={0.2}
          />
          <StatCard 
            label="Identified Barriers" 
            value={stats.totalIssues} 
            icon={<BarChart3 className="text-rose-400" size={28} />} 
            delay={0.3}
          />
        </div>

        {/* Audit List */}
        <div className="glass-card border-white/5 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/40">
            <h2 className="text-[11px] font-display font-black uppercase tracking-[0.4em] text-slate-400">Recent Intelligence Reports</h2>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-500 bg-slate-950/50 px-4 py-2 rounded-full border border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="tracking-widest uppercase text-[10px]">Real-time connectivity</span>
            </div>
          </div>

          {isLoading ? (
            <div className="py-32 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : reports?.length === 0 ? (
            <div className="py-32 text-center">
              <div className="relative w-24 h-24 flex items-center justify-center mx-auto mb-10 group/search">
                <div className="absolute inset-0 bg-slate-900 cyber-hex border border-white/10 group-hover/search:border-brand-500/30 transition-all duration-500 group-hover/search:scale-110"></div>
                <Search size={40} className="relative z-10 text-slate-700 group-hover/search:text-brand-400 group-hover/search:scale-110 transition-all duration-500" />
                <div className="scanner-line opacity-0 group-hover/search:opacity-100 transition-opacity"></div>
              </div>
              <p className="text-slate-400 text-lg font-bold mb-6 tracking-tight">Intelligence base is currently empty.</p>
              <Link href="/" className="btn-vibrant inline-block">
                Start Analysis →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {reports?.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    href={`/audit/${report.id}`}
                    className="flex flex-col md:flex-row md:items-center justify-between p-8 hover:bg-white/5 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-500/0 via-brand-500/0 to-brand-500/0 group-hover:via-brand-500/[0.02] transition-all"></div>
                    <div className="flex-1 min-w-0 mr-12 relative z-10">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-white text-xl font-black truncate max-w-xl tracking-tight group-hover:text-brand-400 transition-colors">
                          {report.url}
                        </span>
                        <ExternalLink size={16} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                      </div>
                      <div className="flex items-center gap-5 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                        <span className="flex items-center gap-2">
                          <Clock size={14} className="opacity-50" />
                          {formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                        <span className={`${report.total_issues > 0 ? 'text-rose-500' : 'text-emerald-500'} flex items-center gap-2`}>
                          <AlertCircle size={14} className="opacity-50" />
                          {report.total_issues} Detected Barriers
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-10 mt-6 md:mt-0 relative z-10">
                      <div className="text-right">
                        <div className="text-3xl font-black text-white tracking-tight">{report.score}%</div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-600 mt-1">Health Score</div>
                      </div>
                      <div className="w-12 h-12 cyber-hex bg-slate-900 flex items-center justify-center text-slate-600 border border-white/5 group-hover:bg-brand-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all duration-500 group-hover:scale-110">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, icon, delay }: { label: string, value: string | number, icon: React.ReactNode, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-8 border-slate-800 relative group overflow-hidden"
    >
      <div className="absolute top-6 right-6 w-14 h-14 flex items-center justify-center">
        <div className="absolute inset-0 bg-white/5 cyber-clip-tr border border-white/10 group-hover:bg-brand-500/10 group-hover:border-brand-500/30 transition-all duration-500 group-hover:rotate-6"></div>
        <div className="relative z-10 opacity-30 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
          {icon}
        </div>
        <div className="scanner-line opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <div className="text-[10px] font-display font-black uppercase tracking-wider text-slate-600 mb-4">{label}</div>
      <div className="text-5xl font-display font-black text-white tracking-tight">{value}</div>
      <div className="mt-4 w-full bg-slate-900 h-1 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: delay + 0.5 }}
          className="h-full bg-brand-500/30"
        />
      </div>
    </motion.div>
  );
}
