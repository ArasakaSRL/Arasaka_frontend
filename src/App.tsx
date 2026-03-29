import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layout/MainLayout'
import Home from './pages/Home'
import About from './pages/About'
import { Link } from 'react-router-dom'
import { Hitos } from './features/hitos/page/Hitos'

export function App() {
  return (
    <>
    <nav style={{ padding: '20px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
      <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', justifyContent: 'center', margin: 0, padding: 0 }}>
        <li>
            <Link to="/" style={{ color: 'var(--text-h)', textDecoration: 'none', fontWeight: 'bold' }}>Inicio</Link>
        </li>
        <li>
          <Link to="/about" style={{ color: 'var(--text-h)', textDecoration: 'none', fontWeight: 'bold' }}>Acerca de</Link>
        </li>
      </ul>
    </nav>

    <Routes>

      <Route element={<MainLayout />}>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path='/hitos' element={<Hitos/>}/>
      </Route>

    </Routes>
    
    </>
    
  )
}