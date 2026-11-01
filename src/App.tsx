import { useState } from 'react'
import { StoreProvider, useStore } from './lib/store'
import { CinematicIntro } from './components/CinematicIntro'
import { Landing } from './components/Landing'
import { Onboarding } from './components/app/Onboarding'
import { Shell, type ModuleKey } from './components/app/Shell'
import { Dashboard } from './components/app/Dashboard'
import { Inventory } from './components/app/Inventory'
import { Clients } from './components/app/Clients'
import { Sales } from './components/app/Sales'
import { Payments } from './components/app/Payments'
import { Reports } from './components/app/Reports'
import { Settings } from './components/app/Settings'

type Phase = 'intro' | 'landing' | 'onboarding' | 'app'

const ONBOARD_KEY = 'arion-onboarded'

function Root() {
  const store = useStore()
  const [phase, setPhase] = useState<Phase>('intro')
  const [onboarded, setOnboarded] = useState(() => {
    try {
      return localStorage.getItem(ONBOARD_KEY) === '1'
    } catch {
      return false
    }
  })
  const [module, setModule] = useState<ModuleKey>('dashboard')
  const [saleOpen, setSaleOpen] = useState(false)

  function enterApp() {
    setPhase(onboarded ? 'app' : 'onboarding')
  }

  function completeOnboarding(id: string) {
    store.setBusinessType(id)
    try {
      localStorage.setItem(ONBOARD_KEY, '1')
    } catch {
      /* ignore */
    }
    setOnboarded(true)
    setModule('dashboard')
    setPhase('app')
  }

  function renderModule() {
    switch (module) {
      case 'dashboard':
        return <Dashboard onNavigate={setModule} />
      case 'inventory':
        return <Inventory />
      case 'clients':
        return <Clients />
      case 'sales':
        return <Sales open={saleOpen} setOpen={setSaleOpen} />
      case 'payments':
        return <Payments />
      case 'reports':
        return <Reports />
      case 'settings':
        return <Settings />
    }
  }

  if (phase === 'intro') {
    return <CinematicIntro onDone={() => setPhase('landing')} />
  }

  if (phase === 'landing') {
    return <Landing onEnter={enterApp} />
  }

  if (phase === 'onboarding') {
    return <Onboarding onComplete={completeOnboarding} />
  }

  return (
    <Shell
      active={module}
      onNavigate={setModule}
      onNewSale={() => {
        setModule('sales')
        setSaleOpen(true)
      }}
      onExit={() => setPhase('landing')}
    >
      {renderModule()}
    </Shell>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Root />
    </StoreProvider>
  )
}
