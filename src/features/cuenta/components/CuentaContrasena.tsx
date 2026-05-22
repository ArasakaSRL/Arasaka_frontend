import { useState } from 'react'
import { Lock, Loader2, CheckCircle } from 'lucide-react'
import { z } from 'zod'
import { cambiarContrasena } from '@/features/auth/api/auth'
import { AuthInput } from '@/features/auth/components/auth/AuthInput'

const schema = z.object({
    contrasena_actual: z.string().min(1, 'Campo obligatorio'),
    contrasena_nueva: z
        .string()
        .min(12, 'Mínimo 12 caracteres')
        .max(12, 'Máximo 12 caracteres')
        .regex(/[A-Z]/, 'Debe contener una mayúscula')
        .regex(/[a-z]/, 'Debe contener una minúscula')
        .regex(/[0-9]/, 'Debe contener un número')
        .regex(/[^A-Za-z0-9]/, 'Debe contener un carácter especial'),
    contrasena_nueva_confirmation: z.string().min(1, 'Campo obligatorio'),
}).refine(d => d.contrasena_nueva === d.contrasena_nueva_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['contrasena_nueva_confirmation'],
})

type Errors = Partial<Record<'contrasena_actual' | 'contrasena_nueva' | 'contrasena_nueva_confirmation', string>>

export default function CuentaContrasena() {
    const [form, setForm] = useState({ contrasena_actual: '', contrasena_nueva: '', contrasena_nueva_confirmation: '' })
    const [errors, setErrors] = useState<Errors>({})
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)

    function set(field: keyof typeof form, val: string) {
        setForm(p => ({ ...p, [field]: val }))
        setErrors(p => ({ ...p, [field]: undefined }))
        setSuccess(false)
        setApiError(null)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setApiError(null)
        const result = schema.safeParse(form)
        if (!result.success) {
            const e: Errors = {}
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof Errors
                if (!e[key]) e[key] = issue.message
            }
            setErrors(e)
            return
        }
        setLoading(true)
        try {
            await cambiarContrasena(form)
            setSuccess(true)
            setForm({ contrasena_actual: '', contrasena_nueva: '', contrasena_nueva_confirmation: '' })
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } }
            setApiError(e.response?.data?.message ?? 'Error al cambiar la contraseña')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-[#1e2a5e]/5 border border-[#1e2a5e]/10 flex items-center justify-center shrink-0">
                    <Lock size={24} className="text-[#1e2a5e]" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-left text-slate-700">Cambiar contraseña</p>
                    <p className="text-xs text-slate-400 mt-0.5">Actualiza tu contraseña de acceso</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <AuthInput
                    label="Contraseña actual"
                    placeholder="Tu contraseña actual"
                    type="password"
                    value={form.contrasena_actual}
                    onChange={v => set('contrasena_actual', v)}
                    error={errors.contrasena_actual}
                    required
                />
                <AuthInput
                    label="Nueva contraseña"
                    placeholder="Nueva contraseña"
                    type="password"
                    value={form.contrasena_nueva}
                    onChange={v => set('contrasena_nueva', v.slice(0, 12))}
                    error={errors.contrasena_nueva}
                    maxLength={12}
                    required
                />
                <AuthInput
                    label="Confirmar nueva contraseña"
                    placeholder="Repite la nueva contraseña"
                    type="password"
                    value={form.contrasena_nueva_confirmation}
                    onChange={v => set('contrasena_nueva_confirmation', v.slice(0, 12))}
                    error={errors.contrasena_nueva_confirmation}
                    maxLength={12}
                    required
                />

                {apiError && <p className="text-red-500 text-xs">{apiError}</p>}

                {success && (
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                        <CheckCircle size={15} />
                        <p className="text-xs font-medium">Contraseña actualizada exitosamente</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !form.contrasena_actual || !form.contrasena_nueva || !form.contrasena_nueva_confirmation}
                    className="flex items-center justify-center gap-2 bg-[#1e2a5e] hover:bg-[#27496e] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
                    {loading ? 'Guardando...' : 'Actualizar contraseña'}
                </button>
            </form>
        </div>
    )
}
