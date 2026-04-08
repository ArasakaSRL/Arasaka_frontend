import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';
import { AuthInput } from '@/features/auth/components/auth/AuthInput';
import { AuthButton } from '@/features/auth/components/auth/AuthButton';
import { loginRequest, getUsuario, sendPasswordResetEmail } from '@/features/auth/api/auth';
import { useAuthStore } from '@/stores/authStore';

const loginSchema = z.object({
    correo: z
        .string()
        .trim()
        .min(15, 'El correo no es valido')
        .max(50, 'El correo es demasiado largo')
        .email('Ingresa un formato de correo válido'),

    password: z
        .string()
        .min(12, 'la contraseña debe tener 12 caracteres')
        .max(12, 'Máximo 12 caracteres permitidos')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[a-z]/, 'Debe contener al menos una minúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número')
        .regex(/[^A-Za-z0-9]/, 'Debe contener un carácter especial'),
});

type FieldErrors = Partial<Record<'correo' | 'password', string>>;

export default function Login() {

    // Referencias para el foco (Criterio: Posicionar foco en primer error)
    const correoRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    //estados para recuperar contraseña
    const [resetLoading, setResetLoading] = useState(false);
    const [resetMessage, setResetMessage] = useState<string | null>(null);

    const navigate = useNavigate();
    const setUser = useAuthStore(s => s.setUser);
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<FieldErrors>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const isFilled = correo.length > 0 && password.length > 0;

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
        const limpio = val.trimStart().slice(0, 50);
        setCorreo(limpio);
    };

    const handlePasswordChange = (val: string) => {
        if (val.length <= 12) {
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
        const result = loginSchema.safeParse({ correo, password });

        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            let firstErrorKey: string | null = null;

            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof FieldErrors;
                if (!fieldErrors[key]) fieldErrors[key] = issue.message;
                if (!firstErrorKey) firstErrorKey = key;
            }
            setErrors(fieldErrors);

            // Criterio: Posiciona el foco del teclado en el primer campo con error
            if (firstErrorKey === 'correo') correoRef.current?.focus();
            else if (firstErrorKey === 'password') passwordRef.current?.focus();

            return;
        }
        setErrors({});
        setLoading(true);
        try {
            await loginRequest({ correo, password });
            const user = await getUsuario();
            if (user) setUser(user)
            navigate('/Dashboard/perfilPersonal/PerfilPersonal');
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
            const raw = error?.response?.data?.message
                ?? Object.values(error?.response?.data?.errors ?? {})?.[0]?.[0]
                ?? 'Credenciales incorrectas';
            setApiError(raw === 'auth.failed' ? 'Credenciales incorrectas' : raw);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-1">
            <Link to="/" className="absolute top-10 left-10 text-gray-600 text-sm flex items-center gap-2 hover:text-black no-underline">
                <ArrowLeft size={16} /> Volver al inicio
            </Link>

            <div className="flex items-center gap-2">
                <img
                    src="https://res.cloudinary.com/dcyx3nqj5/image/upload/v1775541507/WhatsApp_Image_2026-04-07_at_1.53.52_AM-removebg-preview_dxvzgv.png"
                    alt="Arasaka logo"
                    className="h-22 w-auto object-contain"
                />
            </div>

            <div className="w-full max-w-md items-start bg-white rounded-4xl shadow-2xl overflow-hidden border border-gray-300 relative">

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

                    <AuthInput
                        ref={passwordRef}
                        label="Contraseña"
                        placeholder="tu contraseña"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        error={errors.password}
                        maxLength={12}
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

                    <p className="mt-6! text-sm text-gray-600 font-medium">
                        ¿No tienes cuenta?{' '}
                        <Link to="/auth/Register" className="font-bold text-blue-800 hover:text-blue-900">
                            Regístrate
                        </Link>
                    </p>
                </form>
            </div>

            <footer className="mt-8">
                <p className="text-gray-600! text-sm">Sistema Generador de Portafolios Digitales</p>
            </footer>
        </div>
    );
}
