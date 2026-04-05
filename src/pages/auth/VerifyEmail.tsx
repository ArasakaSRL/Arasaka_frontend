// src/pages/auth/VerifyEmail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmailRequest } from '@/features/auth/api/auth';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmail() {
    const { id, hash } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        if (id && hash) {
            verifyEmailRequest(id, hash)
                .then(() => {
                    setStatus('success');
                    setTimeout(() => navigate('/Dashboard/perfilPersonal/PerfilPersonal'), 3000);
                })
                .catch(() => setStatus('error'));
        }
    }, [id, hash, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-sm w-full border border-gray-100">
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-bold">Verificando tu cuenta...</h2>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-green-700">¡Correo verificado!</h2>
                        <p className="text-gray-500 mt-2">Redirigiendo a tu dashboard...</p>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-red-700">Enlace inválido o expirado</h2>
                        <button 
                            onClick={() => navigate('/auth/Login')}
                            className="mt-6 text-blue-600 font-bold underline"
                        >
                            Volver al inicio de sesión
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}