import { useEffect, useMemo, useState } from 'react'
import { Minus, Plus, Receipt, Search, Trash2, Wallet } from 'lucide-react'
import { bizById } from '../../data'
import { useStore, inr, isValidPhone } from '../../lib/store'
import { Button, Card, Badge, Field, inputCls, Modal, EmptyState } from './ui'

interface Line {
  itemId: string
  qty: number
}

export function Sales({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const store = useStore()
  const biz = bizById[store.businessType]
  const [q, setQ] = useState('')

  // new sale state
  const [clientSel, setClientSel] = useState('walkin')
  const [quickName, setQuickName] = useState('')
  const [quickPhone, setQuickPhone] = useState('')
  const [quickErr, setQuickErr] = useState('')
  const [itemQ, setItemQ] = useState('')
  const [lines, setLines] = useState<Line[]>([])
  const [paid, setPaid] = useState(0)
  const [mode, setMode] = useState<'cash' | 'upi' | 'card' | 'other'>('cash')
  const [saleErr, setSaleErr] = useState('')

  // collect payment state
  const [collect, setCollect] = useState<string | null>(null)
  const [collectAmt, setCollectAmt] = useState(0)

  const total = lines.reduce((s, l) => {
    const it = store.inventory.find((i) => i.id === l.itemId)
    return s + (it ? it.sellPrice * l.qty : 0)
  }, 0)

  useEffect(() => {
    setPaid(total)
  }, [total])

  const itemList = useMemo(() => {
    const t = itemQ.toLowerCase()
    return store.inventory.filter((i) => i.name.toLowerCase().includes(t) || i.sku.toLowerCase().includes(t))
  }, [store.inventory, itemQ])

  const saleList = useMemo(() => {
    const t = q.toLowerCase()
    return store.sales.filter((s) => s.clientName.toLowerCase().includes(t) || s.invoiceNo.toLowerCase().includes(t))
  }, [store.sales, q])

  function addLine(id: string) {
    const it = store.inventory.find((i) => i.id === id)
    if (!it || it.qty <= 0) return
    setLines((prev) => {
      const ex = prev.find((l) => l.itemId === id)
      if (ex) {
        if (ex.qty >= it.qty) return prev
        return prev.map((l) => (l.itemId === id ? { ...l, qty: l.qty + 1 } : l))
      }
      return [...prev, { itemId: id, qty: 1 }]
    })
  }

  function resetSale() {
    setClientSel('walkin')
    setQuickName('')
    setQuickPhone('')
    setQuickErr('')
    setItemQ('')
    setLines([])
    setSaleErr('')
    setMode('cash')
  }

  function submitSale() {
    let clientId: string | null = null
    let clientName = 'Walk-in Customer'
    if (clientSel === 'new') {
      if (!isValidPhone(quickPhone.replace(/[\s-]/g, ''))) {
        setQuickErr('Enter a valid 10-digit phone number.')
        return
      }
      if (!quickName.trim()) {
        setQuickErr('Enter the client name.')
        return
      }
      clientId = store.addClient({ name: quickName.trim(), phone: quickPhone.replace(/[\s-]/g, ''), locality: '', openingBalance: 0 })
      clientName = quickName.trim()
    } else if (clientSel !== 'walkin') {
      const c = store.clients.find((x) => x.id === clientSel)
      if (c) {
        clientId = c.id
        clientName = c.name
      }
    }

    if (lines.length === 0) {
      setSaleErr('Add at least one item.')
      return
    }
    const res = store.createSale({ clientId, clientName, lines, paid, mode })
    if (!res.ok) {
      setSaleErr(res.error || 'Could not save sale.')
      return
    }
    resetSale()
    setOpen(false)
  }

  function submitCollect() {
    if (!collect) return
    store.recordPayment(collect, collectAmt)
    setCollect(null)
    setCollectAmt(0)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-white/45">
          <span className="font-display text-xl font-semibold text-white">{store.sales.length}</span> {biz.sellLabel.toLowerCase()}s this period
        </div>
        <Button onClick={() => { resetSale(); setOpen(true) }}>
          <Plus className="h-4 w-4" /> New {biz.sellLabel}
        </Button>
      </div>

      <Card className="p-0">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <Search className="h-4 w-4 text-white/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by invoice or client…" className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none" />
        </div>
        {saleList.length === 0 ? (
          <div className="p-4">
            <EmptyState icon={<Receipt className="h-8 w-8" />} title={`No ${biz.sellLabel.toLowerCase()}s yet`} sub="Create your first bill to see it here." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
                  <th className="px-4 py-3 font-medium">Invoice</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Date</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 text-right font-medium">Paid</th>
                  <th className="px-4 py-3 text-right font-medium">Balance</th>
                  <th className="px-4 py-3 text-right font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {saleList.map((s) => {
                  const bal = s.total - s.paid
                  return (
                    <tr key={s.id} className="border-b border-white/5 last:border-0">
                      <td className="px-4 py-3 font-mono text-xs text-white/60">{s.invoiceNo}</td>
                      <td className="px-4 py-3 text-white/85">{s.clientName}</td>
                      <td className="hidden px-4 py-3 text-white/50 sm:table-cell">{new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                      <td className="px-4 py-3 text-right font-semibold text-white">{inr(s.total)}</td>
                      <td className="px-4 py-3 text-right text-white/60">{inr(s.paid)}</td>
                      <td className="px-4 py-3 text-right">{bal > 0 ? <span className="text-amber-300">{inr(bal)}</span> : <span className="text-white/30">—</span>}</td>
                      <td className="px-4 py-3 text-right">
                        <Badge tone={s.status === 'paid' ? 'success' : s.status === 'partial' ? 'warning' : 'danger'}>{s.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {bal > 0 && (
                          <Button variant="outline" className="px-3 py-1.5 text-xs" onClick={() => { setCollect(s.id); setCollectAmt(bal) }}>
                            Collect
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* New sale modal */}
      <Modal open={open} onClose={() => { setOpen(false); resetSale() }} title={`New ${biz.sellLabel} · ${biz.invoiceTitle}`} wide>
        <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
          {/* Left: client + items */}
          <div className="space-y-4">
            <div>
              <Field label={biz.clientLabel}>
                <select className={inputCls} value={clientSel} onChange={(e) => setClientSel(e.target.value)}>
                  <option value="walkin">Walk-in Customer</option>
                  {store.clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} · {c.phone}
                    </option>
                  ))}
                  <option value="new">＋ New {biz.clientLabel.toLowerCase()}</option>
                </select>
              </Field>
              {clientSel === 'new' && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Field label="Name">
                    <input className={inputCls} value={quickName} onChange={(e) => { setQuickName(e.target.value); setQuickErr('') }} placeholder="Name" />
                  </Field>
                  <Field label="Phone">
                    <input className={inputCls} value={quickPhone} onChange={(e) => { setQuickPhone(e.target.value); setQuickErr('') }} placeholder="98XXXXXXXX" />
                  </Field>
                  {quickErr && <span className="col-span-2 text-xs text-rose-300">{quickErr}</span>}
                </div>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Search className="h-4 w-4 text-white/40" />
                <input value={itemQ} onChange={(e) => setItemQ(e.target.value)} placeholder="Search item…" className="w-full rounded-lg border border-white/10 bg-ink-900/60 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/30" />
              </div>
              <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
                {itemList.slice(0, 8).map((i) => (
                  <button
                    key={i.id}
                    onClick={() => addLine(i.id)}
                    disabled={i.qty <= 0}
                    className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left transition-colors hover:bg-white/[0.06] disabled:opacity-40"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm text-white/85">{i.name}</div>
                      <div className="text-xs text-white/40">
                        {inr(i.sellPrice)} · {i.qty} in stock
                      </div>
                    </div>
                    <Plus className="h-4 w-4 shrink-0 text-white/50" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: bill */}
          <div className="flex flex-col rounded-xl border border-white/10 bg-ink-900/50 p-4">
            <h4 className="mb-3 font-display text-sm font-semibold text-white">Bill</h4>
            <div className="flex-1 space-y-2">
              {lines.length === 0 ? (
                <p className="py-6 text-center text-xs text-white/40">No items added yet.</p>
              ) : (
                lines.map((l) => {
                  const it = store.inventory.find((i) => i.id === l.itemId)
                  if (!it) return null
                  return (
                    <div key={l.itemId} className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm text-white/85">{it.name}</div>
                        <div className="text-xs text-white/40">{inr(it.sellPrice)} each</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setLines((p) => (l.qty <= 1 ? p.filter((x) => x.itemId !== l.itemId) : p.map((x) => (x.itemId === l.itemId ? { ...x, qty: x.qty - 1 } : x))))} className="rounded-md border border-white/10 p-1 text-white/60 hover:bg-white/5">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold text-white">{l.qty}</span>
                        <button onClick={() => addLine(l.itemId)} className="rounded-md border border-white/10 p-1 text-white/60 hover:bg-white/5">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="w-16 text-right text-sm font-semibold text-white">{inr(it.sellPrice * l.qty)}</div>
                      <button onClick={() => setLines((p) => p.filter((x) => x.itemId !== l.itemId))} className="text-white/30 hover:text-rose-300">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })
              )}
            </div>

            <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/55">Total</span>
                <span className="font-display text-xl font-semibold text-white">{inr(total)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Amount received (₹)">
                  <input type="number" className={inputCls} value={paid} onChange={(e) => setPaid(Number(e.target.value))} />
                </Field>
                <Field label="Mode">
                  <select className={inputCls} value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-amber-400/10 px-3 py-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                  <Wallet className="h-3.5 w-3.5" /> Udhaar (balance)
                </span>
                <span className="font-display text-sm font-semibold text-amber-300">{inr(Math.max(0, total - paid))}</span>
              </div>
              {saleErr && <p className="text-xs text-rose-300">{saleErr}</p>}
              <Button onClick={submitSale} className="w-full">
                Save {biz.sellLabel.toLowerCase()} · {inr(total)}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Collect payment modal */}
      <Modal open={!!collect} onClose={() => setCollect(null)} title="Record payment">
        <div className="space-y-4">
          <Field label="Amount (₹)">
            <input type="number" className={inputCls} value={collectAmt} onChange={(e) => setCollectAmt(Number(e.target.value))} />
          </Field>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCollect(null)}>Cancel</Button>
            <Button onClick={submitCollect}>Mark paid</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
