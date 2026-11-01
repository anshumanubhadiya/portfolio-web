# BUILD PROMPT — Arion AI OS v2 (Advanced) — Modular Business OS for Indian SMBs

Product name: Arion AI OS (or NIX if branding requires)
Market: India | Currency: ₹ | Language: English UI (Hinglish shop words OK: Stock, Client, Sale, Payment, Pending, Udhaar, Low stock)
UI: simple, clean, modern LIGHT SaaS. Fast for counters. Mobile-friendly (PWA).
Stack: React + Vite + TypeScript (or Next.js + TS) + Supabase (Auth, Postgres, RLS, Edge Functions)
AI: server-side ONLY (Supabase Edge Function + secret key in server env). NO secrets in frontend. `.env.example` placeholders only.

---

## CORE PRODUCT POSITIONING (MANDATORY)

This is primarily an Inventory + Client + Sales system. Every business type centers on these 3 pillars:

1) INVENTORY (Stock): product/item add, quantity, buy price / sell price, low-stock alert, type-specific attributes, stock decreases on sale, stock increases on purchase entry / adjustment.
2) CLIENTS (Customer/Member/Client): name + 10-digit Indian phone, address optional, pending balance (udhaar), full purchase history, strong search by phone/name.
3) SELL (Sale / Order / Job / Membership): client select / quick create, items from inventory (or plan/package), qty → stock reduce, bill total, advance / full payment, balance (udhaar), invoice / receipt.

Minimum end-to-end flow per enabled type:
Add inventory → Add client → Create sale/order → Reduce stock → Record payment → Show pending balance → Low-stock alerts.

Do NOT build a CRM-only or dashboard-only app.

---

## BUSINESS TYPES (EXACTLY 9 — NO 30+ INDUSTRY MAP)

Only these 9 selectable types:
1. Optical & Eyewear
2. Retail & Apparel
3. Services & Contracting
4. Real Estate & Brokerage
5. Appointment & Wellness
6. Wholesale & B2B Distribution
7. Gym & Fitness
8. Medical Store / Pharmacy
9. Jewellery Store

Onboarding: user picks ONE. Persist `business_type` on workspace. After login/refresh, restore the same UI from saved `business_type`.

Each type controls: sidebar modules, dashboard KPIs, Today Actions, forms/fields, work-record labels & statuses, AI context wording, invoice title ("Sale Bill", "Tax Invoice", "Job Bill", "Membership Receipt", etc.).

| Type | Inventory | Client label | Sell label | Extra (v2) |
|---|---|---|---|---|
| Optical | Frame, lens, stock | Customer | Optical order | Prescription (SPH/CYL/axis, both eyes), order PDF |
| Retail | Products + variants (size/color) | Customer | Sale | Barcode field, quick counter sale |
| Service | Parts (optional) | Client | Job + bill | Site address, technician, estimate → job → bill |
| Real Estate | Property list (light) | Client | Deal | Deal stages, token/balance, site visits |
| Appointment | Packages (light) | Client | Session bill | Slot calendar, reschedule/cancel |
| Wholesale | Bulk stock | B2B client | Dispatch/sale | Credit days, PO reference, due date |
| Gym | Membership plans | Member | Membership sell | Plan start/expiry, check-in, classes |
| Pharmacy | Medicine + batch/expiry | Customer | Medicine sale | Batch/lot, expiry, supplier |
| Jewellery | Item + weight/metal/purity | Customer | Jewellery sale | Gross/net weight, making charges, wastage |

---

## AUTH

- Email + password signup / login / logout / password reset
- Email verification required when Supabase email is configured
- Verification-pending screen + resend with cooldown; NEVER mark verified from a fake frontend click
- Roles: Owner, Staff — with granular permissions (see Roles section)
- No demo login bypass buttons

---

## ROLES & PERMISSIONS (v2)

`workspace_members.role` = owner | staff.
Permission matrix on workspace (configurable by Owner in Settings):
- staff can: create sale, add client, add payment, check-in (gym), view inventory/clients
- staff cannot by default: delete sales/clients/items, edit shop profile, view full reports, manage members, export CSV, stock adjustments (each toggleable)
- Owner sees an Activity/Audit log of who did what (see Audit Log)

---

## WORKSPACE PERSISTENCE (CRITICAL)

Create workspace must write to Supabase:
- `workspaces` row (with business_type, shop profile)
- `workspace_members` owner row

Returning login with existing memberships → dashboard directly.
If 0 workspaces → onboarding only.
When Supabase configured: NO silent localStorage success on failed DB writes — show clear error. Fix RLS so insert workspace + membership works (avoid select/RETURNING race).
Never trust client-provided workspace IDs — always derive active workspace from authenticated user's membership (RLS + server check).

---

