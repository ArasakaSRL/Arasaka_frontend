export type Certificado = {
  id: string;
  titulo: string;
  imagen: string;
  orientacion: "horizontal" | "vertical";
};

type Props = {
  cert: Certificado;
  onClick: () => void;
};

export function CertificadoCard({ cert, onClick  }: Props) {
  const isVertical = cert.orientacion === "vertical";

  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer
        rounded-xl overflow-hidden bg-white p-2 shadow-sm
        hover:scale-105 transition
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