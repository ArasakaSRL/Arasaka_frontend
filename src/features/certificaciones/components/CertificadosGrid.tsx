import { useState } from "react";
import { CertificadoCard, type Certificado } from "./CertificadoCard";
import { CertificadoViewer } from "./CertificadoViewer";
type Props = {
  certificados: Certificado[];
  modoAccion: "editar" | "eliminar" | null;
  onEliminar: (cert: Certificado) => void;
}

export function CertificadosGrid({ certificados, modoAccion, onEliminar}: Props) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const calcularLayout = (certs: Certificado[]) => {
    type Item = { cert: Certificado; col: number; row: number; colSpan: number; rowSpan: number };
    const items: Item[] = [];
    const ocupado: Set<string> = new Set();
    const estaOcupado = (col: number, row: number) => ocupado.has(`${col},${row}`);
    const ocuparCeldas = (col: number, row: number, colSpan: number, rowSpan: number) => {
      for (let r = row; r < row + rowSpan; r++)
        for (let c = col; c < col + colSpan; c++)
          ocupado.add(`${c},${r}`);
    };
    const siguienteCeldaLibre = (col: number, row: number): [number, number] => {
      let c = col, r = row;
      while (estaOcupado(c, r)) { c++; if (c > 4) { c = 1; r++; } }
      return [c, r];
    };

    let col = 1, row = 1;
    for (const cert of certs) {
      [col, row] = siguienteCeldaLibre(col, row);
      if (cert.orientacion === "vertical") {
        let placed = false;
        for (let c = col; c <= 4; c++) {
          if (!estaOcupado(c, row) && !estaOcupado(c, row + 1)) {
            items.push({ cert, col: c, row, colSpan: 1, rowSpan: 2 });
            ocuparCeldas(c, row, 1, 2);
            col = c + 1;
            placed = true;
            break;
          }
        }
        if (!placed) {
          row++; col = 1;
          items.push({ cert, col, row, colSpan: 1, rowSpan: 2 });
          ocuparCeldas(col, row, 1, 2);
          col = 2;
        }
      } else {
        items.push({ cert, col, row, colSpan: 1, rowSpan: 1 });
        ocuparCeldas(col, row, 1, 1);
        col++;
        if (col > 4) { col = 1; row++; }
      }
    }
    return items;
  };

  const layout = calcularLayout(certificados);

  return (
    <>
      {/* ── MÓVIL: carrusel horizontal ── */}
      <div className="flex md:hidden flex-col gap-4">
        {layout.map(({ cert }, index) => (
          <div
            key={cert.id}
            className={`w-full bg-white rounded-xl shadow-sm overflow-hidden p-2 transition-all select-none
              ${
                modoAccion==="eliminar"
                  ? `cursor-pointer hover:bg-red-50 hover:ring-2 hover:ring-red-400`
                  : `cursor-pointer `
              }
            `}
            style={{ height: cert.orientacion === "vertical" ? "70vw" : "50vw" }}
            onClick={() => {
            if (modoAccion==="eliminar") {
              onEliminar?.(cert);
              return;
            }
            setViewerIndex(index);
          }}
          >
            <img
              src={cert.imagen}
              alt={cert.titulo}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* ── DESKTOP: grid con layout inteligente ── */}
      <div
        className="hidden md:grid grid-cols-4 gap-4"
        style={{ gridAutoRows: "220px" }}
      >
        {layout.map(({ cert, col, row, colSpan, rowSpan }, index) => (
          <div
            key={cert.id}
            style={{
              gridColumn: `${col} / span ${colSpan}`,
              gridRow: `${row} / span ${rowSpan}`,
            }}
          >
            <CertificadoCard
              cert={cert}
              onClick={() => {
                if (modoAccion==="eliminar") {
                  onEliminar?.(cert);
                return;
                }
                setViewerIndex(index);
              }}
              eliminando = {modoAccion === "eliminar"}
            />
          </div>
        ))}
      </div>

      {viewerIndex !== null && (
        <CertificadoViewer
          certificados={layout.map(l => l.cert)}
          indexActual={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onNext={() => setViewerIndex(p => p === null ? null : (p + 1) % layout.length)}
          onPrev={() => setViewerIndex(p => p === null ? null : (p - 1 + layout.length) % layout.length)}
        />
      )}
    </>
  );
}