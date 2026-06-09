import {
  Locate,
  GraduationCap,
  Mail,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import FotoPerfil from "../FotoPerfil";
import { InfoItem } from "../botones/InfoItem";
import BotonPerfil from "../botones/BotonPerfil";
import ContactarModal from "@/features/sendGmail/components/ContactarModal";
import type { InformacionBasica } from "@/features/portafolio/types/portafolioType";
import { useState } from "react";
interface CardPerfilProps {
  nombre: string;
  pais: string;
  profesion: string;
  correo: string;
  foto?: string;
  mostrarContacto?: boolean;
  mostrarCV?: boolean;
  informacion_basica?: InformacionBasica | null;
}

export default function DetallesPerfil({
    nombre,
    pais,
    profesion,
    correo,
    foto,
    mostrarContacto,
    mostrarCV,
    informacion_basica
  }: CardPerfilProps) {

    const [contactarOpen, setContactarOpen] = useState(false);
    

  return (
    <div className="relative bg-white rounded-xl pt-16 pb-6 px-6 shadow-sm">

      {/* FOTO */}
      <div className="absolute -top-14 left-6">
        <FotoPerfil
          imagenUrl={foto ?? ""}
          ancho={100}
          alto={100}
        />
      </div>

      {/* CONTENIDO */}
      <div className="mt-4 ">
        <h2 className="text-3xl leading-tight text-black ml-20">
          {nombre}
        </h2>

        
        <div className="mt-6 space-y-3 text-gray-700 transition-all duration-300">
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
        {mostrarContacto && (
          <BotonPerfil
            onClick={() => setContactarOpen(true)}
            label="CONTACTAR"
            icon={MessageCircle}
            variant="primary"
          />
        )}

        {mostrarCV && (
          <BotonPerfil
            label="DESCARGAR CV"
            icon={ExternalLink}
            variant="secondary"
          />
        )}
        </div>
      </div>
      <ContactarModal
        open={contactarOpen}
        onClose={() => setContactarOpen(false)} 
        correoDestinatario={informacion_basica?.gmail ?? correo}
        nombreDestinatario={nombre}
      />
    </div>
  );
}