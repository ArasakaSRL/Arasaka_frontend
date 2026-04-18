import { useState } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import { useAuthStore } from '@/stores/authStore';
import {
    actualizarInformacion,
    actualizarPais,
    agregarTelefono,
    eliminarTelefono,
    actualizarTelefono,
} from '@/features/auth/api/update-perfilPersonal';
import type { Profesion, Telefono } from '@/features/auth/types/update-perfilPersonal';
import { AxiosError } from 'axios';
import PerfilForm from '@/features/auth/components/Dashboard/profile/PerfilFrom';
import PerfilPreview from '@/features/auth/components/Dashboard/profile/PerfilPreview';

interface PerfilFormData {
    nombre: string;
    apellido: string;
    biografia: string;
    correo: string;
    pais: string;
}

export default function PerfilPersonal() {

    const user = useAuthStore((state) => state.user)
    const setUser = useAuthStore((state) => state.setUser)

    const [formData, setFormData] = useState<PerfilFormData>({
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        biografia: user?.biografia || '',
        correo: user?.correo || '',
        pais: user?.pais?.nombre || '',
    });

    const [asignadas, setAsignadas] = useState<Profesion[]>([]);
    // Teléfonos inicializados desde el store, sin petición extra
    const [telefonos, setTelefonos] = useState<Telefono[]>(user?.telefonos || []);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSave = async () => {
        setApiError(null);
        setSuccess(false);
        setLoading(true);
        try {
            const res = await actualizarInformacion({
                nombre: formData.nombre,
                apellido: formData.apellido,
                correo: formData.correo,
                ...(formData.biografia && { biografia: formData.biografia }),
            });

            if (formData.pais.trim()) {
                await actualizarPais({ nombre: formData.pais.trim() })
            }

            if (user) setUser({ ...user, ...res.data, pais: { nombre: formData.pais } });
            setSuccess(true);
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            setApiError(error?.response?.data?.message ?? 'Error al guardar los cambios');
        } finally {
            setLoading(false);
        }
    };

    const handleAgregarTelefono = async (numero: string) => {
        try {
            const res = await agregarTelefono({ telefono: numero })
            setTelefonos(prev => [...prev, res.data])
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>
            setApiError(error?.response?.data?.message ?? 'Error al agregar teléfono')
        }
    }

    const handleEliminarTelefono = async (id: string) => {
        try {
            await eliminarTelefono(id)
            setTelefonos(prev => prev.filter(t => t.id_telefono !== id))
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>
            setApiError(error?.response?.data?.message ?? 'Error al eliminar teléfono')
        }
    }

    const handleActualizarTelefono = async (id: string, numero: string) => {
        try {
            const res = await actualizarTelefono(id, { telefono: numero })
            setTelefonos(prev => prev.map(t => t.id_telefono === id ? res.data : t))
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>
            setApiError(error?.response?.data?.message ?? 'Error al actualizar teléfono')
        }
    }

    if (!user) return null;

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <PerfilForm
                    formData={formData}
                    setFormData={setFormData}
                    asignadas={asignadas}
                    setAsignadas={setAsignadas}
                    telefonos={telefonos}
                    onAgregarTelefono={handleAgregarTelefono}
                    onEliminarTelefono={handleEliminarTelefono}
                    onActualizarTelefono={handleActualizarTelefono}
                    loading={loading}
                    apiError={apiError}
                    success={success}
                    setSuccess={setSuccess}
                    handleSave={handleSave}
                />
                <PerfilPreview
                    user={user}
                    formData={formData}
                    profesiones={asignadas}
                />
            </div>
        </DashboardLayout>
    );
}