## SHARED CORE (ALL 9 TYPES) — workspace-scoped

- Inventory items (with per-type attributes)
- People directory (labels by type)
- Sales / orders / jobs / memberships as configured
- Payments + pending balances
- Tasks / follow-ups
- Leads (where relevant)
- Basic reports (sales, pending, low stock)
- Settings (shop profile, GSTIN optional, address, UPI ID, invoice prefix)
- Invoice / receipt using shop profile
- CSV export basic
- Floating AI assistant (auth + membership required; no invented data)
- WhatsApp: phone + wa.me link only (no API automation in v1)
- Indian phone validation everywhere: exactly 10 digits after optional +91/91; shared PhoneInput component; frontend + backend validation
- Address fields (India default): line1, line2 optional, landmark optional, locality, city, state, PIN (6 digits), country. Manual entry always works. Never invent PIN/city/state.

Reusable "New Sale / Order / Job" modal:
- opens as modal; title/fields adapt to business type
- client + inventory lines + totals + payment
- save only after Supabase success; prevent double submit; stock deduction on success (Postgres function / trigger with row locking to prevent overselling)

---

## NEW v2 MODULES (ADD ALL — THESE MAKE IT A REAL DAILY-USE TOOL)

### A) UPI Payments (no API, zero cost)
- Settings: UPI VPA (e.g. shop@upi) + payee name
- Generate UPI intent link: `upi://pay?pa=<vpa>&pn=<name>&am=<amount>&cu=INR&tn=<note>`
- Generate UPI QR (client-side qrcode lib) for: full bill amount, pending balance, or any custom amount
- Show QR on invoice print/PDF and on client detail page
- "Mark as paid" records payment manually (honest — no fake auto-verify; status = "awaiting confirmation" note)
- Payment link shareable via wa.me message template

### B) Party Ledger / Udhaar Book (per client)
- Client detail page = ledger: opening balance, sales (debit), payments (credit), running balance
- Statement period selector (this month / all)
- Top "Pending (Udhaar)" list across all clients with amount + last payment date
- One-tap WhatsApp reminder message: prefilled polite text with pending amount + UPI link + QR (wa.me only, no API)
- Mark oldest dues cleared first (FIFO khata style)
- CSV export of ledger

### C) Invoices & Printing
- Invoice numbering: prefix + auto sequence (per workspace), e.g. INV-2026-0001
- GST-lite (optional fields): GSTIN, HSN code per item, GST slab (0/5/12/18/28%), intra-state → CGST+SGST breakup, inter-state → IGST. No e-invoice/IRN/filing in v1 — clean hook only.
- Two print layouts via browser print CSS (no paid libs): 58/80mm thermal receipt + A4 invoice
- PDF download (client-side, e.g. jsPDF or html2pdf)
- Shop logo upload (Supabase Storage, workspace-scoped bucket)
- WhatsApp share button on invoice: wa.me link with invoice number + amount (no file API in v1; PDF download + manual attach)

### D) Offline-First Billing (India reality)
- PWA + service worker
- Read cache of inventory + clients (last synced) in IndexedDB
- Offline sale capture: create sale locally with queue, show "queued offline" state, block printing "PAID" stamp until synced
- On reconnect: background sync queue → server, then toast real success/failure per sale
- Conflict rule: if stock changed and is insufficient on sync → do not silently overdraw; flag sale for review
- Show sync status indicator (online / queued count / syncing / error)

### E) Purchases & Suppliers (inventory inflow)
- Purchase entry: supplier (or quick-add), item, qty, unit/buy price, total, date, invoice ref
- On save: stock increases + rolling weighted-average buy price update (or last-buy-price; document choice)
- Suppliers list (name, phone, address, pending payable optional-lite)
- "Reorder suggestion" list: items at/below reorder level, with last supplier + last buy price + one-click "New Purchase Entry" prefilled

### F) Stock Adjustment & Audit Log
- Manual adjustment reasons: damage, theft/lost, return to supplier, personal use, recount, opening stock
- Adjustments always: reason + note + before/after qty + user; never silent edits
- Audit log table: user, action (create/update/delete/adjust/pay), entity, before/after JSON, timestamp — Owner-only view with filters
- Soft delete everywhere (deleted_at + deleted_by); deleted records hidden from UI, excluded from live stock, kept for reports integrity

### G) Day Close (daily hisaab)
- End-of-day summary card: total sales, cash vs UPI vs card collection, total pending added, total received, refunds/returns, new clients, low-stock count
- Confirm "Day Close" → saves daily snapshot row (for history graph)
- Compare vs yesterday / same weekday average (real data only)

