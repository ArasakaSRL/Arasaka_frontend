import { useState } from "react";
import { CertificadoCard, type Certificado } from "./CertificadoCard";
import { CertificadoViewer } from "./CertificadoViewer";

// CertificadosGrid.tsx - todo el posicionamiento aquí
export function CertificadosGrid({ certificados }: { certificados: Certificado[] }) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // Calcular posiciones explícitas para cada cert
  const calcularLayout = (certs: Certificado[]) => {
    type Item = { cert: Certificado; col: number; row: number; colSpan: number; rowSpan: number };
    const items: Item[] = [];
    
    // grid de 4 columnas, rastrear qué celdas están ocupadas
    const ocupado: Set<string> = new Set();
    
    const estaOcupado = (col: number, row: number) => ocupado.has(`${col},${row}`);
    
    const ocuparCeldas = (col: number, row: number, colSpan: number, rowSpan: number) => {
      for (let r = row; r < row + rowSpan; r++) {
        for (let c = col; c < col + colSpan; c++) {
          ocupado.add(`${c},${r}`);
        }
      }
    };

    const siguienteCeldaLibre = (col: number, row: number): [number, number] => {
      let c = col, r = row;
      while (estaOcupado(c, r)) {
        c++;
        if (c > 4) { c = 1; r++; }
      }
      return [c, r];
    };

    let col = 1, row = 1;

    for (const cert of certs) {
      [col, row] = siguienteCeldaLibre(col, row);

      if (cert.orientacion === "vertical") {
        // vertical: 1 col, 2 rows — buscar espacio que tenga 2 filas libres
        // si no cabe en col actual, mover a col 4 de la misma fila
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
          // pasar a siguiente fila
          row++;
          col = 1;
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
      <div className="grid grid-cols-4 gap-4" style={{ gridAutoRows: "220px" }}>
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
              onClick={() => setViewerIndex(index)}
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