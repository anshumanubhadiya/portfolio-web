import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface InventoryItem {
  id: string
  sku: string
  name: string
  category: string
  qty: number
  buyPrice: number
  sellPrice: number
  reorderLevel: number
  attrs: Record<string, string>
}

export interface Client {
  id: string
  name: string
  phone: string
  locality: string
  openingBalance: number
  joined: string
}

export interface SaleLine {
  itemId: string
  name: string
  qty: number
  price: number
}

export interface Sale {
  id: string
  invoiceNo: string
  clientId: string | null
  clientName: string
  date: string
  lines: SaleLine[]
  total: number
  paid: number
  mode: 'cash' | 'upi' | 'card' | 'other'
  status: 'paid' | 'partial' | 'due'
}

export interface Profile {
  name: string
  gstin: string
  address: string
  upi: string
  upiName: string
  invoicePrefix: string
}

interface Seed {
  inventory: InventoryItem[]
  clients: Client[]
  sales: Sale[]
  invoiceSeq: number
}

export const isValidPhone = (p: string) => /^(\+?91)?[6-9]\d{9}$/.test(p.replace(/[\s-]/g, ''))

const item = (
  id: string,
  sku: string,
  name: string,
  category: string,
  qty: number,
  buyPrice: number,
  sellPrice: number,
  reorderLevel: number,
  attrs: Record<string, string> = {},
): InventoryItem => ({ id, sku, name, category, qty, buyPrice, sellPrice, reorderLevel, attrs })

const client = (
  id: string,
  name: string,
  phone: string,
  locality: string,
  openingBalance: number,
  joined: string,
): Client => ({ id, name, phone, locality, openingBalance, joined })

const sale = (
  id: string,
  invoiceNo: string,
  clientId: string | null,
  clientName: string,
  daysAgo: number,
  lines: SaleLine[],
  paid: number,
  mode: Sale['mode'] = 'cash',
): Sale => {
  const total = lines.reduce((s, l) => s + l.qty * l.price, 0)
  const date = new Date(Date.now() - daysAgo * 86400000).toISOString()
  const balance = total - paid
  return {
    id,
    invoiceNo,
    clientId,
    clientName,
    date,
    lines,
    total,
    paid,
    mode,
    status: balance <= 0 ? 'paid' : paid > 0 ? 'partial' : 'due',
  }
}

