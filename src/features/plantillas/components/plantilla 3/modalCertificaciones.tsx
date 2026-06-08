import { X, ExternalLink } from "lucide-react";

import type {
  certificaciones,
} from "@/features/portafolio/types/portafolioType";

type Props = {
  certificacion: certificaciones;
  onClose: () => void;
};

export default function ModalCertificacion({
  certificacion,
  onClose,
}: Props) {

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString(
        "es-ES",
        {
          month: "long",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-4xl border-4 border-slate-900 text-slate-900 w-full max-w-4xl overflow-hidden shadow-[14px_14px_0px_0px_rgba(123,223,242,1)] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-900 text-white rounded-full p-2 z-20"
        >
          <X size={16} />
        </button>
        <div className="flex flex-col md:flex-row">
        {/* Imagen */}
        <div className="w-full md:w-1/2">
          <div className="relative h-62.5 md:h-full bg-[#eff7f6]">
            <img
              src={certificacion.url_certificado!}
              alt={certificacion.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-[#7bdff2] border-2 border-slate-900 text-[9px] font-black uppercase px-3 py-1 rounded-full">
              {certificacion.categoria}
            </div>
          </div>
        </div>
        {/* Información */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center gap-1 md:gap-4">
          <h3 className="text-xl md:text-2xl font-black">
            {certificacion.titulo}
          </h3>
          <p className="text-sm text-[#f2b5d4] font-black mt-1">
            {certificacion.institucion}
          </p>
          <span className="inline-block text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3 bg-[#eff7f6] px-2 py-1 rounded border border-slate-200 w-fit">
            Otorgado: {formatDate(certificacion.fecha_emision)}
          </span>
          <p className="text-xs md:text-sm text-left text-slate-600 leading-relaxed bg-[#eff7f6] p-4 rounded-xl border border-slate-200 mt-5">
            {certificacion.descripcion}
          </p>
          {certificacion.url_certificado && (
            <a
              href={certificacion.url_certificado}
              target="_blank"
              rel="noreferrer"
              className="mt-5 w-fit inline-flex items-center justify-center bg-[#7bdff2] border-2 border-slate-900 px-5 py-2 rounded-xl font-black text-xs uppercase"
            >
              <ExternalLink size={16} className="mr-2" />
              Ver Certificado
            </a>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}