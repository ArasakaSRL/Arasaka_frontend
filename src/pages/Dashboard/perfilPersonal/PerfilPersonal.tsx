import { useState } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import { useAuthStore } from '@/stores/authStore';
import { actualizarInformacion } from '@/features/auth/api/update-perfilPersonal';
import type { Profesion } from '@/features/auth/types/update-perfilPersonal';
import { AxiosError } from 'axios';
import PerfilForm from '@/features/auth/components/Dashboard/profile/PerfilFrom';
import PerfilPreview from '@/features/auth/components/Dashboard/profile/PerfilPreview';

interface PerfilFormData {
    nombre: string;
    apellido: string;
    descripcion_laboral: string;
    correo: string;
}

export default function PerfilPersonal() {

    const user = useAuthStore((state) => state.user)
    const setUser = useAuthStore((state) => state.setUser)

    const [formData, setFormData] = useState<PerfilFormData>({
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        descripcion_laboral: user?.descripcion_laboral || '',
        correo: user?.correo || '',
    });

    const [asignadas, setAsignadas] = useState<Profesion[]>([]);
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
                ...(formData.descripcion_laboral && { descripcion_laboral: formData.descripcion_laboral }),
            });
            // Actualiza el store con los nuevos datos
            if (user) setUser({ ...user, ...res.data });
            setSuccess(true);
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            setApiError(error?.response?.data?.message ?? 'Error al guardar los cambios');
        } finally {
            setLoading(false);
        }
    };

    // Criterio: Manejo de estados de carga, éxito y error para mejorar la experiencia del usuario
    if (!user) return null;

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                <PerfilForm
                    formData={formData}
                    setFormData={setFormData}
                    asignadas={asignadas}
                    setAsignadas={setAsignadas}
                    loading={loading}
                    apiError={apiError}
                    success={success}
                    handleSave={handleSave}
                />

                {/* Vista previa */}
                <PerfilPreview
                    user={user}
                    formData={formData}
                    profesiones={asignadas}
                />

            </div>
        </DashboardLayout>
    );
}
