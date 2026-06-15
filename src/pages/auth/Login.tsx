import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';
import { AuthInput } from '@/features/auth/components/auth/AuthInput';
import { AuthButton } from '@/features/auth/components/auth/AuthButton';
import SocialAuthButtons from '@/features/auth/components/auth/SocialAuthButtons';
import { loginRequest, getUsuario, sendPasswordResetEmail, firebaseAuthRequest } from '@/features/auth/api/auth';
import { useAuthStore, resolverPortafolioDesdeArray } from '@/stores/authStore';
import { signInWithProvider } from '@/firebase/firebaseAuth';
import { PASSWORD_MAX } from '@/features/auth/utils/passwordRules';
import { ARASAKA_LOGO_URL } from '@/features/auth/utils/authBranding';
import type { AuthProvider } from 'firebase/auth';
import CuentaSuspendidaModal from '@/components/ui/CuentaSuspendidaModal';

const passwordField = z.string().min(1, 'La contraseña es requerida').max(PASSWORD_MAX, `Máximo ${PASSWORD_MAX} caracteres`)

const loginSchema = z.object({
    correo: z.string().trim().max(50, 'El correo es demasiado largo').email('Ingresa un formato de correo válido'),
    password: passwordField,
});

const usernameSchema = z.object({
    username: z.string().trim().min(3, 'El usuario debe tener al menos 3 caracteres').max(30, 'Máximo 30 caracteres'),
    password: passwordField,
});

type FieldErrors = Partial<Record<'correo' | 'username' | 'password', string>>;

