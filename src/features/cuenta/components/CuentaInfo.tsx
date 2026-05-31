import UsernameField from './UsernameField'
import CorreoField from './CorreoField'

export default function CuentaInfo() {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-sm text-left font-semibold text-slate-700">Información de la cuenta</p>
            </div>
            <UsernameField />
            <CorreoField />
        </div>
    )
}