### H) Speed Features (counter-first)
- Quick Sale mode: search item by name/SKU/barcode → tap to add → total → client optional (walk-in) → save in ≤3 taps
- Barcode field on items (manual entry + keyboard-scanner input; camera scan = design hook only)
- Keyboard shortcuts: "/" focus search, "N" new sale, "Esc" close modal, "Ctrl+P" print
- Global search (Ctrl+K): clients, items, sales, phone digits partial match

### I) Notifications Center (in-app)
- Rules (DB-driven counts, honest empty states): low stock, near-expiry (pharmacy), membership expiring ≤7 days (gym), pending payments > X days, overdue jobs/orders
- Notification bell with badge count; each links to filtered list
- Settings toggles per rule (Owner)

### J) AI Assistant (server-side Edge Function; auth + membership required)
Grounded in real workspace data only; if data missing, say so. Capabilities:
- "Bol ke/type karke bill banao": parse natural text → draft sale ("2 Frame model X aur 1 lens for Ramesh 98xxxxxx") → review → confirm → real sale created
- Daily summary: yesterday's sales, top item, pending total, low-stock list, urgent expiry (pharmacy)
- Ask questions: "kaun sa maal khatam ho raha hai?", "sabse zyada udhaar kis ka?"
- Payment reminder message drafting (polite Hinglish) for wa.me
- Reorder suggestion text based on velocity + reorder level
- Never invents numbers; every AI answer cites the exact DB aggregate used; all AI calls logged (user, prompt, workspace, timestamp)

---

## TODAY ACTIONS (REQUIRED PER BUSINESS TYPE)

Never show the same generic cards for every business. Use REAL DB counts. Honest empty states. Each card links to filtered list. All v2 modules contribute counts (pending payments, low stock, expiring) where relevant.

- **Optical**: orders ready for pickup, pending lens fitting, awaiting delivery, follow-ups, pending payments
- **Retail**: today's sales/orders, awaiting fulfilment, low stock, pending pickups, returns needing attention
- **Service**: jobs due today, overdue jobs, pending estimates, site visits, customer follow-ups
- **Real Estate**: site visits today, buyer/seller follow-ups, pending inquiries, deals needing action
- **Appointment & Wellness**: today's appointments, upcoming sessions, cancellations, client follow-ups, pending payments
- **Wholesale**: dispatches due, pending POs, low stock, outstanding receivables, delivery follow-ups
- **Gym & Fitness**: today's check-ins, memberships expiring soon, renewals due, scheduled classes, pending membership payments
- **Pharmacy**: low-stock medicines, near-expiry batches, expired stock (not sellable), today's pending sales/orders, supplier follow-ups
- **Jewellery**: customer orders due, ready for delivery, pending custom work, low-stock items, pending payments

---

## TYPE-SPECIFIC DETAILS

**Optical**: prescriptions optional (SPH/CYL/axis/add, both eyes), frame/lens inventory, order statuses (Received → Fitting → Ready → Delivered), payments/balance, order print with prescription block.

**Retail**: sales/orders, variants (size/color), inventory, low stock, payments, barcode + Quick Sale first.

**Service**: jobs/projects, site address, technician, statuses (Requested → Estimate → In Progress → Done → Invoiced), payments, optional parts inventory, estimate → invoice conversion.

**Real Estate**: deals/clients, site visits, deal stages (Lead → Site Visit → Negotiation → Token → Agreement → Closed), token/balance tracking, light property inventory optional.

**Appointment & Wellness**: appointments/sessions, slot-based day view, avoid retail qty-first forms, packages optional, reschedule/cancel with reason, payments per session or package balance.

**Wholesale**: B2B orders/dispatches, credit limit + credit days per client, bulk stock (case/pack units + conversion), payments against invoices (FIFO), outstanding aging (0-30/31-60/60+ days).

**Gym & Fitness**: members, plans (duration, price, sessions), start/expiry, renewals, status (active/expired/frozen); attendance check-in (search phone → one tap; class check-in optional); trainers/classes basic; payments + dues. Dashboard: active members, new memberships, expiring, revenue, attendance today, pending payments. Workflow: Register → Plan → Payment → Active → Attendance → Renewal reminder.

**Pharmacy**: catalog (brand/generic, category, SKU, HSN), batch/lot + expiry per batch, purchase/selling price per batch, stock per batch, reorder level; sale picks batch (FEFO suggestion); BLOCK selling expired batch in standard sale flow (server-enforced); low-stock + near-expiry (≤90/30 days configurable) + expired alerts; suppliers basic; dashboard: products, low stock, near expiry, expired, today's sales, pending supplier pay. Do NOT invent controlled-drug legal rules.

**Jewellery**: catalog with SKU, type (ring/necklace/etc), metal, purity/karat, gross/net weight, stone details optional, making charges/wastage configurable (flat ₹ or %), cost + selling price; sales update stock; pending payments. Dashboard: items, inventory value, today's sales, sold count, low stock, pending payments. No live gold rate feeds in v1 (manual rate field per item is OK).

