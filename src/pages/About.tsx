import { CertificadosGrid } from "../features/certificaciones/components/CertificadosGrid";
import type { Certificado } from "../features/certificaciones/components/CertificadoCard";

export default function About() {

  const certificadosMock: Certificado[] = [
    {
      id: "1",
      titulo: "Certificado 1",
      imagen: "https://res.cloudinary.com/dkopjpuqx/image/upload/v1774753657/de-reconocimiento_b95guz.png",
      orientacion: "horizontal",
    },
    {
      id: "2",
      titulo: "Certificado 2",
      imagen: "https://res.cloudinary.com/dkopjpuqx/image/upload/v1774753657/de-reconocimiento_b95guz.png",
      orientacion: "horizontal",
    },
    {
      id: "4",
      titulo: "Certificado 4",
      imagen: "https://res.cloudinary.com/dkopjpuqx/image/upload/v1774753657/de-reconocimiento_b95guz.png",
      orientacion: "horizontal",
    },
    {
      id: "3",
      titulo: "Certificado vertical",
      imagen: "https://res.cloudinary.com/dkopjpuqx/image/upload/v1774753667/imagen-ce-aenor_fqwiir.jpg",
      orientacion: "vertical",
    },
    
    {
      id: "5",
      titulo: "Certificado 2",
      imagen: "https://res.cloudinary.com/dkopjpuqx/image/upload/v1774753657/de-reconocimiento_b95guz.png",
      orientacion: "horizontal",
    },
    {
      id: "6",
      titulo: "Certificado 2",
      imagen: "https://res.cloudinary.com/dkopjpuqx/image/upload/v1774753657/de-reconocimiento_b95guz.png",
      orientacion: "horizontal",
    },
    {
      id: "7",
      titulo: "Certificado 2",
      imagen: "https://res.cloudinary.com/dkopjpuqx/image/upload/v1774753657/de-reconocimiento_b95guz.png",
      orientacion: "horizontal",
    },
  ];
    return (
    <section id="center" className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Acerca de nosotros</h1>

      <p>Esta es una página adicional para probar React Router.</p>

      <CertificadosGrid certificados={certificadosMock} />
    </section>
  );
}
