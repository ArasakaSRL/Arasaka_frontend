import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layout/MainLayout'
import Home from './pages/Home'
import About from './pages/About'
import PerfilPersonal from './pages/Dashboard/perfilPersonal/PerfilPersonal'
import Login from './pages/auth/Login'
import Register from '@/pages/auth/Register'
import Proyectos from '@/features/proyectos/pages/PageProyectos'
import Habilidades from '@/features/habilidades/pages/PageHabilidades'
import Certificaciones from '@/features/certificaciones/page/Certificaciones'
import { Hitos } from './features/hitos/page/Hitos'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/Dashboard/perfilPersonal/PerfilPersonal" element={<PerfilPersonal />} />
        <Route path="/auth/Login" element={<Login />} />
        <Route path="/auth/Register" element={<Register />} />
        <Route path="/Dashboard/proyectos/Proyectos" element={<Proyectos />} />
        <Route path="/Dashboard/habilidades/Habilidades" element={<Habilidades />} />
        <Route path="/Dashboard/certificaciones/Certificaciones" element={< Certificaciones/>} />
        <Route path="/Dashboard/logros/Hitos" element={< Hitos/>} />
      </Route>
    </Routes>
  )
}
