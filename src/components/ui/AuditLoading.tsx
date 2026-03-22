'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Layers, Sparkles, ShieldCheck, Zap } from 'lucide-react';

const STATUS_MESSAGES = [
  "Establishing Secure Link...",
  "Accessing Collective Intelligence...",
  "Retrieving Audit Trace...",
  "Deconstructing DOM Architecture...",
  "Applying Accessibility Heuristics...",
  "Synthesizing Engine Signals...",
  "Finalizing Executive Synthesis..."
];

export function AuditLoading() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-inter">
      {/* Digital Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }} 
      />

      {/* Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 blur-[120px] rounded-full" />
      
      {/* Scanning Line Animation */}
      <motion.div 
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent z-10"
      />

      <div className="relative z-20 flex flex-col items-center">
        {/* Central Animation Core */}
        <div className="relative w-32 h-32 mb-12">
           {/* Outer Rotating Ring */}
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 border-2 border-dashed border-brand-500/20 rounded-full"
           />
           
           {/* Inner Pulsing Hex */}
           <motion.div 
             animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute inset-4 bg-brand-500/10 rounded-2xl border border-brand-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(var(--brand-500),0.2)]"
           >
             <Zap size={32} className="text-brand-400" />
           </motion.div>

           {/* Orbital Particles */}
           {[0, 90, 180, 270].map((angle, i) => (
             <motion.div
               key={i}
               animate={{ rotate: 360 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
               className="absolute inset-0"
               style={{ transform: `rotate(${angle}deg)` }}
             >
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(var(--brand-400),0.8)]" />
             </motion.div>
           ))}
        </div>

        {/* Text Sequence */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-black uppercase tracking-[0.4em] text-white"
          >
            Deep Scan Initiated
          </motion.h1>
          
          <div className="h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={statusIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-brand-500 animate-pulse" />
                {STATUS_MESSAGES[statusIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* HUD Decoration */}
        <div className="mt-16 flex items-center gap-12 border-t border-white/5 pt-8">
           <HUDMetric icon={<Target size={14} />} label="Topology" value="Active" />
           <HUDMetric icon={<Layers size={14} />} label="Heuristics" value="Engaged" />
           <HUDMetric icon={<Sparkles size={14} />} label="AI Logic" value="Online" />
        </div>
      </div>
    </div>
  );
}

function HUDMetric({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-slate-700">{icon}</div>
      <div className="flex flex-col items-center">
        <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">{label}</span>
        <span className="text-[9px] font-bold text-brand-500/60 uppercase">{value}</span>
      </div>
    </div>
  );
}
