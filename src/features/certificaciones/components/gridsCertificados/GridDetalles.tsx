import type { CertificacionAPI } from "../../types";
import { CardTexto } from "../ordenarCards/CardTexto";


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
          key={cert.id_certificacion}
          titulo={cert.titulo}
          descripcion={cert.descripcion || ""}
          institucion={cert.institucion_emisora || ""}
          fecha={cert.fecha_obtencion ? cert.fecha_obtencion.split('T')[0] : ""}
          categoria={cert.categoria_certificacion?.nombre_categoria || ""}
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
        }}
        />
      ))}
    </div>
  );
}