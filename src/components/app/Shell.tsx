import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  Bell,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Plus,
  Receipt,
  Search,
  Settings,
  Users,
  Wallet,
  Wifi,
  X,
} from 'lucide-react'
import { bizById } from '../../data'
import { useStore } from '../../lib/store'
import { Logo } from '../ui'

export type ModuleKey =
  | 'dashboard'
  | 'inventory'
  | 'clients'
  | 'sales'
  | 'payments'
  | 'reports'
  | 'settings'

export function Shell({
  active,
  onNavigate,
  onNewSale,
  onExit,
  children,
}: {
  active: ModuleKey
  onNavigate: (k: ModuleKey) => void
  onNewSale: () => void
  onExit: () => void
  children: ReactNode
}) {
  const store = useStore()
  const biz = bizById[store.businessType]
  const [mobileOpen, setMobileOpen] = useState(false)

  const lowStock = store.inventory.filter((i) => i.qty <= i.reorderLevel).length
  const pending = store.sales.filter((s) => s.total > s.paid).length
  const badge = lowStock + pending

  const nav: { key: ModuleKey; label: string; icon: typeof Package }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'inventory', label: biz.stockLabel, icon: Package },
    { key: 'clients', label: biz.clientLabel + 's', icon: Users },
    { key: 'sales', label: biz.sellLabel, icon: Receipt },
    { key: 'payments', label: 'Payments & UPI', icon: Wallet },
    { key: 'reports', label: 'Reports', icon: BarChart3 },
    { key: 'settings', label: 'Settings', icon: Settings },
  ]

  const currentLabel = nav.find((n) => n.key === active)?.label ?? 'Dashboard'

  const Sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <Logo className="h-7 w-7" />
        <div>
          <div className="font-display text-sm font-semibold leading-tight text-white">
            ARION <span className="text-gradient">AI OS</span>
          </div>
          <div className="text-[11px] text-white/40">{store.profile.name}</div>
        </div>
      </div>

      <div className="mx-4 mb-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
        {(() => {
          const Icon = biz.icon
          return <Icon className={`h-4 w-4 ${biz.accentText}`} />
        })()}
        <span className="flex-1 text-xs font-medium text-white/70">{biz.name}</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {nav.map((n) => {
          const Icon = n.icon
          const isActive = active === n.key
          return (
            <button
              key={n.key}
              onClick={() => {
                onNavigate(n.key)
                setMobileOpen(false)
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-white/10 text-white' : 'text-white/55 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {n.label}
            </button>
          )
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-3">
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-white/45">
          <Wifi className="h-3.5 w-3.5 text-emerald-400" />
          Online · {store.inventory.length} items synced
        </div>
        <button
          onClick={onExit}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/55 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Back to site
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-ink-950">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-ink-900/40 lg:block">
        <div className="sticky top-0 h-screen">{Sidebar}</div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/70 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-ink-900 lg:hidden"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 rounded-full p-1.5 text-white/50 hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
              {Sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-ink-950/80 px-4 backdrop-blur-xl sm:px-6">
          <button
            className="rounded-lg p-2 text-white/60 hover:bg-white/5 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-lg font-semibold text-white">{currentLabel}</h1>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 sm:flex">
              <Search className="h-4 w-4 text-white/40" />
              <input
                placeholder="Search…"
                className="w-36 bg-transparent text-sm text-white placeholder-white/30 outline-none"
              />
            </div>
            <button
              onClick={onNewSale}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-ink-950 transition-colors hover:bg-white/90"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New {biz.sellLabel}</span>
              <span className="sm:hidden">New</span>
            </button>
            <button className="relative rounded-lg p-2 text-white/60 hover:bg-white/5">
              <Bell className="h-5 w-5" />
              {badge > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-fuchsia-500 px-1 text-[10px] font-bold text-white">
                  {badge}
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
