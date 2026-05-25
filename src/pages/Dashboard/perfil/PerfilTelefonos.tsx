import { useState } from 'react'
import DashboardLayout from '@/layout/DashboardLayout'
import PageHeader from '@/components/ui/PageHeader'
import { useAuthStore } from '@/stores/authStore'
import { agregarTelefono, eliminarTelefono, actualizarTelefono } from '@/features/auth/api/update-perfilPersonal'
import type { Telefono } from '@/features/auth/types/update-perfilPersonal'
import { AxiosError } from 'axios'
import { Smartphone, CheckCircle2, AlertCircle } from 'lucide-react'
import TelefonosHeader from '@/features/auth/components/Dashboard/profile/telefonos/TelefonosHeader'
import TelefonosBannerEliminar from '@/features/auth/components/Dashboard/profile/telefonos/TelefonosBannerEliminar'
import TelefonosList from '@/features/auth/components/Dashboard/profile/telefonos/TelefonosList'
import TelefonosAgregar from '@/features/auth/components/Dashboard/profile/telefonos/TelefonosAgregar'

export default function PerfilTelefonos() {
    const user = useAuthStore(s => s.user)
    const setUser = useAuthStore(s => s.setUser)
    const idPortafolio = useAuthStore(s => s.portafolioSeleccionado?.id_portafolio ?? '')
    const [telefonos, setTelefonos] = useState<Telefono[]>([])
    const [editandoId, setEditandoId] = useState<string | null>(null)
    const [telefonoEditado, setTelefonoEditado] = useState('')
    const [apiError, setApiError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [loadingAgregar, setLoadingAgregar] = useState(false)
    const [modoEliminar, setModoEliminar] = useState(false)
    const [seleccionados, setSeleccionados] = useState<string[]>([])
    const [loadingEliminar, setLoadingEliminar] = useState(false)

    function showSuccess(msg: string) {
        setSuccess(msg)
        setTimeout(() => setSuccess(null), 3000)
    }

    function cancelarModoEliminar() {
        setModoEliminar(false)
        setSeleccionados([])
    }

    function toggleSeleccion(id: string) {
        setSeleccionados(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
    }

    async function handleAgregar(numero: string) {
        setApiError(null)
        setLoadingAgregar(true)
        try {
            const res = await agregarTelefono(idPortafolio, { telefono: numero })
            const updated = [...telefonos, res.data]
            setTelefonos(updated)
            showSuccess('Teléfono agregado correctamente')
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>
            setApiError(error?.response?.data?.message ?? 'Error al agregar teléfono')
        } finally {
            setLoadingAgregar(false)
        }
    }

    async function handleEliminarSeleccionados() {
        setApiError(null)
        setLoadingEliminar(true)
        try {
            await Promise.all(seleccionados.map(id => eliminarTelefono(idPortafolio, id)))
            const updated = telefonos.filter(t => !seleccionados.includes(t.id_telefono ?? ''))
            setTelefonos(updated)
            showSuccess(`${seleccionados.length} teléfono${seleccionados.length > 1 ? 's eliminados' : ' eliminado'} correctamente`)
            cancelarModoEliminar()
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>
            setApiError(error?.response?.data?.message ?? 'Error al eliminar teléfonos')
        } finally {
            setLoadingEliminar(false)
        }
    }

    async function handleActualizar(id: string) {
        setApiError(null)
        setLoadingId(id)
        try {
            const res = await actualizarTelefono(idPortafolio, id, { telefono: telefonoEditado })
            const updated = telefonos.map(t => t.id_telefono === id ? res.data : t)
            setTelefonos(updated)
            setEditandoId(null)
            showSuccess('Teléfono actualizado correctamente')
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>
            setApiError(error?.response?.data?.message ?? 'Error al actualizar teléfono')
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                <div className="lg:col-span-12">
                    <PageHeader icon={Smartphone} title="Teléfonos" description="Administra los números de contacto de tu perfil" />
                </div>

                <div className="lg:col-span-12 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                    <TelefonosHeader
                        total={telefonos.length}
                        modoEliminar={modoEliminar}
                        onActivarEliminar={() => setModoEliminar(true)}
                        onCancelarEliminar={cancelarModoEliminar}
                    />

                    {modoEliminar && (
                        <TelefonosBannerEliminar
                            seleccionados={seleccionados.length}
                            loading={loadingEliminar}
                            onConfirmar={handleEliminarSeleccionados}
                        />
                    )}

                    {(apiError || success) && (
                        <div className={`mx-6 mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm ${
                            apiError
                                ? 'bg-red-50 border border-red-100 text-red-600'
                                : 'bg-green-50 border border-green-100 text-green-600'
                        }`}>
                            {apiError ? <AlertCircle size={15} className="shrink-0" /> : <CheckCircle2 size={15} className="shrink-0" />}
                            {apiError || success}
                        </div>
                    )}

                    <TelefonosList
                        telefonos={telefonos}
                        modoEliminar={modoEliminar}
                        seleccionados={seleccionados}
                        editandoId={editandoId}
                        telefonoEditado={telefonoEditado}
                        loadingId={loadingId}
                        onToggleSeleccion={toggleSeleccion}
                        onIniciarEdicion={(id, val) => { setEditandoId(id); setTelefonoEditado(val) }}
                        onCancelarEdicion={() => setEditandoId(null)}
                        onGuardarEdicion={handleActualizar}
                        onTelefonoEditadoChange={setTelefonoEditado}
                    />

                    <TelefonosAgregar loading={loadingAgregar} onAgregar={handleAgregar} />

                </div>
            </div>
        </DashboardLayout>
    )
}
