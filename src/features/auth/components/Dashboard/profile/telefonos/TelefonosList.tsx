import { CheckCircle2, Pencil, Phone, Smartphone } from 'lucide-react'
import type { Telefono } from '@/features/auth/types/update-perfilPersonal'

interface Props {
    telefonos: Telefono[]
    modoEliminar: boolean
    seleccionados: string[]
    editandoId: string | null
    telefonoEditado: string
    loadingId: string | null
    onToggleSeleccion: (id: string) => void
    onIniciarEdicion: (id: string, valor: string) => void
    onCancelarEdicion: () => void
    onGuardarEdicion: (id: string) => void
    onTelefonoEditadoChange: (val: string) => void
}

export default function TelefonosList({
    telefonos, modoEliminar, seleccionados, editandoId, telefonoEditado,
    loadingId, onToggleSeleccion, onIniciarEdicion, onCancelarEdicion,
    onGuardarEdicion, onTelefonoEditadoChange
}: Props) {
    if (telefonos.length === 0) return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Smartphone size={36} strokeWidth={1.2} />
            <p className="text-sm">No tienes teléfonos registrados</p>
        </div>
    )

    return (
        <ul className="divide-y divide-gray-100">
            {telefonos.map((t, i) => {
                const isSelected = seleccionados.includes(t.id_telefono ?? '')
                return (
                    <li
                        key={t.id_telefono ?? t.telefono}
                        onClick={() => modoEliminar && t.id_telefono && onToggleSeleccion(t.id_telefono)}
                        className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                            modoEliminar
                                ? isSelected ? 'bg-red-50 cursor-pointer' : 'hover:bg-red-50/40 cursor-pointer'
                                : 'hover:bg-slate-50/60'
                        }`}
                    >
                        {modoEliminar ? (
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                                isSelected ? 'bg-red-500 border-red-500' : 'border-slate-300'
                            }`}>
                                {isSelected && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-slate-500">{i + 1}</span>
                            </div>
                        )}

                        {editandoId === t.id_telefono && !modoEliminar ? (
                            <div className="flex-1 flex items-center gap-2">
                                <input
                                    value={telefonoEditado}
                                    onChange={e => onTelefonoEditadoChange(e.target.value.replace(/\D/g, ''))}
                                    maxLength={15}
                                    autoFocus
                                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-blue-700 outline-none"
                                />
                                <button
                                    onClick={() => t.id_telefono && onGuardarEdicion(t.id_telefono)}
                                    disabled={loadingId === t.id_telefono}
                                    className="px-4 py-2 text-xs rounded-xl bg-[#1e2a5e] text-white hover:bg-[#151d41] transition-colors disabled:opacity-50"
                                >
                                    {loadingId === t.id_telefono ? 'Guardando...' : 'Guardar'}
                                </button>
                                <button
                                    onClick={onCancelarEdicion}
                                    className="px-4 py-2 text-xs rounded-xl border border-gray-200 text-slate-500 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className={`flex-1 text-sm font-medium ${isSelected ? 'text-red-600' : 'text-slate-700'}`}>
                                    {t.telefono}
                                </span>
                                {!modoEliminar && (
                                    <button
                                        onClick={() => onIniciarEdicion(t.id_telefono ?? '', t.telefono)}
                                        className="p-2 rounded-lg text-slate-400 hover:text-[#1e2a5e] hover:bg-blue-50 transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                )}
                            </>
                        )}
                    </li>
                )
            })}
        </ul>
    )
}
