import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { bizTypes } from '../../data'
import { Logo } from '../ui'
import { Button } from './ui'

export function Onboarding({ onComplete }: { onComplete: (id: string) => void }) {
  const [selected, setSelected] = useState<string>('optical')

  return (
    <div className="min-h-screen bg-ink-950 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo className="h-7 w-7" />
            <span className="font-display text-base font-semibold text-white">
              ARION <span className="text-gradient">AI OS</span>
            </span>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-white/40">Step 1 of 2</span>
        </div>

        <div className="mt-14 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="display-giant text-5xl text-white sm:text-6xl"
          >
            What business <span className="text-gradient">do you run?</span>
          </motion.h1>
          <p className="mt-4 text-white/55">
            Pick one — your sidebar, forms, invoice titles and daily actions will match it.
            You can change this later in Settings.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bizTypes.map((b, i) => {
            const Icon = b.icon
            const active = selected === b.id
            return (
              <motion.button
                key={b.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                onClick={() => setSelected(b.id)}
                className={`relative rounded-2xl border p-5 text-left transition-all duration-300 ${
                  active
                    ? 'border-white/40 bg-white/[0.06] shadow-[0_0_40px_-12px_rgba(139,92,246,0.6)]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                }`}
              >
                {active && (
                  <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-white text-ink-950">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${b.accent} text-ink-950`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-white">{b.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/50">{b.tagline}</p>
              </motion.button>
            )
          })}
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
          <p className="text-sm text-white/40">
            <span className="font-semibold text-white/70">{bizTypes.find((b) => b.id === selected)?.name}</span>{' '}
            selected
          </p>
          <Button onClick={() => onComplete(selected)} className="gap-2">
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
