import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';
import { AuthInput } from '@/features/auth/components/auth/AuthInput';
import { AuthButton } from '@/features/auth/components/auth/AuthButton';
import { sendPasswordResetEmail, getCsrfCookie } from '@/features/auth/api/auth';
import { ARASAKA_LOGO_URL } from '@/features/auth/utils/authBranding';

const schema = z.object({
    correo: z.string().trim().max(50, 'El correo es demasiado largo').email('Ingresa un formato de correo válido'),
});

type FieldErrors = Partial<Record<'correo', string>>;

export default function ForgotPassword() {
    const correoRef = useRef<HTMLInputElement>(null);
    const [correo, setCorreo] = useState('');
    const [errors, setErrors] = useState<FieldErrors>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        setApiError(null);
        setSuccessMessage(null);

        const result = schema.safeParse({ correo });
        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof FieldErrors;
                if (!fieldErrors[key]) fieldErrors[key] = issue.message;
            }
            setErrors(fieldErrors);
            correoRef.current?.focus();
            return;
        }

        setErrors({});
        setLoading(true);
        try {
            await getCsrfCookie();
            const response = await sendPasswordResetEmail(correo);
            setSuccessMessage(response.message || '¡Enlace enviado! Revisa tu bandeja de entrada.');
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            setApiError(error?.response?.data?.message ?? 'No se pudo enviar el correo. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-1 relative">

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
                    onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
                >
                    <p className="text-black text-[22px] font-bold mb-1">Recuperar Contraseña</p>
                    <p className="text-gray-500! font-normal text-[14px] mb-4!">
                        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
                    </p>

                    <AuthInput
                        ref={correoRef}
                        label="Correo"
                        placeholder="tu@correo.com"
                        type="email"
                        value={correo}
                        onChange={(val) => setCorreo(val.trimStart().toLowerCase().slice(0, 50))}
                        error={errors.correo}
                        maxLength={50}
                        required
                    />

                    {successMessage && (
                        <p className="text-green-600! text-xs text-left w-full mb-3 font-medium">
                            {successMessage}
                        </p>
                    )}

                    {apiError && (
                        <p className="text-red-500! text-xs text-left w-full mb-3">{apiError}</p>
                    )}

                    <div className="w-full mt-2">
                        <AuthButton
                            type="submit"
                            text={loading ? 'Enviando...' : 'Enviar enlace'}
                            disabled={correo.length === 0 || loading}
                        />
                    </div>

                    <p className="mt-4! text-sm text-gray-600 font-medium text-center">
                        <Link to="/auth/Login" className="font-bold text-blue-800 hover:text-blue-900 flex items-center justify-center gap-1">
                            <ArrowLeft size={14} /> Volver al inicio de sesión
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
