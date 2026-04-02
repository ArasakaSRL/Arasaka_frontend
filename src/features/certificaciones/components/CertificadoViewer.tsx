import type { Certificado } from "./CertificadoCard";


type Props = {
  certificados: Certificado[];
  indexActual: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export function CertificadoViewer({
  certificados,
  indexActual,
  onClose,
  onNext,
  onPrev,
}: Props) {
  const cert = certificados[indexActual];

  if (!cert) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      
      {/* BOTÓN CERRAR */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl"
      >
        ✕
      </button>

      {/* BOTÓN IZQUIERDA */}
      <button
        onClick={onPrev}
        className="absolute left-4 text-white text-3xl"
      >
        {"<"}
      </button>

      {/* IMAGEN */}
      <img
        src={cert.imagen}
        alt={cert.titulo}
        className="max-w-[90%] max-h-[90%] object-contain rounded-lg"
      />

      {/* BOTÓN DERECHA */}
      <button
        onClick={onNext}
        className="absolute right-4 text-white text-3xl"
      >
        {">"}
      </button>
    </div>
  );
}