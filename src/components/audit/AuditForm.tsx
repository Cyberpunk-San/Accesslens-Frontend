'use client'

import { useMemo, useState } from 'react'
import { Search, Sparkles, SlidersHorizontal, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Engine } from '@/lib/types'

interface AuditFormProps {
  url: string
  setUrl: (value: string) => void
  onStartAudit: (
    url: string,
    options: { engines: string[]; enableAI: boolean; depth: 'quick' | 'standard' | 'deep' }
  ) => void
  isLoading?: boolean
  engines?: Engine[]
}

export function AuditForm({
  url,
  setUrl,
  onStartAudit,
  isLoading = false,
  engines = []
}: AuditFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [enableAI, setEnableAI] = useState(true)
  const [depth, setDepth] = useState<'quick' | 'standard' | 'deep'>('standard')
  const [selectedEngines, setSelectedEngines] = useState<string[]>([])

  const defaultEngineIds = useMemo(() => {
    if (!engines || engines.length === 0) return []

    return engines.map((engine: any, index) => {
      return (
        engine?.id?.toString?.() ||
        engine?.name?.toString?.() ||
        engine?.engine_id?.toString?.() ||
        `engine-${index}`
      )
    })
  }, [engines])

  return (
    <div className="glass-card p-10 border-white/5 bg-slate-900/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-6 max-w-[850px] mx-auto">
        <div className="relative flex-1 min-w-0">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500">
            <Globe size={24} />
          </div>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter digital architecture URL for audit..."
            className="w-full pl-16 pr-6 py-4 rounded-2xl bg-slate-950/50 border border-white/10 text-white placeholder:text-slate-500 outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all text-lg font-medium"
          />
        </div>

        <button
          onClick={() =>
            onStartAudit(url, {
              engines: selectedEngines.length > 0 ? selectedEngines : defaultEngineIds,
              enableAI,
              depth
            })
          }
          disabled={isLoading}
          className="btn-vibrant min-w-[200px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group/btn"
        >
          <span className="inline-flex items-center gap-3">
            <Sparkles size={20} className="group-hover/btn:animate-pulse" />
            <span className="tracking-widest uppercase text-sm font-black">
              {isLoading ? 'Processing...' : 'Start Audit'}
            </span>
          </span>
        </button>
      </div>

      <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10 border-t border-white/5 pt-6">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`inline-flex w-fit items-center gap-3 rounded-xl border px-6 py-3 text-xs font-black uppercase tracking-widest transition-all duration-300
            ${showAdvanced
              ? 'bg-brand-500/10 border-brand-500/40 text-brand-400 shadow-xl shadow-brand-500/10'
              : 'border-white/10 bg-white/5 text-slate-400 hover:border-brand-500/30 hover:bg-brand-500/5 hover:text-white'
            }`}
        >
          <SlidersHorizontal size={18} />
          Advanced Parameters
        </button>

        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
          Detectors Active: <span className="text-slate-400">{engines?.length || 0} Intelligence Engines</span>
        </p>
      </div>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/60 p-8 text-left shadow-inner relative z-10">
              <label className="flex items-center gap-4 text-sm font-bold text-slate-200 cursor-pointer mb-8 group/toggle">
                <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${enableAI ? 'bg-brand-500' : 'bg-slate-800'}`}>
                  <input
                    type="checkbox"
                    checked={enableAI}
                    onChange={(e) => setEnableAI(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${enableAI ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
                <span className="tracking-tight">Enable AI-assisted contextual analysis</span>
                <Sparkles size={16} className="text-amber-500 opacity-0 group-hover/toggle:opacity-100 transition-opacity" />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-white/5">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Scan Intensity</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['quick', 'standard', 'deep'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDepth(d)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all
                          ${depth === d
                            ? 'bg-brand-500/20 border-brand-500 text-brand-400'
                            : 'border-white/5 bg-slate-900/50 text-slate-500 hover:border-white/20'
                          }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Active Detecors</label>
                  <div className="flex flex-wrap gap-2">
                    {engines.map((engine) => (
                      <button
                        key={engine.name}
                        type="button"
                        onClick={() => {
                          setSelectedEngines(prev =>
                            prev.includes(engine.name)
                              ? prev.filter(e => e !== engine.name)
                              : [...prev, engine.name]
                          )
                        }}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${selectedEngines.includes(engine.name) || (selectedEngines.length === 0 && defaultEngineIds.includes(engine.name))
                            ? 'bg-brand-500/20 border-brand-500 text-brand-400'
                            : 'bg-slate-900/50 border-white/5 text-slate-500 hover:border-white/20'
                          }`}
                      >
                        {engine.name.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}