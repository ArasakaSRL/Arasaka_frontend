import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import SuspenseWrapper from '../components/SuspenseWrapper'
import { Home, About, NotFound, PerfilPersonal, Login, Register, Proyectos, Habilidades, Certificaiones, Mensajes } from './lazyRoutes'
import Hitos from '@/features/hitos/page/Hitos'
import Configuracion from '@/features/configuracion/page/Configuracion'
import ReportesUsr from '@/features/reportesUsuario/page/ReportesUsr'


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
        path: 'Dashboard/perfilPersonal/PerfilPersonal',
        element: (
          <SuspenseWrapper>
            <PerfilPersonal />
          </SuspenseWrapper>
        ),
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
        path: '/Dashboard/mensajes/Mensajes',
        element: (
          <SuspenseWrapper>
            <Mensajes />
          </SuspenseWrapper>
        )
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
        path: '/Dashboard/estadisticas/Reportes',
        element: (
          <SuspenseWrapper>
            <ReportesUsr></ReportesUsr>
          </SuspenseWrapper>
        )
      }

    ],
  },
])
