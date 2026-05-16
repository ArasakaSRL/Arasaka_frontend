import { useMemo, useState } from "react";
import { CertificadoCard, type Certificado } from "./CertificadoCard";
import { CertificadoViewer } from "./CertificadoViewer";

type Props = {
  certificados: Certificado[];
  modoAccion: "editar" | "eliminar" | null;
  certificadosEliminar: string[];
  onEliminar: (cert: Certificado) => void;
};

type Columna = {
  altura: number;
  items: {
    cert: Certificado;
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
        cert.orientacion === "vertical"
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
          <div key={cert.id}>
            <CertificadoCard
              cert={cert}
              eliminando={modoAccion === "eliminar"}
              seleccionado={certificadosEliminar.includes(cert.id)}
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
                key={cert.id}
                cert={cert}
                eliminando={modoAccion === "eliminar"}
                seleccionado={certificadosEliminar.includes(cert.id)}
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