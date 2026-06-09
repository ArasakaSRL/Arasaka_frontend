import { useState } from 'react'
import { User, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { z } from 'zod'
import { useAuthStore } from '@/stores/authStore'
import { actualizarInformacion } from '@/features/auth/api/update-perfilPersonal'
import { getUsuario } from '@/features/auth/api/auth'
import EditableField from './EditableField'

const usernameSchema = z.string().trim()
    .min(3, 'Mínimo 3 caracteres')
    .max(30, 'Máximo 30 caracteres')
    .regex(/^[a-zA-Z0-9]+$/, 'Solo letras y números')

export default function UsernameField() {
    const user    = useAuthStore(s => s.user)
    const setUser = useAuthStore(s => s.setUser)

    const [editing, setEditing]   = useState(false)
    const [value,   setValue]     = useState('')
    const [error,   setError]     = useState<string | undefined>()
    const [apiError, setApiError] = useState<string | null>(null)
    const [loading, setLoading]   = useState(false)
    const [success, setSuccess]   = useState(false)

    function handleEdit() {
        setValue(user?.username ?? '')
        setError(undefined)
        setApiError(null)
        setSuccess(false)
        setEditing(true)
    }

    function handleCancel() {
        setEditing(false)
        setError(undefined)
        setApiError(null)
    }

    async function handleSave() {
        setApiError(null)
        const r = usernameSchema.safeParse(value)
        if (!r.success) { setError(r.error.issues[0].message); return }
        if (value === user?.username) { setError('El usuario es igual al actual'); return }
        setLoading(true)
        try {
            await actualizarInformacion({ username: value })
            const updatedUser = await getUsuario()
            if (updatedUser) setUser(updatedUser)
            setSuccess(true)
            setEditing(false)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } }
            setApiError(e.response?.data?.message ?? 'Error al actualizar')
        } finally {
            setLoading(false)
        }
    }

    return (
        <EditableField
            icon={User}
            label="Usuario"
            value={user?.username}
            editing={editing}
            onStartEdit={handleEdit}
            onCancel={handleCancel}
            success={success}
            successText="Usuario actualizado"
        >
            <div className="px-4 py-3 flex flex-col gap-2">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={value}
                        maxLength={30}
                        autoFocus
                        aria-invalid={!!error}
                        onChange={e => { setValue(e.target.value); setError(undefined) }}
                        onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }}
                        className={`flex-1 px-3 py-2 text-sm rounded-xl border outline-none transition-all text-slate-700
                            ${error
                                ? 'border-red-300 focus:ring-1 focus:ring-red-300 bg-red-50/30'
                                : 'border-gray-200 focus:ring-1 focus:ring-[#1e2a5e]/30 focus:border-[#1e2a5e]/40 bg-white'}`}
                    />
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={loading || !value.trim()}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1e2a5e] text-white hover:bg-[#27496e] transition-colors disabled:opacity-40 shrink-0"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={13} />}
                    </button>
                </div>
                {(error || apiError) && (
                    <p className="text-red-500 text-[11px] flex items-center gap-1" role="alert">
                        <AlertCircle size={11} /> {error ?? apiError}
                    </p>
                )}
            </div>
        </EditableField>
    )
}
