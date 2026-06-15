import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { verificarCodigoRegistro, reenviarCodigoRegistro, getUsuario } from '@/features/auth/api/auth';
import { useAuthStore, resolverPortafolioDesdeArray } from '@/stores/authStore';
import { ARASAKA_LOGO_URL } from '@/features/auth/utils/authBranding';
import { AuthButton } from '@/features/auth/components/auth/AuthButton';

const EXPIRACION_SEG = 5 * 60;

export default function VerificarCodigo() {
    const location = useLocation();
    const navigate = useNavigate();
    const correo: string = (location.state as { correo?: string })?.correo ?? '';

    const setUser = useAuthStore(s => s.setUser);
    const setPortafolio = useAuthStore(s => s.setPortafolio);

    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    const [segundos, setSegundos] = useState(EXPIRACION_SEG);
    const [loading, setLoading] = useState(false);
    const [reenvioLoading, setReenvioLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState(false);

    useEffect(() => {
        if (!correo) navigate('/auth/Register', { replace: true });
    }, [correo, navigate]);

    useEffect(() => {
        if (segundos <= 0) return;
        const t = setTimeout(() => setSegundos(s => s - 1), 1000);
        return () => clearTimeout(t);
    }, [segundos]);

    const minutosStr = String(Math.floor(segundos / 60)).padStart(2, '0');
    const segsStr = String(segundos % 60).padStart(2, '0');

    function handleDigit(index: number, value: string) {
        const char = value.replace(/\D/g, '').slice(-1);
        const next = [...digits];
        next[index] = char;
        setDigits(next);
        if (char && index < 5) inputs.current[index + 1]?.focus();
    }

    function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    }

    function handlePaste(e: React.ClipboardEvent) {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;
        const next = [...digits];
        for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
        setDigits(next);
        inputs.current[Math.min(pasted.length, 5)]?.focus();
        e.preventDefault();
    }

    async function handleVerificar() {
        const codigo = digits.join('');
        if (codigo.length < 6) { setError('Ingresa el código completo de 6 dígitos.'); return; }
        setError(null);
        setLoading(true);
        try {
            await verificarCodigoRegistro(correo, codigo);
            const user = await getUsuario();
            if (user) {
                setUser(user);
                setPortafolio(resolverPortafolioDesdeArray(user.portafolios ?? []));
            }
            setExito(true);
            sessionStorage.removeItem('tour_iniciado');
            setTimeout(() => navigate('/Dashboard/perfil/General', { replace: true }), 1500);
        } catch (err: unknown) {
            const e = err as AxiosError<{ message?: string }>;
            setError(e?.response?.data?.message ?? 'Código incorrecto o expirado.');
        } finally {
            setLoading(false);
        }
    }

    async function handleReenviar() {
        setReenvioLoading(true);
        setError(null);
        try {
            await reenviarCodigoRegistro(correo);
            setSegundos(EXPIRACION_SEG);
            setDigits(['', '', '', '', '', '']);
            inputs.current[0]?.focus();
        } catch (err: unknown) {
            const e = err as import('axios').AxiosError<{ message?: string }>;
            setError(e?.response?.data?.message ?? 'No se pudo reenviar el código.');
        } finally {
            setReenvioLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-1 py-12 md:py-8">

            <Link to="/auth/Register" className="absolute top-10 left-10 text-gray-600 text-sm flex items-center gap-2 hover:text-black no-underline">
                <ArrowLeft size={16} /> Volver al registro
            </Link>

            <div className="flex items-center gap-2 z-10 relative">
                <img src={ARASAKA_LOGO_URL} alt="DevLinked logo" className="h-22 w-auto object-contain" />
            </div>

            <div className="w-full max-w-lg bg-white rounded-4xl shadow-2xl overflow-hidden border border-gray-300 relative z-10">
                <div className="absolute inset-0 bg-linear-to-r from-blue-400/40 to-transparent pointer-events-none" />

                <div className="relative z-20 p-8 flex flex-col items-center gap-5">

                    {/* Ícono superior */}
                    <div className="w-14 h-14 rounded-2xl bg-[#1e2a5e]/10 border border-[#1e2a5e]/20 flex items-center justify-center">
                        <Mail size={26} className="text-[#1e2a5e]" />
                    </div>

                    {/* Título */}
                    <div className="text-center">
                        <p className="text-[22px] text-black font-bold">Verifica tu correo</p>
                        <p className="text-gray-500 text-sm mt-1 font-normal">
                            Ingresa el código de 6 dígitos que enviamos a
                        </p>
                        <p className="text-[#1e2a5e] text-sm font-semibold break-all">{correo}</p>
                    </div>

                    {/* Inputs de código */}
                    <div className="flex gap-3 mt-1" onPaste={handlePaste}>
                        {digits.map((d, i) => (
                            <input
                                key={i}
                                ref={el => { inputs.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={d}
                                onChange={e => handleDigit(i, e.target.value)}
                                onKeyDown={e => handleKeyDown(i, e)}
                                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-[#1e2a5e] focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                            />
                        ))}
                    </div>

                    {/* Countdown */}
                    {segundos > 0 ? (
                        <p className="text-sm text-gray-500">
                            El código expira en{' '}
                            <span className="font-semibold text-[#1e2a5e]">{minutosStr}:{segsStr}</span>
                        </p>
                    ) : (
                        <p className="text-sm text-red-500 font-semibold">El código ha expirado.</p>
                    )}

                    {/* Mensajes de error / éxito */}
                    {error && (
                        <div className="w-full flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl px-3 py-2 text-xs">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                    {exito && (
                        <div className="w-full flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl px-3 py-2 text-xs">
                            <CheckCircle size={14} className="shrink-0" />
                            <span>¡Verificado! Redirigiendo a tu panel...</span>
                        </div>
                    )}

                    {/* Botón verificar */}
                    <div className="w-full">
                        <AuthButton
                            type="button"
                            text={loading ? 'Verificando...' : 'Verificar'}
                            disabled={loading || digits.join('').length < 6 || segundos <= 0}
                            onClick={handleVerificar}
                        />
                    </div>

                    {/* Reenviar */}
                    <button
                        type="button"
                        onClick={handleReenviar}
                        disabled={reenvioLoading}
                        className="flex items-center gap-1.5 text-sm text-[#1e2a5e] font-semibold hover:underline disabled:opacity-50"
                    >
                        {reenvioLoading
                            ? <><Loader2 size={13} className="animate-spin" /> Reenviando...</>
                            : 'Reenviar código'}
                    </button>

                </div>
            </div>

            <footer className="mt-8 z-10 relative">
                <p className="text-gray-600 text-sm font-normal">Sistema Generador de Portafolios Digitales</p>
            </footer>
        </div>
    );
}
