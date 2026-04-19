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
import Hitos from './features/hitos/page/Hitos'
import VerifyEmail from './pages/auth/VerifyEmail'
import Dashboard from './pages/Dashboard/index'
import ResetPassword from './pages/auth/ResetPassword'
import Configuracion from './features/configuracion/page/Configuracion'
import PortafolioPage from './features/portafolio/pages/PortfolioPage'

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
        <Route path="/Dashboard/hitos/Hitos" element={< Hitos/>} />
        <Route path="/Dashboard/configuracion/Configuracion" element={<Configuracion/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verificar-correo/:id/:hash" element={<VerifyEmail />} />
        <Route path="/password-reset/:token" element={<ResetPassword />} />
      </Route>
      <Route path="/portfolio/:slug" element={<PortafolioPage />} />
    </Routes>
  )
}
