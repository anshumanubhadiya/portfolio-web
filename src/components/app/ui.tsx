import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

export function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50'
  const variants = {
    primary: 'bg-white text-ink-950 hover:bg-white/90',
    outline: 'border border-white/15 bg-white/5 text-white hover:bg-white/10',
    ghost: 'text-white/70 hover:bg-white/5 hover:text-white',
    danger: 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] ${className}`}>
      {children}
    </div>
  )
}

export function Stat({
  label,
  value,
  sub,
  accent = 'text-white',
}: {
  label: string
  value: string
  sub?: string
  accent?: string
}) {
  return (
    <Card className="p-5">
      <div className="text-xs font-medium uppercase tracking-wider text-white/45">{label}</div>
      <div className={`mt-2 font-display text-2xl font-semibold sm:text-3xl ${accent}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-white/45">{sub}</div>}
    </Card>
  )
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
}) {
  const tones = {
    neutral: 'bg-white/10 text-white/70',
    success: 'bg-emerald-400/10 text-emerald-300',
    warning: 'bg-amber-400/10 text-amber-300',
    danger: 'bg-rose-400/10 text-rose-300',
    info: 'bg-cyan-400/10 text-cyan-300',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-white/55">{label}</span>
      {children}
    </label>
  )
}

export const inputCls =
  'w-full rounded-lg border border-white/10 bg-ink-900/60 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/30'

export function EmptyState({ icon, title, sub }: { icon: ReactNode; title: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-14 text-center">
      <div className="text-white/30">{icon}</div>
      <div className="mt-3 text-sm font-semibold text-white/70">{title}</div>
      {sub && <div className="mt-1 max-w-xs text-xs text-white/40">{sub}</div>}
    </div>
  )
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  wide?: boolean
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-white/10 bg-ink-900 p-6 sm:rounded-2xl ${
              wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'
            }`}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
              <button onClick={onClose} className="rounded-full p-1.5 text-white/50 hover:bg-white/5 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
