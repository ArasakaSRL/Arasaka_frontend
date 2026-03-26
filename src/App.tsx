import { Link, Outlet } from 'react-router-dom'
import './App.css'

function App() {
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

      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App