import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Habilidad {
    id_habilidad: string;
    nombre: string;
    categoria_habilidad: string;
    nivel: string;
}

interface Props {
    habilidades: Habilidad[];
}

const LIMITE = 6

const estiloCategoria = (categoria: string) => {
    const cat = categoria?.toLowerCase()
    if (cat?.includes('tecn') || cat?.includes('técn'))
        return 'bg-[#1e2a5e]/10 text-[#1e2a5e] border border-[#1e2a5e]/20'
    if (cat?.includes('bland'))
        return 'bg-purple-50 text-purple-700 border border-purple-200'
    return 'bg-slate-100 text-slate-600 border border-slate-200'
}

const etiquetaCategoria = (categoria: string) => {
    const cat = categoria?.toLowerCase()
    if (cat?.includes('tecn') || cat?.includes('técn')) return '⚙️'
    if (cat?.includes('bland')) return '💡'
    return '🔹'
}

export default function HabilidadesGrid({ habilidades }: Props) {
    const [verTodas, setVerTodas] = useState(false)
    const visibles = verTodas ? habilidades : habilidades.slice(0, LIMITE)
    const restantes = habilidades.length - LIMITE

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1.5">
                <AnimatePresence>
                    {visibles.map((hab, i) => (
                        <motion.span
                            key={hab.id_habilidad}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2, delay: i * 0.03 }}
                            className={`flex items-center gap-1 px-2.5 py-1 text-[12px] font-medium rounded-full ${estiloCategoria(hab.categoria_habilidad)}`}
                        >
                            <span>{etiquetaCategoria(hab.categoria_habilidad)}</span>
                            {hab.nombre}
                        </motion.span>
                    ))}
                </AnimatePresence>
            </div>

            {habilidades.length > LIMITE && (
                <button
                    onClick={() => setVerTodas(prev => !prev)}
                    className="self-start text-[12px] font-semibold text-[#1e2a5e] transition-colors"
                >
                    {verTodas ? 'Ver menos ' : `+${restantes} más `}
                </button>
            )}

            <div className="flex gap-3 mt-1">
                <span className="flex items-center gap-1 text-[12px] text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-[#1e2a5e]/30 inline-block" /> Técnica
                </span>
                <span className="flex items-center gap-1 text-[12px] text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-purple-300 inline-block" /> Blanda
                </span>
            </div>
        </div>
    )
}
