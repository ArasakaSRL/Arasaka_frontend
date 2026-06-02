import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layout/MainLayout'
import Home from './pages/Home'
import Explorar from './pages/Explorar'
import About from './pages/About'
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
import PortfolioPagePrivate from './features/portafolio/pages/PortfolioPagePrivate'
import MensajesPrincipal from './pages/Dashboard/mensajes/MensajesPrincipal'
import MensajesRecibidos from './pages/Dashboard/mensajes/MensajesRecibidos'
import MensajesEnviados from './pages/Dashboard/mensajes/MensajesEnviados'
import MensajesDestacados from './pages/Dashboard/mensajes/MensajesDestacados'
import Cuenta from './pages/Dashboard/cuenta/Cuenta'
import ReportesUsr from './features/reportesUsuario/page/ReportesUsr'
import PerfilGeneral from './pages/Dashboard/perfil/PerfilGeneral'
import PerfilEditar from './pages/Dashboard/perfil/PerfilEditar'
import PerfilTelefonos from './pages/Dashboard/perfil/PerfilTelefonos'
import PerfilPortafolio from './pages/Dashboard/perfil/PerfilPortafolio'
import PagePortafolio from './features/portafolio/pages/PagePortafolio'
import TegnologiaPage from './features/tegnologias/page/TegnologiaPage'
import PageVistaProyecto from './features/vistaProyectos/pages/PageVistaProyecto'
import { VisibilidadComponentes, VisibilidadGeneral } from './router/lazyRoutes'
import {FormacionAcademicaForm} from './features/portafolio/pages/FormacionAcademicaForm'
export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explorar" element={<Explorar />} />
        <Route path="/about" element={<About />} />
        <Route path="/Dashboard/mensajes/Principal" element={<MensajesPrincipal />} />
        <Route path="/Dashboard/mensajes/Recibidos" element={<MensajesRecibidos />} />
        <Route path="/Dashboard/mensajes/Enviados" element={<MensajesEnviados />} />
        <Route path="/Dashboard/mensajes/Destacados" element={<MensajesDestacados />} />
        <Route path="/Dashboard/perfil/General" element={<PerfilGeneral />} />
        <Route path="/Dashboard/perfil/Editar" element={<PerfilEditar />} />
        <Route path="/Dashboard/perfil/Telefonos" element={<PerfilTelefonos />} />
        <Route path="/Dashboard/perfil/Portafolio" element={<PerfilPortafolio />} />
        <Route path="/auth/Login" element={<Login />} />
        <Route path="/auth/Register" element={<Register />} />
        <Route path="/Dashboard/proyectos/Proyectos" element={<Proyectos />} />
        <Route path="/Dashboard/habilidades/Habilidades" element={<Habilidades />} />
        <Route path="/Dashboard/certificaciones/Certificaciones" element={< Certificaciones/>} />
        <Route path="/Dashboard/hitos/Hitos" element={< Hitos/>} />
        <Route path="/Dashboard/configuracion/Configuracion" element={<Configuracion/>} />
        <Route path="/Dashboard/cuenta/Cuenta" element={<Cuenta />} />
        <Route path="/Dashboard/configuracion/Componentes" element={<VisibilidadComponentes/>} />
        <Route path="/Dashboard/configuracion/General" element={<VisibilidadGeneral/>} />
        <Route path="/Dashboard/estadisticas/Reportes" element={<ReportesUsr/>} />
        <Route path="/Dashboard/tecnologias" element={<TegnologiaPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verificar-correo/:id/:hash" element={<VerifyEmail />} />
        <Route path="/password-reset/:token" element={<ResetPassword />} />
        <Route path="/Dashboard/admin/Usuarios" element={<PagePortafolio />} />

      </Route>
      <Route path="/portafolio/:slug" element={<PortafolioPage />} />
      <Route path="/portafolio/privado/:slug" element={<PortfolioPagePrivate />} />
      <Route path="/portafolio/:slug/proyectos/:id" element={<PageVistaProyecto />} />
      <Route path="/portafolio/privado/:slug/proyectos/:id" element={<PageVistaProyecto />} />
      <Route path="/portafolio/formacion-academica" element={<FormacionAcademicaForm />} />
    </Routes>
  )
}
