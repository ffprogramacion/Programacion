import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { AuthProvider } from './context/AuthContext';
import AppShell from './components/AppShell';
import Dashboard from './components/Dashboard';

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
        <AppShell>
          <Dashboard />
        </AppShell>
    </AuthProvider>
  )
}

export default App
