import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import type { Profesion } from '@/features/auth/types/update-perfilPersonal';
import apiClient from '@/api/api';

interface Props {
    user: {
        nombre: string;
        apellido: string;
        url_foto?: string | null;
    };
    formData: {
        nombre: string;
        apellido: string;
        biografia: string;
        correo: string;
    };
    profesiones: Profesion[];
}

export default function AvatarPerfil({ user, formData, profesiones }: Props) {
    const setPortafolioSeleccionado = useAuthStore(s => s.setPortafolioSeleccionado)
    const portafolio = useAuthStore(s => s.portafolioSeleccionado)
    const inputRef = useRef<HTMLInputElement>(null)
    const [uploadingFoto, setUploadingFoto] = useState(false)
    const [fotoUrl, setFotoUrl] = useState<string | null>(
        portafolio?.informacion_basica?.foto_perfil ?? user.url_foto ?? null
    )

    const iniciales = `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase()

    async function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file || !portafolio) return
        setUploadingFoto(true)
        try {
            const fd = new FormData()
            fd.append('foto', file)
            const response = await apiClient.post(
                `/portafolios/${portafolio.id_portafolio}/informacion-basica/foto`,
                fd,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            )
            const url = response.data?.data?.foto_perfil ?? ''
            const publicId = response.data?.data?.foto_perfil_public_id ?? null
            setFotoUrl(url)
            const current = useAuthStore.getState().portafolioSeleccionado
            if (current) {
                setPortafolioSeleccionado({
                    ...current,
                    informacion_basica: current.informacion_basica
                        ? { ...current.informacion_basica, foto_perfil: url, foto_perfil_public_id: publicId }
                        : current.informacion_basica,
                })
            }
        } catch {
            // silencioso
        } finally {
            setUploadingFoto(false)
            if (inputRef.current) inputRef.current.value = ''
        }
    }

    return (
        <div className="bg-linear-to-br from-slate-300 to-slate-100 rounded-2xl p-6 text-center flex flex-col items-center gap-2 overflow-hidden w-full">
            <div className="relative group cursor-pointer" onClick={() => inputRef.current?.click()}>
                <div className="w-24 h-24 bg-slate-300 rounded-full flex items-center justify-center text-slate-600 text-2xl font-bold border-4 border-white/50 overflow-hidden">
                    {uploadingFoto ? (
                        <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
                    ) : fotoUrl ? (
                        <img src={fotoUrl} alt={user.nombre} className="w-full h-full object-cover" />
                    ) : iniciales}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={22} className="text-white" />
                </div>
            </div>

            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />

            <div>
                <h3 className="text-lg font-bold text-slate-800">{formData.nombre} {formData.apellido}</h3>
                <p className="text-slate-500 text-[14px]">{formData.correo}</p>
            </div>

            {profesiones.length > 0 && (
                <div className="flex flex-wrap gap-1.5 justify-center">
                    {profesiones.map(p => (
                        <span key={p.id_profesion} className="px-2.5 py-0.5 bg-[#1e2a5e] text-white text-[12px] rounded-full">
                            {p.nombre}
                        </span>
                    ))}
                </div>
            )}

            {formData.biografia && (
                <p className="text-slate-600 text-xs text-center line-clamp-6 px-2 break-all w-full">{formData.biografia}</p>
            )}
        </div>
    )
}
