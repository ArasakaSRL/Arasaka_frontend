import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { resendVerificationEmail } from '@/features/auth/api/auth';
import { AxiosError } from 'axios';

export default function VerificacionPendiente() {
    const [loading, setLoading] = useState(false)
    const [enviado, setEnviado] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleReenviar() {
        setLoading(true)
        setError(null)
        try {
            await resendVerificationEmail()
            setEnviado(true)
        } catch (err: unknown) {
            const e = err as AxiosError<{ message?: string }>
            setError(e?.response?.data?.message ?? 'Error al reenviar el correo')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-sm w-full border border-gray-100">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-[#1e2a5e]" />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">Verifica tu correo</h2>
                <p className="text-gray-500 text-sm mb-6">
                    Te enviamos un enlace de verificación. Revisa tu bandeja de entrada y haz clic en el enlace.
                </p>

                {enviado && (
                    <div className="flex items-center gap-2 justify-center text-green-600 text-sm mb-4">
                        <CheckCircle size={16} />
                        Correo reenviado correctamente
                    </div>
                )}

                {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

                <button
                    onClick={handleReenviar}
                    disabled={loading || enviado}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-[#1e2a5e] hover:bg-[#151d41] transition-colors disabled:opacity-60"
                >
                    {loading ? 'Enviando...' : enviado ? 'Correo enviado ✓' : 'Reenviar correo de verificación'}
                </button>
            </div>
        </div>
    )
}
