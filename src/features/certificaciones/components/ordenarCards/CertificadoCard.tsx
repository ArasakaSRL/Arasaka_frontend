export type Certificado = {
  id: string;
  titulo: string;
  imagen: string;
  orientacion: "horizontal" | "vertical";
};

type Props = {
  cert: Certificado;
  onClick: () => void;
  eliminando?: boolean;
  seleccionado?: boolean;
};


export function CertificadoCard({
  cert,
  onClick,
  eliminando,
  seleccionado,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        w-[360px]
        rounded-2xl overflow-hidden
        bg-white shadow-sm border border-gray-200
        transition-all duration-300

        ${
          eliminando
            ? seleccionado
              ? "cursor-pointer bg-red-50 ring-2 ring-red-500"
              : "cursor-pointer hover:bg-red-50 hover:ring-2 hover:ring-red-400"
            : "cursor-pointer hover:-translate-y-2 hover:shadow-xl"
        }
      `}
    >
      <img
        src={cert.imagen}
        alt={cert.titulo}
        className={`
          w-full transition-transform duration-500
          hover:scale-105

          ${
            cert.orientacion === "vertical"
              ? "object-contain bg-white"
              : "object-cover h-[220px]"
          }
        `}
      />
    </div>
  );
}