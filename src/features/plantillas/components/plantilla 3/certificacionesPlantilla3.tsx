import { useState } from "react";
import { Eye, Medal} from "lucide-react";

import type { certificaciones } from "@/features/portafolio/types/portafolioType";
import ModalCertificacion from "./modalCertificaciones";
import { AnimatePresence } from "framer-motion";

type Props = {
  certificaciones: certificaciones[];
};

export default function CertificacionesPastel({
  certificaciones,
}: Props) {
  const [selectedCert, setSelectedCert] =
    useState<certificaciones | null>(null);

  return (
    <>
      <section className="bg-white border-4 border-slate-900 rounded-[36px] p-6 md:p-8 shadow-[14px_14px_0px_0px_rgba(123,223,242,1)] space-y-6">
        <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-4">
          <div className="w-8 h-8 rounded-full bg-[#f7d6e0] border-2 border-slate-900 flex items-center justify-center">
            <Medal size={20} color="black" />
          </div>
          <h3 className="font-black text-xl tracking-tight text-slate-900 uppercase">
            Certificaciones
          </h3>
        </div>
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {certificaciones.map((cert) => (
            <div
              key={cert.id_certificacion}
              onClick={() => setSelectedCert(cert)}
              className="cursor-pointer px-4 flex-col bg-white border-2 border-slate-900 p-4 rounded-3xl hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 transition duration-300 flex items-center gap-1 group"
            >
              {/* imagen */}
              <div className="w-40 h-30 rounded-2xl bg-[#eff7f6] border-2 border-slate-900 overflow-hidden shrink-0 flex items-center justify-center relative">
                <img
                  src={cert.url_certificado ?? undefined}
                  alt={cert.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#7bdff2]/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Eye className="w-5 h-5 text-slate-900" />
                </div>
              </div>
              {/* titulo */}
              <div className="w-full min-w-0">
                <h4 className="overflow-hidden whitespace-nowrap text-ellipsis font-black text-xs text-slate-900 group-hover:text-[#f2b5d4] transition">
                  {cert.titulo}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>
      <AnimatePresence>
        {selectedCert && (
          <ModalCertificacion
            certificacion={selectedCert}
            onClose={() => setSelectedCert(null)}
          />
        )}
      </AnimatePresence>
          </>
        );
}