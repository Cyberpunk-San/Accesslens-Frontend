'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCcw, Home, Wind } from 'lucide-react';
import Link from 'next/link';

interface AuditMeditationProps {
  id: string;
  onRetry: () => void;
}

export function AuditMeditation({ id, onRetry }: AuditMeditationProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden font-inter">
      {/* Calm Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
         <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.1, 0.2, 0.1],
           }}
           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-500/10 blur-[130px] rounded-full"
         />
         <motion.div 
           animate={{ 
             scale: [1.2, 1, 1.2],
             opacity: [0.05, 0.15, 0.05],
           }}
           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
           className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 blur-[110px] rounded-full"
         />
      </div>

      <div className="relative z-10 max-w-xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 relative inline-block"
        >
          <div className="w-24 h-24 bg-brand-500/5 rounded-[40px] flex items-center justify-center text-brand-400 border border-brand-500/10 shadow-[0_0_60px_rgba(var(--brand-500),0.1)]">
            <Wind size={40} className="animate-pulse" />
          </div>
        </motion.div>

        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
              Symphony in Progress
            </h1>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-brand-500/60 flex items-center justify-center gap-3">
               <Sparkles size={14} />
               Meditate for a few more seconds
            </p>
          </div>

          <p className="text-slate-400 font-medium leading-relaxed bg-brand-900/5 p-8 rounded-[32px] border border-white/5 backdrop-blur-xl">
             Your intelligence report <span className="text-brand-400 font-mono font-bold bg-brand-500/10 px-2 py-0.5 rounded">[{id.substring(0, 8)}]</span> is undergoing deep synthesis. This architectural deconstruction is fast, but precise quality requires a few additional moments of processing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={onRetry}
              className="w-full sm:w-auto px-10 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-900/20 group"
            >
              <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
              Check Status
            </button>
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto px-10 py-4 bg-slate-900/50 hover:bg-slate-800 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border border-white/5 flex items-center justify-center gap-3"
            >
              <Home size={18} />
              Return to Base
            </Link>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex justify-between items-center px-4 opacity-40">
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">Adaptive Synthesis Phase</span>
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-500/50 flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
             Optimal Flow
           </span>
        </div>
      </div>
    </div>
  );
}