import React, { useState } from "react";
import { MessageCircle, MapPin, Mail, Sparkles, ExternalLink } from "lucide-react";
import type {
  Usuario,
  InformacionBasica,
  Proyectos,
  HabilidadTecnica,
  HabilidadBlanda,
  experiencias as Experiencia,
  certificaciones as Certificacion,
  formacion_academica as FormacionAcademica,
  redes_profesionales as RedesProfesionales,
} from "../types/portafolioType";
import ContactarModal from "../../sendGmail/components/ContactarModal";
import { generateCV } from "../lib/cv.generator";
import { toast } from "@/components/Alerta";

type Props = {
  usuario: Usuario;
  informacion_basica?: InformacionBasica | null;
  proyectos?: Proyectos[];
  tecnicas?: HabilidadTecnica[];
  blandas?: HabilidadBlanda[];
  experiencias?: Experiencia[];
  certificaciones?: Certificacion[];
  formacion_academica?: FormacionAcademica[];
  redes_profesionales?: RedesProfesionales[];
  mostrarCV?: boolean;
  mostrarContacto?: boolean;
  mostrarRedes?: boolean;
  onUploadCover?: () => void;
};

const PortfolioHeader: React.FC<Props> = ({
  usuario,
  informacion_basica,
  proyectos = [],
  tecnicas = [],
  blandas = [],
  experiencias = [],
  certificaciones = [],
  formacion_academica = [],
  redes_profesionales = [], 
  mostrarCV = true,
  mostrarContacto = true,
  mostrarRedes = true,
}) => {
  const fullName = `${usuario.nombre} ${usuario.apellido}`;
  const mainProfession = usuario.profesiones?.length > 0 ? usuario.profesiones[0].nombre : "Professional";
  const whatsappNumber = usuario.telefonos?.[0]?.numero.replace(/\s+/g, "");
  const [contactarOpen, setContactarOpen] = useState(false);
  const [descargandoCV, setDescargandoCV] = useState(false);

  const linkedin = redes_profesionales?.find(r =>
  r.nombre.toLowerCase().includes("linkedin")
);
const github = redes_profesionales?.find(r =>
  r.nombre.toLowerCase().includes("github")
);
const hasLinkedin = !!linkedin?.url_Red;
const hasGithub = !!github?.url_Red;
const hasAnySocial = hasLinkedin || hasGithub;

  const handleDescargarCV = async () => {
    if (descargandoCV) return;
    setDescargandoCV(true);
    try {
      await generateCV({
        usuario,
        informacion_basica,
        proyectos,
        tecnicas,
        blandas,
        experiencias,
        certificaciones,
        formacion_academica,
      });
      toast.success("pdf generado con éxito");
    } catch (err) {
      console.error("Error generando CV:", err);
      toast.error("Ocurrió un error al generar el pdf");
    } finally {
      setDescargandoCV(false);
    }
  };

  return (
    <div
      data-track="clic_general"
      className="
        w-full rounded-xl
        min-h-75 md:min-h-85vh 
        text-white
        bg-[#0a1120]
        flex flex-col md:flex-row items-center justify-between
        relative overflow-hidden shadow-2xl border border-white/5
      "
    >

      <div className="absolute top-0 right-0 w-75 h-75 bg-blue-600/10 blur-[100px] rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-50 h-50 bg-indigo-600/10 blur-[80px] rounded-full -ml-8 -mb-8"></div>

      <div className="relative w-full md:w-[42%] flex items-center justify-center py-6 md:py-0 md:pl-12 z-10">
        <div className="absolute w-56 h-56 md:w-72 md:h-72 bg-blue-500/15 blur-[60px] rounded-full"></div>
        <div data-hover="foto"  data-track="clic_foto_perfil" className="relative group">
          <div className="
            relative z-10
            w-48 h-48 md:w-64 md:h-64 
            rounded-full overflow-hidden
            border-4 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]
            transition-all duration-700 group-hover:scale-[1.04] group-hover:border-blue-500/40
          ">
            <img
              src={
                usuario.foto_perfil ||
                `https://ui-avatars.com/api/?name=${fullName}&size=512&background=0a1120&color=fff`
              }
              alt="perfil"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="absolute -inset-4 border border-blue-500/20 rounded-full animate-[spin_15s_linear_infinite] pointer-events-none"></div>
          <div className="absolute -inset-1 border border-white/5 rounded-full pointer-events-none"></div>
        </div>
      </div>

      <div className="w-full md:w-[58%] flex flex-col justify-center p-6 md:p-10 md:pr-16 relative z-20">
        <div className="flex flex-col space-y-3">
          
          <div className="flex items-center gap-2 w-fit bg-blue-500/10 border border-blue-400/20 px-3 py-1 rounded-full backdrop-blur-md">
            <MapPin size={14} className="text-blue-400" />
            <span className="text-[10px] font-bold text-blue-100 uppercase tracking-[0.2em]">
              {usuario.pais || "Remote"}
            </span>
          </div>

          <div className="space-y-0">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
              {usuario.nombre} 
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-300 ml-2">
                {usuario.apellido}
              </span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Sparkles size={16} className="text-yellow-400/80" />
              <p className="text-lg md:text-xl text-white/60 font-medium tracking-wide">
                {mainProfession}
              </p>
            </div>
          </div>

  
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/5 w-fit">
            <div 
              data-hover="correo"      
              data-track="clic_correo"
              className="flex items-center gap-2 group cursor-pointer">
              <Mail size={16} className="text-blue-400/70 group-hover:text-blue-400 transition-colors" />
              <span className="text-xs font-light text-white/50 group-hover:text-white/80 transition-colors">
                {usuario.correo}
              </span>
            </div>

          {mostrarRedes && hasAnySocial && (
              <div className="flex items-center gap-4">

             {hasLinkedin && (
                 <a
               href={linkedin!.url_Red}
               target="_blank"
               rel="noopener noreferrer"
               className="cursor-pointer transition-all hover:scale-110 hover:brightness-125"
                >
               <img
               src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg"
               alt="LinkedIn"
               className="w-6 h-6"
                />
               </a>
              )}

              {hasGithub && (
      <a
                href={github!.url_Red}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer transition-all hover:scale-110 hover:brightness-125"
               >
               <img
               src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg"
               alt="GitHub"
               className="w-6 h-6 invert brightness-[2]"
              />
           </a>
            )}

         </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-8">
          {mostrarContacto && (
            <>
              <button
                data-track="clic_contactar"
                onClick={() => setContactarOpen(true)}
                className="
                  group flex items-center gap-2
                  bg-white text-[#0a1120]
                  px-7 py-3 rounded-xl
                  font-bold text-xs transition-all
                  hover:bg-blue-50 hover:scale-[1.02]
                  active:scale-95 shadow-lg shadow-white/5
                "
              >
                <MessageCircle size={18} className="transition-transform group-hover:rotate-12" />
                CONTACTAR
              </button>
              <ContactarModal
                open={contactarOpen}
                onClose={() => setContactarOpen(false)}
                correoDestinatario={informacion_basica?.gmail ?? usuario.correo}
                nombreDestinatario={fullName}
                whatsappNumber={whatsappNumber}
              />
            </>
          )}

          {mostrarCV && (
            <button
              onClick={handleDescargarCV}
              disabled={descargandoCV}
              data-track="clic_descargar_cv"
              className="
                flex items-center gap-2
                bg-white/5 hover:bg-white/10
                backdrop-blur-xl border border-white/10
                text-white/90 px-7 py-3 rounded-xl
                text-xs font-semibold transition-all
                hover:border-white/20
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              <span>{descargandoCV ? "Generando..." : "Descargar CV"}</span>
              <ExternalLink size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent"></div>
    </div>
  );
};

export default PortfolioHeader;