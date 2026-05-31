import { useState } from 'react'
import { User, Pencil, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { useAuthStore } from '@/stores/authStore'
import { actualizarInformacion } from '@/features/auth/api/update-perfilPersonal'

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
            if (user) setUser({ ...user, username: value })
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
        <div className="flex flex-col gap-2">
            <AnimatePresence mode="wait">
                {!editing ? (
                    <motion.div key="view"
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
                        className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-2 md:px-4 py-3"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                            <User size={22} className="text-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Usuario</p>
                            <p className="text-sm text-slate-700 font-medium break-all">{user?.username || '—'}</p>
                        </div>
                        <button
                            onClick={handleEdit}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#1e2a5e]/20 bg-[#1e2a5e]/5 text-[#1e2a5e] hover:bg-[#1e2a5e]/10 transition-colors shrink-0"
                        >
                            <Pencil size={16} className='text-slate-400' />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div key="edit"
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
                        className="flex flex-col gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                    >
                        <label className="text-[12px]! font-semibold text-slate-500 flex items-center gap-1.5">
                            <User size={16} className="text-slate-400 text-sm!" /> Usuario
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={value}
                                maxLength={30}
                                autoFocus
                                onChange={e => { setValue(e.target.value); setError(undefined) }}
                                onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }}
                                className={`flex-1 px-3 py-2 text-sm rounded-xl border outline-none transition-all text-slate-700
                                    ${error
                                        ? 'border-red-300 focus:ring-1 focus:ring-red-300 bg-red-50/30'
                                        : 'border-gray-200 focus:ring-1 focus:ring-[#1e2a5e]/30 focus:border-[#1e2a5e]/40 bg-white'}`}
                            />
                            <button
                                onClick={handleSave}
                                disabled={loading || !value.trim()}
                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1e2a5e] text-white hover:bg-[#27496e] transition-colors disabled:opacity-40 shrink-0"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={13} />}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 transition-colors shrink-0"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        {(error || apiError) && (
                            <p className="text-red-500 text-[11px] flex items-center gap-1">
                                <AlertCircle size={11} /> {error ?? apiError}
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5"
                    >
                        <CheckCircle size={13} />
                        <p className="text-xs font-medium">Usuario actualizado</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
