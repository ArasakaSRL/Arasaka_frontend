import { useRef, useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { actualizarFoto } from '@/features/auth/api/update-perfilPersonal'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/components/Alerta'

export default function CuentaAvatar() {
    const user    = useAuthStore(s => s.user)
    const setUser = useAuthStore(s => s.setUser)
    const inputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)

    const initials = user
        ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase()
        : '?'

    async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file || !user) return
        setLoading(true)
        try {
            const fd = new FormData()
            fd.append('foto_perfil', file)
            fd.append('_method', 'PATCH')
            const res = await actualizarFoto(fd)
            setUser({ ...user, url_foto: res.data?.url_foto ?? user.url_foto })
            toast.success('Foto actualizada')
        } catch {
            toast.error('Error al actualizar la foto')
        } finally {
            setLoading(false)
            e.target.value = ''
        }
    }

    return (
        <div className="flex flex-col items-center gap-4 py-6">
            <div className="relative">

                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#1e2a5e] flex items-center justify-center shadow-lg ring-4 ring-white">
                    {user?.url_foto
                        ? <img src={user.url_foto} alt={user.nombre} className="w-full h-full object-cover" />
                        : <span className="text-white text-2xl font-bold">{initials}</span>
                    }
                </div>

                <button
                    onClick={() => inputRef.current?.click()}
                    disabled={loading}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 border-2 border-white flex items-center justify-center shadow-md transition-colors disabled:opacity-60"
                >
                    {loading
                        ? <Loader2 size={14} className="text-slate-600 animate-spin" />
                        : <Camera size={14} className="text-slate-600" />
                    }
                </button>

                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
            </div>

            <div className="text-center">
                <p className="text-base font-bold text-slate-800">{user?.username}</p>
                <p className="text-sm text-slate-400 mt-0.5">{user?.correo}</p>
            </div>
        </div>
    )
}
