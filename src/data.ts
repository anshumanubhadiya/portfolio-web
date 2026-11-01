import type { LucideIcon } from 'lucide-react'
import {
  Glasses,
  Shirt,
  Wrench,
  Building2,
  CalendarClock,
  Truck,
  Dumbbell,
  Pill,
  Gem,
} from 'lucide-react'

export interface BizType {
  id: string
  name: string
  short: string
  icon: LucideIcon
  tagline: string
  clientLabel: string
  sellLabel: string
  invoiceTitle: string
  stockLabel: string
  accent: string
  accentText: string
  photo: string
  todayActions: { key: string; label: string }[]
  kpis: { key: string; label: string }[]
  attributes: { key: string; label: string; type: 'text' | 'number' }[]
}

export const bizTypes: BizType[] = [
  {
    id: 'optical',
    name: 'Optical & Eyewear',
    short: 'Optical',
    icon: Glasses,
    tagline: 'Prescriptions, frame & lens stock, order tracking and pickup-ready alerts.',
    clientLabel: 'Customer',
    sellLabel: 'Optical Order',
    invoiceTitle: 'Optical Bill',
    stockLabel: 'Frames & Lenses',
    accent: 'from-cyan-400 to-blue-500',
    accentText: 'text-cyan-300',
    photo: 'optical',
    todayActions: [
      { key: 'ready', label: 'Orders ready for pickup' },
      { key: 'fitting', label: 'Pending lens fitting' },
      { key: 'delivery', label: 'Awaiting delivery' },
      { key: 'followups', label: 'Customer follow-ups' },
      { key: 'pending', label: 'Pending payments' },
    ],
    kpis: [
      { key: 'todaySales', label: "Today's Orders" },
      { key: 'pending', label: 'Pending (Udhaar)' },
      { key: 'lowStock', label: 'Low Stock' },
      { key: 'ready', label: 'Ready for Pickup' },
    ],
    attributes: [
      { key: 'brand', label: 'Brand', type: 'text' },
      { key: 'type', label: 'Type (Frame / Lens)', type: 'text' },
      { key: 'prescription', label: 'Prescription', type: 'text' },
    ],
  },
  {
    id: 'retail',
    name: 'Retail & Apparel',
    short: 'Retail',
    icon: Shirt,
    tagline: 'Variants, barcode scanning and a three-tap counter sale that never slows down.',
    clientLabel: 'Customer',
    sellLabel: 'Sale',
    invoiceTitle: 'Sale Bill',
    stockLabel: 'Products',
    accent: 'from-fuchsia-400 to-pink-500',
    accentText: 'text-fuchsia-300',
    photo: 'retail',
    todayActions: [
      { key: 'todaySales', label: "Today's sales" },
      { key: 'fulfilment', label: 'Awaiting fulfilment' },
      { key: 'lowStock', label: 'Low stock' },
      { key: 'pickups', label: 'Pending pickups' },
      { key: 'returns', label: 'Returns needing attention' },
    ],
    kpis: [
      { key: 'todaySales', label: "Today's Sales" },
      { key: 'pending', label: 'Pending (Udhaar)' },
      { key: 'lowStock', label: 'Low Stock' },
      { key: 'sold', label: 'Units Sold' },
    ],
    attributes: [
      { key: 'size', label: 'Size', type: 'text' },
      { key: 'color', label: 'Color', type: 'text' },
      { key: 'barcode', label: 'Barcode', type: 'text' },
    ],
  },
  {
    id: 'services',
    name: 'Services & Contracting',
    short: 'Services',
    icon: Wrench,
    tagline: 'Jobs, estimates, technicians and site addresses — estimate to job to invoice.',
    clientLabel: 'Client',
    sellLabel: 'Job',
    invoiceTitle: 'Job Bill',
    stockLabel: 'Parts',
    accent: 'from-amber-400 to-orange-500',
    accentText: 'text-amber-300',
    photo: 'services',
    todayActions: [
      { key: 'due', label: 'Jobs due today' },
      { key: 'overdue', label: 'Overdue jobs' },
      { key: 'estimates', label: 'Pending estimates' },
      { key: 'visits', label: 'Site visits' },
      { key: 'followups', label: 'Customer follow-ups' },
    ],
    kpis: [
      { key: 'todaySales', label: 'Jobs Billed' },
      { key: 'pending', label: 'Pending (Udhaar)' },
      { key: 'overdue', label: 'Overdue Jobs' },
      { key: 'open', label: 'Open Jobs' },
    ],
    attributes: [
      { key: 'site', label: 'Site Address', type: 'text' },
      { key: 'technician', label: 'Technician', type: 'text' },
      { key: 'status', label: 'Status', type: 'text' },
    ],
  },
  {
    id: 'realestate',
    name: 'Real Estate & Brokerage',
    short: 'Real Estate',
    icon: Building2,
    tagline: 'Deal stages, site visits and token / balance tracking from lead to closed.',
    clientLabel: 'Client',
    sellLabel: 'Deal',
    invoiceTitle: 'Deal Note',
    stockLabel: 'Properties',
    accent: 'from-violet-400 to-indigo-500',
    accentText: 'text-violet-300',
    photo: 'realestate',
    todayActions: [
      { key: 'visits', label: 'Site visits today' },
      { key: 'followups', label: 'Buyer / seller follow-ups' },
      { key: 'inquiries', label: 'Pending inquiries' },
      { key: 'deals', label: 'Deals needing action' },
    ],
    kpis: [
      { key: 'todaySales', label: 'Deals in Pipeline' },
      { key: 'pending', label: 'Token / Balance Due' },
      { key: 'visits', label: 'Visits Today' },
      { key: 'closed', label: 'Closed Deals' },
    ],
    attributes: [
      { key: 'stage', label: 'Deal Stage', type: 'text' },
      { key: 'area', label: 'Area (sqft)', type: 'number' },
      { key: 'locality', label: 'Locality', type: 'text' },
    ],
  },
  {
    id: 'wellness',
    name: 'Appointment & Wellness',
    short: 'Wellness',
    icon: CalendarClock,
    tagline: 'Slot-based calendar, sessions, reschedule / cancel with a reason, per-session billing.',
    clientLabel: 'Client',
    sellLabel: 'Session',
    invoiceTitle: 'Session Receipt',
    stockLabel: 'Packages',
    accent: 'from-emerald-400 to-teal-500',
    accentText: 'text-emerald-300',
    photo: 'wellness',
    todayActions: [
      { key: 'appointments', label: "Today's appointments" },
      { key: 'upcoming', label: 'Upcoming sessions' },
      { key: 'cancellations', label: 'Cancellations' },
      { key: 'followups', label: 'Client follow-ups' },
      { key: 'pending', label: 'Pending payments' },
    ],
    kpis: [
      { key: 'todaySales', label: 'Sessions Today' },
      { key: 'pending', label: 'Pending (Udhaar)' },
      { key: 'appointments', label: 'Appointments' },
      { key: 'cancellations', label: 'Cancellations' },
    ],
    attributes: [
      { key: 'slot', label: 'Slot', type: 'text' },
      { key: 'duration', label: 'Duration (min)', type: 'number' },
      { key: 'type', label: 'Session Type', type: 'text' },
    ],
  },
  {
    id: 'wholesale',
    name: 'Wholesale & B2B',
    short: 'Wholesale',
    icon: Truck,
    tagline: 'Credit days, PO references, dispatches and outstanding aging (0-30 / 31-60 / 60+).',
    clientLabel: 'B2B Client',
    sellLabel: 'Dispatch',
    invoiceTitle: 'Tax Invoice',
    stockLabel: 'Bulk Stock',
    accent: 'from-sky-400 to-cyan-500',
    accentText: 'text-sky-300',
    photo: 'wholesale',
    todayActions: [
      { key: 'dispatches', label: 'Dispatches due' },
      { key: 'pos', label: 'Pending POs' },
      { key: 'lowStock', label: 'Low stock' },
      { key: 'receivables', label: 'Outstanding receivables' },
      { key: 'delivery', label: 'Delivery follow-ups' },
    ],
    kpis: [
      { key: 'todaySales', label: 'Dispatched Today' },
      { key: 'pending', label: 'Outstanding' },
      { key: 'lowStock', label: 'Low Stock' },
      { key: 'aging', label: '60+ Days Aging' },
    ],
    attributes: [
      { key: 'unit', label: 'Pack Unit', type: 'text' },
      { key: 'po', label: 'PO Reference', type: 'text' },
      { key: 'credit', label: 'Credit Days', type: 'number' },
    ],
  },
  {
    id: 'gym',
    name: 'Gym & Fitness',
    short: 'Gym',
    icon: Dumbbell,
    tagline: 'Memberships, plan start / expiry, one-tap check-in, renewals and class schedules.',
    clientLabel: 'Member',
    sellLabel: 'Membership',
    invoiceTitle: 'Membership Receipt',
    stockLabel: 'Plans',
    accent: 'from-lime-400 to-emerald-500',
    accentText: 'text-lime-300',
    photo: 'gym',
    todayActions: [
      { key: 'checkins', label: "Today's check-ins" },
      { key: 'expiring', label: 'Memberships expiring soon' },
      { key: 'renewals', label: 'Renewals due' },
      { key: 'classes', label: 'Scheduled classes' },
      { key: 'pending', label: 'Pending membership payments' },
    ],
    kpis: [
      { key: 'todaySales', label: 'New Memberships' },
      { key: 'active', label: 'Active Members' },
      { key: 'expiring', label: 'Expiring Soon' },
      { key: 'checkins', label: 'Check-ins Today' },
    ],
    attributes: [
      { key: 'plan', label: 'Plan', type: 'text' },
      { key: 'duration', label: 'Duration (months)', type: 'number' },
      { key: 'expiry', label: 'Expiry', type: 'text' },
    ],
  },
  {
    id: 'pharmacy',
    name: 'Medical / Pharmacy',
    short: 'Pharmacy',
    icon: Pill,
    tagline: 'Batch / lot and expiry tracking, FEFO picking, reorder levels and suppliers.',
    clientLabel: 'Customer',
    sellLabel: 'Medicine Sale',
    invoiceTitle: 'Tax Invoice',
    stockLabel: 'Medicines',
    accent: 'from-rose-400 to-red-500',
    accentText: 'text-rose-300',
    photo: 'pharmacy',
    todayActions: [
      { key: 'lowStock', label: 'Low-stock medicines' },
      { key: 'nearExpiry', label: 'Near-expiry batches' },
      { key: 'expired', label: 'Expired stock (not sellable)' },
      { key: 'todaySales', label: "Today's pending sales" },
      { key: 'supplier', label: 'Supplier follow-ups' },
    ],
    kpis: [
      { key: 'todaySales', label: "Today's Sales" },
      { key: 'pending', label: 'Pending (Udhaar)' },
      { key: 'nearExpiry', label: 'Near Expiry' },
      { key: 'expired', label: 'Expired' },
    ],
    attributes: [
      { key: 'batch', label: 'Batch / Lot', type: 'text' },
      { key: 'expiry', label: 'Expiry', type: 'text' },
      { key: 'supplier', label: 'Supplier', type: 'text' },
    ],
  },
  {
    id: 'jewellery',
    name: 'Jewellery Store',
    short: 'Jewellery',
    icon: Gem,
    tagline: 'Weight, metal / purity, making charges and wastage — cost to selling price, clean.',
    clientLabel: 'Customer',
    sellLabel: 'Jewellery Sale',
    invoiceTitle: 'Tax Invoice',
    stockLabel: 'Items',
    accent: 'from-yellow-300 to-amber-500',
    accentText: 'text-yellow-300',
    photo: 'jewellery',
    todayActions: [
      { key: 'orders', label: 'Customer orders due' },
      { key: 'delivery', label: 'Ready for delivery' },
      { key: 'custom', label: 'Pending custom work' },
      { key: 'lowStock', label: 'Low-stock items' },
      { key: 'pending', label: 'Pending payments' },
    ],
    kpis: [
      { key: 'todaySales', label: "Today's Sales" },
      { key: 'pending', label: 'Pending (Udhaar)' },
      { key: 'inventoryValue', label: 'Inventory Value' },
      { key: 'sold', label: 'Items Sold' },
    ],
    attributes: [
      { key: 'metal', label: 'Metal', type: 'text' },
      { key: 'purity', label: 'Purity (Karat)', type: 'text' },
      { key: 'weight', label: 'Gross Weight (g)', type: 'number' },
    ],
  },
]

export const bizById = Object.fromEntries(bizTypes.map((b) => [b.id, b]))

export function photo(seed: string, w = 800, h = 600): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

export const landingPhotos = {
  hero1: photo('arion-hero-1', 640, 420),
  hero2: photo('arion-hero-2', 640, 420),
  hero3: photo('arion-hero-3', 640, 420),
  hero4: photo('arion-hero-4', 640, 420),
  hero5: photo('arion-hero-5', 640, 420),
  philosophy: photo('arion-philosophy', 900, 700),
  detail1: photo('arion-detail-1', 600, 480),
  detail2: photo('arion-detail-2', 600, 480),
  join: photo('arion-join', 1000, 700),
}
