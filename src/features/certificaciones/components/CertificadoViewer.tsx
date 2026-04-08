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

  // NUEVA FUNCIÓN: Maneja el clic en el fondo
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Si el elemento clickeado es el contenedor principal (el fondo negro)
    // y no uno de sus hijos (imagen o botones), entonces cerramos.
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onClick={handleBackdropClick} // <-- Agregamos el evento aquí
    >
      
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