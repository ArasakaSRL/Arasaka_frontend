import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';
import { AuthInput } from '@/features/auth/components/auth/AuthInput';
import { AuthButton } from '@/features/auth/components/auth/AuthButton';
import SocialAuthButtons from '@/features/auth/components/auth/SocialAuthButtons';
import { registerRequest, getUsuario, firebaseAuthRequest } from '@/features/auth/api/auth';
import { useAuthStore, resolverPortafolioDesdeArray } from '@/stores/authStore';
import { signInWithProvider } from '@/firebase/firebaseAuth';
import { passwordSchema, PASSWORD_MAX } from '@/features/auth/utils/passwordRules';
import { ARASAKA_LOGO_URL } from '@/features/auth/utils/authBranding';
import type { AuthProvider } from 'firebase/auth';

const registerSchema = z.object({
    nombre: z.string().trim().min(2, 'El nombre es requerido').max(40, 'Máximo 40 caracteres').regex(/^[A-Za-z\s]+$/, 'Solo letras y espacios'),
    apellido: z.string().trim().min(2, 'El apellido es requerido').max(40, 'Máximo 40 caracteres').regex(/^[A-Za-z\s]+$/, 'Solo letras y espacios'),
    correo: z.string().trim().max(50, 'Máximo 50 caracteres').email('Ingresa un formato de correo válido'),
    password: passwordSchema,
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
    const setPortafolio = useAuthStore(s => s.setPortafolio);

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
            if (user) {
                setUser(user);
                setPortafolio(resolverPortafolioDesdeArray(user.portafolios ?? []));
            }
            sessionStorage.removeItem('tour_iniciado');
            navigate('/Dashboard/perfil/General');
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
            if (user) {
                setUser(user);
                setPortafolio(resolverPortafolioDesdeArray(user.portafolios ?? []));
            }
            sessionStorage.removeItem('tour_iniciado');
            navigate('/auth/VerificaCorreo');

        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            setApiError(error?.response?.data?.message ?? 'Error al crear la cuenta');
        } finally {
            setLoading(false);
        }
    }

    // Manejadores de cambio para validar en tiempo real
    const handleNombreChange = (val: string) => { setNombre(val.replace(/[^A-Za-z\s]/g, '').slice(0, 40)); setErrors(prev => ({ ...prev, nombre: undefined })); };
    const handleApellidoChange = (val: string) => { setApellido(val.replace(/[^A-Za-z\s]/g, '').slice(0, 40)); setErrors(prev => ({ ...prev, apellido: undefined })); };
    const handleCorreoChange = (val: string) => { setCorreo(val.trimStart().toLowerCase().slice(0, 50)); setErrors(prev => ({ ...prev, correo: undefined })); };
    const handlePasswordChange = (val: string) => { if (val.length <= PASSWORD_MAX) { setPassword(val); setErrors(prev => ({ ...prev, password: undefined })); } };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-1 py-12 md:py-8">
            
            <Link to="/" className="absolute top-10 left-10 text-gray-600 text-sm flex items-center gap-2 hover:text-black no-underline">
                <ArrowLeft size={16} /> Volver al inicio
            </Link>

            <div className="flex items-center gap-2 z-10 relative">
                <img src={ARASAKA_LOGO_URL} alt="Arasaka logo" className="h-22 w-auto object-contain" />
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
                    <AuthInput ref={passwordRef} label="Contraseña" placeholder="Tu contraseña" type="password" value={password} onChange={handlePasswordChange} error={errors.password} maxLength={64} required />
                    <AuthInput label="Confirmar Contraseña" placeholder="Repite tu contraseña" type="password" value={password_confirmation} onChange={setPasswordConfirmation} error={errors.password_confirmation} required />


                    {apiError && <p className="text-red-500 text-xs w-full text-center my-4">{apiError}</p>}

                    <div className="w-full mt-2">
                        <AuthButton
                            type="submit"
                            text={loading ? 'Creando cuenta...' : 'Crear cuenta'}
                            disabled={loading || !isFilled}
                        />

                    </div>

                    <SocialAuthButtons onLogin={handleSocialLogin} loading={socialLoading} />

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
