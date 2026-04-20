import { User, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PaisSelect from '@/components/ui/PaisSelect';

interface PerfilFormData {
    nombre: string;
    apellido: string;
    biografia: string;
    correo: string;
    pais: string;
}

type FormErrors = Partial<Record<keyof PerfilFormData, string>>;

interface InfoBasicaFieldsProps {
    formData: PerfilFormData;
    errors: FormErrors;
    onChange: (field: keyof PerfilFormData, val: string) => void;
    nombreRef: React.RefObject<HTMLInputElement | null>;
    apellidoRef: React.RefObject<HTMLInputElement | null>;
    correoRef: React.RefObject<HTMLInputElement | null>;
    biografiaRef: React.RefObject<HTMLInputElement | null>;
}

export default function InfoBasicaFields({
    formData, errors, onChange, nombreRef, apellidoRef, correoRef
}: InfoBasicaFieldsProps) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3! md:gap-3!">
                <Input
                    ref={nombreRef}
                    label="Nombre"
                    icon={User}
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={(val) => onChange('nombre', val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜ\s]/g, ''))}
                    error={errors.nombre}
                    maxLength={40}
                />
                <Input
                    ref={apellidoRef}
                    label="Apellido"
                    icon={User}
                    type="text"
                    placeholder="Tu apellido"
                    value={formData.apellido}
                    onChange={(val) => onChange('apellido', val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜ\s]/g, ''))}
                    error={errors.apellido}
                    maxLength={40}
                />
            </div>

            <Input
                ref={correoRef}
                label="Correo"
                icon={Mail}
                type="text"
                placeholder="tu@correo.com"
                value={formData.correo}
                onChange={(val) => onChange('correo', val)}
                error={errors.correo}
                maxLength={50}
                readOnly
                readOnlyMessage="Este campo no es editable"
            />

            <PaisSelect
                value={formData.pais}
                onChange={(val) => onChange('pais', val)}
            />
        </>
    );
}
