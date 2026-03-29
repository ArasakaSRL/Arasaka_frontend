import { lazy } from 'react'

export const Home = lazy(() => import('../pages/Home'))
export const About = lazy(() => import('../pages/About'))
export const NotFound = lazy(() => import('../pages/NotFound'))
export const PerfilPersonal = lazy(() => import('../pages/Dashboard/perfilPersonal/PerfilPersonal'))
export const Login = lazy(() => import('../pages/auth/Login'))
export const Register = lazy(() => import('../pages/auth/Register'))