function seedsFor(biz: string): Seed {
  switch (biz) {
    case 'optical':
      return {
        invoiceSeq: 4,
        inventory: [
          item('o1', 'FR-001', 'Ray-Ban Aviator Classic', 'Frames', 2, 3200, 5400, 3, { brand: 'Ray-Ban', type: 'Frame' }),
          item('o2', 'FR-002', 'Vincent Chase Oval Metal', 'Frames', 9, 950, 1800, 4, { brand: 'Vincent Chase', type: 'Frame' }),
          item('o3', 'LN-101', 'Crizal Anti-glare Lens', 'Lenses', 4, 1200, 2400, 5, { brand: 'Crizal', type: 'Lens' }),
          item('o4', 'LN-102', 'Blue-cut Progressive Lens', 'Lenses', 12, 1800, 3600, 5, { brand: 'Essilor', type: 'Lens' }),
          item('o5', 'FR-003', 'Fastrack Round Full-rim', 'Frames', 7, 800, 1500, 3, { brand: 'Fastrack', type: 'Frame' }),
        ],
        clients: [
          client('c1', 'Ramesh Gupta', '9820012345', 'Andheri West', 1200, '2026-01-14'),
          client('c2', 'Priya Nair', '9987654321', 'Bandra', 0, '2026-02-02'),
          client('c3', 'Arjun Mehta', '9123456780', 'Dadar', 3500, '2025-12-19'),
          client('c4', 'Sana Shaikh', '9876501234', 'Juhu', 0, '2026-03-11'),
        ],
        sales: [
          sale('s1', 'INV-2026-0001', 'c1', 'Ramesh Gupta', 5, [{ itemId: 'o1', name: 'Ray-Ban Aviator Classic', qty: 1, price: 5400 }], 5400),
          sale('s2', 'INV-2026-0002', 'c2', 'Priya Nair', 3, [
            { itemId: 'o2', name: 'Vincent Chase Oval Metal', qty: 1, price: 1800 },
            { itemId: 'o3', name: 'Crizal Anti-glare Lens', qty: 2, price: 2400 },
          ], 5000, 'upi'),
          sale('s3', 'INV-2026-0003', 'c3', 'Arjun Mehta', 1, [{ itemId: 'o4', name: 'Blue-cut Progressive Lens', qty: 1, price: 3600 }], 2000, 'upi'),
          sale('s4', 'INV-2026-0004', null, 'Walk-in Customer', 0, [{ itemId: 'o5', name: 'Fastrack Round Full-rim', qty: 1, price: 1500 }], 1500),
        ],
      }
    case 'retail':
      return {
        invoiceSeq: 4,
        inventory: [
          item('r1', 'AP-100', 'Cotton Round-neck T-shirt', 'Apparel', 3, 250, 599, 5, { size: 'M/L/XL', color: 'White' }),
          item('r2', 'AP-101', 'Slim-fit Denim Jeans', 'Apparel', 14, 850, 1599, 5, { size: '32/34', color: 'Indigo' }),
          item('r3', 'AP-102', 'Oversized Hoodie', 'Apparel', 8, 700, 1299, 4, { size: 'L/XL', color: 'Black' }),
          item('r4', 'AP-103', 'Linen Casual Shirt', 'Apparel', 18, 550, 1099, 5, { size: 'S/M/L', color: 'Beige' }),
          item('r5', 'AP-104', 'Chino Trousers', 'Apparel', 2, 600, 1199, 4, { size: '30/32', color: 'Olive' }),
        ],
        clients: [
          client('c1', 'Rahul Sharma', '9812345670', 'Karol Bagh', 0, '2026-01-20'),
          client('c2', 'Neha Verma', '9922334455', 'Saket', 750, '2026-02-08'),
          client('c3', 'Vikram Singh', '9111223344', 'Dwarka', 0, '2025-12-01'),
        ],
        sales: [
          sale('s1', 'INV-2026-0001', 'c1', 'Rahul Sharma', 4, [
            { itemId: 'r1', name: 'Cotton Round-neck T-shirt', qty: 2, price: 599 },
            { itemId: 'r2', name: 'Slim-fit Denim Jeans', qty: 1, price: 1599 },
          ], 2797),
          sale('s2', 'INV-2026-0002', 'c2', 'Neha Verma', 2, [{ itemId: 'r3', name: 'Oversized Hoodie', qty: 1, price: 1299 }], 500, 'upi'),
          sale('s3', 'INV-2026-0003', null, 'Walk-in Customer', 1, [{ itemId: 'r4', name: 'Linen Casual Shirt', qty: 2, price: 1099 }], 2198, 'card'),
          sale('s4', 'INV-2026-0004', 'c3', 'Vikram Singh', 0, [{ itemId: 'r5', name: 'Chino Trousers', qty: 1, price: 1199 }], 1199, 'upi'),
        ],
      }
    case 'pharmacy':
      return {
        invoiceSeq: 4,
        inventory: [
          item('p1', 'MED-500', 'Paracetamol 500mg (strip of 15)', 'Tablets', 6, 12, 25, 10, { batch: 'B2201', expiry: '2027-06-30', supplier: 'MedPlus Distributors' }),
          item('p2', 'MED-650', 'Amoxicillin 500mg Capsule', 'Antibiotics', 40, 45, 90, 10, { batch: 'B1188', expiry: '2027-03-31', supplier: 'Pharma Wholesale Co.' }),
          item('p3', 'MED-420', 'Cetirizine 10mg (strip of 10)', 'Allergy', 12, 18, 35, 8, { batch: 'B3310', expiry: '2027-01-31', supplier: 'MedPlus Distributors' }),
          item('p4', 'MED-600', 'Ibuprofen 400mg (strip of 15)', 'Pain Relief', 4, 22, 45, 6, { batch: 'B4405', expiry: '2026-12-31', supplier: 'Pharma Wholesale Co.' }),
          item('p5', 'MED-700', 'Azithromycin 500mg (strip of 3)', 'Antibiotics', 3, 60, 110, 5, { batch: 'B5502', expiry: '2026-10-31', supplier: 'MedPlus Distributors' }),
        ],
        clients: [
          client('c1', 'Sunita Devi', '9810011002', 'Lajpat Nagar', 0, '2026-01-05'),
          client('c2', 'Mohan Lal', '9988776655', 'Green Park', 260, '2025-12-22'),
          client('c3', 'Ritu Agarwal', '9100112233', 'Defence Colony', 0, '2026-02-15'),
        ],
        sales: [
          sale('s1', 'INV-2026-0001', 'c1', 'Sunita Devi', 3, [
            { itemId: 'p1', name: 'Paracetamol 500mg', qty: 2, price: 25 },
            { itemId: 'p3', name: 'Cetirizine 10mg', qty: 1, price: 35 },
          ], 85),
          sale('s2', 'INV-2026-0002', 'c2', 'Mohan Lal', 2, [{ itemId: 'p2', name: 'Amoxicillin 500mg', qty: 1, price: 90 }], 90, 'upi'),
          sale('s3', 'INV-2026-0003', null, 'Walk-in Customer', 1, [{ itemId: 'p4', name: 'Ibuprofen 400mg', qty: 1, price: 45 }], 45),
          sale('s4', 'INV-2026-0004', 'c3', 'Ritu Agarwal', 0, [{ itemId: 'p5', name: 'Azithromycin 500mg', qty: 1, price: 110 }], 110, 'card'),
        ],
      }
    case 'gym':
      return {
        invoiceSeq: 4,
        inventory: [
          item('g1', 'PLN-01', 'Monthly Gym Membership', 'Plans', 999, 1000, 1500, 10, { plan: 'Monthly', duration: '1' }),
          item('g2', 'PLN-03', 'Quarterly Gym Membership', 'Plans', 999, 2800, 4000, 5, { plan: 'Quarterly', duration: '3' }),
          item('g3', 'PLN-06', 'Half-yearly Membership', 'Plans', 999, 5200, 7500, 5, { plan: 'Half-yearly', duration: '6' }),
          item('g4', 'PLN-12', 'Annual Membership', 'Plans', 999, 9500, 13500, 3, { plan: 'Annual', duration: '12' }),
          item('g5', 'CLS-01', 'Personal Training (10 sessions)', 'Add-ons', 999, 4000, 6000, 3, { plan: 'PT Pack', duration: '1' }),
        ],
        clients: [
          client('c1', 'Amit Joshi', '9812345098', 'Koramangala', 0, '2026-01-10'),
          client('c2', 'Karan Malhotra', '9955667788', 'Indiranagar', 1500, '2025-11-15'),
          client('c3', 'Divya Reddy', '9166443322', 'HSR Layout', 0, '2026-02-20'),
          client('c4', 'Farhan Khan', '9845123456', 'BTM Layout', 0, '2026-03-01'),
        ],
        sales: [
          sale('s1', 'INV-2026-0001', 'c1', 'Amit Joshi', 6, [{ itemId: 'g1', name: 'Monthly Gym Membership', qty: 1, price: 1500 }], 1500),
          sale('s2', 'INV-2026-0002', 'c2', 'Karan Malhotra', 4, [{ itemId: 'g2', name: 'Quarterly Gym Membership', qty: 1, price: 4000 }], 2500, 'upi'),
          sale('s3', 'INV-2026-0003', 'c3', 'Divya Reddy', 2, [{ itemId: 'g4', name: 'Annual Membership', qty: 1, price: 13500 }], 13500, 'upi'),
          sale('s4', 'INV-2026-0004', 'c4', 'Farhan Khan', 0, [{ itemId: 'g1', name: 'Monthly Gym Membership', qty: 1, price: 1500 }], 1500),
        ],
      }
    case 'jewellery':
      return {
        invoiceSeq: 4,
        inventory: [
          item('j1', 'JW-100', '22K Gold Ring (Classic)', 'Rings', 3, 22000, 26800, 2, { metal: 'Gold', purity: '22K', weight: '4.2' }),
          item('j2', 'JW-101', '18K Gold Necklace', 'Necklaces', 5, 46000, 56000, 2, { metal: 'Gold', purity: '18K', weight: '12.5' }),
          item('j3', 'JW-102', 'Silver Anklet Pair', 'Anklets', 8, 900, 1800, 3, { metal: 'Silver', purity: '92.5', weight: '18.0' }),
          item('j4', 'JW-103', 'Diamond Stud Earrings', 'Earrings', 4, 18000, 24000, 2, { metal: 'Gold', purity: '18K', weight: '3.1' }),
          item('j5', 'JW-104', 'Kundan Bridal Set', 'Bridal', 2, 38000, 49000, 2, { metal: 'Gold', purity: '22K', weight: '20.0' }),
        ],
        clients: [
          client('c1', 'Pooja Agarwal', '9871234567', 'Chandni Chowk', 5000, '2026-01-18'),
          client('c2', 'Rakesh Jain', '9812345001', 'Karol Bagh', 0, '2026-02-25'),
          client('c3', 'Meera Soni', '9167891234', 'Lajpat Nagar', 0, '2025-12-30'),
        ],
        sales: [
          sale('s1', 'INV-2026-0001', 'c1', 'Pooja Agarwal', 5, [{ itemId: 'j1', name: '22K Gold Ring (Classic)', qty: 1, price: 26800 }], 21800, 'upi'),
          sale('s2', 'INV-2026-0002', 'c2', 'Rakesh Jain', 3, [{ itemId: 'j3', name: 'Silver Anklet Pair', qty: 2, price: 1800 }], 3600),
          sale('s3', 'INV-2026-0003', 'c3', 'Meera Soni', 1, [{ itemId: 'j4', name: 'Diamond Stud Earrings', qty: 1, price: 24000 }], 24000, 'upi'),
          sale('s4', 'INV-2026-0004', null, 'Walk-in Customer', 0, [{ itemId: 'j2', name: '18K Gold Necklace', qty: 1, price: 56000 }], 40000, 'card'),
        ],
      }
    default:
      return {
        invoiceSeq: 4,
        inventory: [
          item('i1', 'SKU-100', 'Standard Item — Alpha', 'General', 4, 400, 800, 5, {}),
          item('i2', 'SKU-101', 'Standard Item — Beta', 'General', 12, 600, 1200, 5, {}),
          item('i3', 'SKU-102', 'Standard Item — Gamma', 'General', 2, 250, 500, 4, {}),
          item('i4', 'SKU-103', 'Standard Item — Delta', 'General', 20, 300, 650, 5, {}),
        ],
        clients: [
          client('c1', 'Amit Sharma', '9812345670', 'City Center', 0, '2026-01-15'),
          client('c2', 'Priya Patel', '9988776655', 'Old Town', 800, '2025-12-20'),
          client('c3', 'Ravi Kumar', '9123456780', 'Market Road', 0, '2026-02-10'),
        ],
        sales: [
          sale('s1', 'INV-2026-0001', 'c1', 'Amit Sharma', 4, [{ itemId: 'i1', name: 'Standard Item — Alpha', qty: 1, price: 800 }], 800),
          sale('s2', 'INV-2026-0002', 'c2', 'Priya Patel', 2, [{ itemId: 'i2', name: 'Standard Item — Beta', qty: 2, price: 1200 }], 1600, 'upi'),
          sale('s3', 'INV-2026-0003', null, 'Walk-in Customer', 1, [{ itemId: 'i3', name: 'Standard Item — Gamma', qty: 1, price: 500 }], 500),
          sale('s4', 'INV-2026-0004', 'c3', 'Ravi Kumar', 0, [{ itemId: 'i4', name: 'Standard Item — Delta', qty: 1, price: 650 }], 650, 'card'),
        ],
      }
  }
}

