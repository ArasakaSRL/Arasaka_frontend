import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { Briefcase, ArrowLeft } from 'lucide-react';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { loginRequest } from '@/api/auth';

const loginSchema = z.object({
    correo: z.email('Correo inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

type FieldErrors = Partial<Record<'correo' | 'password', string>>;

export default function Login() {
    const navigate = useNavigate();
    const [correo, setCorrecto] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<FieldErrors>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
            await loginRequest({ correo, password });
            navigate('/Dashboard/perfilPersonal/PerfilPersonal');
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string; errors?: { correo?: string[] } }>;
            const msg = error?.response?.data?.message
                ?? error?.response?.data?.errors?.correo?.[0]
                ?? 'Credenciales incorrectas';
            setApiError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <Link to="/" className="absolute top-10 left-10 text-gray-600 text-sm flex items-center gap-2 hover:text-black no-underline">
                <ArrowLeft size={16} /> Volver al inicio
            </Link>

            <div className="mb-5 bg-blue-500 p-2 rounded-2xl shadow-xl shadow-blue-200">
                <Briefcase className="w-14 h-14 text-black" />
            </div>

            <div className="w-full max-w-md items-start bg-white rounded-4xl shadow-2xl overflow-hidden border border-gray-300 relative">

                <div className="absolute z-0 inset-0 bg-linear-to-r from-blue-400/40 to-transparent pointer-events-none" />

                <div className="relative z-20 p-4 flex flex-col">
                    <p className="text-black text-[22px] font-bold mb-1">Iniciar Sesión</p>
                    <p className="text-gray-500! font-normal text-[14px] mb-4!">Accede a tu portafolio digital profesional</p>

                    <AuthInput
                        label="Correo"
                        placeholder="tu@correo.com"
                        type="email"
                        value={correo}
                        onChange={setCorrecto}
                        error={errors.correo}
                    />

                    <AuthInput
                        label="Contraseña"
                        placeholder="tu password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        error={errors.password}
                    />

                    {apiError && (
                        <p className="text-red-500! text-xs text-left w-full mb-4">{apiError}</p>
                    )}

                    <div className="w-full mt-2">
                        <AuthButton
                            text={loading ? 'Ingresando...' : 'Ingresar'}
                            onClick={handleLogin}
                        />
                    </div>

                    <p className="mt-6! text-sm text-gray-600 font-medium">
                        ¿No tienes cuenta?{' '}
                        <Link to="/auth/register" className="font-bold text-blue-800 hover:text-blue-900">
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>

            <footer className="mt-8">
                <p className="text-gray-600! text-sm">Sistema Generador de Portafolios Digitales</p>
            </footer>
        </div>
    );
}
