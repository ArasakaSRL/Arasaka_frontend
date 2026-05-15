import { useState, useEffect } from 'react';
import { Briefcase, X, ChevronDown } from 'lucide-react';
import { getCatalogoProfesiones, getProfesiones, asignarProfesion, desasignarProfesion } from '@/features/auth/api/update-perfilPersonal';
import type { Profesion } from '@/features/auth/types/update-perfilPersonal';

interface ProfesionesSectionProps {
    asignadas: Profesion[];
    setAsignadas: React.Dispatch<React.SetStateAction<Profesion[]>>;
    onAgregar?: (p: Profesion) => void;
    onQuitar?: (p: Profesion) => void;
    onChange?: () => void;
}

export default function ProfesionesSection({ asignadas, setAsignadas, onAgregar, onQuitar, onChange }: ProfesionesSectionProps) {

    const [catalogo, setCatalogo] = useState<Profesion[]>([])
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [loadingId, setLoadingId] = useState<string | null>(null)

    useEffect(() => {
        getCatalogoProfesiones().then(setCatalogo).catch(() => {})
        getProfesiones().then(setAsignadas).catch(() => {})
    }, [])

    const disponibles = catalogo.filter(p => !asignadas.some(a => a.id_profesion === p.id_profesion))

    async function handleAsignar(profesion: Profesion) {
        if (onAgregar) {
            onAgregar(profesion)
            setDropdownOpen(false)
            onChange?.()
            return
        }
        setLoadingId(profesion.id_profesion)
        try {
            await asignarProfesion({ id_profesion: profesion.id_profesion })
            setAsignadas(prev => [...prev, profesion])
        } finally {
            setLoadingId(null)
            setDropdownOpen(false)
        }
    }

    async function handleDesasignar(profesion: Profesion) {
        if (onQuitar) {
            onQuitar(profesion)
            onChange?.()
            return
        }
        setLoadingId(profesion.id_profesion)
        try {
            await desasignarProfesion(profesion.id_profesion)
            setAsignadas(prev => prev.filter(p => p.id_profesion !== profesion.id_profesion))
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <div className="flex flex-col gap-1.5 w-full mb-2">
            <label className="flex items-center gap-1.5 text-black font-semibold text-[14px] ml-1">
                <Briefcase size={15} className="text-gray-500" />
                Profesiones
            </label>

            <div className={`flex flex-wrap gap-2 ${asignadas.length > 0 ? 'mb-3' : ''}`}>
                {asignadas.map(p => (
                    <span key={p.id_profesion} className="flex items-center gap-1 px-4 py-2 bg-[#1e2a5e] text-white text-xs rounded-full">
                        {p.nombre}
                        <button
                            onClick={() => handleDesasignar(p)}
                            disabled={loadingId === p.id_profesion}
                            className="hover:text-red-300 transition-colors disabled:opacity-50"
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}
            </div>

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setDropdownOpen(prev => !prev)}
                    disabled={disponibles.length === 0}
                    className="flex items-center gap-2 px-4 py-3 w-full rounded-xl border border-gray-300 text-sm text-gray-500 hover:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="flex-1 text-left">
                        {disponibles.length === 0 ? 'No hay más profesiones disponibles' : 'Agregar profesión...'}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && disponibles.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                        {disponibles.map(p => (
                            <button
                                key={p.id_profesion}
                                onClick={() => handleAsignar(p)}
                                disabled={loadingId === p.id_profesion}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1e2a5e] transition-colors disabled:opacity-50"
                            >
                                {p.nombre}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
