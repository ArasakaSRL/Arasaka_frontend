import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { ArrowLeft, Mail } from 'lucide-react';
import { AuthInput } from '@/features/auth/components/auth/AuthInput';
import { AuthButton } from '@/features/auth/components/auth/AuthButton';
import { registerRequest, getUsuario, resendVerificationEmail, firebaseAuthRequest } from '@/features/auth/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { signInWithProvider } from '@/firebase/firebaseAuth';
import { googleProvider, githubProvider, facebookProvider } from '@/firebase/config';
import type { AuthProvider } from 'firebase/auth';
import LoginBackground from '@/components/LoginBackground';

const registerSchema = z.object({
    nombre: z.string().trim().min(3, 'El nombre es requerido').max(40, 'Máximo 40 caracteres').regex(/^[A-Za-z\s]+$/, 'Solo letras y espacios'),
    apellido: z.string().trim().min(6, 'El apellido es requerido').max(40, 'Máximo 40 caracteres').regex(/^[A-Za-z\s]+$/, 'Solo letras y espacios'),
    correo: z.string().trim().min(15, 'Mínimo 15 caracteres').max(50, 'Máximo 50 caracteres').email('Ingresa un formato de correo válido'),
    password: z.string().min(12, 'La contraseña debe tener 12 caracteres').max(12, 'Máximo 12 caracteres').regex(/[A-Z]/, 'Debe contener al menos una mayúscula').regex(/[a-z]/, 'Debe contener al menos una minúscula').regex(/[0-9]/, 'Debe contener al menos un número').regex(/[^A-Za-z0-9]/, 'Debe contener un carácter especial'),
    password_confirmation: z.string(),

}).refine(data => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation']
});

type FieldErrors = Partial<Record<'nombre' | 'apellido' | 'correo' | 'password' | 'password_confirmation' | 'portafolio_nombre' | 'portafolio_visibilidad', string>>;

