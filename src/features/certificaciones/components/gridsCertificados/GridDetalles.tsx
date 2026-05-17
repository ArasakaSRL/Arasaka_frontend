import { CardTexto } from "../ordenarCards/CardTexto";
import type { Certificado } from "../ordenarCards/CertificadoCard";

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

export function GridDetalles({
  certificados,
  modoAccion,
  certificadosEliminar,
  onEliminar,
}: Props) {
  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-5 md:gap-6
        items-start
      "
    >
      {certificados.map((cert) => (
        <CardTexto
          key={cert.id}
          titulo={cert.titulo}
          descripcion={""+cert.descripcion}
          institucion={""+cert.institucion}
          fecha={""+cert.fecha}
          categoria={""+cert.categoria}
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
        }}
        />
      ))}
    </div>
  );
}