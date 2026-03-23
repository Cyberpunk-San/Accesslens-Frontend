'use client'

import React, { useState } from 'react'
import { useEngines, useStartAudit } from '@/hooks/use-audits'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import {
  ShieldCheck,
  Zap,
  LayoutDashboard,
  Activity,
  Sparkles,
  ArrowRight,
  Database,
  Terminal,
  Cpu,
  Search,
  Globe,
  ChevronDown,
  Code2
} from 'lucide-react'

import { motion } from 'framer-motion'
import { AuditForm } from '@/components/audit/AuditForm'
import { InteractiveGrid } from '@/components/ui/InteractiveGrid'
import { MatrixRain } from '@/components/ui/MatrixRain'
import Image from 'next/image'
import logo from '../components/layout/logo.png'

export default function HomePage() {
  const [url, setUrl] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [hexCodes, setHexCodes] = useState<string[]>([])
  const router = useRouter()

  React.useEffect(() => {
    setIsMounted(true)
    setHexCodes([...Array(5)].map(() => Math.random().toString(16).slice(2, 6).toUpperCase()))
  }, [])
  const { data: engines } = useEngines()
  const startAudit = useStartAudit()

  const handleStartAudit = (
    auditUrl: string,
    options: { engines: string[]; enableAI: boolean; depth: 'quick' | 'standard' | 'deep' }
  ) => {
    if (!auditUrl.trim()) {
      toast.error('Enter URL')
      return
    }

    startAudit.mutate({
      url: auditUrl,
      engines: options.engines,
      enable_ai: options.enableAI,
      depth: options.depth
    }, {
      onSuccess: (data: any) => {
        toast.success('Audit started')
        router.push(`/audit/${data.audit_id}`)
      },
      onError: (error: any) => {
        toast.error(error.message || 'No response from server')
      }
    })
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#020617] text-white">
      <InteractiveGrid />
      <MatrixRain />

      {/* Background HUD Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
        <div className="absolute top-40 left-10 w-40 h-px bg-gradient-to-r from-brand-500/0 via-brand-500/40 to-brand-500/0"></div>
        <div className="absolute top-40 left-10 w-px h-40 bg-gradient-to-b from-brand-500/0 via-brand-500/40 to-brand-500/0"></div>

        <div className="absolute bottom-40 right-10 w-40 h-px bg-gradient-to-r from-brand-500/0 via-brand-500/40 to-brand-500/0"></div>
        <div className="absolute bottom-40 right-10 w-px h-40 bg-gradient-to-b from-brand-500/0 via-brand-500/40 to-brand-500/0"></div>

        {isMounted && hexCodes.map((hex, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.05, 0.1, 0.05], y: [-20, 20] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
            className="absolute text-[9px] font-mono text-brand-500 tracking-[0.3em] font-black"
            style={{ top: `${20 + i * 15}%`, right: `${5 + (i * 12) % 30}%` }}
          >
            0x{hex} // INTEL_SYSTEM_V{i}.0
          </motion.div>
        ))}
      </div>

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 h-20">
        <div className="container-custom h-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
              <Image src={logo} alt="AccessLens Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-mono font-black tracking-tighter uppercase">ACCESSLENS</span>
          </div>
          <div className="flex items-center gap-10 font-mono">
            <Link href="/dashboard" className="group flex items-center gap-2.5 text-[10px] font-black text-slate-500 hover:text-brand-400 transition-all uppercase tracking-[0.2em]">
              <div className="w-6 h-6 cyber-hex bg-slate-900 flex items-center justify-center border border-white/5 group-hover:bg-brand-500/10 group-hover:border-brand-500/20 transition-all">
                <LayoutDashboard size={12} className="group-hover:text-brand-400 transition-colors" />
              </div>
              Intelligence Hub
            </Link>
            <Link href="#how-it-works" className="group flex items-center gap-2.5 text-[10px] font-black text-slate-500 hover:text-brand-400 transition-all uppercase tracking-[0.2em]">
              <div className="w-6 h-6 cyber-hex bg-slate-900 flex items-center justify-center border border-white/5 group-hover:bg-brand-500/10 group-hover:border-brand-500/20 transition-all">
                <Activity size={12} className="group-hover:text-brand-400 transition-colors" />
              </div>
              How it works
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Workspace */}
      <section className="relative z-10 pt-44 pb-24">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-mono font-black tracking-tighter leading-[0.9] mb-8 uppercase"
            >
              Master Your <span className="text-brand-500">Accessibility.</span>
            </motion.h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Scan any URL in seconds. Identify hidden accessibility barriers and get the AI-powered code needed to fix them. [SECURE_SCAN_ACTIVE]
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto relative group"
          >
            <div className="absolute -inset-10 bg-brand-500/10 blur-[100px] rounded-full -z-10 group-hover:bg-brand-500/20 transition-all duration-1000"></div>
            <AuditForm
              url={url}
              setUrl={setUrl}
              onStartAudit={handleStartAudit}
              isLoading={startAudit.isPending}
              engines={engines || []}
            />
          </motion.div>
        </div>
      </section>

      {/* Step Section (Clear Terms) */}
      <section id="how-it-works" className="relative z-10 pt-24 pb-40">
        <div className="container-custom">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-2xl font-mono font-black uppercase tracking-[0.3em] text-brand-500">// The AccessLens Protocol</h2>
            <div className="h-1 w-20 bg-brand-500/20 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <StepCard
              num="01"
              icon={<Search />}
              title="Deep Search Scan"
              description="Multi-engine intelligence (Axe, Contrast, Structural) audits every node of the rendered website."
            />
            <StepCard
              num="02"
              icon={<Activity />}
              title="Identify Barriers"
              description="Pinpoint exactly where users are blocked, from broken Aria flow to mathematical contrast failures."
            />
            <StepCard
              num="03"
              icon={<Code2 />}
              title="Deploy Fixes"
              description="Get AI-synthesized code patches. Just copy and paste to evolve your architectural accessibility."
            />
          </div>
        </div>
      </section>

      {/* Philosophy Section (The Vision) */}
      <section className="relative z-10 bg-slate-900/40 border-y border-white/5 py-40 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px] -z-10"></div>
        <div className="container-custom relative">
          <div className="max-w-4xl">
            <h3 className="text-brand-400 text-sm font-black uppercase tracking-[0.4em] mb-10">Strategic Vision // The AccessLens Gap</h3>
            <div className="space-y-12">
              <p className="text-3xl md:text-5xl font-display font-black text-white leading-tight tracking-tight">
                "The deeper issue is not the absence of rules — it is the <span className="text-brand-500">absence of layered reasoning.</span>"
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                <div className="space-y-4">
                  <h4 className="text-white font-bold text-lg">Markup Validation isn't enough.</h4>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    Most tools flag missing attributes. AccessLens analyzes the rendered accessibility tree, validates structural flow, and evaluate contextual clarity.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white font-bold text-lg">Goal: Explainable Reasoning.</h4>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    AccessLens doesn't replace humans with automation. It provides AI-assisted, confidence-aware logic so inclusive digital architectures can be built with oversight.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Meta Status */}
      <footer className="relative z-10 pb-20 pt-40 container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2 opacity-30">
            <div className="w-6 h-6 rounded overflow-hidden">
              <Image src={logo} alt="AccessLens Logo" className="w-full h-full object-contain grayscale" />
            </div>
            <span className="text-sm font-black tracking-widest uppercase">ACCESSLENS Protocol</span>
          </div>
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-[0.2em] font-mono">
            Status: Intel-Active // v2.0.4 - Builder Optimized
          </p>
        </div>
      </footer>
    </main>
  )
}

function StepCard({ num, icon, title, description }: { num: string, icon: React.ReactElement<{ size?: number }>, title: string, description: string }) {
  return (
    <div className="glass-card p-10 border-white/5 relative group hover:bg-slate-900/60 transition-all duration-500">
      <div className="absolute top-6 right-8 text-5xl font-mono font-black text-white/5 group-hover:text-brand-500/10 transition-colors">{num}</div>
      <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-brand-400 mb-8 border border-white/5 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500">
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <h3 className="text-xl font-black text-white mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium text-sm">
        {description}
      </p>
    </div>
  )
}