export default function Register() {
    const nombreRef = useRef<HTMLInputElement>(null);
    const apellidoRef = useRef<HTMLInputElement>(null);
    const correoRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    const setUser = useAuthStore(s => s.setUser);

    const [isRegistered, setIsRegistered] = useState(false); // Nuevo estado
    const [resendLoading, setResendLoading] = useState(false);
    const [resendStatus, setResendStatus] = useState<string | null>(null);

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');

    const [errors, setErrors] = useState<FieldErrors>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [socialLoading, setSocialLoading] = useState<string | null>(null);

    const isFilled = nombre.length > 0
        && apellido.length > 0
        && correo.length > 0
        && password.length > 0
        && password_confirmation.length > 0;

    // Función para manejar el inicio de sesión con proveedores sociales
    async function handleSocialLogin(provider: AuthProvider, name: string) {
        setSocialLoading(name);
        setApiError(null);
        try {
            const { id_token, correo, provider: providerName } = await signInWithProvider(provider);
            await firebaseAuthRequest(id_token, correo, providerName);
            const user = await getUsuario();
            if (user) setUser(user);
            navigate('/Dashboard/perfilPersonal/PerfilPersonal');
        } catch (err: unknown) {
            const axiosError = err as AxiosError<{ message?: string }>;
            const firebaseError = err as { code?: string; message?: string };

            if (axiosError?.response?.data?.message) {
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

    /**
     * handleRegister: manejador del evento de registro.
     * Un "handler" es una función que se ejecuta en respuesta a una acción del usuario,
     * en este caso al hacer clic en "Crear cuenta".
     * Flujo:
     * 1. Limpia errores previos
     * 2. Valida los campos con zod antes de tocar la API
     * 3. Si la validación falla, muestra errores por campo y detiene la ejecución
     * 4. Si pasa, llama a registerRequest() que hace POST /registrar al backend
     * 5. Si el backend responde bien, redirige al Dashboard
     * 6. Si el backend responde con error, muestra el mensaje de error
     * 7. finally siempre desactiva el loading, haya error o no
     */
    async function handleRegister() {
        setApiError(null);
        const result = registerSchema.safeParse({
            nombre, apellido, correo, password, password_confirmation,
        });

        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            let firstErrorKey: string | null = null;
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof FieldErrors;
                if (!fieldErrors[key]) fieldErrors[key] = issue.message;
                if (!firstErrorKey) firstErrorKey = key;
            }
            setErrors(fieldErrors);
            if (firstErrorKey === 'nombre') nombreRef.current?.focus();
            else if (firstErrorKey === 'apellido') apellidoRef.current?.focus();
            else if (firstErrorKey === 'correo') correoRef.current?.focus();
            else if (firstErrorKey === 'password') passwordRef.current?.focus();
            return;
        }

        setErrors({});
        setLoading(true);
        try {
            await registerRequest({
                nombre, apellido, correo, password, password_confirmation,
            });

            const user = await getUsuario();
            if (user) setUser(user)
            setIsRegistered(true); // Marca como registrado para mostrar mensaje de verificación

        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            setApiError(error?.response?.data?.message ?? 'Error al crear la cuenta');
        } finally {
            setLoading(false);
        }
    }

    // Función para el botón de "Reenviar correo"
    async function handleResendEmail() {
        setResendLoading(true);
        setResendStatus(null);
        try {
            await resendVerificationEmail();
            setResendStatus('¡Enlace enviado! Revisa tu bandeja de entrada.');
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            setResendStatus(error?.response?.data?.message ?? 'Error al reenviar. Intenta más tarde.');
        } finally {
            setResendLoading(false);
        }
    }

    // Manejadores de cambio para validar en tiempo real
    const handleNombreChange = (val: string) => { setNombre(val.replace(/[^A-Za-z\s]/g, '').slice(0, 40)); setErrors(prev => ({ ...prev, nombre: undefined })); };
    const handleApellidoChange = (val: string) => { setApellido(val.replace(/[^A-Za-z\s]/g, '').slice(0, 40)); setErrors(prev => ({ ...prev, apellido: undefined })); };
    const handleCorreoChange = (val: string) => { setCorreo(val.trimStart().slice(0, 50)); setErrors(prev => ({ ...prev, correo: undefined })); };
    const handlePasswordChange = (val: string) => { if (val.length <= 12) { setPassword(val); setErrors(prev => ({ ...prev, password: undefined })); } };

    // VISTA DE VERIFICACIÓN (Se muestra solo tras el registro exitoso)
    if (isRegistered) {
        return (
            <div className="flex flex-col items-center bg-gray-50 min-h-screen pt-10 sm:pt-0 sm:justify-center px-1 sm:px-6 lg:px-8">

                <div className="mb-6! bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-10 h-10 text-blue-600 animate-bounce" />
                </div>

                <div className="w-full max-w-full md:max-w-md items-start bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-300 relative">

                    <div className="absolute z-0 inset-0 bg-linear-to-r from-blue-400/40 to-transparent pointer-events-none" />

                    <div className="relative z-20 p-6 flex flex-col">

                        <h2 className="text-2xl font-bold text-black mb-2!">¡Casi listo, {nombre}!</h2>
                        <p className="text-gray-600 mb-4!">
                            Hemos enviado un enlace de verificación a <span className="font-bold text-black">{correo}</span>.
                            Es necesario verificar tu cuenta para acceder a todas las funciones.
                        </p>

                        <AuthButton
                            text={resendLoading ? 'Enviando...' : 'Reenviar correo de verificación'}
                            onClick={handleResendEmail}
                            disabled={resendLoading}
                        />
                        {resendStatus && <p className="text-sm! text-blue-600 pt-2 font-medium">{resendStatus}</p>}

                        <button
                            onClick={() => navigate('/auth/Login')}
                            className="text-sm text-gray-500 pt-4 hover:text-black transition-colors underline"
                        >
                            Redirigir al inicio de sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-1 py-12 md:py-8">
            <LoginBackground />
            <Link to="/" className="absolute top-10 left-10 text-gray-600 text-sm flex items-center gap-2 hover:text-black no-underline">
                <ArrowLeft size={16} /> Volver al inicio
            </Link>

            <div className="flex items-center gap-2 z-10 relative">
                <img
                    src="https://res.cloudinary.com/dcyx3nqj5/image/upload/v1775541507/WhatsApp_Image_2026-04-07_at_1.53.52_AM-removebg-preview_dxvzgv.png"
                    alt="Arasaka logo"
                    className="h-22 w-auto object-contain"
                />
            </div>

            <div className="w-full max-w-lg bg-white rounded-4xl shadow-2xl overflow-hidden border border-gray-300 relative z-10">
                <div className="absolute inset-0 bg-linear-to-r from-blue-400/40 to-transparent pointer-events-none" />

                <form
                    onSubmit={(e) => { e.preventDefault(); handleRegister(); }}
                    className="relative z-20 p-4 flex flex-col"
                >
                    <p className="text-[22px] text-black font-bold">Crear Cuenta</p>
                    <p className="text-gray-500! text-sm mb-4! font-normal text-center">Crea tu portafolio digital de proyectos de software</p>
                    <p className="text-xs text-gray-500! mb-2! text-left w-full">Los campos marcados con <span className="text-red-500">*</span> son obligatorios</p>

                    <AuthInput ref={nombreRef} label="Nombre" placeholder="Tu nombre" type="text" value={nombre} onChange={handleNombreChange} error={errors.nombre} maxLength={40} required />
                    <AuthInput ref={apellidoRef} label="Apellido" placeholder="Tu apellido" type="text" value={apellido} onChange={handleApellidoChange} error={errors.apellido} maxLength={40} required />
                    <AuthInput ref={correoRef} label="Correo" placeholder="tu@correo.com" type="email" value={correo} onChange={handleCorreoChange} error={errors.correo} maxLength={50} required />
                    <AuthInput ref={passwordRef} label="Contraseña" placeholder="Tu contraseña" type="password" value={password} onChange={handlePasswordChange} error={errors.password} maxLength={12} required />
                    <AuthInput label="Confirmar Contraseña" placeholder="Repite tu contraseña" type="password" value={password_confirmation} onChange={setPasswordConfirmation} error={errors.password_confirmation} required />


                    {apiError && <p className="text-red-500 text-xs w-full text-center my-4">{apiError}</p>}

                    <div className="w-full mt-2">
                        <AuthButton
                            type="submit"
                            text={loading ? 'Creando cuenta...' : 'Crear cuenta'}
                            disabled={loading || !isFilled}
                        />

                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400">o continúa con</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => handleSocialLogin(googleProvider, 'google')} disabled={!!socialLoading}
                                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
                                {socialLoading === 'google' ? '...' : <><svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>Google</>}
                            </button>
                            <button type="button" onClick={() => handleSocialLogin(githubProvider, 'github')} disabled={!!socialLoading}
                                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
                                {socialLoading === 'github' ? '...' : <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" /></svg>GitHub</>}
                            </button>
                            {/*   <button type="button" onClick={() => handleSocialLogin(facebookProvider, 'facebook')} disabled={!!socialLoading}
                                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
                                {socialLoading === 'facebook' ? '...' : <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>Facebook</>}
                            </button>*/}
                        </div>
                    </div>

                    <p className="mt-6! text-sm text-gray-600 font-medium">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/auth/Login" className="font-bold text-blue-800 hover:text-blue-900">Inicia sesión</Link>
                    </p>
                </form>
            </div>

            <footer className="mt-8 z-10 relative">
                <p className="text-gray-600! text-sm font-normal">Sistema Generador de Portafolios Digitales</p>
            </footer>
        </div>
    );
}
