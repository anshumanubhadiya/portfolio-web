import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  ShoppingCart,
  Users,
  Sparkles,
  WifiOff,
  QrCode,
} from 'lucide-react'
import { bizTypes } from '../data'
import { Reveal, Photo, Logo, fadeUp, stagger } from './ui'
import { LiveClock } from './LiveClock'

function Ticker() {
  const nums = ['3', '2', '1', '0', '1', '2', '3']
  return (
    <div className="flex items-center gap-1.5 font-mono text-sm text-white/40">
      {nums.map((n, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="text-white/70">{n}</span>
          <span className="text-white/20">·</span>
        </span>
      ))}
    </div>
  )
}

function Nav({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <Logo className="h-7 w-7" />
          <span className="font-display text-base font-semibold tracking-tight text-white">
            ARION <span className="text-gradient">AI OS</span>
          </span>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {[
            ['About', '#about'],
            ['Business types', '#business-types'],
            ['Features', '#features'],
            ['Contact', '#contact'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <LiveClock className="hidden text-sm text-white/40 lg:inline" />
          <button
            onClick={onEnter}
            className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-950 transition-all hover:bg-white/90"
          >
            Enter app
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </nav>
    </motion.header>
  )
}

function Hero({ onEnter }: { onEnter: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-28 sm:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[140px]" />
        <div className="absolute inset-0 bg-grid mask-fade-y opacity-40" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-white/40"
            >
              <span className="h-px w-10 bg-white/30" />
              The operating system for Indian business
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="display-giant mt-5 text-[20vw] text-white sm:text-[15vw] lg:text-[11rem]"
            >
              ARION
              <br />
              <span className="text-gradient">AI&nbsp;OS</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-7 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
            >
              We are experts in the daily running of Indian shops. Inventory, clients,
              sales, udhaar and UPI payments — one clean, offline-ready system that keeps
              billing even when the internet drops.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={onEnter}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-ink-950 transition-all hover:bg-white/90"
              >
                Start your workspace
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <a
                href="#business-types"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
              >
                Explore 9 business types
              </a>
            </motion.div>
          </div>

          {/* Right rail — clock + ticker + photo stack */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs uppercase tracking-[0.25em] text-white/40">
                Fresh drops · everyday
              </span>
              <Ticker />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Photo seed="arion-hero-1" w={400} h={520} className="h-44 rounded-xl" alt="Retail counter" />
              <Photo seed="arion-hero-2" w={400} h={300} className="h-28 rounded-xl" alt="Shop floor" />
              <Photo seed="arion-hero-3" w={400} h={360} className="h-32 rounded-xl" alt="Billing" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Photo seed="arion-hero-4" w={500} h={300} className="h-28 rounded-xl" alt="Inventory" />
              <Photo seed="arion-hero-5" w={500} h={300} className="h-28 rounded-xl" alt="Payments" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Philosophy() {
  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-white/40">
            <span className="h-px w-10 bg-white/30" />
            We are — simple · fast · offline-ready
          </div>
        </Reveal>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <h2 className="display-giant text-5xl text-white sm:text-6xl lg:text-7xl">
              We embody the daily <span className="text-gradient">hisaab</span>, beautifully.
            </h2>
          </Reveal>
          <div className="space-y-6">
            {[
              ['01', 'Bringing bold ideas to life through clean, fast software.'],
              ['02', 'Elevating counter productivity with offline-first billing.'],
              ['03', 'New generation. A new vision. A new way to run business.'],
            ].map(([n, text]) => (
              <Reveal key={n} delay={0.05}>
                <div className="flex gap-5 border-t border-white/10 pt-5">
                  <span className="font-display text-sm font-semibold text-gradient">{n}</span>
                  <p className="max-w-md text-lg text-white/70">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-3">
          <Photo seed="arion-philosophy" w={900} h={700} className="col-span-2 h-64 rounded-2xl lg:h-80" alt="Business in motion" />
          <Photo seed="arion-abstract-1" w={600} h={700} className="h-64 rounded-2xl lg:h-80" alt="Detail" />
        </div>
      </div>
    </section>
  )
}

function BusinessShowcase({ onEnter }: { onEnter: () => void }) {
  return (
    <section id="business-types" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-white/40">
                <span className="h-px w-10 bg-white/30" />
                On the counter
              </div>
              <h2 className="display-giant mt-4 text-5xl text-white sm:text-6xl lg:text-7xl">
                Nine trades.
                <br />
                One <span className="text-gradient">operating system</span>.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-xs text-white/55">
              Pick your business once and your sidebar, forms, invoices and daily actions
              instantly match how your shop actually works.
            </p>
          </Reveal>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3"
        >
          {bizTypes.map((b) => {
            const Icon = b.icon
            return (
              <motion.button
                key={b.id}
                variants={fadeUp}
                onClick={onEnter}
                className="group relative overflow-hidden rounded-2xl border border-white/10 text-left transition-all duration-500 hover:border-white/25"
              >
                <Photo seed={b.photo} w={600} h={420} className="h-40 sm:h-48" alt={b.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-white/70" />
                      <h3 className="font-display text-base font-semibold text-white">
                        {b.name}
                      </h3>
                    </div>
                    <p className="mt-0.5 text-xs text-white/55">{b.tagline}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function Pillars() {
  const items = [
    {
      icon: Boxes,
      title: 'Inventory',
      desc: 'Stock, variants, buy/sell price and low-stock alerts. Stock rises on purchase, falls on every sale — automatically.',
    },
    {
      icon: Users,
      title: 'Clients',
      desc: 'Name + 10-digit Indian phone, full purchase history and a running udhaar balance. Search by phone in an instant.',
    },
    {
      icon: ShoppingCart,
      title: 'Sales',
      desc: 'Bill in three taps. Advance or full payment, invoice / receipt, and the ledger updates the moment you save.',
    },
  ]
  return (
    <section id="features" className="relative border-y border-white/5 bg-white/[0.02] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-white/40">
            <span className="h-px w-10 bg-white/30" />
            Beyond billing
          </div>
          <h2 className="display-giant mt-4 text-5xl text-white sm:text-6xl lg:text-7xl">
            Three pillars.
            <br />
            <span className="text-gradient">Everything wired together.</span>
          </h2>
        </Reveal>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 grid gap-4 md:grid-cols-3"
        >
          {items.map((it) => {
            const Icon = it.icon
            return (
              <motion.div
                key={it.title}
                variants={fadeUp}
                className="rounded-2xl border border-white/10 bg-ink-900/40 p-7 transition-all duration-500 hover:border-white/25"
              >
                <Icon className="h-8 w-8 text-cyan-300" />
                <h3 className="mt-5 font-display text-xl font-semibold text-white">{it.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{it.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Feature strip */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: QrCode, label: 'UPI QR & links', sub: '₹0 fee, share on WhatsApp' },
            { icon: WifiOff, label: 'Offline-first', sub: 'Billing that survives bad internet' },
            { icon: Sparkles, label: 'AI assistant', sub: 'Speak a bill, get a draft' },
          ].map((f) => {
            const Icon = f.icon
            return (
              <Reveal key={f.label}>
                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <Icon className="h-6 w-6 text-fuchsia-300" />
                  <div>
                    <div className="text-sm font-semibold text-white">{f.label}</div>
                    <div className="text-xs text-white/45">{f.sub}</div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Manifesto({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="space-y-6 text-3xl leading-tight text-white/85 sm:text-4xl">
            <Reveal>
              <p>
                Arion <span className="text-gradient">redefines</span> how Indian shops run,
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p>
                with <span className="text-gradient">simplicity</span> &
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                <span className="text-gradient">speed</span> at the counter.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-2 text-base text-white/50">
                No setup marathon. Pick your trade, add your stock and clients, and start
                billing the same day — with a clean day-close hisaab every evening.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <button
                onClick={onEnter}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-ink-950 transition-all hover:bg-white/90"
              >
                Get in touch <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Photo seed="arion-manifesto-1" w={500} h={600} className="h-56 rounded-2xl sm:h-72" alt="Counter" />
            <Photo seed="arion-manifesto-2" w={500} h={400} className="mt-8 h-44 rounded-2xl sm:h-52" alt="Ledger" />
            <Photo seed="arion-manifesto-3" w={500} h={400} className="h-44 rounded-2xl sm:h-52" alt="UPI" />
            <Photo seed="arion-manifesto-4" w={500} h={600} className="-mt-8 h-56 rounded-2xl sm:h-72" alt="Team" />
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactCTA({ onEnter }: { onEnter: () => void }) {
  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-ink-800 to-ink-950 px-6 py-16 text-center sm:px-16 sm:py-20">
            <div className="pointer-events-none absolute left-1/4 top-0 h-64 w-64 rounded-full bg-cyan-500/15 blur-[100px]" />
            <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-[100px]" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                Creating the future together
              </p>
              <h2 className="display-giant mt-4 text-5xl text-white sm:text-6xl">
                Run your business
                <br />
                on <span className="text-gradient">autopilot</span>.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-white/60">
                Start free, pick your business type, and get a tailored workspace in
                minutes.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={onEnter}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-ink-950 transition-all hover:bg-white/90 sm:w-auto"
                >
                  Start your workspace
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <Logo className="h-7 w-7" />
            <span className="font-display text-base font-semibold text-white">
              ARION <span className="text-gradient">AI OS</span>
            </span>
          </div>
          <p className="text-xs text-white/40">
            Inventory · Clients · Sales · Udhaar · UPI · Day Close
          </p>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/40">© 2026 Arion AI OS. All rights reserved.</p>
          <p className="text-xs text-white/40">Built in India · ₹ · wa.me ready</p>
        </div>
      </div>
    </footer>
  )
}

export function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="noise relative min-h-screen bg-ink-950 text-white">
      <Nav onEnter={onEnter} />
      <main>
        <Hero onEnter={onEnter} />
        <Philosophy />
        <BusinessShowcase onEnter={onEnter} />
        <Pillars />
        <Manifesto onEnter={onEnter} />
        <ContactCTA onEnter={onEnter} />
      </main>
      <Footer />
    </div>
  )
}
