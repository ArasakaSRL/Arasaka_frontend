import { createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import App from '../App';

const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const NotFound = lazy(() => import('../pages/NotFound'));
const PageProyectos = lazy(() => import('../features/proyectos/pages/PageProyectos'));

// eslint-disable-next-line react-refresh/only-export-components
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<section id="center"><p>Cargando vista...</p></section>}>
    {children}
  </Suspense>
);

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
            {/* <Home /> */}
            <PageProyectos />
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
    ],
  },
]);