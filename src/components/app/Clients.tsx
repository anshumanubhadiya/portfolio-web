import { useMemo, useState } from 'react'
import { MessageCircle, Plus, Search, Users } from 'lucide-react'
import { bizById } from '../../data'
import { useStore, inr, isValidPhone, clientBalance, type Client } from '../../lib/store'
import { Button, Card, Badge, Field, inputCls, Modal, EmptyState } from './ui'

export function Clients() {
  const store = useStore()
  const biz = bizById[store.businessType]
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<Client | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', locality: '', openingBalance: 0 })
  const [phoneErr, setPhoneErr] = useState('')

  const list = useMemo(() => {
    const t = q.toLowerCase()
    return store.clients.filter((c) => c.name.toLowerCase().includes(t) || c.phone.includes(t))
  }, [store.clients, q])

  function submit() {
    const p = form.phone.replace(/[\s-]/g, '')
    if (!isValidPhone(p)) {
      setPhoneErr('Enter a valid 10-digit Indian mobile number.')
      return
    }
    store.addClient({ name: form.name.trim(), phone: p, locality: form.locality.trim(), openingBalance: Math.max(0, form.openingBalance) })
    setOpen(false)
    setForm({ name: '', phone: '', locality: '', openingBalance: 0 })
    setPhoneErr('')
  }

  function waLink(c: Client, amount: number) {
    const msg = `Hi ${c.name}, a gentle reminder — your pending balance with ${store.profile.name} is ${inr(amount)}. You can pay via UPI at ${store.profile.upi}. Thank you!`
    return `https://wa.me/91${c.phone}?text=${encodeURIComponent(msg)}`
  }

  const ledger = detail
    ? store.sales.filter((s) => s.clientId === detail.id).slice().reverse()
    : []

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-white/45">
          <span className="font-display text-xl font-semibold text-white">{store.clients.length}</span> {biz.clientLabel.toLowerCase()}s
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Add {biz.clientLabel.toLowerCase()}
        </Button>
      </div>

      <Card className="p-0">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <Search className="h-4 w-4 text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or phone…"
            className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
          />
        </div>
        {list.length === 0 ? (
          <div className="p-4">
            <EmptyState icon={<Users className="h-8 w-8" />} title={`No ${biz.clientLabel.toLowerCase()}s yet`} sub="Add your first client to start billing." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Locality</th>
                  <th className="px-4 py-3 text-right font-medium">Pending</th>
                  <th className="px-4 py-3 text-right font-medium">Ledger</th>
                </tr>
              </thead>
              <tbody>
                {list.map((c) => {
                  const bal = clientBalance(store.sales, c.id) + c.openingBalance
                  return (
                    <tr key={c.id} className="border-b border-white/5 last:border-0">
                      <td className="px-4 py-3">
                        <div className="font-medium text-white/90">{c.name}</div>
                        <div className="text-[11px] text-white/40">Since {c.joined}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-white/60">{c.phone}</td>
                      <td className="hidden px-4 py-3 text-white/60 sm:table-cell">{c.locality || '—'}</td>
                      <td className="px-4 py-3 text-right">
                        {bal > 0 ? <span className="font-semibold text-amber-300">{inr(bal)}</span> : <Badge tone="success">clear</Badge>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="outline" className="px-3 py-1.5 text-xs" onClick={() => setDetail(c)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add modal */}
      <Modal open={open} onClose={() => setOpen(false)} title={`Add ${biz.clientLabel.toLowerCase()}`}>
        <div className="space-y-4">
          <Field label="Full name">
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Customer name" />
          </Field>
          <Field label="Phone (10 digits)">
            <input className={inputCls} value={form.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value }); setPhoneErr('') }} placeholder="98XXXXXXXX" />
            {phoneErr && <span className="mt-1 block text-xs text-rose-300">{phoneErr}</span>}
          </Field>
          <Field label="Locality / Area">
            <input className={inputCls} value={form.locality} onChange={(e) => setForm({ ...form, locality: e.target.value })} placeholder="e.g. Andheri West" />
          </Field>
          <Field label="Opening balance (₹, optional)">
            <input type="number" className={inputCls} value={form.openingBalance} onChange={(e) => setForm({ ...form, openingBalance: Number(e.target.value) })} />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={!form.name.trim()}>Add {biz.clientLabel.toLowerCase()}</Button>
          </div>
        </div>
      </Modal>

      {/* Ledger modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail ? `${detail.name} — Party Ledger` : ''} wide>
        {detail && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div>
                <div className="font-mono text-xs text-white/50">{detail.phone}</div>
                <div className="text-sm text-white/60">{detail.locality || 'No address'}</div>
              </div>
              {(() => {
                const bal = clientBalance(store.sales, detail.id) + detail.openingBalance
                return bal > 0 ? (
                  <a href={waLink(detail, bal)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-emerald-400/15 px-3.5 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-400/25">
                    <MessageCircle className="h-4 w-4" /> Remind via WhatsApp
                  </a>
                ) : null
              })()}
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
                    <th className="px-4 py-2.5 font-medium">Date</th>
                    <th className="px-4 py-2.5 font-medium">Bill</th>
                    <th className="px-4 py-2.5 text-right font-medium">Debit</th>
                    <th className="px-4 py-2.5 text-right font-medium">Credit</th>
                    <th className="px-4 py-2.5 text-right font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 text-white/50">Opening</td>
                    <td className="px-4 py-2.5 text-white/60">—</td>
                    <td className="px-4 py-2.5 text-right text-white/70">{inr(detail.openingBalance)}</td>
                    <td className="px-4 py-2.5 text-right text-white/40">—</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-white">{inr(detail.openingBalance)}</td>
                  </tr>
                  {ledger.map((s) => (
                    <tr key={s.id} className="border-b border-white/5">
                      <td className="px-4 py-2.5 text-white/50">{new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-white/60">{s.invoiceNo}</td>
                      <td className="px-4 py-2.5 text-right text-white/70">{inr(s.total)}</td>
                      <td className="px-4 py-2.5 text-right text-emerald-300/80">{s.paid > 0 ? inr(s.paid) : '—'}</td>
                      <td className="px-4 py-2.5 text-right text-white/50">{inr(s.total - s.paid)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-white/[0.03]">
                    <td colSpan={4} className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/50">
                      Pending balance
                    </td>
                    <td className="px-4 py-3 text-right font-display text-base font-semibold text-amber-300">
                      {inr(clientBalance(store.sales, detail.id) + detail.openingBalance)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