export default function Login() {

    // Referencias para el foco (Criterio: Posicionar foco en primer error)
    const correoRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);

    //estados para recuperar contraseña
    const [resetLoading, setResetLoading] = useState(false);
    const [resetMessage, setResetMessage] = useState<string | null>(null);

    const navigate = useNavigate();
    const setUser = useAuthStore(s => s.setUser);
    const setPortafolio = useAuthStore(s => s.setPortafolio);
    const [correo, setCorreo] = useState('');
    const [username, setUsername] = useState('');
    const [loginMode, setLoginMode] = useState<'correo' | 'username'>('correo');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<FieldErrors>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [suspendidoHasta, setSuspendidoHasta] = useState<string | null>(null);

    const isFilled = loginMode === 'correo'
        ? correo.length > 0 && password.length > 0
        : username.length > 0 && password.length > 0

    const [socialLoading, setSocialLoading] = useState<string | null>(null);

    //funcion para iniciar sesion con google, github o facebook
    async function handleSocialLogin(provider: AuthProvider, name: string) {
        setSocialLoading(name);
        setApiError(null);
        try {
            const { id_token, correo, provider: providerName } = await signInWithProvider(provider);
            await firebaseAuthRequest(id_token, correo, providerName);
            const user = await getUsuario();
            if (user) {
                setUser(user);
                setPortafolio(resolverPortafolioDesdeArray(user.portafolios ?? []));
            }
            sessionStorage.removeItem('tour_iniciado');
            navigate('/Dashboard/perfil/General');
        } catch (err: unknown) {
            const axiosError = err as AxiosError<{ message?: string; suspended?: boolean; suspendido_hasta?: string }>;
            const firebaseError = err as { code?: string; message?: string };

            if (axiosError?.response?.status === 403 && axiosError.response.data?.suspended) {
                setSuspendidoHasta(axiosError.response.data.suspendido_hasta ?? null);
                return;
            } else if (axiosError?.response?.data?.message) {
                setApiError(axiosError.response.data.message);
            } else if (firebaseError.code?.startsWith('auth/')) {
                setApiError('Error al iniciar sesión con el proveedor');
            } else if (firebaseError.message) {
                setApiError(firebaseError.message);
            } else {
                setApiError('Error al iniciar sesión');
            }
        } finally {
            setSocialLoading(null);
        }
    }

    //funcion para recueperar contraseña
    async function handleForgotPassword() {
        setApiError(null);
        if (!correo) {
            setErrors({ correo: 'Ingresa tu correo para recuperar la contraseña' });
            correoRef.current?.focus();
            return;
        }

        setResetLoading(true);
        try {
            const response = await sendPasswordResetEmail(correo);
            setResetMessage(response.message || '¡Enlace enviado! Revisa tu bandeja de entrada.');
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            setApiError(error?.response?.data?.message ?? 'No se pudo enviar el correo');
        } finally {
            setResetLoading(false);
        }
    }

    // Criterio: Limitar caracteres y validar tipos (Input Handling)
    const handleCorreoChange = (val: string) => {
        const limpio = val.trimStart().toLowerCase().slice(0, 50);
        setCorreo(limpio);
    };

    const handlePasswordChange = (val: string) => {
        if (val.length <= PASSWORD_MAX) {
            setPassword(val);
        }
    };

    /**
     * handleLogin: manejador del evento de inicio de sesión.
     * Un "handler" (manejador) es una función que se ejecuta en respuesta
     * a una acción del usuario, en este caso al hacer clic en "Ingresar".
     * Se encarga de: validar los campos, llamar a la API y manejar la respuesta.
     */
    async function handleLogin() {
        setApiError(null);

        const result = loginMode === 'correo'
            ? loginSchema.safeParse({ correo, password })
            : usernameSchema.safeParse({ username, password })

        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            let firstErrorKey: string | null = null;

            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof FieldErrors;
                if (!fieldErrors[key]) fieldErrors[key] = issue.message;
                if (!firstErrorKey) firstErrorKey = key;
            }
            setErrors(fieldErrors);

            if (firstErrorKey === 'correo') correoRef.current?.focus();
            else if (firstErrorKey === 'username') usernameRef.current?.focus();
            else if (firstErrorKey === 'password') passwordRef.current?.focus();
            return;
        }
        setErrors({});
        setLoading(true);
        try {
            const payload = loginMode === 'correo'
                ? { correo, password }
                : { username, password }
            await loginRequest(payload);
            const user = await getUsuario();
            if (user) {
                setUser(user);
                setPortafolio(resolverPortafolioDesdeArray(user.portafolios ?? []));
            }
            sessionStorage.removeItem('tour_iniciado');
            navigate('/Dashboard/perfil/General');
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string; suspended?: boolean; suspendido_hasta?: string; errors?: Record<string, string[]> }>;
            if (error?.response?.status === 403 && error.response.data?.suspended) {
                setSuspendidoHasta(error.response.data.suspendido_hasta ?? null);
                return;
            }
            const raw = error?.response?.data?.message
                ?? Object.values(error?.response?.data?.errors ?? {})?.[0]?.[0]
                ?? 'Credenciales incorrectas';
            setApiError(raw === 'auth.failed' ? 'Credenciales incorrectas' : raw);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-1 relative">
            {suspendidoHasta && (
                <CuentaSuspendidaModal
                    suspendidoHasta={suspendidoHasta}
                    onClose={() => setSuspendidoHasta(null)}
                />
            )}
            
            <Link to="/" className="absolute top-10 left-10 text-gray-600 text-sm flex items-center gap-2 hover:text-black no-underline z-10">
                <ArrowLeft size={16} /> Volver al inicio
            </Link>

            <div className="flex items-center gap-2 z-10 relative">
                <img src={ARASAKA_LOGO_URL} alt="Arasaka logo" className="h-22 w-auto object-contain" />
            </div>

            <div className="w-full max-w-md items-start bg-white rounded-4xl shadow-2xl overflow-hidden border border-gray-300 relative z-10">

                <div className="absolute z-0 inset-0 bg-linear-to-r from-blue-400/40 to-transparent pointer-events-none" />

                <form
                    className="relative z-20 p-4 flex flex-col"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                >
                    <p className="text-black text-[22px] font-bold mb-1">Iniciar Sesión</p>
                    <p className="text-gray-500! font-normal text-[14px] mb-4!">Accede a tu portafolio digital profesional</p>

                    <p className="text-xs text-gray-500! mb-2! text-left w-full">
                        Los campos marcados con <span className="text-red-500">*</span> son obligatorios
                    </p>

                    <div className="flex bg-gray-100 rounded-xl p-1 mb-3">
                        {(['correo', 'username'] as const).map(mode => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => { setLoginMode(mode); setErrors({}) }}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    loginMode === mode
                                        ? 'bg-white text-[#1e2a5e] shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {mode === 'correo' ? 'Correo' : 'Usuario'}
                            </button>
                        ))}
                    </div>

                    {loginMode === 'correo' ? (
                        <AuthInput
                            ref={correoRef}
                            label="Correo"
                            placeholder="tu@correo.com"
                            type="email"
                            value={correo}
                            onChange={handleCorreoChange}
                            error={errors.correo}
                            maxLength={50}
                            required
                        />
                    ) : (
                        <AuthInput
                            ref={usernameRef}
                            label="Usuario"
                            placeholder="tu_usuario"
                            type="text"
                            value={username}
                            onChange={v => setUsername(v.slice(0, 30))}
                            error={errors.username}
                            maxLength={30}
                            required
                        />
                    )}

                    <AuthInput
                        ref={passwordRef}
                        label="Contraseña"
                        placeholder="tu contraseña"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        error={errors.password}
                        maxLength={PASSWORD_MAX}
                        required
                    />

                    <div className="flex justify-end w-full -mt-2 mb-2">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            disabled={resetLoading}
                            className="text-xs font-bold text-blue-800 hover:text-blue-900 disabled:opacity-50"
                        >
                            {resetLoading ? 'Enviando...' : '¿Olvidaste tu contraseña?'}
                        </button>
                    </div>


                    {resetMessage && (
                        <p className="text-green-600! text-xs text-left w-full mb-4 font-medium">
                            {resetMessage}
                        </p>
                    )}

                    {apiError && (
                        <p className="text-red-500! text-xs text-left w-full mb-4">{apiError}</p>
                    )}

                    <div className="w-full mt-2">
                        <AuthButton
                            type="submit"
                            text={loading ? 'Ingresando...' : 'Ingresar'}
                            disabled={!isFilled || loading || resetLoading}
                        />
                    </div>

                    <SocialAuthButtons onLogin={handleSocialLogin} loading={socialLoading} />

                    <p className="mt-4! text-sm text-gray-600 font-medium">
                        ¿No tienes cuenta?{' '}
                        <Link to="/auth/Register" className="font-bold text-blue-800 hover:text-blue-900">
                            Regístrate
                        </Link>
                    </p>
                </form>
            </div>

            <footer className="mt-8 z-10 relative">
                <p className="text-gray-600! text-sm">Sistema Generador de Portafolios Digitales</p>
            </footer>
        </div>
    );
}
