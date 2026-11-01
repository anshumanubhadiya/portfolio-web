# Arion AI OS — Landing Page

A dark, premium, animated marketing site for **Arion AI OS** — the modular business OS for Indian SMBs (inventory + clients + sales, udhaar, UPI, offline PWA, Hinglish AI).

Built with a motionsites.ai-inspired design language: aurora gradients, animated gradient text, glowing glass cards, scroll-reveal animations, marquee, animated counters, and a floating mock-dashboard hero.

## Stack

- **React 18 + Vite + TypeScript**
- **Tailwind CSS 3** — utility styling + custom dark theme
- **Framer Motion 11** — scroll reveals, stagger, counters, float loops
- **lucide-react** — icons

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build
```

## Structure

```
src/
  App.tsx               # page composition
  data.ts               # all copy/content (business types, features, plans…)
  index.css             # theme, gradients, marquee/shimmer keyframes
  components/
    ui.tsx              # Reveal, SectionHeading, Spotlight, stagger variants
    Navbar.tsx          # glassy sticky nav + mobile menu
    Hero.tsx            # animated headline + mock dashboard + float chips
    Marquee.tsx         # scrolling business-type strip
    BusinessTypes.tsx   # 9 glowing business cards
    Features.tsx        # 3 pillars + 6 advanced modules
    HowItWorks.tsx      # 3-step setup
    Stats.tsx           # animated counters
    Pricing.tsx         # ₹ pricing tiers
    CTA.tsx             # Hinglish closing CTA
    Footer.tsx
```

> This is the marketing/landing page. The full product (Supabase auth, RLS, inventory/sales engine, offline sync, AI Edge Function) lives in `file-upn.md` and is built separately.
