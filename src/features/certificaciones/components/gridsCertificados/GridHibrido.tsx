import { useState } from "react";
import { CertificadoViewer } from "../CertificadoViewer";
import { CardHibrida } from "@/features/certificaciones/components/ordenarCards/CardHibrida";
import type { Certificado } from "../ordenarCards/CertificadoCard";

export type CertificacionHibrida = {
  id: string;
  titulo: string;
  descripcion?: string;
  institucion?: string;
  fecha?: string;
  categoria?: string;
  imagen: string;
};

type Props = {
  certificados: Certificado[];

  modoAccion:
    | "editar"
    | "eliminar"
    | null;

  certificadosEliminar: string[];

  onEliminar: (
    cert: Certificado
  ) => void;
};

export function GridHibrido({
  certificados,
  modoAccion,
  certificadosEliminar,
  onEliminar,
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
            descripcion={''+cert.descripcion}
            institucion={''+cert.institucion}
            fecha={''+cert.fecha}
            categoria={''+cert.categoria}
            imagen={cert.imagen}
            onClick={() => {
            if (modoAccion === "eliminar") {
              onEliminar(cert);
              return;
            }

            setViewerIndex(index);
          }}
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
            descripcion={""+cert.descripcion}
            institucion={""+cert.institucion}
            fecha={""+cert.fecha}
            categoria={""+cert.categoria}
            imagen={cert.imagen}
            eliminando={
              modoAccion === "eliminar"
            }

            seleccionado={
              certificadosEliminar.includes(cert.id)
            }
            onClick={() => {
              if (modoAccion === "eliminar") {
                onEliminar(cert);
                return;
              }

              setViewerIndex(index);
            }}
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