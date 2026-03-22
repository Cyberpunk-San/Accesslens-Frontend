'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Palette, ArrowRight, Layers } from 'lucide-react';

interface ContrastPattern {
  pattern: string;
  foreground: string;
  background: string;
  ratio: number;
  count: number;
  sample_selector: string;
  severity: string;
}

interface ContrastPatternGalleryProps {
  patterns: ContrastPattern[];
}

export function ContrastPatternGallery({ patterns }: ContrastPatternGalleryProps) {
  if (!patterns || patterns.length === 0) return null;

  return (
    <div className="glass-card p-10 border-white/5 bg-slate-900/20 col-span-1 lg:col-span-2">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 glow-brand">
          <Palette size={22} />
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Contrast Intelligence</h2>
          <p className="mt-1 text-xs font-bold text-slate-500 uppercase tracking-widest">Aesthetic Barrier Patterns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-100">
        {patterns.map((pattern, index) => (
          <motion.div
            key={`${pattern.pattern}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-[24px] border border-white/5 bg-slate-950/40 p-6 group hover:border-brand-500/30 transition-all duration-500 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
               <div className="flex -space-x-4">
                  <div 
                    className="w-10 h-10 rounded-full border-[3px] border-slate-950 shadow-2xl relative z-20"
                    style={{ backgroundColor: pattern.foreground }}
                    title={`Foreground: ${pattern.foreground}`}
                  >
                    <div className="absolute inset-0 rounded-full ring-1 ring-white/10"></div>
                  </div>
                  <div 
                    className="w-10 h-10 rounded-full border-[3px] border-slate-950 shadow-2xl relative z-10"
                    style={{ backgroundColor: pattern.background }}
                    title={`Background: ${pattern.background}`}
                  >
                    <div className="absolute inset-0 rounded-full ring-1 ring-white/10"></div>
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-2xl font-black text-white tracking-tighter">{pattern.ratio?.toFixed(2)}:1</div>
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Contrast Ratio</div>
               </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Frequency</span>
                 <span className="text-xs font-black text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/10">
                   {pattern.count} Elements
                 </span>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Sample Selector</span>
                <p className="text-xs font-mono text-slate-300 bg-black/30 p-3 rounded-xl border border-white/5 leading-relaxed break-all line-clamp-2 italic">
                  {pattern.sample_selector}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
               <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                 pattern.severity === 'critical' 
                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                  : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
               }`}>
                 {pattern.severity}
               </span>
               <button className="text-[10px] font-black uppercase text-slate-500 group-hover:text-brand-400 flex items-center gap-2 transition-colors tracking-widest">
                 See Details <ArrowRight size={14} />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
