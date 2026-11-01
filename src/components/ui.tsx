import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { photo } from '../data'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

export function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="arion-logo-g" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="0.5" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.04)" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="none" stroke="rgba(255,255,255,0.1)" />
      <path d="M16 5.5 L26 24.5 H21.6 L16 12.4 L10.4 24.5 H6 Z" fill="url(#arion-logo-g)" />
    </svg>
  )
}

export function Photo({
  seed,
  w = 900,
  h = 700,
  className = '',
  alt = '',
}: {
  seed: string
  w?: number
  h?: number
  className?: string
  alt?: string
}) {
  return (
    <div className={`photo-frame ${className}`}>
      <img
        src={photo(seed, w, h)}
        alt={alt}
        loading="lazy"
        onError={(e) => {
          ;(e.currentTarget as HTMLImageElement).src = photo('arion-fallback', w, h)
        }}
      />
    </div>
  )
}
