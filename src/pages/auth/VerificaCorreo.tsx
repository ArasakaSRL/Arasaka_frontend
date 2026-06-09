import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react'
import { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { resendVerificationEmail, getUsuario } from '@/features/auth/api/auth'
import { ARASAKA_LOGO_URL } from '@/features/auth/utils/authBranding'

const RESEND_COOLDOWN_SECONDS = 60
const POLL_INTERVAL_MS = 5000

export default function VerificaCorreo() {
    const navigate = useNavigate()
    const user = useAuthStore(s => s.user)
    const setUser = useAuthStore(s => s.setUser)

    const verificado = !!user?.verificacion_email

    const [cooldown, setCooldown] = useState(0)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!user) navigate('/auth/Login', { replace: true })
    }, [user, navigate])

    useEffect(() => {
        if (cooldown <= 0) return
        const id = window.setTimeout(() => setCooldown(c => c - 1), 1000)
        return () => window.clearTimeout(id)
    }, [cooldown])

    useEffect(() => {
        console.log('[VerificaCorreo] polling effect run. verificado=', verificado)
        if (verificado) {
            console.log('[VerificaCorreo] ya verificado, NO se inicia polling')
            return
        }
        console.log('[VerificaCorreo] iniciando interval cada', POLL_INTERVAL_MS, 'ms')
        const id = window.setInterval(async () => {
            console.log('[VerificaCorreo] tick — llamando getUsuario()')
            try {
                const updated = await getUsuario()
                console.log('[VerificaCorreo] respuesta getUsuario:', updated)
                console.log('[VerificaCorreo] verificacion_email =', updated?.verificacion_email)
                if (updated) setUser(updated)
            } catch (err) {
                console.warn('[VerificaCorreo] error en getUsuario:', err)
            }
        }, POLL_INTERVAL_MS)
        return () => {
            console.log('[VerificaCorreo] limpiando interval', id)
            window.clearInterval(id)
        }
    }, [verificado, setUser])

    useEffect(() => {
        if (!verificado) return
        console.log('[VerificaCorreo] verificado=true → intentando window.close() en 600ms')
        const id = window.setTimeout(() => {
            console.log('[VerificaCorreo] ejecutando window.close()')
            window.close()
        }, 600)
        return () => window.clearTimeout(id)
    }, [verificado])

    async function handleResend() {
        setError(null)
        setSuccess(null)
        setLoading(true)
        try {
            await resendVerificationEmail()
            setSuccess('Te enviamos un nuevo correo. Revisa tu bandeja de entrada.')
            setCooldown(RESEND_COOLDOWN_SECONDS)
        } catch (err: unknown) {
            const e = err as AxiosError<{ message?: string }>
            setError(e.response?.data?.message ?? 'No se pudo reenviar el correo')
        } finally {
            setLoading(false)
        }
    }

    async function handleCheckNow() {
        setError(null)
        setLoading(true)
        try {
            const updated = await getUsuario()
            if (updated) setUser(updated)
            if (!updated?.verificacion_email) {
                setError('Aún no detectamos la verificación. Asegúrate de hacer clic en el enlace del correo.')
            }
        } catch {
            setError('No se pudo comprobar el estado')
        } finally {
            setLoading(false)
        }
    }

    function handleCerrar() {
        window.close()
        navigate('/', { replace: true })
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-12">
            <Link to="/" className="absolute top-10 left-10 text-gray-600 text-sm flex items-center gap-2 hover:text-black no-underline">
                <ArrowLeft size={16} /> Volver al inicio
            </Link>

            <div className="flex items-center gap-2 z-10 relative">
                <img src={ARASAKA_LOGO_URL} alt="Arasaka logo" className="h-22 w-auto object-contain" />
            </div>

            <div className="w-full max-w-md bg-white rounded-4xl shadow-2xl overflow-hidden border border-gray-300 relative z-10">
                <div className="absolute inset-0 bg-linear-to-r from-blue-400/40 to-transparent pointer-events-none" />

                {verificado ? (
                    <div className="relative z-20 p-6 flex flex-col items-center text-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                            <CheckCircle size={28} className="text-emerald-600" />
                        </div>

                        <div>
                            <p className="text-[20px] text-black font-bold">¡Correo verificado!</p>
                            <p className="text-gray-500! text-sm mt-1!">
                                Tu cuenta ya está activa. Continúa desde la pestaña donde abriste el enlace del correo.
                            </p>
                        </div>

                        <p className="text-xs text-gray-500! text-center leading-relaxed">
                            Puedes cerrar esta pestaña con seguridad.
                        </p>

                        <div className="w-full flex flex-col gap-2 mt-2">
                            <button
                                type="button"
                                onClick={handleCerrar}
                                className="w-full flex items-center justify-center gap-2 bg-[#1e2a5e] hover:bg-[#27496e] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                            >
                                <X size={14} /> Cerrar pestaña
                            </button>
                            <Link
                                to="/"
                                className="w-full text-[#1e2a5e] hover:underline text-sm font-semibold py-2 text-center"
                            >
                                Ir al inicio
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-20 p-6 flex flex-col items-center text-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#1e2a5e]/10 border border-[#1e2a5e]/20 flex items-center justify-center">
                            <Mail size={28} className="text-[#1e2a5e]" />
                        </div>

                        <div>
                            <p className="text-[20px] text-black font-bold">Verifica tu correo</p>
                            <p className="text-gray-500! text-sm mt-1!">
                                Te enviamos un enlace de verificación a{' '}
                                <span className="font-semibold text-slate-700 break-all">{user?.correo ?? ''}</span>
                            </p>
                        </div>

                        <p className="text-xs text-gray-500! text-center leading-relaxed">
                            Haz clic en el enlace del correo para activar tu cuenta. Al abrirlo se abrirá una nueva pestaña con tu Dashboard. Esta pestaña te avisará automáticamente cuando detecte la verificación.
                        </p>

                        {success && (
                            <div className="w-full flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl px-3 py-2 text-xs" role="status" aria-live="polite">
                                <CheckCircle size={14} className="shrink-0" />
                                <span>{success}</span>
                            </div>
                        )}

                        {error && (
                            <div className="w-full flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl px-3 py-2 text-xs" role="alert">
                                <AlertCircle size={14} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="w-full flex flex-col gap-2 mt-2">
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={loading || cooldown > 0}
                                className="w-full flex items-center justify-center gap-2 bg-[#1e2a5e] hover:bg-[#27496e] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? <Loader2 size={14} className="animate-spin" />
                                    : cooldown > 0
                                        ? `Reenviar en ${cooldown}s`
                                        : 'Reenviar correo de verificación'}
                            </button>

                            <button
                                type="button"
                                onClick={handleCheckNow}
                                disabled={loading}
                                className="w-full text-[#1e2a5e] hover:underline text-sm font-semibold py-2"
                            >
                                Comprobar ahora
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <footer className="mt-8 z-10 relative">
                <p className="text-gray-600! text-sm font-normal">Sistema Generador de Portafolios Digitales</p>
            </footer>
        </div>
    )
}
