import { useState } from 'react'
import { Mail, Loader2, CheckCircle, AlertCircle, ArrowRight, KeyRound } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { useAuthStore } from '@/stores/authStore'
import { verificarCorreo, confirmarCorreo } from '@/features/auth/api/auth'
import EditableField from './EditableField'

const correoSchema = z.string().trim()
    .min(5, 'Correo inválido')
    .max(50, 'Máximo 50 caracteres')
    .email('Formato de correo inválido')

const codigoSchema = z.string()
    .length(6, 'El código debe tener 6 dígitos')
    .regex(/^\d+$/, 'Solo números')

export default function CorreoField() {
    const user    = useAuthStore(s => s.user)
    const setUser = useAuthStore(s => s.setUser)

    const [editing,          setEditing]          = useState(false)
    const [correoVal,        setCorreoVal]         = useState('')
    const [correoError,      setCorreoError]       = useState<string | undefined>()
    const [codigoEnviado,    setCodigoEnviado]     = useState(false)
    const [codigo,           setCodigo]            = useState('')
    const [codigoError,      setCodigoError]       = useState<string | undefined>()
    const [verificado,       setVerificado]        = useState(false)
    const [loadingEnviar,    setLoadingEnviar]     = useState(false)
    const [loadingVerificar, setLoadingVerificar]  = useState(false)
    const [success,          setSuccess]           = useState(false)
    const [apiError,         setApiError]          = useState<string | null>(null)

    const correoChanged = correoVal !== (user?.correo ?? '')

    function resetEditState() {
        setCorreoError(undefined)
        setCodigoEnviado(false)
        setCodigo('')
        setCodigoError(undefined)
        setVerificado(false)
        setApiError(null)
    }

    function handleEdit() {
        setCorreoVal(user?.correo ?? '')
        resetEditState()
        setSuccess(false)
        setEditing(true)
    }

    function handleCancel() {
        if (loadingEnviar || loadingVerificar) return
        setEditing(false)
        resetEditState()
    }

    function handleCorreoChange(val: string) {
        setCorreoVal(val.toLowerCase())
        resetEditState()
    }

    async function handleEnviarCodigo() {
        setApiError(null)
        const normalized = correoVal.trim().toLowerCase()
        const r = correoSchema.safeParse(normalized)
        if (!r.success) { setCorreoError(r.error.issues[0].message); return }
        if (normalized === user?.correo) { setCorreoError('El correo es igual al actual'); return }
        setLoadingEnviar(true)
        try {
            await verificarCorreo({ correo_nuevo: normalized })
            setCodigoEnviado(true)
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } }
            setApiError(e.response?.data?.message ?? 'Error al enviar el código')
        } finally {
            setLoadingEnviar(false)
        }
    }

    async function handleVerificarCodigo() {
        setApiError(null)
        const r = codigoSchema.safeParse(codigo)
        if (!r.success) { setCodigoError(r.error.issues[0].message); return }
        setLoadingVerificar(true)
        try {
            await confirmarCorreo({ correo_nuevo: correoVal, codigo })
            if (user) setUser({ ...user, correo: correoVal })
            setSuccess(true)
            setEditing(false)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } }
            setApiError(e.response?.data?.message ?? 'Código incorrecto o expirado')
        } finally {
            setLoadingVerificar(false)
        }
    }

    return (
        <EditableField
            icon={Mail}
            label="Correo"
            value={user?.correo}
            editing={editing}
            onStartEdit={handleEdit}
            onCancel={handleCancel}
            success={success}
            successText="Correo actualizado"
            editClassName="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white"
        >
            <div className="px-4 py-3 bg-white flex flex-col gap-2">
                <div className="relative">
                    <input
                        type="email"
                        value={correoVal}
                        maxLength={50}
                        autoFocus
                        disabled={codigoEnviado}
                        placeholder="nuevo@correo.com"
                        aria-invalid={!!correoError}
                        onKeyDown={e => { if (e.key === 'Enter' && !codigoEnviado) handleEnviarCodigo(); if (e.key === 'Escape') handleCancel() }}
                        onChange={e => handleCorreoChange(e.target.value)}
                        className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition-all text-slate-700
                            ${codigoEnviado ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-100' :
                            correoError ? 'border-red-300 focus:ring-1 focus:ring-red-300 bg-red-50/30' :
                            verificado ? 'border-emerald-300 bg-emerald-50/20 pr-8' :
                            'border-slate-200 focus:ring-1 focus:ring-[#1e2a5e]/30 focus:border-[#1e2a5e]/40 bg-white'}`}
                    />
                    {verificado && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <CheckCircle size={15} className="text-emerald-500" />
                        </div>
                    )}
                </div>
                {correoError && (
                    <p className="text-red-500 text-[11px] flex items-center gap-1" role="alert">
                        <AlertCircle size={11} /> {correoError}
                    </p>
                )}
                {correoChanged && !codigoEnviado && !verificado && (
                    <button
                        type="button"
                        onClick={handleEnviarCodigo}
                        disabled={loadingEnviar}
                        className="flex items-center gap-1.5 text-[#1e2a5e] font-semibold text-xs py-1 hover:underline transition-all disabled:opacity-40 self-start"
                    >
                        {loadingEnviar ? <Loader2 size={12} className="animate-spin" /> : <ArrowRight size={12} />}
                        {loadingEnviar ? 'Enviando...' : 'Enviar código de verificación'}
                    </button>
                )}
            </div>

            <AnimatePresence>
                {codigoEnviado && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/60 flex flex-col gap-2">
                            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                <KeyRound size={11} className="text-[#1e2a5e]" />
                                Código enviado a <span className="font-semibold text-slate-600 break-all">{correoVal}</span>
                            </p>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={codigo}
                                maxLength={6}
                                autoFocus
                                placeholder="000000"
                                aria-invalid={!!codigoError}
                                onKeyDown={e => { if (e.key === 'Enter') handleVerificarCodigo() }}
                                onChange={e => { setCodigo(e.target.value.replace(/\D/g, '')); setCodigoError(undefined) }}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 outline-none focus:ring-1 focus:ring-[#1e2a5e]/30 tracking-[0.3em] font-mono text-slate-700 bg-white"
                            />
                            {codigoError && (
                                <p className="text-red-500 text-[11px] flex items-center gap-1" role="alert">
                                    <AlertCircle size={11} /> {codigoError}
                                </p>
                            )}
                            <button
                                type="button"
                                onClick={handleVerificarCodigo}
                                disabled={loadingVerificar || codigo.length !== 6}
                                className="flex items-center justify-center gap-1.5 bg-[#1e2a5e] hover:bg-[#27496e] text-white font-semibold py-2 rounded-lg text-xs transition-colors disabled:opacity-40"
                            >
                                {loadingVerificar ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                                {loadingVerificar ? 'Verificando...' : 'Confirmar código'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {apiError && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        role="alert"
                        className="border-t border-red-100 px-4 py-2.5 bg-red-50 flex items-center gap-2"
                    >
                        <AlertCircle size={12} className="text-red-400 shrink-0" />
                        <p className="text-[11px] text-red-600">{apiError}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </EditableField>
    )
}
