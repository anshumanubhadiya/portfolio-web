import { useMemo, useState } from 'react'
import { Minus, Package, Plus, Search, Trash2 } from 'lucide-react'
import { bizById } from '../../data'
import { useStore, inr } from '../../lib/store'
import { Button, Card, Badge, Field, inputCls, Modal, EmptyState } from './ui'

export function Inventory() {
  const store = useStore()
  const biz = bizById[store.businessType]
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    qty: 0,
    buyPrice: 0,
    sellPrice: 0,
    reorderLevel: 5,
    attrs: {} as Record<string, string>,
  })

  const list = useMemo(() => {
    const t = q.toLowerCase()
    return store.inventory.filter(
      (i) => i.name.toLowerCase().includes(t) || i.sku.toLowerCase().includes(t) || i.category.toLowerCase().includes(t),
    )
  }, [store.inventory, q])

  const low = store.inventory.filter((i) => i.qty <= i.reorderLevel).length
  const value = store.inventory.reduce((s, i) => s + i.qty * i.buyPrice, 0)

  function submit() {
    if (!form.name.trim()) return
    store.addInventory({
      name: form.name.trim(),
      sku: form.sku.trim() || `SKU-${Date.now()}`,
      category: form.category.trim() || 'General',
      qty: Math.max(0, form.qty),
      buyPrice: Math.max(0, form.buyPrice),
      sellPrice: Math.max(0, form.sellPrice),
      reorderLevel: Math.max(0, form.reorderLevel),
      attrs: form.attrs,
    })
    setOpen(false)
    setForm({ name: '', sku: '', category: '', qty: 0, buyPrice: 0, sellPrice: 0, reorderLevel: 5, attrs: {} })
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-sm text-white/45">
            <span className="font-display text-xl font-semibold text-white">{store.inventory.length}</span>{' '}
            {biz.stockLabel.toLowerCase()} · <span className="text-white/70">{inr(value)}</span> at cost
          </div>
          <Badge tone={low > 0 ? 'danger' : 'success'}>{low} low stock</Badge>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Add item
        </Button>
      </div>

      <Card className="p-0">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <Search className="h-4 w-4 text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${biz.stockLabel.toLowerCase()} by name, SKU or category…`}
            className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
          />
        </div>
        {list.length === 0 ? (
          <div className="p-4">
            <EmptyState icon={<Package className="h-8 w-8" />} title="No items found" sub="Add your first item to get started." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  {biz.attributes.slice(0, 2).map((a) => (
                    <th key={a.key} className="hidden px-4 py-3 font-medium lg:table-cell">
                      {a.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-medium">Buy</th>
                  <th className="px-4 py-3 text-right font-medium">Sell</th>
                  <th className="px-4 py-3 text-center font-medium">Stock</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((i) => {
                  const lowIt = i.qty <= i.reorderLevel
                  return (
                    <tr key={i.id} className="border-b border-white/5 last:border-0">
                      <td className="px-4 py-3">
                        <div className="font-medium text-white/90">{i.name}</div>
                        <div className="font-mono text-[11px] text-white/40">{i.sku}</div>
                      </td>
                      <td className="px-4 py-3 text-white/60">{i.category}</td>
                      {biz.attributes.slice(0, 2).map((a) => (
                        <td key={a.key} className="hidden px-4 py-3 text-white/60 lg:table-cell">
                          {i.attrs[a.key] || '—'}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right text-white/60">{inr(i.buyPrice)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-white">{inr(i.sellPrice)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => store.adjustStock(i.id, -1)}
                            className="rounded-md border border-white/10 p-1 text-white/60 hover:bg-white/5"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className={`w-10 text-center font-semibold ${lowIt ? 'text-rose-300' : 'text-white'}`}>
                            {i.qty}
                          </span>
                          <button
                            onClick={() => store.adjustStock(i.id, 1)}
                            className="rounded-md border border-white/10 p-1 text-white/60 hover:bg-white/5"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => store.deleteInventory(i.id)}
                          className="rounded-md p-1.5 text-white/40 hover:bg-rose-500/10 hover:text-rose-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={`Add ${biz.stockLabel.slice(0, -1)}`}>
        <div className="space-y-4">
          <Field label="Name">
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Item name" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="SKU / Barcode">
              <input className={inputCls} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="SKU-001" />
            </Field>
            <Field label="Category">
              <input className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Stock qty">
              <input type="number" className={inputCls} value={form.qty} onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })} />
            </Field>
            <Field label="Buy price (₹)">
              <input type="number" className={inputCls} value={form.buyPrice} onChange={(e) => setForm({ ...form, buyPrice: Number(e.target.value) })} />
            </Field>
            <Field label="Sell price (₹)">
              <input type="number" className={inputCls} value={form.sellPrice} onChange={(e) => setForm({ ...form, sellPrice: Number(e.target.value) })} />
            </Field>
          </div>
          <Field label="Reorder level">
            <input type="number" className={inputCls} value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: Number(e.target.value) })} />
          </Field>

          {biz.attributes.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {biz.attributes.map((a) => (
                <Field key={a.key} label={a.label}>
                  <input
                    type={a.type === 'number' ? 'number' : 'text'}
                    className={inputCls}
                    value={form.attrs[a.key] || ''}
                    onChange={(e) => setForm({ ...form, attrs: { ...form.attrs, [a.key]: e.target.value } })}
                    placeholder={a.label}
                  />
                </Field>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!form.name.trim()}>
              Add item
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
