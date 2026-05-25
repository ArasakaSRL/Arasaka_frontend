import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, MapPin, MessageCircle, GitBranch, ExternalLink, Globe } from 'lucide-react'

function useScrollLink() {
  const location = useLocation()
  const navigate = useNavigate()
  return (hash: string) => {
    if (location.pathname === '/') {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${hash}`)
    }
  }
}

export default function Footer() {
  const scrollTo = useScrollLink()

  return (
    <footer className="bg-[#0d1535] text-white px-6 pt-16 pb-8">
      <div className="max-w-5xl mx-auto">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/8">

         
          <div className="lg:col-span-1 flex flex-col gap-4">
            <Link to="/" className="no-underline w-fit bg-white">
              <img
                src="https://res.cloudinary.com/dnbklbswg/image/upload/v1779721854/devlinked-removebg-preview_ccujvc.png"
                alt="Dev Linked"
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-white/40 text-xs leading-relaxed">
              Plataforma para que profesionales creen y compartan su portafolio digital de forma elegante.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <a href="mailto:contacto@devlinked.com" aria-label="Email" className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-white/40 hover:bg-white/15 hover:text-white transition-all">
                <Mail size={14} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-white/40 hover:bg-white/15 hover:text-white transition-all">
                <GitBranch size={14} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-white/40 hover:bg-white/15 hover:text-white transition-all">
                <Globe size={14} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X" className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-white/40 hover:bg-white/15 hover:text-white transition-all">
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

         
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest mb-1">Plataforma</p>
            <Link to="/explorar" className="text-sm text-white/50 hover:text-white transition-colors no-underline w-fit">
              Explorar portafolios
            </Link>
            <Link to="/auth/Register" className="text-sm text-white/50 hover:text-white transition-colors no-underline w-fit">
              Crear portafolio
            </Link>
            <Link to="/auth/Login" className="text-sm text-white/50 hover:text-white transition-colors no-underline w-fit">
              Iniciar sesión
            </Link>
          </div>

     
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest mb-1">Empresa</p>
            <button onClick={() => scrollTo('nosotros')} className="text-sm text-white/50 hover:text-white transition-colors text-left w-fit">
              Sobre nosotros
            </button>
            <button onClick={() => scrollTo('como-funciona')} className="text-sm text-white/50 hover:text-white transition-colors text-left w-fit">
              Cómo funciona
            </button>
            <a href="mailto:contacto@devlinked.com" className="text-sm text-white/50 hover:text-white transition-colors no-underline w-fit">
              Contacto
            </a>
          </div>

   
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest mb-1">Contacto</p>
            <a href="mailto:contacto@devlinked.com" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors no-underline w-fit">
              <Mail size={13} className="shrink-0" />
              contacto@devlinked.com
            </a>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors no-underline w-fit">
              <MessageCircle size={13} className="shrink-0" />
              WhatsApp
            </a>
            <span className="flex items-center gap-2 text-sm text-white/50">
              <MapPin size={13} className="shrink-0" />
              Bolivia
            </span>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} Dev Linked. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/15">
            Hecho con ♥ para la comunidad tech
          </p>
        </div>

      </div>
    </footer>
  )
}
