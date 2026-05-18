import { useState } from "react";
import { CertificadoViewer } from "../CertificadoViewer";
import { CardHibrida } from "@/features/certificaciones/components/ordenarCards/CardHibrida";
import type { CertificacionAPI } from "../../types";

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
  certificados: CertificacionAPI[];

  modoAccion:
    | "editar"
    | "eliminar"
    | null;

  certificadosEliminar: string[];

  onEliminar: (
    cert: CertificacionAPI
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
            key={cert.id_certificacion}
            titulo={cert.titulo}
            descripcion={cert.descripcion || ""}
            institucion={cert.institucion_emisora || ""}
            fecha={cert.fecha_obtencion ? cert.fecha_obtencion.split('T')[0] : ""}
            categoria={cert.categoria_certificacion?.nombre_categoria || ""}
            imagen={cert.url_archivo}
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
            key={cert.id_certificacion}
            titulo={cert.titulo}
            descripcion={cert.descripcion || ""}
            institucion={cert.institucion_emisora || ""}
            fecha={cert.fecha_obtencion ? cert.fecha_obtencion.split('T')[0] : ""}
            categoria={cert.categoria_certificacion?.nombre_categoria || ""}
            imagen={cert.url_archivo}
            eliminando={
              modoAccion === "eliminar"
            }

            seleccionado={
              certificadosEliminar.includes(cert.id_certificacion)
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
            id: cert.id_certificacion,
            titulo: cert.titulo,
            imagen: cert.url_archivo,
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