'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface ScoreCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  subtitle?: string;
  color?: string;
  tooltip?: string;
}

export function ScoreCard({ title, value, icon, trend, subtitle, color, tooltip }: ScoreCardProps) {
  const bgColor = color || 'from-brand-500/20 to-indigo-500/20';

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative glass-card p-6 group border-slate-800 transition-all hover:bg-slate-900/40`}
    >
      {/* Background Gradient wrapped in overflow-hidden to allow tooltip overflow on parent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl overflow-hidden pointer-events-none`} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-slate-900 group-hover:bg-slate-800 transition-colors">
            {icon}
          </div>
          {trend && (
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
              {trend}
            </span>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-[11px] font-display font-black uppercase tracking-wider text-slate-500 group-hover:text-brand-400 transition-colors flex items-center gap-1.5 min-h-[16px]">
            {title}
            {tooltip && (
              <div className="relative group/tooltip inline-block">
                <div className="w-3.5 h-3.5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-600 group-hover/tooltip:bg-slate-700 group-hover/tooltip:text-slate-300 transition-colors cursor-help">
                  ?
                </div>
                {/* Enhanced Tooltip with Arrow and No Clipping */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-4 rounded-2xl bg-slate-950 border border-brand-500/30 shadow-[0_0_40px_rgba(0,0,0,0.8)] opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-all duration-300 transform translate-y-2 group-hover/tooltip:translate-y-0 z-[100] text-[12px] font-bold normal-case tracking-normal leading-relaxed text-slate-200 backdrop-blur-3xl ring-1 ring-white/5 font-sans">
                  <div className="relative z-10">{tooltip}</div>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 border-r border-b border-brand-500/30 rotate-45" />
                </div>
              </div>
            )}
          </h3>
          <div className="text-4xl font-display font-black text-white tracking-tight leading-none">
            {value}
          </div>
          {subtitle && (
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-brand-500/50 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
