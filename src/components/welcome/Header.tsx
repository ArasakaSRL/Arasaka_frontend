import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">

                    <Link to="/" className="flex items-center no-underline shrink-0">
                        <img
                            src="https://res.cloudinary.com/dcyx3nqj5/image/upload/v1775541507/WhatsApp_Image_2026-04-07_at_1.53.52_AM-removebg-preview_dxvzgv.png"
                            alt="Arasaka logo"
                            className="h-12 sm:h-16 w-auto object-contain"
                        />
                    </Link>

                    {/* Nav escritorio */}
                    <nav className="hidden md:flex items-center gap-3">
                        <Link
                            to="/auth/Login"
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-all no-underline"
                        >
                            Iniciar sesión
                        </Link>
                        <Link
                            to="/auth/Register"
                            className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-[#1e2a5e] hover:bg-[#151d45] shadow-md shadow-indigo-900/20 transition-all active:scale-95 no-underline"
                        >
                            Comenzar gratis
                        </Link>
                    </nav>

                    {/* Botón hamburguesa mobile */}
                    <button
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                        onClick={() => setMenuOpen(prev => !prev)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Menú desplegable mobile */}
                {menuOpen && (
                    <div className="md:hidden border-t border-slate-100 py-4 flex flex-col gap-2">
                        <Link
                            to="/auth/Login"
                            onClick={() => setMenuOpen(false)}
                            className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors no-underline"
                        >
                            Iniciar sesión
                        </Link>
                        <Link
                            to="/auth/Register"
                            onClick={() => setMenuOpen(false)}
                            className="px-4 py-2.5 text-sm font-semibold text-white text-center rounded-xl bg-[#1e2a5e] hover:bg-[#151d45] transition-colors no-underline"
                        >
                            Comenzar gratis
                        </Link>
                    </div>
                )}
            </div>
        </header>
    )
}
