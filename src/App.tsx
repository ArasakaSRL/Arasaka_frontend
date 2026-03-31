import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layout/MainLayout'
import Home from './pages/Home'
import About from './pages/About'
<<<<<<< HEAD
import PerfilPersonal from './pages/Dashboard/perfilPersonal/PerfilPersonal'
import Login from './pages/auth/Login'
import Register from '@/pages/auth/Register'
import Proyectos from '@/features/proyectos/pages/PageProyectos'
import Habilidades from '@/features/habilidades/pages/PageHabilidades'

export default function App() {
  return (
=======
import { Link } from 'react-router-dom'
import { Certificaciones } from './features/certificaciones/page/Certificaciones'
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
>>>>>>> feature/Subir-certificados-de-cursos-realizados
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
<<<<<<< HEAD
        <Route path="/Dashboard/perfilPersonal/PerfilPersonal" element={<PerfilPersonal />} />
        <Route path="/auth/Login" element={<Login />} />
        <Route path="/auth/Register" element={<Register />} />
        <Route path="/Dashboard/proyectos/Proyectos" element={<Proyectos />} />
        <Route path="/Dashboard/habilidades/Habilidades" element={<Habilidades />} />
=======
        <Route path='/certificaciones' element={<Certificaciones/>}/>
>>>>>>> feature/Subir-certificados-de-cursos-realizados
      </Route>
    </Routes>
  )
}
