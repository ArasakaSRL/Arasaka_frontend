import { useState } from "react";
import { CertificadoViewer } from "../CertificadoViewer";
import { CardHibrida } from "../ordenarCards/cardHibrida";

export type CertificacionHibrida = {
  id: string;
  titulo: string;
  descripcion: string;
  institucion: string;
  fecha: string;
  categoria: string;
  imagen: string;
};

type Props = {
  certificados: CertificacionHibrida[];
};

export function GridHibrido({
  certificados,
}: Props) {

  const [viewerIndex, setViewerIndex] =
    useState<number | null>(null);

  return (
    <>
      {/* ───────── MOBILE ───────── */}
      <div className="flex md:hidden flex-col gap-5">

        {certificados.map((cert, index) => (
          <CardHibrida
            key={cert.id}
            titulo={cert.titulo}
            descripcion={cert.descripcion}
            institucion={cert.institucion}
            fecha={cert.fecha}
            categoria={cert.categoria}
            imagen={cert.imagen}
            onClick={() => setViewerIndex(index)}
          />
        ))}

      </div>

      {/* ───────── DESKTOP ───────── */}
      <div
        className="
          hidden md:grid
          grid-cols-2
          gap-6
          items-start
        "
      >

        {certificados.map((cert, index) => (
          <CardHibrida
            key={cert.id}
            titulo={cert.titulo}
            descripcion={cert.descripcion}
            institucion={cert.institucion}
            fecha={cert.fecha}
            categoria={cert.categoria}
            imagen={cert.imagen}
            onClick={() => setViewerIndex(index)}
          />
        ))}

      </div>

      {/* ───────── VIEWER ───────── */}
      {viewerIndex !== null && (
        <CertificadoViewer
          certificados={certificados.map((cert) => ({
            id: cert.id,
            titulo: cert.titulo,
            imagen: cert.imagen,
            orientacion: "horizontal",
          }))}
          indexActual={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onNext={() =>
            setViewerIndex((p) =>
              p === null
                ? null
                : (p + 1) % certificados.length
            )
          }
          onPrev={() =>
            setViewerIndex((p) =>
              p === null
                ? null
                : (p - 1 + certificados.length) %
                  certificados.length
            )
          }
        />
      )}
    </>
  );
}