const defaultProfile: Profile = {
  name: 'Sharma & Co.',
  gstin: '',
  address: '12, MG Road, Mumbai',
  upi: 'shop@upi',
  upiName: 'Sharma & Co.',
  invoicePrefix: 'INV-2026',
}

interface Store {
  businessType: string
  profile: Profile
  invoiceSeq: number
  inventory: InventoryItem[]
  clients: Client[]
  sales: Sale[]
  setBusinessType: (id: string) => void
  updateProfile: (p: Partial<Profile>) => void
  addInventory: (i: Omit<InventoryItem, 'id'>) => void
  adjustStock: (id: string, delta: number) => void
  deleteInventory: (id: string) => void
  addClient: (c: Omit<Client, 'id' | 'joined'>) => string
  createSale: (input: {
    clientId: string | null
    clientName: string
    lines: { itemId: string; qty: number }[]
    paid: number
    mode: Sale['mode']
  }) => { ok: boolean; error?: string; sale?: Sale }
  recordPayment: (saleId: string, amount: number) => void
  resetDemo: () => void
}

const Ctx = createContext<Store | null>(null)
const KEY = 'arion-demo-v3'

function load(): { businessType: string; profile: Profile; invoiceSeq: number; inventory: InventoryItem[]; clients: Client[]; sales: Sale[] } {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.businessType) return parsed
    }
  } catch {
    /* ignore */
  }
  const biz = 'optical'
  return { businessType: biz, profile: defaultProfile, ...seedsFor(biz) }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const setBusinessType = useCallback((id: string) => {
    setState((s) => ({ ...s, businessType: id, ...seedsFor(id) }))
  }, [])

  const updateProfile = useCallback((p: Partial<Profile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...p } }))
  }, [])

  const addInventory = useCallback((i: Omit<InventoryItem, 'id'>) => {
    setState((s) => ({ ...s, inventory: [{ ...i, id: `inv-${Date.now()}` }, ...s.inventory] }))
  }, [])

  const adjustStock = useCallback((id: string, delta: number) => {
    setState((s) => ({
      ...s,
      inventory: s.inventory.map((it) => (it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it)),
    }))
  }, [])

  const deleteInventory = useCallback((id: string) => {
    setState((s) => ({ ...s, inventory: s.inventory.filter((it) => it.id !== id) }))
  }, [])

  const addClient = useCallback((c: Omit<Client, 'id' | 'joined'>) => {
    const id = `cli-${Date.now()}`
    setState((s) => ({
      ...s,
      clients: [{ ...c, id, joined: new Date().toISOString().slice(0, 10) }, ...s.clients],
    }))
    return id
  }, [])

  const createSale = useCallback<Store['createSale']>(
    (input) => {
      const seq = state.invoiceSeq + 1
      const invoiceNo = `${state.profile.invoicePrefix || 'INV'}-${String(seq).padStart(4, '0')}`
      // Validate stock
      for (const l of input.lines) {
        const it = state.inventory.find((i) => i.id === l.itemId)
        if (!it) return { ok: false, error: 'Item not found.' }
        if (it.qty < l.qty) return { ok: false, error: `Insufficient stock for "${it.name}" (${it.qty} left).` }
      }
      const lines: SaleLine[] = input.lines.map((l) => {
        const it = state.inventory.find((i) => i.id === l.itemId)!
        return { itemId: l.itemId, name: it.name, qty: l.qty, price: it.sellPrice }
      })
      const total = lines.reduce((s, l) => s + l.qty * l.price, 0)
      const newSale: Sale = {
        id: `sal-${Date.now()}`,
        invoiceNo,
        clientId: input.clientId,
        clientName: input.clientName || 'Walk-in Customer',
        date: new Date().toISOString(),
        lines,
        total,
        paid: Math.min(input.paid, total),
        mode: input.mode,
        status: input.paid >= total ? 'paid' : input.paid > 0 ? 'partial' : 'due',
      }
      setState((s) => ({
        ...s,
        invoiceSeq: seq,
        inventory: s.inventory.map((it) => {
          const line = input.lines.find((l) => l.itemId === it.id)
          return line ? { ...it, qty: it.qty - line.qty } : it
        }),
        sales: [newSale, ...s.sales],
      }))
      return { ok: true, sale: newSale }
    },
    [state.inventory, state.invoiceSeq, state.profile.invoicePrefix],
  )

  const recordPayment = useCallback((saleId: string, amount: number) => {
    setState((s) => ({
      ...s,
      sales: s.sales.map((sl) => {
        if (sl.id !== saleId) return sl
        const paid = Math.min(sl.total, sl.paid + amount)
        return { ...sl, paid, status: paid >= sl.total ? 'paid' : paid > 0 ? 'partial' : 'due' }
      }),
    }))
  }, [])

  const resetDemo = useCallback(() => {
    setState((s) => ({ ...s, businessType: s.businessType, ...seedsFor(s.businessType) }))
  }, [])

  const value = useMemo<Store>(
    () => ({
      ...state,
      setBusinessType,
      updateProfile,
      addInventory,
      adjustStock,
      deleteInventory,
      addClient,
      createSale,
      recordPayment,
      resetDemo,
    }),
    [state, setBusinessType, updateProfile, addInventory, adjustStock, deleteInventory, addClient, createSale, recordPayment, resetDemo],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

// ---- derived helpers ----
export const inr = (n: number) =>
  '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 })

export function clientBalance(saleList: Sale[], clientId: string): number {
  return saleList.filter((s) => s.clientId === clientId).reduce((sum, s) => sum + (s.total - s.paid), 0)
}

export function pendingTotal(saleList: Sale[]): number {
  return saleList.reduce((sum, s) => sum + (s.total - s.paid), 0)
}

export function isToday(iso: string): boolean {
  const d = new Date(iso)
  const now = new Date()
  return d.toDateString() === now.toDateString()
}
