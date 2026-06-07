import {
  Locate,
  GraduationCap,
  Mail,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
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

export default function PerfilDetalles({
  nombre,
  pais,
  profesion,
  correo,
  foto,
}: CardPerfilProps) {
  return (
    <div className="
      p-6
      rounded-2xl
      bg-white/5
      backdrop-blur-2xl
      border border-white/10
      shadow-[0_8px_32px_rgba(0,0,0,0.2)]
    ">
      {/* CABECERA: Foto y Nombre alineados horizontalmente */}
      <div className="flex items-center gap-5">
        {/* FOTO */}
        <div className="rounded-full border-[3px] border-white/20 shadow-lg overflow-hidden bg-[#F0EAD6] shrink-0">
          <FotoPerfil
            imagenUrl={foto ?? ""}
            // He reducido un poco el tamaño (de 100 a 80) para que se vea más proporcional 
            // al estar en la misma línea que el texto, pero puedes volver a subirlo si prefieres.
            ancho={80} 
            alto={80}
          />
        </div>

        {/* NOMBRE */}
        <h2 className="text-3xl font-medium leading-tight text-black">
          {nombre}
        </h2>
      </div>

      {/* CONTENIDO: Información y Botones */}
      <div className="mt-6">
        <div className="space-y-3 text-black/70 transition-all duration-300">
          <InfoItem
            icon={<Locate size={18} />}
            text={pais}
          />

          <InfoItem
            icon={<GraduationCap size={18} />}
            text={profesion}
          />

          <InfoItem
            icon={<Mail size={18} />}
            text={correo}
          />
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <BotonPerfil
            label="CONTACTAR"
            icon={MessageCircle}
            variant="primary"
          />

          <BotonPerfil
            label="DESCARGAR CV"
            icon={ExternalLink}
            variant="secondary"
          />
        </div>
      </div>
    </div>
  );
}