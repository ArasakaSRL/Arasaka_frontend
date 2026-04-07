import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { Briefcase, ArrowLeft, Mail } from 'lucide-react';
import { AuthInput } from '@/features/auth/components/auth/AuthInput';
import { AuthButton } from '@/features/auth/components/auth/AuthButton';
import { registerRequest, getUsuario, resendVerificationEmail } from '@/features/auth/api/auth';
import { useAuthStore } from '@/stores/authStore';

const registerSchema = z.object({
    nombre: z.string().trim().min(3, 'El nombre es requerido').max(40, 'Máximo 40 caracteres').regex(/^[A-Za-z\s]+$/, 'Solo letras y espacios'),
    apellido: z.string().trim().min(6, 'El apellido es requerido').max(40, 'Máximo 40 caracteres').regex(/^[A-Za-z\s]+$/, 'Solo letras y espacios'),
    correo: z.string().trim().min(15, 'Mínimo 15 caracteres').max(50, 'Máximo 50 caracteres').email('Ingresa un formato de correo válido'),
    password: z.string().min(12, 'La contraseña debe tener 12 caracteres').max(12, 'Máximo 12 caracteres').regex(/[A-Z]/, 'Debe contener al menos una mayúscula').regex(/[a-z]/, 'Debe contener al menos una minúscula').regex(/[0-9]/, 'Debe contener al menos un número').regex(/[^A-Za-z0-9]/, 'Debe contener un carácter especial'),
    password_confirmation: z.string(),
    crear_portafolio: z.boolean(),
    portafolio_nombre: z.string().optional(),
    portafolio_descripcion: z.string().optional(),
    portafolio_visibilidad: z.boolean().optional(),
}).refine(data => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation']
}).refine(data => !data.crear_portafolio || (data.portafolio_nombre && data.portafolio_nombre.trim().length > 0), {
    message: 'El nombre del portafolio es requerido',
    path: ['portafolio_nombre']
}).refine(data => !data.crear_portafolio || data.portafolio_visibilidad !== undefined, {
    message: 'La visibilidad es requerida',
    path: ['portafolio_visibilidad']
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
    const [crearPortafolio, setCrearPortafolio] = useState(false);
    const [portafolioNombre, setPortafolioNombre] = useState('');
    const [portafolioDescripcion, setPortafolioDescripcion] = useState('');
    const [portafolioVisibilidad, setPortafolioVisibilidad] = useState<boolean | undefined>(undefined);

    const [errors, setErrors] = useState<FieldErrors>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const isFilled = nombre.length > 0 && apellido.length > 0 && correo.length > 0 && password.length > 0 && password_confirmation.length > 0 && (!crearPortafolio || (portafolioNombre.length > 0 && portafolioVisibilidad !== undefined));

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
            crear_portafolio: crearPortafolio,
            portafolio_nombre: portafolioNombre,
            portafolio_descripcion: portafolioDescripcion,
            portafolio_visibilidad: portafolioVisibilidad,
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
                crear_portafolio: crearPortafolio,
                ...(crearPortafolio && {
                    portafolio: {
                        nombre: portafolioNombre,
                        descripcion: portafolioDescripcion,
                        visibilidad: portafolioVisibilidad!,
                    }
                })
            });

            const user = await getUsuario();
            setUser(user);
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
            <Link to="/" className="absolute top-10 left-10 text-gray-600 text-sm flex items-center gap-2 hover:text-black no-underline">
                <ArrowLeft size={16} /> Volver al inicio
            </Link>

            <div className="mb-5 bg-blue-500 p-2 rounded-2xl shadow-xl shadow-blue-200">
                <Briefcase className="w-14 h-14 text-black" />
            </div>

            <div className="w-full max-w-lg bg-white rounded-4xl shadow-2xl overflow-hidden border border-gray-300 relative">
                <div className="absolute inset-0 bg-linear-to-r from-blue-400/40 to-transparent pointer-events-none" />

                <form
                    onSubmit={(e) => { e.preventDefault(); handleRegister(); }}
                    className="relative p-4 flex flex-col items-center"
                >
                    <p className="text-[22px] text-black font-bold">Crear Cuenta</p>
                    <p className="text-gray-500! text-sm mb-4! font-normal text-center">Crea tu portafolio digital de proyectos de software</p>
                    <p className="text-xs text-gray-500! mb-2! text-left w-full">Los campos marcados con <span className="text-red-500">*</span> son obligatorios</p>

                    <AuthInput ref={nombreRef} label="Nombre" placeholder="Tu nombre" type="text" value={nombre} onChange={handleNombreChange} error={errors.nombre} maxLength={40} required />
                    <AuthInput ref={apellidoRef} label="Apellido" placeholder="Tu apellido" type="text" value={apellido} onChange={handleApellidoChange} error={errors.apellido} maxLength={40} required />
                    <AuthInput ref={correoRef} label="Correo" placeholder="tu@correo.com" type="email" value={correo} onChange={handleCorreoChange} error={errors.correo} maxLength={50} required />
                    <AuthInput ref={passwordRef} label="Contraseña" placeholder="Tu password" type="password" value={password} onChange={handlePasswordChange} error={errors.password} maxLength={12} required />
                    <AuthInput label="Confirmar Contraseña" placeholder="Repite tu password" type="password" value={password_confirmation} onChange={setPasswordConfirmation} error={errors.password_confirmation} required />

                    {/* Checkbox crear portafolio */}
                    <div className="w-full flex items-center gap-2 mb-4">
                        <input
                            id="crear_portafolio"
                            type="checkbox"
                            checked={crearPortafolio}
                            onChange={e => setCrearPortafolio(e.target.checked)}
                            className="w-4 h-4 accent-blue-600 cursor-pointer"
                        />
                        <label htmlFor="crear_portafolio" className="text-sm text-gray-700 cursor-pointer">
                            Crear portafolio al registrarme
                        </label>
                    </div>

                    {crearPortafolio && (
                        <div className="w-full flex flex-col gap-1 mb-4 p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                            <p className="text-sm font-semibold text-black mb-3!">Datos del portafolio</p>

                            <AuthInput label="Nombre del portafolio" placeholder="Mi portafolio" type="text" value={portafolioNombre} onChange={val => { setPortafolioNombre(val); setErrors(prev => ({ ...prev, portafolio_nombre: undefined })); }} error={errors.portafolio_nombre} required />

                            <AuthInput label="Descripción" placeholder="Describe tu portafolio" type="text" value={portafolioDescripcion} onChange={setPortafolioDescripcion} />

                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="text-black text-left font-semibold text-[14px] ml-1">Visibilidad <span className="text-red-500">*</span></label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input type="radio" name="visibilidad" value="true" checked={portafolioVisibilidad === true} onChange={() => { setPortafolioVisibilidad(true); setErrors(prev => ({ ...prev, portafolio_visibilidad: undefined })); }} className="accent-blue-600" />
                                        Público
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input type="radio" name="visibilidad" value="false" checked={portafolioVisibilidad === false} onChange={() => { setPortafolioVisibilidad(false); setErrors(prev => ({ ...prev, portafolio_visibilidad: undefined })); }} className="accent-blue-600" />
                                        Privado
                                    </label>
                                </div>
                                {errors.portafolio_visibilidad && <p className="text-red-500 text-[12px] ml-1">{errors.portafolio_visibilidad}</p>}
                            </div>
                        </div>
                    )}

                    {apiError && <p className="text-red-500 text-xs w-full text-center my-4">{apiError}</p>}

                    <div className="w-full mt-2">
                        <AuthButton
                            type="submit"
                            text={loading ? 'Creando cuenta...' : 'Crear cuenta'}
                            disabled={loading || !isFilled}
                        />

                    </div>

                    <p className="mt-6! text-sm text-gray-600 font-medium">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/auth/Login" className="font-bold text-blue-800 hover:text-blue-900">Inicia sesión</Link>
                    </p>
                </form>
            </div>

            <footer className="mt-8">
                <p className="text-gray-600! text-sm font-normal">Sistema Generador de Portafolios Digitales</p>
            </footer>
        </div>
    );
}
