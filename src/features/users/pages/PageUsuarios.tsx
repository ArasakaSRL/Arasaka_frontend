/* eslint-disable react-hooks/set-state-in-effect */
import DashboardLayout from '@/layout/DashboardLayout'
import { Banner } from '@/components/Banner'
import { UserSearch } from '../components/UsuariosBuscador'
import { UserList } from '../components/UsuarioList'
import { useUsuarios } from '../hooks/useUsers'
import { useBuscarUsuarios } from '../hooks/useBuscador'
import { Users, ChevronLeft, ChevronRight  }from "lucide-react"
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
export default function PageUsuarios() {
  const {
    usuarios
  } = useUsuarios();

  const {
    search,
    setSearch,
    usuariosFiltrados,
  } = useBuscarUsuarios(usuarios);

  const [pagina, setPagina] = useState(1)

  const POR_PAGINA = 6
  const totalPaginas = Math.ceil(
    usuariosFiltrados.length / POR_PAGINA
  )

  const usuariosPaginados = usuariosFiltrados.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA
  )
  useEffect(() => {
    setPagina(1)
  }, [search])

  const cambioPagina = (nuevaPagina: number) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;

    setPagina(nuevaPagina);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <DashboardLayout>
      <Banner
      titulo="Usuarios"
      descripcion="Gestiona tus usuarios"
      />
      <section className="mt-8 space-y-6">
        <div className="bg-white text-left rounded-2xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="font-semibold text-sm flex-row flex gap-2">
           <Users className="text-[#16266B]" size={18} />
           Usuarios encontrados: {usuariosFiltrados.length}
          </div>
          <UserSearch value={search} onChange={setSearch} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={pagina}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <UserList users={usuariosPaginados} />
          </motion.div>
        </AnimatePresence>
        {totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => cambioPagina(pagina - 1)}
              disabled={pagina === 1}
              className=" flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#1e2a5e] border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors
              "
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: totalPaginas },
                (_, i) => i + 1
              )
                .filter(
                  n =>
                    n === 1 ||
                    n === totalPaginas ||
                    Math.abs(n - pagina) <= 1
                )
                .reduce<(number | "…")[]>(
                  (acc, n, idx, arr) => {
                    if (
                      idx > 0 &&
                      n - (arr[idx - 1] as number) > 1
                    ) {
                      acc.push("…");
                    }

                    acc.push(n);

                    return acc;
                  },
                  []
                )
                .map((item, idx) =>
                  item === "…" ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="
                        px-1
                        text-gray-400
                        text-sm
                      "
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() =>
                        cambioPagina(item as number)
                      }
                      className={` w-9 h-9 text-sm font-medium rounded-xl transition-colors
                        ${
                          pagina === item
                            ? "bg-[#1e2a5e] text-white"
                            : "text-slate-600 hover:bg-gray-100"
                        }
                      `}
                    >
                      {item}
                    </button>
                  )
                )}
            </div>

            <button
              onClick={() => cambioPagina(pagina + 1)}
              disabled={pagina === totalPaginas}
              className=" flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#1e2a5e] border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors
              "
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>
    </DashboardLayout>
  )
}