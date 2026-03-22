import React from 'react'

interface Props {
  icon: React.ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: Props) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-black/28 p-7 text-center backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.08)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:shadow-[0_0_50px_rgba(34,211,238,0.08)]">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400/20 via-fuchsia-400/10 to-cyan-300/20 text-cyan-200">
        {icon}
      </div>

      <h3 className="text-2xl font-semibold text-white leading-tight">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-7 text-slate-300">
        {description}
      </p>
    </div>
  )
}