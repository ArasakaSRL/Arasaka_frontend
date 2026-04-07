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

// CertificadoCard.tsx - sacar el posicionamiento, la card no debe saber dónde está
export function CertificadoCard({ cert, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl overflow-hidden bg-white p-2 shadow-sm hover:scale-105 transition w-full h-full"
    >
      <img
        src={cert.imagen}
        alt={cert.titulo}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
