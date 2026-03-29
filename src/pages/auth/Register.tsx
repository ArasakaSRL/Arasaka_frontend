import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { Briefcase, ArrowLeft } from 'lucide-react';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { registerRequest } from '@/api/auth';

const registerSchema = z.object({
    nombre: z.string().min(2, 'El nombre es muy corto'),
    apellido: z.string().min(2, 'El apellido es muy corto'),
    correo: z.string().email('Correo inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
});

type FieldErrors = Partial<Record<'nombre' | 'apellido' | 'correo' | 'password' | 'password_confirmation', string>>;

export default function Register() {
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

    async function handleRegister() {
        setApiError(null);
        const result = registerSchema.safeParse({ nombre, apellido, correo, password, password_confirmation });

        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof FieldErrors;
                fieldErrors[key] = issue.message;
            }
            setErrors(fieldErrors);
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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 py-12">
            <Link to="/" className="absolute top-10 left-10 text-gray-500 text-sm flex items-center gap-2 hover:text-black no-underline">
                <ArrowLeft size={16} /> Volver al inicio
            </Link>

            <div className="mb-8 bg-blue-500 p-4 rounded-2xl shadow-xl shadow-blue-200">
                <Briefcase className="w-12 h-12 text-white" />
            </div>

            <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 relative">
                {/* El gradiente azul de tu imagen */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 to-transparent pointer-events-none" />

                <div className="relative p-10 flex flex-col items-center">
                    <h1 className="text-2xl font-black text-gray-900 mb-1">Crear Cuenta</h1>
                    <p className="text-gray-500 text-sm mb-8 text-center">Crea tu portafolio digital de proyectos de software</p>


                    <AuthInput label="Nombre" placeholder="Tu nombre" type="text" value={nombre} onChange={setNombre} />
                    {errors.nombre && <p className="text-red-500 text-[10px] w-full -mt-3 mb-3">{errors.nombre}</p>}

                    <AuthInput label="Apellido" placeholder="Tu apellido" type="text" value={apellido} onChange={setApellido} />
                    {errors.apellido && <p className="text-red-500 text-[10px] w-full -mt-3 mb-3">{errors.apellido}</p>}

                    <AuthInput label="Correo" placeholder="tu@correo.com" type="email" value={correo} onChange={setCorreo} />
                    {errors.correo && <p className="text-red-500 text-[10px] w-full -mt-3 mb-3">{errors.correo}</p>}

                    <AuthInput label="Contraseña" placeholder="Tu password" type="password" value={password} onChange={setPassword} />
                    {errors.password && <p className="text-red-500 text-[10px] w-full -mt-3 mb-3">{errors.password}</p>}

                    <AuthInput label="Confirmar Contraseña" placeholder="Repite tu password" type="password" value={password_confirmation} onChange={setPasswordConfirmation} />
                    {errors.password_confirmation && <p className="text-red-500 text-[10px] w-full -mt-3 mb-3">{errors.password_confirmation}</p>}

                    {apiError && <p className="text-red-500 text-xs w-full text-center my-4">{apiError}</p>}

                    <div className="w-full mt-6">
                        <AuthButton text={loading ? 'Creando cuenta...' : 'Ingresar'} onClick={handleRegister} />
                    </div>

                    <p className="mt-8 text-sm text-gray-600 font-medium">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="font-bold text-blue-900 hover:text-blue-700">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>

            <footer className="mt-12">
                <p className="text-gray-400 text-sm font-medium">Sistema Generador de Portafolios Digitales</p>
            </footer>
        </div>
    );
}