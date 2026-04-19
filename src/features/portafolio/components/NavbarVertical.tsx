import { motion } from 'framer-motion';
import { Home, Briefcase, Code2, GraduationCap, LayoutPanelLeft, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

const menuItems = [
  { id: 'inicio', icon: <Home size={19} />, label: 'Inicio' },
  { id: 'habilidades', icon: <Code2 size={19} />, label: 'Habilidades' },
  { id: 'experiencia', icon: <Briefcase size={19} />, label: 'Experiencia' },
  { id: 'proyectos', icon: <LayoutPanelLeft size={19} />, label: 'Proyectos' },
  { id: 'certificaciones', icon: <GraduationCap size={19} />, label: 'Certificaciones' },
];

export const NavbarVertical = () => {
  const [activeSection, setActiveSection] = useState('inicio');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      sections.forEach(section => {
        if (section && scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col gap-2 p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.3)]">
      
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className={`relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 group
            ${activeSection === item.id ? 'text-blue-500' : 'text-slate-400 hover:text-white'}`}
        >
         
          <span className="relative z-10 transition-colors duration-500">
            {item.icon}
          </span>
          
          
          <span className="absolute left-16 px-4 py-2 rounded-xl bg-white text-blue-900 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 shadow-xl border border-blue-100 -translate-x-2 group-hover:translate-x-0">
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

     
      <div className="h-[1px] w-8 mx-auto bg-white/10 my-2" />

     
      <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all duration-300 hover:scale-110">
        <Moon size={18} />
      </button>
    </div>
  );
};