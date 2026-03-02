import { Routes, Route, Link } from 'react-router-dom'
import './App.css'

import { MainDashboard } from './components/MainDashboard';
import { DareDetails } from './components/DareDetails';
import { TimelinePlanner } from './components/TimelinePlanner';
import { TrophyRoom } from './components/TrophyRoom';


function App() {
  return (
    <div className="app-container">
      <nav className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
        <div className="container" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }} className="text-gradient-accent">29 Dares By 29</h2>
          <Link href="/" to="/" style={{ fontWeight: 500 }}>Grid</Link>
          <Link href="/timeline" to="/timeline">Timeline</Link>
          <Link href="/trophy-room" to="/trophy-room">Trophy Room</Link>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<MainDashboard />} />
          <Route path="/dare/:id" element={<DareDetails />} />
          <Route path="/timeline" element={<TimelinePlanner />} />
          <Route path="/trophy-room" element={<TrophyRoom />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