---

## DATA & SECURITY

- Versioned schema/migrations (supabase/migrations, numbered)
- RLS on ALL business tables: every row has workspace_id; policies verify membership via subquery (SECURITY DEFINER helper function to avoid join loops)
- Never trust client workspace IDs; always derive from membership
- Extend tables; never wipe existing data
- Success toast only after DB confirms write
- Stock deduction via Postgres function with `FOR UPDATE` row lock (no negative stock race)
- Server-side validation mirrors frontend (phone, PIN, amounts, batch expiry)
- Rate-limit AI endpoint (per user/hour); AI function re-checks membership server-side
- Soft delete + audit log as above

---

## SCHEMA OUTLINE (versioned migrations)

`workspaces`, `workspace_members(role, permissions jsonb)`, `inventory_items(+type-specific jsonb attrs, reorder_level, hsn, gst_slab, barcode, avg_buy_price)`, `inventory_batches(pharmacy: batch_no, expiry, qty)`, `people(clients/members, type-specific label via workspace business_type; phone unique-ish per workspace, opening_balance)`, `sales(order_type by business, status, totals, gst breakup, offline_sync flag)`, `sale_lines`, `payments(mode: cash/upi/card/other)`, `purchases` + `purchase_lines` + `suppliers`, `stock_movements(in/out/adjust; reason, before, after, user)`, `appointments/sessions(appointment types)`, `memberships & check_ins (gym)`, `jobs (service)`, `deals/property/visits (real estate)`, `prescriptions (optical)`, `tasks`, `leads`, `audit_log`, `notifications_rules (settings)`, `day_close_snapshots`, `ai_logs`.

---

## FUTURE HOOKS (DESIGN ONLY — DO NOT FULLY BUILD)

- WhatsApp Business API automation (template reminders, invoice PDF auto-send)
- Subscription billing / SaaS payments
- Multi-branch & multi-warehouse
- Full GST/accounting pack (GSTR, e-invoice IRN, e-way bill)
- Barcode camera scanner; thermal printer native SDK
- SMS/voice reminders; delivery partner tracking
- Tally/accounting export bridge
Keep clean extension points only (interface + empty module stubs).

---

## OUT OF SCOPE V1

- 30+ industry mapping list
- Super Admin SaaS panel
- Live subscription billing
- Full GST filing product
- WhatsApp Business API automation (wa.me links only)
- Multi-warehouse complexity
- Bank/UPI auto-reconciliation (manual "mark as paid" only; reconciliation = future hook)

---

## ACCEPTANCE TESTS (MUST PASS — report only real results)

1. All 9 business types selectable and saved
2. Workspace + membership rows appear in Supabase
3. Logout/login restores same business UI (no false onboarding)
4. Inventory add works and persists; purchase entry increases stock
5. Client add works and persists; phone rejects invalid 10-digit inputs
6. Sale uses inventory, reduces stock (locked, no negative), payment works, pending balance correct in party ledger
7. Optical/Retail/Service basic order+payment works
8. Gym membership + payment + expiry list + check-in works
9. Pharmacy batch/expiry + sale stock update works; expired batch blocked (server-side)
10. Jewellery item + sale works (weight/making charge math correct)
11. Today Actions differ correctly per business type (screenshot each)
12. Email verification flow works when email provider configured
13. UPI QR/link generates with correct amount + VPA; invoice print shows QR (thermal + A4)
14. Offline: sale created offline appears in queue, syncs on reconnect, stock correct after sync
15. Day Close totals match real DB aggregates
16. AI assistant answers a real pending-balance and low-stock question with correct DB numbers; refuses/flags when data missing
17. Staff role cannot delete a sale; Owner audit log shows the staff's attempted restricted action or blocked attempt
18. Cross-workspace data blocked by RLS (test with two accounts)

---

## START ORDER

1) Inspect environment / existing code if present
2) Schema + RLS + auth + workspace persistence (migrations first)
3) 9 business-type config + onboarding + persistence restore
4) Inventory CRUD + purchases + stock movements + reorder (pillar 1)
5) Client CRUD + phone validation + party ledger (pillar 2)
6) Sale/Order modal + stock deduction (locked) + payments + invoice/UPI QR/print (pillar 3)
7) Today Actions per type + notifications center
8) Gym + Pharmacy + Jewellery dedicated flows
9) Email verification + address + reports + audit log + roles/permissions
10) Offline queue + PWA + Quick Sale + Day Close
11) Secure AI endpoint (grounded, logged, rate-limited)
12) Run all acceptance tests; report only REAL results (no invented screenshots/logs)
