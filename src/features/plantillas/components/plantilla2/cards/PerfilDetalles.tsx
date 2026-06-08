import { Locate, GraduationCap, Mail, MessageCircle, ExternalLink } from "lucide-react";
import FotoPerfil from "../../plantilla1/FotoPerfil";
import { InfoItem } from "../../plantilla1/botones/InfoItem";
import BotonPerfil from "../../plantilla1/botones/BotonPerfil";

interface CardPerfilProps {
  nombre: string;
  pais: string;
  profesion: string;
  correo: string;
  foto?: string;
}

export default function PerfilDetalles({ nombre, pais, profesion, correo, foto }: CardPerfilProps) {
  return (
    <div className="
      p-6 rounded-2xl
      bg-white/60
      backdrop-blur-xl
      border border-black/8
      shadow-[0_4px_24px_rgba(0,0,0,0.08)]
    ">
      <div className="flex items-center gap-5">
        <div className="rounded-full border-[3px] border-black/10 shadow-sm overflow-hidden shrink-0">
          <FotoPerfil imagenUrl={foto ?? ""} ancho={80} alto={80} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold leading-tight text-gray-900">{nombre}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{profesion}</p>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        <InfoItem icon={<Locate size={16} />} text={pais} />
        <InfoItem icon={<Mail size={16} />}   text={correo} />
        <InfoItem icon={<GraduationCap size={16} />} text={profesion} />
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        <BotonPerfil label="CONTACTAR"    icon={MessageCircle} variant="primary" />
        <BotonPerfil label="DESCARGAR CV" icon={ExternalLink}  variant="secondary" />
      </div>
    </div>
  );
}