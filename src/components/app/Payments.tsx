import { useMemo, useState } from 'react'
import { Copy, MessageCircle, QrCode, Wallet } from 'lucide-react'
import { useStore, inr, clientBalance } from '../../lib/store'
import { Card, Badge, Field, inputCls, EmptyState } from './ui'

export function Payments() {
  const store = useStore()
  const [amount, setAmount] = useState(500)
  const [note, setNote] = useState('')
  const [copied, setCopied] = useState(false)

  const upiUri = `upi://pay?pa=${encodeURIComponent(store.profile.upi)}&pn=${encodeURIComponent(store.profile.upiName)}&am=${amount || 0}&cu=INR&tn=${encodeURIComponent(note || 'Payment')}`
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&color=ffffff&bgcolor=000000&data=${encodeURIComponent(upiUri)}`

  const udhaar = useMemo(
    () =>
      store.clients
        .map((c) => {
          const bal = clientBalance(store.sales, c.id) + c.openingBalance
          const lastSale = store.sales.filter((s) => s.clientId === c.id)[0]
          return { ...c, bal, lastSale: lastSale ? lastSale.date : null }
        })
        .filter((c) => c.bal > 0)
        .sort((a, b) => b.bal - a.bal),
    [store.clients, store.sales],
  )

  function copy() {
    navigator.clipboard?.writeText(upiUri).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function waReminder(c: { name: string; phone: string; bal: number }) {
    const msg = `Hi ${c.name}, a gentle reminder — your pending balance with ${store.profile.name} is ${inr(c.bal)}. Pay via UPI: ${store.profile.upi}. Thank you!`
    return `https://wa.me/91${c.phone}?text=${encodeURIComponent(msg)}`
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        {/* UPI QR */}
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-cyan-300" />
            <h3 className="font-display text-base font-semibold text-white">UPI Payment QR</h3>
          </div>
          <p className="mt-1 text-xs text-white/45">
            No API, no commission. Generate a QR for any amount and share it.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Field label="Amount (₹)">
              <input type="number" className={inputCls} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </Field>
            <Field label="Note">
              <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Invoice #1" />
            </Field>
          </div>

          <div className="mt-5 flex flex-col items-center">
            <div className="rounded-2xl border border-white/10 bg-white p-3">
              <img src={qrSrc} alt="UPI QR code" width={220} height={220} />
            </div>
            <div className="mt-3 w-full truncate rounded-lg bg-white/[0.03] px-3 py-2 text-center font-mono text-[11px] text-white/50">
              {store.profile.upi}
            </div>
            <div className="mt-3 flex w-full gap-2">
              <button onClick={copy} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10">
                <Copy className="h-3.5 w-3.5" /> {copied ? 'Copied!' : 'Copy link'}
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Pay ${inr(amount || 0)} to ${store.profile.name} — ${store.profile.upi}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-400/15 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-400/25"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Share on WhatsApp
              </a>
            </div>
          </div>
        </Card>

        {/* Udhaar book */}
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-amber-300" />
            <h3 className="font-display text-base font-semibold text-white">Udhaar Book</h3>
          </div>
          <p className="mt-1 text-xs text-white/45">Everyone who owes you money, oldest dues first.</p>

          {udhaar.length === 0 ? (
            <div className="mt-4">
              <EmptyState icon={<Wallet className="h-8 w-8" />} title="No pending balances" sub="Everyone has paid up. Nice." />
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {udhaar.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-white/90">{c.name}</div>
                    <div className="text-xs text-white/40">
                      {c.lastSale ? `Last bill ${new Date(c.lastSale).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : 'Opening balance'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-semibold text-amber-300">{inr(c.bal)}</span>
                    <a href={waReminder(c)} target="_blank" rel="noreferrer" className="rounded-lg bg-emerald-400/15 p-2 text-emerald-300 hover:bg-emerald-400/25">
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/45">
          <Badge tone="info">0% commission</Badge>
          <Badge tone="neutral">Manual "mark as paid" only — honest status</Badge>
          <span className="ml-auto">QR shows on invoice print & client detail (future hook)</span>
        </div>
      </Card>
    </div>
  )
}
