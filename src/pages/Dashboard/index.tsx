import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

export default function Dashboard() {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const verified = params.get('verified') === '1'

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/Dashboard/perfilPersonal/PerfilPersonal')
        }, 3000)
        return () => clearTimeout(timer)
    }, [navigate])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-sm w-full border border-gray-100">
                {verified ? (
                    <>
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-green-700">¡Correo verificado!</h2>
                        <p className="text-gray-500 text-sm mt-2">Redirigiendo a tu dashboard...</p>
                    </>
                ) : (
                    <p className="text-gray-500 text-sm">Redirigiendo...</p>
                )}
            </div>
        </div>
    )
}
