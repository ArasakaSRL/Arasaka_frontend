import { useState } from "react";
import { CertificadoCard, type Certificado } from "./CertificadoCard";
import { CertificadoViewer } from "./CertificadoViewer";

export function CertificadosGrid({ certificados }: { certificados: Certificado[] }) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  
  const organizarCertificados = (certs: Certificado[]) => {
    const horizontales = certs.filter((c) => c.orientacion === "horizontal");
    const verticales = certs.filter((c) => c.orientacion === "vertical");
    const resultado: Certificado[] = [];

    while (horizontales.length > 0 || verticales.length > 0) {
      if (verticales.length > 0) {
        resultado.push(...horizontales.splice(0, 3));
        resultado.push(verticales.shift()!);
        resultado.push(...horizontales.splice(0, 3));
      } else {
        resultado.push(...horizontales.splice(0, horizontales.length));
      }
    }
    
    return resultado;
  };

  const certificadosOrdenados = organizarCertificados(certificados);

  const next = () => {
    setViewerIndex((prev) =>
      prev === null ? null : (prev + 1) % certificadosOrdenados.length
    );
  };

  const prev = () => {
    setViewerIndex((prev) =>
      prev === null
        ? null
        : (prev - 1 + certificadosOrdenados.length) %
          certificadosOrdenados.length
    );
  };
  return (
    <>
      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-2
        lg:grid-cols-4
        gap-4
        sm:auto-rows-[220px]
      ">
        {certificadosOrdenados.map((cert, index) => (
          <div className="min-w-[85%] sm:min-w-0">
            <CertificadoCard
              key={cert.id}
              cert={cert}
              onClick={() => setViewerIndex(index)}
            />
          </div>
        ))}
      </div>

      {viewerIndex !== null && (
        <CertificadoViewer
          certificados={certificadosOrdenados}
          indexActual={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onNext={next}
          onPrev={prev}
        />
      )}
    </>
  );
}