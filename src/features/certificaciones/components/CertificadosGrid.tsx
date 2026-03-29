import { CertificadoCard, type Certificado } from "./CertificadoCard";

export function CertificadosGrid({ certificados }: { certificados: Certificado[] }) {
  return (
    <div
      className="grid grid-cols-4 gap-4 auto-rows-[220px]"
    >
      {certificados.map((cert) => (
        <CertificadoCard key={cert.id} cert={cert} />
      ))}
    </div>
  );
}