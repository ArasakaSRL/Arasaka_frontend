import { useState } from 'react';
import { Phone, Plus, Pencil, Trash2 } from 'lucide-react';
import CodigoPaisSelect from '@/components/ui/CodigoPaisSelect';
import type { Telefono } from '@/features/auth/types/update-perfilPersonal';

interface TelefonosSectionProps {
    telefonos: Telefono[];
    onAgregar: (numero: string) => Promise<void>;
    onEliminar: (id: string) => Promise<void>;
    onActualizar: (id: string, numero: string) => Promise<void>;
}

export default function TelefonosSection({
    telefonos, onAgregar, onEliminar, onActualizar
}: TelefonosSectionProps) {

    const [telefonosLocales, setTelefonosLocales] = useState<Telefono[]>(telefonos)
    const [nuevoTelefono, setNuevoTelefono] = useState('')
    const [codigoPais, setCodigoPais] = useState('+591')
    const [editandoId, setEditandoId] = useState<string | null>(null)
    const [telefonoEditado, setTelefonoEditado] = useState('')

    async function handleAgregar() {
        if (!nuevoTelefono.trim()) return
        const numeroCompleto = `${codigoPais}${nuevoTelefono.trim()}`
        await onAgregar(numeroCompleto)
        setTelefonosLocales(prev => [...prev, { telefono: numeroCompleto }])
        setNuevoTelefono('')
    }

    async function handleActualizar(id: string) {
        await onActualizar(id, telefonoEditado)
        setTelefonosLocales(prev => prev.map(t =>
            t.id_telefono === id ? { ...t, telefono: telefonoEditado } : t
        ))
        setEditandoId(null)
    }

    async function handleEliminar(id: string) {
        await onEliminar(id)
        setTelefonosLocales(prev => prev.filter(t => t.id_telefono !== id))
    }

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="flex items-center gap-1.5 text-black font-semibold text-[14px] ml-1">
                <Phone size={15} className="text-gray-500" />
                Teléfonos
            </label>

            <div className="flex flex-col gap-2">
                {telefonosLocales.map(t => (
                    <div key={t.id_telefono ?? t.telefono} className="flex flex-wrap items-center gap-2">
                        {editandoId === t.id_telefono ? (
                            <>
                                <input
                                    value={telefonoEditado}
                                    onChange={e => setTelefonoEditado(e.target.value)}
                                    maxLength={15}
                                    className="flex-1 min-w-0 px-3 py-2 text-sm rounded-xl border border-blue-400 outline-none focus:ring-1 focus:ring-blue-600"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => t.id_telefono && handleActualizar(t.id_telefono)}
                                        className="px-3 py-2 text-xs rounded-xl bg-[#1e2a5e] text-white hover:bg-[#151d41] transition-colors"
                                    >Guardar</button>
                                    <button
                                        onClick={() => setEditandoId(null)}
                                        className="px-3 py-2 text-xs rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                                    >Cancelar</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="flex-1 min-w-0 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-700 truncate">
                                    {t.telefono}
                                </span>
                                <div className="flex gap-1 shrink-0">
                                    <button
                                        onClick={() => { setEditandoId(t.id_telefono ?? null); setTelefonoEditado(t.telefono) }}
                                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                                    ><Pencil size={15} /></button>
                                    <button
                                        onClick={() => t.id_telefono && handleEliminar(t.id_telefono)}
                                        className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                                    ><Trash2 size={15} /></button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 mt-1">
                <div className="shrink-0">
                    <CodigoPaisSelect value={codigoPais} onChange={setCodigoPais} />
                </div>
                <input
                    value={nuevoTelefono}
                    onChange={e => setNuevoTelefono(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    placeholder="Número..."
                    className="flex-1 min-w-0 px-3 py-2 text-sm rounded-xl border border-gray-300 outline-none focus:ring-1 focus:ring-blue-600 placeholder:text-gray-400"
                />
                <button
                    type="button"
                    onClick={handleAgregar}
                    disabled={nuevoTelefono.trim().length < 7}
                    className="p-2 shrink-0 rounded-xl bg-[#1e2a5e] text-white hover:bg-[#151d41] transition-colors disabled:opacity-50"
                ><Plus size={20} /></button>
            </div>
        </div>
    )
}
