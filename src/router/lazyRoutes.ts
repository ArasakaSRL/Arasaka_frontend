import { lazy } from 'react'

export const Home = lazy(() => import('../pages/Home'))
export const About = lazy(() => import('../pages/About'))
export const NotFound = lazy(() => import('../pages/NotFound'))
export const PerfilPersonal = lazy(() => import('../pages/Dashboard/perfilPersonal/PerfilPersonal'))
export const Proyectos = lazy(() => import('../features/proyectos/pages/PageProyectos'))
export const Habilidades = lazy(() => import('../features/habilidades/pages/PageHabilidades'))
export const Login = lazy(() => import('../pages/auth/Login'))
export const Register = lazy(() => import('../pages/auth/Register'))
