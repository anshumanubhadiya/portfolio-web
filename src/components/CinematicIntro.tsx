import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { LiveClock } from './LiveClock'

const seq = ['3', '2', '1', '0', '1', '2', '3']

export function CinematicIntro({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= seq.length - 1) {
          clearInterval(t)
          setLeaving(true)
          return s
        }
        return s + 1
      })
    }, 420)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (leaving) {
      const t = setTimeout(onDone, 700)
      return () => clearTimeout(t)
    }
  }, [leaving, onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-950"
      animate={leaving ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      <div className="absolute right-6 top-6 text-sm text-white/40">
        <LiveClock />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -40, filter: 'blur(8px)' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="display-giant text-[26vw] leading-none text-white sm:text-[20vw]"
        >
          {seq[step]}
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 flex items-center gap-4 text-white/50"
      >
        <span className="font-display text-2xl font-semibold tracking-tight text-white sm:text-4xl">
          ARION <span className="text-gradient">AI OS</span>
        </span>
        <span className="hidden h-px w-16 bg-white/20 sm:block" />
        <span className="text-xs uppercase tracking-[0.25em] text-white/40">
          Business OS for Indian SMBs
        </span>
      </motion.div>

      <button
        onClick={onDone}
        className="absolute bottom-8 right-6 inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
      >
        Skip intro <ArrowRight className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
