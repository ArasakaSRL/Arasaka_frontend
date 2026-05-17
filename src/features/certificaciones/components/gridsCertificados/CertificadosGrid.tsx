import { useMemo, useState } from "react";
import { CertificadoViewer } from "../CertificadoViewer";
import type { CertificacionAPI } from "../../types";
import { CertificadoCard, type Certificado } from "../ordenarCards/CertificadoCard";

type Props = {
  certificados: CertificacionAPI[];
  modoAccion: "editar" | "eliminar" | null;
  certificadosEliminar: string[];
  onEliminar: (cert: CertificacionAPI) => void;
};

type Columna = {
  altura: number;
  items: {
    cert: CertificacionAPI;
    index: number;
  }[];
};

export function CertificadosGrid({
  certificados,
  modoAccion,
  certificadosEliminar,
  onEliminar,
}: Props) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const adaptarCertificado = (cert: CertificacionAPI): Certificado => ({
    id: cert.id_certificacion,
    titulo: cert.titulo,
    imagen: cert.url_archivo,
    orientacion: (cert.orientacion_imagen as "horizontal" | "vertical") || "horizontal",
  });

  const columnas = useMemo(() => {
    const cols: Columna[] = [
      { altura: 0, items: [] },
      { altura: 0, items: [] },
      { altura: 0, items: [] },
    ];

    certificados.forEach((cert, index) => {
      /**
       * Peso visual
       */
      const peso =
        cert.orientacion_imagen === "vertical"
          ? 2.2
          : 1;

      /**
       * Buscar columna más baja
       */
      let columnaMenor = cols[0];

      for (const col of cols) {
        if (col.altura < columnaMenor.altura) {
          columnaMenor = col;
        }
      }

      /**
       * Insertar certificado
       */
      columnaMenor.items.push({
        cert,
        index,
      });

      columnaMenor.altura += peso;
    });

    return cols;
  }, [certificados]);

  return (
    <>
      {/* ───────── MOBILE ───────── */}
      <div className="flex md:hidden flex-col gap-5">
        {certificados.map((cert, index) => (
          <div key={cert.id_certificacion}>
            <CertificadoCard
              cert={adaptarCertificado(cert)}
              eliminando={modoAccion === "eliminar"}
              seleccionado={certificadosEliminar.includes(cert.id_certificacion)}
              onClick={() => {
                if (modoAccion === "eliminar") {
                  onEliminar(cert);
                  return;
                }

                setViewerIndex(index);
              }}
            />
          </div>
        ))}
      </div>

      {/* ───────── DESKTOP MASONRY ───────── */}
      <div className="hidden md:grid grid-cols-3 gap-6 items-start">
        {columnas.map((columna, colIndex) => (
          <div
            key={colIndex}
            className="flex flex-col gap-6"
          >
            {columna.items.map(({ cert, index }) => (
              <CertificadoCard
                key={cert.id_certificacion}
                cert={adaptarCertificado(cert)}
                eliminando={modoAccion === "eliminar"}
                seleccionado={certificadosEliminar.includes(cert.id_certificacion)}
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
        ))}
      </div>

      {/* ───────── VIEWER ───────── */}
      {viewerIndex !== null && (
        <CertificadoViewer
          certificados={certificados}
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