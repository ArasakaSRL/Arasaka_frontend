import { Info } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import UsernameField from './UsernameField'
import CorreoField from './CorreoField'

const PROVIDER_LABELS: Record<string, string> = {
    google: 'Google',
    github: 'GitHub',
    facebook: 'Facebook',
}

export default function CuentaInfo() {
    const provider = useAuthStore(s => s.user?.provider)
    const providerLabel = provider ? PROVIDER_LABELS[provider] ?? provider : null

    return (
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-sm text-left font-semibold text-slate-700">Información de la cuenta</p>
            </div>

            {providerLabel && (
                <div className="flex items-start gap-2 bg-blue-50/60 border border-blue-100 rounded-xl px-3 py-2.5">
                    <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-slate-600 leading-relaxed text-left">
                        Iniciaste sesión con <span className="font-semibold text-slate-700">{providerLabel}</span>. Cambiar tu correo aquí solo afecta tu cuenta de Arasaka, no la de {providerLabel}.
                    </p>
                </div>
            )}

            <UsernameField />
            <CorreoField />
        </div>
    )
}
