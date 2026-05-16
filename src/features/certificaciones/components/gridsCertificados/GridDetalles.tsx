import { CardTexto } from "../ordenarCards/CardTexto";


export type Detalle = {
  id: string;
  titulo: string;
  descripcion?: string;
  institucion?: string;
  fecha?: string;
  categoria?: string;
};

type Props = {
  certificados: Detalle[];
};

export function GridDetalles({
  certificados,
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
      {certificados.map((detalle) => (
        <CardTexto
          key={detalle.id}
          titulo={detalle.titulo}
          descripcion={""+detalle.descripcion}
          institucion={detalle.institucion}
          fecha={detalle.fecha}
          categoria={detalle.categoria}
        />
      ))}
    </div>
  );
}