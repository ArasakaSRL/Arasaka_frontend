import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section id="center">
      <h1>404</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
        Volver al Inicio
      </Link>
    </section>
  )
}