import { motion } from 'framer-motion';
import { Home, Briefcase, Code2, GraduationCap, LayoutPanelLeft } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { configuracion } from '../types/portafolioType';

type MenuItem = {
  id: string;
  icon: React.ReactNode;
  label: string;
  visible: (config?: configuracion | null) => boolean;
};

const menuItems: MenuItem[] = [
  { id: 'inicio', icon: <Home size={19} />, label: 'Inicio', visible: () => true },
  { id: 'habilidades', icon: <Code2 size={19} />, label: 'Habilidades', visible: (c) => !!c?.mostrar_habilidades },
  { id: 'experiencia', icon: <Briefcase size={19} />, label: 'Experiencia', visible: (c) => !!c?.mostrar_experiencias },
  { id: 'proyectos', icon: <LayoutPanelLeft size={19} />, label: 'Proyectos', visible: (c) => !!c?.mostrar_proyectos },
  { id: 'certificaciones', icon: <GraduationCap size={19} />, label: 'Certificaciones', visible: (c) => !!c?.mostrar_certificaciones },
];

interface NavbarVerticalProps {
  config?: configuracion | null;
}

export const NavbarVertical = ({ config }: NavbarVerticalProps) => {
  const items = useMemo(
    () => menuItems.filter((item) => item.visible(config)),
    [config]
  );

  const [activeSection, setActiveSection] = useState(items[0]?.id ?? 'inicio');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = items.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section) => {
        if (section && scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  // Si solo queda "Inicio" no tiene sentido mostrar el submenú
  if (items.length <= 1) return null;

  return (
    <div
      className="fixed z-50 flex gap-2 p-2 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)]
        left-1/2 bottom-4 -translate-x-1/2 flex-row rounded-full
        lg:left-6 lg:top-1/2 lg:bottom-auto lg:translate-x-0 lg:-translate-y-1/2 lg:flex-col"
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          aria-label={item.label}
          className={`relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 group
            ${activeSection === item.id ? 'text-blue-500' : 'text-slate-400 hover:text-white'}`}
        >
          <span className="relative z-10 transition-colors duration-500">
            {item.icon}
          </span>

          {/* Tooltip solo en escritorio (al costado del pill vertical) */}
          <span className="hidden lg:block absolute left-16 px-4 py-2 rounded-xl bg-white text-blue-900 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 shadow-xl border border-blue-100 -translate-x-2 group-hover:translate-x-0">
            {item.label}
          </span>

          {activeSection === item.id && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 bg-white rounded-full shadow-sm"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}

          <div className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-300" />
        </button>
      ))}
    </div>
  );
};
