import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import SuspenseWrapper from '../components/SuspenseWrapper'
import { Home, About, NotFound, PerfilGeneral, PerfilEditar, PerfilTelefonos, PerfilPortafolio, Login, Register, Proyectos, Habilidades, Certificaiones, MensajesPrincipal, MensajesRecibidos, MensajesEnviados, MensajesDestacados, VisibilidadComponentes } from './lazyRoutes'
import Hitos from '@/features/hitos/page/Hitos'
import Configuracion from '@/features/configuracion/page/Configuracion'
import ReportesUsr from '@/features/reportesUsuario/page/ReportesUsr'
import VisibilidadGeneral from '@/pages/Dashboard/configuraciones/VisibilidadGeneral'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <Home />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'about',
        element: (
          <SuspenseWrapper>
            <About />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'Dashboard/perfil/General',
        element: (<SuspenseWrapper><PerfilGeneral /></SuspenseWrapper>),
      },
      {
        path: 'Dashboard/perfil/Editar',
        element: (<SuspenseWrapper><PerfilEditar /></SuspenseWrapper>),
      },
      {
        path: 'Dashboard/perfil/Telefonos',
        element: (<SuspenseWrapper><PerfilTelefonos /></SuspenseWrapper>),
      },
      {
        path: 'Dashboard/perfil/Portafolio',
        element: (<SuspenseWrapper><PerfilPortafolio /></SuspenseWrapper>),
      },

      {
        path: 'auth/Login',
        element: (
          <SuspenseWrapper>
            <Login />
          </SuspenseWrapper>
        ),
      },

      {
        path: 'auth/Register',
        element: (
          <SuspenseWrapper>
            <Register />
          </SuspenseWrapper>
        ),
      },

      {
        path: 'Dashboard/proyectos/Proyectos',
        element: (
          <SuspenseWrapper>
            <Proyectos />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'Dashboard/habilidades/Habilidades',
        element: (
          <SuspenseWrapper>
            <Habilidades />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'Dashboard/certificaciones/Certificaciones',
        element: (
          <SuspenseWrapper>
            <Certificaiones />
          </SuspenseWrapper>
        )
      },
      {
        path: 'Dashboard/hitos/Hitos',
        element: (
          <SuspenseWrapper>
            <Hitos/>
          </SuspenseWrapper>
        )
      },

      {
        path: 'Dashboard/mensajes/Principal',
        element: (<SuspenseWrapper><MensajesPrincipal /></SuspenseWrapper>)
      },
      {
        path: 'Dashboard/mensajes/Recibidos',
        element: (<SuspenseWrapper><MensajesRecibidos /></SuspenseWrapper>)
      },
      {
        path: 'Dashboard/mensajes/Enviados',
        element: (<SuspenseWrapper><MensajesEnviados /></SuspenseWrapper>)
      },
      {
        path: 'Dashboard/mensajes/Destacados',
        element: (<SuspenseWrapper><MensajesDestacados /></SuspenseWrapper>)
      },

      {
        path: '/Dashboard/configuracion/Configuracion',
        element: (
          <SuspenseWrapper>
            <Configuracion></Configuracion>
          </SuspenseWrapper>
        )
      },

      {
        path: '/Dashboard/configuracion/Componentes',
        element: (<SuspenseWrapper><VisibilidadComponentes /></SuspenseWrapper>)
      },
      
      {
        path: '/Dashboard/configuracion/General',
        element: (<SuspenseWrapper><VisibilidadGeneral /></SuspenseWrapper>)
      },

      {
        path: '/Dashboard/estadisticas/Reportes',
        element: (
          <SuspenseWrapper>
            <ReportesUsr></ReportesUsr>
          </SuspenseWrapper>
        )
      },

    ],
  },
])
