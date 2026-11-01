import { useMemo } from 'react'
import { BarChart3, TrendingUp, Wallet } from 'lucide-react'
import { useStore, inr, pendingTotal } from '../../lib/store'
import { Card, Stat } from './ui'

export function Reports() {
  const store = useStore()

  const week = useMemo(() => {
    const days: { label: string; total: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000)
      const key = d.toDateString()
      const total = store.sales
        .filter((s) => new Date(s.date).toDateString() === key)
        .reduce((sum, s) => sum + s.total, 0)
      days.push({ label: d.toLocaleDateString('en-IN', { weekday: 'short' }), total })
    }
    return days
  }, [store.sales])

  const max = Math.max(1, ...week.map((d) => d.total))
  const totalWeek = week.reduce((s, d) => s + d.total, 0)
  const pending = pendingTotal(store.sales)
  const lowStock = store.inventory.filter((i) => i.qty <= i.reorderLevel).length

  const modes = useMemo(() => {
    const m: Record<string, number> = {}
    store.sales.forEach((s) => {
      m[s.mode] = (m[s.mode] || 0) + s.paid
    })
    return Object.entries(m).sort((a, b) => b[1] - a[1])
  }, [store.sales])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="7-day revenue" value={inr(totalWeek)} />
        <Stat label="Pending (Udhaar)" value={inr(pending)} accent="text-amber-300" />
        <Stat label="Low stock" value={String(lowStock)} accent="text-rose-300" />
        <Stat label="Bills" value={String(store.sales.length)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-6 flex items-center gap-2 font-display text-base font-semibold text-white">
            <BarChart3 className="h-4 w-4 text-cyan-300" /> Revenue — last 7 days
          </h3>
          <div className="flex h-48 items-end gap-2">
            {week.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] text-white/40">{d.total > 0 ? inr(d.total) : ''}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-violet-600/40 to-cyan-400/70 transition-all"
                  style={{ height: `${(d.total / max) * 100}%`, minHeight: d.total > 0 ? '8px' : '2px' }}
                />
                <span className="text-[10px] text-white/40">{d.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-5 flex items-center gap-2 font-display text-base font-semibold text-white">
            <Wallet className="h-4 w-4 text-emerald-300" /> Collection by mode
          </h3>
          {modes.length === 0 ? (
            <p className="text-sm text-white/40">No payments yet.</p>
          ) : (
            <div className="space-y-3">
              {modes.map(([mode, amt]) => {
                const pct = totalWeek > 0 ? Math.round((amt / (totalWeek || 1)) * 100) : 0
                return (
                  <div key={mode}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="capitalize text-white/70">{mode}</span>
                      <span className="font-semibold text-white">{inr(amt)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white/45">
            <TrendingUp className="h-4 w-4 text-white/40" />
            Compare vs yesterday & same-weekday average comes with Day Close (future hook).
          </div>
        </Card>
      </div>
    </div>
  )
}
