import { User, Mail, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PaisSelect from '@/components/ui/PaisSelect';

export interface InfoBasicaFormData {
    nombre_completo: string;
    gmail: string;
    pais: string;
    biografia: string;
}

type FormErrors = Partial<Record<keyof InfoBasicaFormData, string>>;

interface InfoBasicaFieldsProps {
    formData: InfoBasicaFormData;
    errors: FormErrors;
    onChange: (field: keyof InfoBasicaFormData, val: string) => void;
    nombreRef: React.RefObject<HTMLInputElement | null>;
    gmailRef: React.RefObject<HTMLInputElement | null>;
}

export default function InfoBasicaFields({
    formData, errors, onChange, nombreRef, gmailRef
}: InfoBasicaFieldsProps) {
    return (
        <>
            <Input
                ref={nombreRef}
                label="Nombre completo"
                icon={User}
                type="text"
                placeholder="Tu nombre completo"
                value={formData.nombre_completo}
                onChange={(val) => onChange('nombre_completo', val)}
                error={errors.nombre_completo}
                maxLength={150}
            />

            <Input
                ref={gmailRef}
                label="Gmail"
                icon={Mail}
                type="text"
                placeholder="tu@gmail.com"
                value={formData.gmail}
                onChange={(val) => onChange('gmail', val)}
                error={errors.gmail}
                maxLength={150}
            />

            <PaisSelect
                value={formData.pais}
                onChange={(val) => onChange('pais', val)}
            />
        </>
    );
}
