import { useState } from 'react'
import { Mail, Pencil, X, Loader2, CheckCircle, AlertCircle, ArrowRight, KeyRound } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { useAuthStore } from '@/stores/authStore'
import { verificarCorreo, confirmarCorreo } from '@/features/auth/api/auth'

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

    function handleEdit() {
        setCorreoVal(user?.correo ?? '')
        setCorreoError(undefined)
        setCodigoEnviado(false)
        setCodigo('')
        setCodigoError(undefined)
        setVerificado(false)
        setApiError(null)
        setSuccess(false)
        setEditing(true)
    }

    function handleCancel() {
        setEditing(false)
        setCorreoError(undefined)
        setCodigoEnviado(false)
        setCodigo('')
        setCodigoError(undefined)
        setVerificado(false)
        setApiError(null)
    }

    function handleCorreoChange(val: string) {
        setCorreoVal(val)
        setCorreoError(undefined)
        setCodigoEnviado(false)
        setCodigo('')
        setCodigoError(undefined)
        setVerificado(false)
        setApiError(null)
    }

    async function handleEnviarCodigo() {
        setApiError(null)
        const r = correoSchema.safeParse(correoVal)
        if (!r.success) { setCorreoError(r.error.issues[0].message); return }
        if (correoVal === user?.correo) { setCorreoError('El correo es igual al actual'); return }
        setLoadingEnviar(true)
        try {
            await verificarCorreo({ correo_nuevo: correoVal })
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
        <div className="flex flex-col gap-2">
            <AnimatePresence mode="wait">
                {!editing ? (
                    <motion.div key="view"
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
                        className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-1 md:px-4 py-3"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                            <Mail size={20} className="text-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Correo</p>
                            <p className="text-sm text-slate-700 font-medium break-all">{user?.correo || '—'}</p>
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
                        className="flex flex-col gap-0 border border-slate-200 rounded-xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
                            <span className="text-[12px]! font-semibold text-slate-500 flex items-center gap-1.5">
                                <Mail size={16} className="text-slate-400" /> Correo
                            </span>
                            <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="px-4 py-3 bg-white flex flex-col gap-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={correoVal}
                                    maxLength={50}
                                    autoFocus
                                    disabled={codigoEnviado}
                                    placeholder="nuevo@correo.com"
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
                                <p className="text-red-500 text-[11px] flex items-center gap-1">
                                    <AlertCircle size={11} /> {correoError}
                                </p>
                            )}
                            {correoChanged && !codigoEnviado && !verificado && (
                                <button
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
                                            value={codigo}
                                            maxLength={6}
                                            autoFocus
                                            placeholder="000000"
                                            onChange={e => { setCodigo(e.target.value.replace(/\D/g, '')); setCodigoError(undefined) }}
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 outline-none focus:ring-1 focus:ring-[#1e2a5e]/30 tracking-[0.3em] font-mono text-slate-700 bg-white"
                                        />
                                        {codigoError && (
                                            <p className="text-red-500 text-[11px] flex items-center gap-1">
                                                <AlertCircle size={11} /> {codigoError}
                                            </p>
                                        )}
                                        <button
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
                                    className="border-t border-red-100 px-4 py-2.5 bg-red-50 flex items-center gap-2"
                                >
                                    <AlertCircle size={12} className="text-red-400 shrink-0" />
                                    <p className="text-[11px] text-red-600">{apiError}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
                        <p className="text-xs font-medium">Correo actualizado</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
