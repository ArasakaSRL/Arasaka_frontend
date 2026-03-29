export type Certificado = {
  id: string;
  titulo: string;
  imagen: string;
  orientacion: "horizontal" | "vertical";
};

type Props = {
  cert: Certificado;
};

export function CertificadoCard({ cert }: Props) {
  const isVertical = cert.orientacion === "vertical";

  return (
    <div
      className={`
        rounded-xl overflow-hidden bg-white p-2 shadow-sm
        ${isVertical ? "row-span-2 col-start-4" : ""}
      `}
    >
      <img
        src={cert.imagen}
        alt={cert.titulo}
        className="w-full h-full object-contain"
      />
    </div>
  );
}