export type Certificado = {
  id: string;
  titulo: string;
  imagen: string;
  orientacion: "horizontal" | "vertical";
};

type Props = {
  cert: Certificado;
  onClick: () => void;
  eliminando?:boolean;
};

// CertificadoCard.tsx - sacar el posicionamiento, la card no debe saber dónde está
export function CertificadoCard({ cert, onClick, eliminando }: Props) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl overflow-hidden bg-white p-2 shadow-sm transition w-full h-full
        ${
          eliminando
            ? ` cursor-pointer hover:bg-red-50 hover:ring-2 hover:ring-red-400`
            : ` cursor-pointer hover:scale-105`
        }
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
