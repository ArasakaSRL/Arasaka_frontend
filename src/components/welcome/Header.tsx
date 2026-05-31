import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Compass, LayoutDashboard, Menu, Sparkles, X } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

function useScrollLink() {
  const location = useLocation()
  const navigate = useNavigate()
  return (hash: string, closeMenu?: () => void) => {
    closeMenu?.()
    if (location.pathname === '/') {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${hash}`)
    }
  }
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const isLoggedIn = !!useAuthStore(s => s.user)
  const scrollTo = useScrollLink()

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          
          <Link to="/" className="flex items-center no-underline shrink-0">
            <img
              src="https://res.cloudinary.com/dnbklbswg/image/upload/v1779721854/devlinked-removebg-preview_ccujvc.png"
              alt="Dev Linked"
              className="h-9 w-auto object-contain"
            />
          </Link>

         
          <nav className="hidden md:flex items-center gap-0.5 ml-10 ">
           
            <button
              onClick={() => scrollTo('como-funciona')}
              className="flex items-center px-3.5 py-2 text-sm font-medium rounded-lg transition-all text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              Cómo funciona
            </button>
            <button
              onClick={() => scrollTo('nosotros')}
              className="flex items-center px-3.5 py-2 text-sm font-medium rounded-lg transition-all text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              Nosotros
            </button>
             <NavLink
              to="/explorar"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-all no-underline ${
                  isActive ? 'text-[#1e2a5e] bg-[#1e2a5e]/8 font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Compass size={14} />
              Explorar
            </NavLink>
          </nav>

       
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <Link
                to="/Dashboard/perfil/General"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-[#1e2a5e] hover:bg-[#151d45] shadow-md shadow-indigo-900/20 transition-all active:scale-95 no-underline"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/Login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-all no-underline"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/auth/Register"
                  className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-[#1e2a5e] hover:bg-[#151d45] shadow-md shadow-indigo-900/20 transition-all active:scale-95 no-underline"
                >
                  <Sparkles size={13} />
                  Comenzar gratis
                </Link>
              </>
            )}
          </div>

       
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 flex flex-col gap-1">
            <Link
              to="/explorar"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors no-underline"
            >
              <Compass size={15} className="text-slate-400" />
              Explorar
            </Link>
            <button
              onClick={() => scrollTo('como-funciona', closeMenu)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
            >
              <span className="w-4 h-4 flex items-center justify-center text-slate-400 text-xs font-bold">3</span>
              Cómo funciona
            </button>
            <button
              onClick={() => scrollTo('nosotros', closeMenu)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
            >
              <span className="w-4 h-4 flex items-center justify-center text-slate-400 text-xs">★</span>
              Nosotros
            </button>

            <div className="border-t border-slate-100 mt-2 pt-3 flex flex-col gap-1">
              {isLoggedIn ? (
                <Link
                  to="/Dashboard/perfil/General"
                  onClick={closeMenu}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white justify-center rounded-xl bg-[#1e2a5e] hover:bg-[#151d45] transition-colors no-underline"
                >
                  <LayoutDashboard size={15} />
                  Ir al Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth/Login"
                    onClick={closeMenu}
                    className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors no-underline"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/auth/Register"
                    onClick={closeMenu}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white justify-center rounded-xl bg-[#1e2a5e] hover:bg-[#151d45] transition-colors no-underline"
                  >
                    <Sparkles size={13} />
                    Comenzar gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
