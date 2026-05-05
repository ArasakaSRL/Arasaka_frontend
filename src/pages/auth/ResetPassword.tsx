import { useState, useRef } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { resetPasswordRequest } from '@/features/auth/api/auth'; // Tu endpoint
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { AuthInput } from '@/features/auth/components/auth/AuthInput';
import { AuthButton } from '@/features/auth/components/auth/AuthButton';

const registerSchema = z.object({
    password: z.string().min(12, 'La contraseña debe tener 12 caracteres').max(12, 'Máximo 12 caracteres').regex(/[A-Z]/, 'Debe contener al menos una mayúscula').regex(/[a-z]/, 'Debe contener al menos una minúscula').regex(/[0-9]/, 'Debe contener al menos un número').regex(/[^A-Za-z0-9]/, 'Debe contener un carácter especial'),
    password_confirmation: z.string(),
}).refine(data => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
});

type FieldErrors = Partial<Record<'correo' | 'password' | 'password_confirmation', string>>;

export default function ResetPassword() {
    const { token } = useParams<{ token: string }>(); // Captura el token de la URL
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || ''; // Captura el correo de la URL
    const navigate = useNavigate();

    const passwordRef = useRef<HTMLInputElement>(null)
    const passwordConfirmRef = useRef<HTMLInputElement>(null)

    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState<FieldErrors>({});
    const [passwordConfirmation, setPasswordConfirmation] = useState('');


    async function handleSubmit() {

        const validation = registerSchema.safeParse({
            password,
            password_confirmation: passwordConfirmation,
        });

        if (!validation.success) {
            const fieldErrors: FieldErrors = {};
            let firstErrorKey: keyof FieldErrors | null = null;

            for (const issue of validation.error.issues) {
                const key = issue.path[0] as keyof FieldErrors;

                if (!fieldErrors[key]) {
                    fieldErrors[key] = issue.message;
                }

                if (!firstErrorKey) {
                    firstErrorKey = key;
                }
            }

            setErrors(fieldErrors);

            if (firstErrorKey === 'password') passwordRef.current?.focus()
            else if (firstErrorKey === 'password_confirmation') passwordConfirmRef.current?.focus()

            return;
        }

        setErrors({});
        setLoading(true);

        try {
            await resetPasswordRequest({
                token: token ?? '',
                correo: email,
                password,
                password_confirmation: passwordConfirmation,
            });

            toast.success('¡Contraseña actualizada exitosamente!', {
                duration: 4000,
                icon: '✅',
            });

            navigate('/auth/Login');

        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            const msg = error.response?.data?.message || 'El enlace ha expirado o es inválido.';
            toast.error(msg);

        } finally {
            setLoading(false);
        }
    }

    const estaLLeno = password.length > 0 && passwordConfirmation.length > 0;

    return (
        <div className="flex flex-col items-center bg-gray-50 min-h-screen pt-10 sm:pt-0 sm:justify-center px-1 sm:px-6 lg:px-8">



            <div className="w-full max-w-full md:max-w-md items-start bg-white rounded-4xl shadow-2xl overflow-hidden border border-gray-300 relative">

                <div className="absolute z-0 inset-0 bg-linear-to-r from-blue-400/40 to-transparent pointer-events-none" />

                <div className="relative z-20 p-4 flex flex-col">
                    <h1 className="text-xl! sm:text-2xl! text-black font-bold mb-2! text-center md:text-center">
                        Nueva Contraseña
                    </h1>

                    <p className="text-gray-500 text-xs! sm:text-sm! mb-3! md:mb-6! text-left md:text-left">
                        Restableciendo para:
                        <span className="font-bold break-all ml-1">{email}</span>
                    </p>
                    <AuthInput
                        ref={passwordRef}
                        label="Nueva contraseña"
                        placeholder="Ingresa tu nueva contraseña"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        required
                        maxLength={12}
                        error={errors.password}
                    />

                    <AuthInput
                        ref={passwordConfirmRef}
                        label="Confirmar contraseña"
                        placeholder="Confirma tu contraseña"
                        type="password"
                        value={passwordConfirmation}
                        onChange={setPasswordConfirmation}
                        required
                        error={errors.password_confirmation}
                    />

                    <AuthButton
                        text={loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                        onClick={handleSubmit}
                        disabled={loading || !estaLLeno}>

                    </AuthButton>

                </div>
            </div>
        </div>
    );
}