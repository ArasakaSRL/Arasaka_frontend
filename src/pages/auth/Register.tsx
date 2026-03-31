import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { Briefcase, ArrowLeft } from 'lucide-react';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { registerRequest } from '@/api/auth';

const registerSchema = z.object({

    nombre: z
        .string()
        .trim()
        .min(5, 'El nombre es requerido')
        .max(15, 'Máximo 15 caracteres')
        .regex(/^[A-Za-z\s]+$/, 'El nombre solo puede contener letras y espacios'),

    apellido: z
        .string()
        .trim()
        .min(5, 'El apellido es requerido')
        .max(15, 'Máximo 15 caracteres')
        .regex(/^[A-Za-z\s]+$/, 'El apellido solo puede contener letras y espacios'),

    correo: z
        .string()
        .trim()
        .min(8, 'Minimo 8 caracteres')
        .max(20, 'Máximo 20 caracteres')
        .email('Ingresa un formato de correo válido'),

    password: z
        .string()
        .min(8, 'la contraseña debe tener 8 caracteres')
        .max(8, 'Máximo 8 caracteres permitidos')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[a-z]/, 'Debe contener al menos una minúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número')
        .regex(/[^A-Za-z0-9]/, 'Debe contener un carácter especial'),

    password_confirmation: z.string()

}).refine(data => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation']
});

type FieldErrors = Partial<Record<'nombre' | 'apellido' | 'correo' | 'password' | 'password_confirmation', string>>;

export default function Register() {

    const nombreRef = useRef<HTMLInputElement>(null);
    const apellidoRef = useRef<HTMLInputElement>(null);
    const correoRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    // Estados para los nuevos campos
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');

    const [errors, setErrors] = useState<FieldErrors>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    /**
     * handleRegister: manejador del evento de registro.
     * Un "handler" es una función que se ejecuta en respuesta a una acción del usuario,
     * en este caso al hacer clic en "Crear cuenta".
     * Flujo:
     * 1. Limpia errores previos
     * 2. Valida los campos con zod antes de tocar la API
     * 3. Si la validación falla, muestra errores por campo y detiene la ejecución
     * 4. Si pasa, llama a registerRequest() que hace POST /registrar al backend
     * 5. Si el backend responde bien, redirige al login
     * 6. Si el backend responde con error, muestra el mensaje de error
     * 7. finally siempre desactiva el loading, haya error o no
     */
    async function handleRegister() {
        setApiError(null);
        const result = registerSchema.safeParse({ nombre, apellido, correo, password, password_confirmation });

        if (!result.success) {
            const fieldErrors: FieldErrors = {};

            let firstErrorKey: string | null = null;

            for (const issue of result.error.issues) {

                const key = issue.path[0] as keyof FieldErrors;

                if (!fieldErrors[key])
                    fieldErrors[key] = issue.message;

                if (!firstErrorKey)
                    firstErrorKey = key;
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
            await registerRequest({ nombre, apellido, correo, password, password_confirmation });
            navigate('/Dashboard/perfilPersonal/PerfilPersonal');
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            setApiError(error?.response?.data?.message ?? 'Error al crear la cuenta');
        } finally {
            setLoading(false);
        }
    }

    //limpiar caracteres mientras escribe
    const handleNombreChange = (val: string) => {
        const limpio = val.replace(/[^A-Za-z\s]/g, '').slice(0, 15);
        setNombre(limpio);
        setErrors(prev => ({ ...prev, nombre: undefined }));
    };

    const handleApellidoChange = (val: string) => {
        const limpio = val.replace(/[^A-Za-z\s]/g, '').slice(0, 15);
        setApellido(limpio);
        setErrors(prev => ({ ...prev, apellido: undefined }));
    };

    const handleCorreoChange = (val: string) => {
        const limpio = val.trimStart().slice(0, 20);
        setCorreo(limpio);
        setErrors(prev => ({ ...prev, correo: undefined }));
    };

    // Limitar caracteres y validar tipos (Input Handling)
    const handlePasswordChange = (val: string) => {

        if (val.length <= 8) {

            setPassword(val);

            setErrors(prev => ({ ...prev, password: undefined }));

        }
    };

    //boton deshabilitado si hay errores o campos vacíos
    /**const isFormInvalid =
           loading ||
           !nombre ||
           !apellido ||
           !correo ||
           !password ||
           Object.keys(errors).length > 0;*/

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 py-12">
            <Link to="/" className="absolute top-10 left-10 text-gray-600 text-sm flex items-center gap-2 hover:text-black no-underline">
                <ArrowLeft size={16} /> Volver al inicio
            </Link>

            <div className="mb-5 bg-blue-500 p-2 rounded-2xl shadow-xl shadow-blue-200">
                <Briefcase className="w-14 h-14 text-black" />
            </div>

            <div className="w-full max-w-lg bg-white rounded-4xl shadow-2xl overflow-hidden border border-gray-300 relative">

                <div className="absolute inset-0 bg-linear-to-r from-blue-400/40 to-transparent pointer-events-none" />

                <div className="relative p-4 flex flex-col items-center">
                    <p className="text-[22px] text-black font-bold">Crear Cuenta</p>
                    <p className="text-gray-500! text-sm mb-4! font-normal text-center">Crea tu portafolio digital de proyectos de software</p>

                    <p className="text-xs text-gray-500! mb-2! text-left w-full">
                        Los campos marcados con <span className="text-red-500">*</span> son obligatorios
                    </p>

                    <AuthInput
                        ref={nombreRef}
                        label="Nombre"
                        placeholder="Tu nombre"
                        type="text"
                        value={nombre}
                        onChange={handleNombreChange}
                        error={errors.nombre}
                        maxLength={15}
                        required
                    />

                    <AuthInput
                        ref={apellidoRef}
                        label="Apellido"
                        placeholder="Tu apellido"
                        type="text"
                        value={apellido}
                        onChange={handleApellidoChange}
                        error={errors.apellido}
                        maxLength={15}
                        required
                    />

                    <AuthInput
                        ref={correoRef}
                        label="Correo"
                        placeholder="tu@correo.com"
                        type="email"
                        value={correo}
                        onChange={handleCorreoChange}
                        error={errors.correo}
                        maxLength={20}
                        required
                    />

                    <AuthInput
                        ref={passwordRef}
                        label="Contraseña"
                        placeholder="Tu password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        error={errors.password}
                        maxLength={8}
                        required
                    />

                    <AuthInput
                        label="Confirmar Contraseña"
                        placeholder="Repite tu password"
                        type="password"
                        value={password_confirmation}
                        onChange={setPasswordConfirmation}
                        error={errors.password_confirmation}
                        required
                    />

                    {apiError && <p className="text-red-500 text-xs w-full text-center my-4">{apiError}</p>}

                    <div className="w-full mt-2">
                        <AuthButton
                            text={loading ? 'Creando cuenta...' : 'Ingresar'}
                            onClick={handleRegister}
                        />
                    </div>

                    <p className="mt-6! text-sm text-gray-600 font-medium">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/auth/Login" className="font-bold text-blue-800 hover:text-blue-900">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>

            <footer className="mt-8">
                <p className="text-gray-600! text-sm font-normal">Sistema Generador de Portafolios Digitales</p>
            </footer>
        </div>
    );
}