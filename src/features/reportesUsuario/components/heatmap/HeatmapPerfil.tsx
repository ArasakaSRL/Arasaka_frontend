// src/features/reportesUsuario/components/heatmap/HeatmapPerfil.tsx

import { useEffect, useState } from 'react'
import { getInteraccionesPerfil } from '../../apis/reportesApi'
import { Mail, MessageCircle, Download, Camera } from 'lucide-react'

interface InteraccionesPerfil {
    hover_foto_count:   number | null
    hover_foto_ms:      number | null
    hover_correo_count: number | null
    hover_correo_ms:    number | null
    clic_foto_perfil:   number | null
    clic_correo:        number | null
    clic_linkedin:      number | null
    clic_github:        number | null
    clic_contactar:     number | null
    clic_descargar_cv:  number | null
}

// Calcula el color según la intensidad
function getColor(valor: number, maximo: number): string {
    if (maximo === 0 || valor === 0) return '#e2e8f0'  // gris — sin interacción
    const ratio = valor / maximo
    if (ratio >= 0.66) return '#ef4444'  // rojo — alto
    if (ratio >= 0.33) return '#f59e0b'  // amarillo — medio
    return '#22c55e'                      // verde — bajo
}

function getLabel(valor: number, maximo: number): string {
    if (maximo === 0 || valor === 0) return 'Sin interacción'
    const ratio = valor / maximo
    if (ratio >= 0.66) return 'Alta'
    if (ratio >= 0.33) return 'Media'
    return 'Baja'
}

export function HeatmapPerfil() {
    const [data, setData]       = useState<InteraccionesPerfil | null>(null)
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<string | null>(null)

    useEffect(() => {
        getInteraccionesPerfil()
            .then(setData)
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="text-slate-400 text-sm">Cargando heatmap...</div>
    if (!data)   return <div className="text-slate-400 text-sm">Sin datos</div>

    // Calcula el máximo para normalizar colores
    const valores = [
        data.clic_foto_perfil   ?? 0,
        data.clic_correo        ?? 0,
        data.clic_linkedin      ?? 0,
        data.clic_github        ?? 0,
        data.clic_contactar     ?? 0,
        data.clic_descargar_cv  ?? 0,
    ]
    const maximo = Math.max(...valores)

    const elementos = [
        {
            id:     'foto',
            label:  'Foto de perfil',
            icon:   <Camera size={20} />,
            clics:  data.clic_foto_perfil  ?? 0,
            hovers: data.hover_foto_count  ?? 0,
            ms:     data.hover_foto_ms     ?? 0,
        },
        {
            id:     'correo',
            label:  'Correo',
            icon:   <Mail size={20} />,
            clics:  data.clic_correo        ?? 0,
            hovers: data.hover_correo_count ?? 0,
            ms:     data.hover_correo_ms    ?? 0,
        },
        
        {
            id:     'contactar',
            label:  'Contactar',
            icon:   <MessageCircle size={20} />,
            clics:  data.clic_contactar ?? 0,
            hovers: 0,
            ms:     0,
        },
        {
            id:     'cv',
            label:  'Descargar CV',
            icon:   <Download size={20} />,
            clics:  data.clic_descargar_cv ?? 0,
            hovers: 0,
            ms:     0,
        },
    ]

    const selectedData = selected
        ? elementos.find(e => e.id === selected)
        : null

    return (
        <div className="flex flex-col gap-6">
            <h3 className="text-lg font-black text-[#0a1120]">
                Heatmap — Perfil
            </h3>

            {/* ── Lienzo visual ── */}
            <div className="bg-[#0a1120] rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">

                {/* Foto */}
                <div className="flex flex-col items-center gap-2">
                    <button
                        onClick={() => setSelected(selected === 'foto' ? null : 'foto')}
                        className="relative w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all"
                        style={{
                            borderColor: getColor(data.clic_foto_perfil ?? 0, maximo),
                            boxShadow:   `0 0 20px ${getColor(data.clic_foto_perfil ?? 0, maximo)}60`
                        }}
                    >
                        <Camera size={32} className="text-white" />
                        <span
                            className="absolute -top-2 -right-2 text-white text-[10px] font-black px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: getColor(data.clic_foto_perfil ?? 0, maximo) }}
                        >
                            {data.clic_foto_perfil ?? 0}
                        </span>
                    </button>
                    <span className="text-white/50 text-[10px]">Foto</span>
                </div>

                {/* Elementos de texto */}
                <div className="flex flex-col gap-3 flex-1">
                    {elementos.filter(e => e.id !== 'foto').map(el => (
                        <button
                            key={el.id}
                            onClick={() => setSelected(selected === el.id ? null : el.id)}
                            className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all hover:bg-white/5"
                            style={{
                                borderLeft: `3px solid ${getColor(el.clics, maximo)}`
                            }}
                        >
                            <span style={{ color: getColor(el.clics, maximo) }}>
                                {el.icon}
                            </span>
                            <span className="text-white/70 text-sm font-medium flex-1 text-left">
                                {el.label}
                            </span>
                            <span
                                className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                                style={{ backgroundColor: getColor(el.clics, maximo) }}
                            >
                                {el.clics}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Detalle al hacer clic ── */}
            {selectedData && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="p-2 rounded-xl"
                            style={{ backgroundColor: `${getColor(selectedData.clics, maximo)}20` }}
                        >
                            <span style={{ color: getColor(selectedData.clics, maximo) }}>
                                {selectedData.icon}
                            </span>
                        </div>
                        <div>
                            <h4 className="font-black text-[#0a1120]">{selectedData.label}</h4>
                            <span
                                className="text-[10px] font-bold uppercase"
                                style={{ color: getColor(selectedData.clics, maximo) }}
                            >
                                Intensidad {getLabel(selectedData.clics, maximo)}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400 uppercase font-bold">Clics</span>
                            <span className="text-2xl font-black text-[#0a1120]">
                                {selectedData.clics}
                            </span>
                        </div>
                        {selectedData.hovers > 0 && (
                            <>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 uppercase font-bold">Hovers</span>
                                    <span className="text-2xl font-black text-[#0a1120]">
                                        {selectedData.hovers}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 uppercase font-bold">Tiempo hover</span>
                                    <span className="text-2xl font-black text-[#0a1120]">
                                        {selectedData.hovers > 0
                                            ? `${Math.round(selectedData.ms / selectedData.hovers / 1000)}s`
                                            : '0s'
                                        }
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ── Leyenda ── */}
            <div className="flex items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"/>
                    <span>Alta interacción</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                    <span>Media</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"/>
                    <span>Baja</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200"/>
                    <span>Sin interacción</span>
                </div>
            </div>
        </div>
    )
}