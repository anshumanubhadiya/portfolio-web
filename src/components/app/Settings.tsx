import { RotateCcw, Settings as SettingsIcon, Store } from 'lucide-react'
import { bizById } from '../../data'
import { useStore } from '../../lib/store'
import { Button, Card, Field, inputCls } from './ui'

export function Settings() {
  const store = useStore()
  const biz = bizById[store.businessType]
  const p = store.profile

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="p-6">
        <h3 className="mb-1 flex items-center gap-2 font-display text-base font-semibold text-white">
          <Store className="h-4 w-4 text-cyan-300" /> Shop profile
        </h3>
        <p className="mb-5 text-xs text-white/45">Used on invoices, receipts and UPI links.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Shop name">
            <input className={inputCls} value={p.name} onChange={(e) => store.updateProfile({ name: e.target.value })} />
          </Field>
          <Field label="GSTIN (optional)">
            <input className={inputCls} value={p.gstin} onChange={(e) => store.updateProfile({ gstin: e.target.value })} placeholder="27ABCDE1234F1Z5" />
          </Field>
          <Field label="Address">
            <input className={inputCls} value={p.address} onChange={(e) => store.updateProfile({ address: e.target.value })} />
          </Field>
          <Field label="Invoice prefix">
            <input className={inputCls} value={p.invoicePrefix} onChange={(e) => store.updateProfile({ invoicePrefix: e.target.value })} />
          </Field>
          <Field label="UPI VPA">
            <input className={inputCls} value={p.upi} onChange={(e) => store.updateProfile({ upi: e.target.value })} placeholder="shop@upi" />
          </Field>
          <Field label="UPI payee name">
            <input className={inputCls} value={p.upiName} onChange={(e) => store.updateProfile({ upiName: e.target.value })} />
          </Field>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-1 flex items-center gap-2 font-display text-base font-semibold text-white">
          <SettingsIcon className="h-4 w-4 text-fuchsia-300" /> Business type
        </h3>
        <p className="mb-5 text-xs text-white/45">
          Switching reloads a fresh demo workspace for that trade. Currently:{' '}
          <span className="text-white/80">{biz.name}</span>.
        </p>
        <select
          className={inputCls}
          value={store.businessType}
          onChange={(e) => store.setBusinessType(e.target.value)}
        >
          {Object.values(bizById).map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </Card>

      <Card className="p-6">
        <h3 className="mb-1 font-display text-base font-semibold text-white">Demo data</h3>
        <p className="mb-4 text-xs text-white/45">Reset the workspace back to its seeded sample data.</p>
        <Button variant="outline" onClick={store.resetDemo}>
          <RotateCcw className="h-4 w-4" /> Reset demo data
        </Button>
      </Card>

      <div className="grid gap-3 text-xs text-white/40 sm:grid-cols-2">
        {[
          'Roles & permissions (Owner / Staff) — future hook',
          'Offline-first PWA & sync queue — future hook',
          'GST-lite, e-invoice IRN — future hook',
          'AI assistant (grounded, logged) — future hook',
        ].map((t) => (
          <div key={t} className="rounded-xl border border-dashed border-white/10 px-4 py-3">
            {t}
          </div>
        ))}
      </div>
    </div>
  )
}
