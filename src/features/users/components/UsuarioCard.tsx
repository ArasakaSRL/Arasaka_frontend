import { ChevronDown, FolderOpen, ExternalLink, Mail } from "lucide-react";
import type { Usuario } from "../lib/UserApi";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
interface Props {
  user: Usuario;
}

export const UsuarioCard = ({ user }: Props) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const [selectedPortfolio, setSelectedPortfolio] = useState(
    user.portafolios[0]
  );

  return (
    <article className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="flex flex-col items-center">

        <div className="relative">
          {user.url_foto ? (
            <img
              src={user.url_foto}
              alt={user.nombre}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#16266B] text-white flex items-center justify-center text-2xl font-bold">
              {user.nombre
                .split(" ")
                .map(word => word[0])
                .slice(0, 2)
                .join("")}
            </div>
          )}
        </div>

        <h3 className="mt-4 text-lg font-bold text-center text-slate-800 line-clamp-2">
          {user.nombre} {user.apellido}
        </h3>

        <p className="text-[#16266B] font-medium text-sm">
          @{user.username}
        </p>

        <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
          <Mail size={14} />
          <span className="truncate max-w-55">
            {user.correo}
          </span>
        </div>

        <div className="relative w-full mt-5">
          <button
            onClick={() => setIsOpenDropdown(prev => !prev)}
            className="w-full bg-[#F8FAFC] border border-gray-200 rounded-2xl p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-gray-100">
                <FolderOpen size={18} className="text-primary-500" />
              </div>

              <div className="text-left">
                <p className="text-[10px] uppercase font-black tracking-wider text-primary-500">
                  Explorar
                </p>

                <p className="font-bold text-primary-500 truncate max-w-40">
                  {selectedPortfolio?.nombre}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary-500 bg-white border border-gray-200 px-2 py-1 rounded-lg">
                {user.portafolios.length}
              </span>

              <ChevronDown
                size={16}
                className={`transition-transform ${
                  isOpenDropdown ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>
          <AnimatePresence>
          {isOpenDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden"
            >
              <div className="p-2 max-h-40 overflow-y-auto space-y-1">
                {user.portafolios.map((portafolio) => {
                  const isSelected =
                    portafolio.id_portafolio ===
                    selectedPortfolio.id_portafolio;

                  return (
                    <button
                      key={portafolio.id_portafolio}
                      onClick={() => {
                        setSelectedPortfolio(portafolio);
                        setIsOpenDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-primary-500 text-white"
                          : "hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      <span className="truncate max-w-37.5">
                        {portafolio.nombre}
                      </span>

                      {portafolio.link_activo && (
                        <span
                          className={`text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-md font-black ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-blue-50 text-primary-500"
                          }`}
                        >
                          Activo
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
        
        <a
          href={`${window.location.origin}/portafolio/${selectedPortfolio.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 w-full py-2.5 px-4 bg-light-500 hover:bg-primary-500 text-gray-500 hover:text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          Ver Portafolio
          <ExternalLink size={14} />
        </a>

      </div>
    </article>
  );
};