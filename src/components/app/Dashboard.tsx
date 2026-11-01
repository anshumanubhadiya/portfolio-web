import { useMemo } from 'react'
import { AlertTriangle, ArrowRight, CalendarDays, Receipt, Wallet } from 'lucide-react'
import { bizById } from '../../data'
import { useStore, inr, pendingTotal, isToday, clientBalance } from '../../lib/store'
import { Card, Stat, Badge, EmptyState } from './ui'
import type { ModuleKey } from './Shell'

function today(iso: string) {
  return isToday(iso)
}

export function Dashboard({ onNavigate }: { onNavigate: (k: ModuleKey) => void }) {
  const store = useStore()
  const biz = bizById[store.businessType]

  const m = useMemo(() => {
    const todaySales = store.sales.filter((s) => today(s.date))
    const todayTotal = todaySales.reduce((s, x) => s + x.total, 0)
    const todayCount = todaySales.length
    const pending = pendingTotal(store.sales)
    const pendingCount = store.sales.filter((s) => s.total > s.paid).length
    const lowStock = store.inventory.filter((i) => i.qty <= i.reorderLevel)
    const soldUnits = store.sales.reduce((s, x) => s + x.lines.reduce((a, l) => a + l.qty, 0), 0)
    const inventoryValue = store.inventory.reduce((s, i) => s + i.qty * i.buyPrice, 0)
    const now = Date.now()
    const nearExpiry = store.inventory.filter((i) => {
      const e = i.attrs.expiry ? new Date(i.attrs.expiry).getTime() : NaN
      return !Number.isNaN(e) && e - now > 0 && e - now < 90 * 86400000
    }).length
    const expired = store.inventory.filter((i) => {
      const e = i.attrs.expiry ? new Date(i.attrs.expiry).getTime() : NaN
      return !Number.isNaN(e) && e <= now
    }).length
    const udhaar = store.clients
      .map((c) => ({ name: c.name, id: c.id, balance: clientBalance(store.sales, c.id) + c.openingBalance }))
      .filter((x) => x.balance > 0)
      .sort((a, b) => b.balance - a.balance)
    return {
      todayTotal,
      todayCount,
      pending,
      pendingCount,
      lowStock,
      soldUnits,
      inventoryValue,
      nearExpiry,
      expired,
      udhaar,
      activeMembers: store.clients.length,
    }
  }, [store])

  function kpi(key: string): { value: string; sub?: string } {
    switch (key) {
      case 'todaySales':
        return { value: inr(m.todayTotal), sub: `${m.todayCount} today` }
      case 'pending':
        return { value: inr(m.pending), sub: `${m.pendingCount} with balance` }
      case 'lowStock':
        return { value: String(m.lowStock.length), sub: 'at/below reorder' }
      case 'sold':
        return { value: String(m.soldUnits), sub: 'units sold' }
      case 'inventoryValue':
        return { value: inr(m.inventoryValue), sub: 'at cost' }
      case 'active':
        return { value: String(m.activeMembers), sub: 'members' }
      case 'nearExpiry':
        return { value: String(m.nearExpiry), sub: 'within 90 days' }
      case 'expired':
        return { value: String(m.expired), sub: 'not sellable' }
      case 'overdue':
      case 'open':
      case 'visits':
      case 'closed':
      case 'appointments':
      case 'cancellations':
      case 'checkins':
      case 'expiring':
      case 'ready':
        return { value: '0', sub: 'none right now' }
      case 'aging':
        return { value: '0', sub: '60+ days' }
      default:
        return { value: '—', sub: '' }
    }
  }

  function action(key: string): { count: number; amount: number } {
    switch (key) {
      case 'todaySales':
        return { count: m.todayCount, amount: m.todayTotal }
      case 'pending':
      case 'receivables':
        return { count: m.pendingCount, amount: m.pending }
      case 'lowStock':
        return { count: m.lowStock.length, amount: 0 }
      case 'nearExpiry':
        return { count: m.nearExpiry, amount: 0 }
      case 'expired':
        return { count: m.expired, amount: 0 }
      default:
        return { count: 0, amount: 0 }
    }
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-white/45">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-white sm:text-3xl">
          {greeting}, {store.profile.name.split(' ')[0]}
        </h2>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {biz.kpis.map((k) => {
          const v = kpi(k.key)
          return <Stat key={k.key} label={k.label} value={v.value} sub={v.sub} />
        })}
      </div>

      {/* Today Actions */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-white/40" />
          <h3 className="font-display text-base font-semibold text-white">Today Actions</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {biz.todayActions.map((a) => {
            const d = action(a.key)
            const empty = d.count === 0 && d.amount === 0
            return (
              <button
                key={a.key}
                onClick={() => onNavigate(a.key === 'pending' || a.key === 'receivables' ? 'payments' : a.key === 'lowStock' || a.key === 'nearExpiry' || a.key === 'expired' ? 'inventory' : 'sales')}
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div>
                  <div className="text-sm font-medium text-white/85">{a.label}</div>
                  <div className="mt-1 text-xs text-white/45">
                    {empty ? 'Nothing due — all clear' : d.amount > 0 ? `${d.count} · ${inr(d.amount)}` : `${d.count} item${d.count === 1 ? '' : 's'}`}
                  </div>
                </div>
                {empty ? (
                  <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
                ) : (
                  <ArrowRight className="h-4 w-4 text-white/40 transition-transform group-hover:translate-x-0.5" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Two columns: low stock + udhaar */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-base font-semibold text-white">
              <AlertTriangle className="h-4 w-4 text-amber-300" /> Low stock
            </h3>
            <button onClick={() => onNavigate('inventory')} className="text-xs font-semibold text-cyan-300 hover:text-cyan-200">
              View all
            </button>
          </div>
          {m.lowStock.length === 0 ? (
            <EmptyState icon={<AlertTriangle className="h-8 w-8" />} title="No low-stock items" sub="Every item is above its reorder level." />
          ) : (
            <div className="space-y-2">
              {m.lowStock.slice(0, 5).map((i) => (
                <div key={i.id} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm text-white/85">{i.name}</div>
                    <div className="text-xs text-white/40">{i.category}</div>
                  </div>
                  <Badge tone="danger">{i.qty} left</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-base font-semibold text-white">
              <Wallet className="h-4 w-4 text-amber-300" /> Udhaar (Pending)
            </h3>
            <button onClick={() => onNavigate('payments')} className="text-xs font-semibold text-cyan-300 hover:text-cyan-200">
              Open ledger
            </button>
          </div>
          {m.udhaar.length === 0 ? (
            <EmptyState icon={<Wallet className="h-8 w-8" />} title="No pending balances" sub="Everyone has paid up. Nice." />
          ) : (
            <div className="space-y-2">
              {m.udhaar.slice(0, 5).map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2.5">
                  <span className="truncate text-sm text-white/85">{u.name}</span>
                  <span className="font-display text-sm font-semibold text-amber-300">{inr(u.balance)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recent sales */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-display text-base font-semibold text-white">
            <Receipt className="h-4 w-4 text-white/40" /> Recent {biz.sellLabel}s
          </h3>
          <button onClick={() => onNavigate('sales')} className="text-xs font-semibold text-cyan-300 hover:text-cyan-200">
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
                <th className="pb-3 pr-4 font-medium">Invoice</th>
                <th className="pb-3 pr-4 font-medium">Client</th>
                <th className="pb-3 pr-4 font-medium">Date</th>
                <th className="pb-3 pr-4 text-right font-medium">Total</th>
                <th className="pb-3 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {store.sales.slice(0, 5).map((s) => (
                <tr key={s.id} className="border-b border-white/5 last:border-0">
                  <td className="py-3 pr-4 font-mono text-xs text-white/60">{s.invoiceNo}</td>
                  <td className="py-3 pr-4 text-white/85">{s.clientName}</td>
                  <td className="py-3 pr-4 text-white/50">{new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                  <td className="py-3 pr-4 text-right font-semibold text-white">{inr(s.total)}</td>
                  <td className="py-3 text-right">
                    <Badge tone={s.status === 'paid' ? 'success' : s.status === 'partial' ? 'warning' : 'danger'}>
                      {s.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
