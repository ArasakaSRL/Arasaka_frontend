import { Mail, MapPin, Download, MessageSquare, Compass, Shell } from "lucide-react";
import { generateCV } from "@/features/portafolio/lib/cv.generator";
import ContactarModal from "./formContacto";
import { toast } from "@/components/Alerta";
import { useState } from "react";
import type { Usuario, Proyectos, HabilidadTecnica, HabilidadBlanda, experiencias, certificaciones, InformacionBasica } from "@/features/portafolio/types/portafolioType";

type Props = {
  usuario: Usuario;
  proyectos: Proyectos[];
  tecnicas: HabilidadTecnica[];
  blandas: HabilidadBlanda[];
  experiencias: experiencias[];
  certificaciones: certificaciones[];
  informacion_basica?: InformacionBasica | null;
};

export default function PerfilBubble({ usuario, proyectos, tecnicas, blandas, experiencias, certificaciones, informacion_basica }: Props) {
  const [descargandoCV, setDescargandoCV] = useState(false);
  const [contactarOpen, setContactarOpen] = useState(false);
  const profesion = usuario.profesiones?.map((p) => p.nombre).join(" • ") || "Profesional";

    const partes = usuario.nombre?.split(" ") || [];

    const nombreMostrar = partes.slice(0, -1).join(" ");
    const apellidoMostrar = partes.slice(-1)[0] || "";

    const fullName = `${usuario.nombre} ${usuario.apellido}`;
    const whatsappNumber = usuario.telefonos?.[0]?.numero.replace( /\s+/g, "");

    const handleDescargarCV = async () => {
      if (descargandoCV) return;
      setDescargandoCV(true);
      try {
        await generateCV({
          usuario,
          proyectos,
          tecnicas,
          blandas,
          experiencias,
          certificaciones,
        });
        toast.success("PDF generado con éxito");
      } catch (error) {
        console.error(error);
        toast.error("Error al generar el PDF");
      } finally {
        setDescargandoCV(false);
      }
    };

    console.log("Usuario en PerfilBubble:", usuario.telefonos);
  return (
    <div className=" p-4 md:p-8 rounded-[40px]">
      <section className=" max-w-362.5 mx-auto bg-[#f8f8f8] border-[5px] border-[#0f172a] rounded-[42px] px-8 py-10 md:px-16 md:py-14 shadow-[14px_14px_0px_0px_#f2b5d4] relative overflow-hidden ">
        <div className="absolute top-0 right-0 flex gap-2 bg-[#f2b5d4] text-slate-950 font-black text-[10px] uppercase tracking-widest px-8 py-2 border-b-2 border-l-2 border-slate-900">
          <Shell className="w-4 h-4" />
          SOFTWARE CREATOR
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
          {/* FOTO */}
          <div className="col-span-1 md:col-span-4 flex flex-col items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#7bdff2] rounded-[40px] border-4 border-slate-900 translate-x-2 translate-y-2 transition-all duration-300"></div>
              <div className="relative w-40 h-40 md:w-44 md:h-44 rounded-[48px] bg-[#b2f7ef] overflow-hidden border-4 border-slate-900 flex items-center justify-center">
                {usuario.foto_perfil ? (
                  <img
                    src={usuario.foto_perfil}
                    alt={usuario.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-6xl text-black">{usuario.nombre.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white border border-slate-900 rounded-full px-3 py-1 text-[8px] font-black uppercase whitespace-nowrap">
                  {(() => {
                    const partes = usuario.nombre.split(" ");
                    if (partes.length >= 3) {
                      return `${partes[0]} ${partes[1]} ${partes[2][0]}.`;
                    }
                    return usuario.nombre;
                  })()}
                </div>
              </div>
            </div>
          </div>
          {/* INFO */}
          <div className="col-span-1 md:col-span-8 text-center md:text-left space-y-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 bg-[#b2f7ef] border-2 border-slate-900 text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <Compass className="w-3 h-3" />
                {profesion}
              </span>
              <h1
                className=" text-[56px] md:text-[78px] font-black leading-[0.9] tracking-[-3px] text-[#0f172a] "
                style={{
                  fontFamily: "League Spartan, sans-serif",
                }}
              >
                {nombreMostrar}
                <span className="text-[#f2b5d4]">
                  {" "}
                  {apellidoMostrar}
                </span>
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed max-w-2xl font-medium">
                {usuario.biografia}
              </p>
            {/* CONTACTO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <div className="bg-[#eff7f6] p-2.5 rounded-xl border-2 border-slate-900 flex items-center gap-2 text-xs font-semibold text-black">
                <Mail className="w-4 h-4 text-[#f2b5d4]" />
                <span className="truncate">
                  {usuario.correo}
                </span>
              </div>
              <div className="bg-[#eff7f6] p-2.5 rounded-xl border-2 border-slate-900 flex items-center gap-2 text-xs font-semibold text-black">
                <MapPin className="w-4 h-4 text-[#7bdff2]" />
                <span>
                  {usuario.pais}
                </span>
              </div>
            </div>
            {/* BOTONES */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
              <a
                onClick={() => setContactarOpen(true)}
                className=" bg-[#7bdff2] border-2 border-slate-900 text-slate-900 font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 "
              >
                <MessageSquare className="w-4 h-4" />
                Hablar conmigo
              </a>
              <button
                onClick={handleDescargarCV}
                disabled={descargandoCV}
                className=" bg-[#f7d6e0] border-2 border-slate-900 text-slate-900 font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 "
              >
                <Download className="w-4 h-4" />
                  {descargandoCV
                  ? "Generando..."
                  : "Obtener mi CV"}
              </button>
              <div className="hidden sm:block h-8 w-0.5 bg-slate-900 mx-1"></div>
              {/* Redes */}
              <div className="flex items-center gap-2">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                  <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg" 
                    className="w-6 h-6" 
                    alt="LinkedIn" 
                  />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                  <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" 
                    className="w-6 h-6" 
                    alt="GitHub" 
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ContactarModal 
        open={contactarOpen}
        onClose={() => setContactarOpen(false)}
        correoDestinatario={
          informacion_basica?.gmail ??
          usuario.correo
        }
        nombreDestinatario={fullName}
        whatsappNumber={whatsappNumber}
      />
    </div>
  );
}