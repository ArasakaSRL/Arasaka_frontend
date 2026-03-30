import { CertificadoCard, type Certificado } from "./CertificadoCard";

export function CertificadosGrid({ certificados }: { certificados: Certificado[] }) {
  
  const organizarCertificados = (certs: Certificado[]) => {
    // 1. Separamos los certificados por su orientación
    const horizontales = certs.filter((c) => c.orientacion === "horizontal");
    const verticales = certs.filter((c) => c.orientacion === "vertical");
    
    const resultado: Certificado[] = [];

    // 2. Iteramos mientras tengamos certificados que ordenar
    while (horizontales.length > 0 || verticales.length > 0) {
      if (verticales.length > 0) {
        // Tomamos hasta 3 horizontales para la primera fila del bloque
        resultado.push(...horizontales.splice(0, 3));
        
        // Tomamos 1 vertical que se colocará en la columna 4 (abarcando 2 filas)
        resultado.push(verticales.shift()!);
        
        // Tomamos hasta 3 horizontales para la segunda fila del bloque
        resultado.push(...horizontales.splice(0, 3));
      } else {
        // Si ya no quedan verticales, simplemente agregamos el resto de horizontales
        resultado.push(...horizontales.splice(0, horizontales.length));
      }
    }
    
    return resultado;
  };

  // 3. Ejecutamos la función antes de renderizar
  const certificadosOrdenados = organizarCertificados(certificados);

  return (
    <div className="grid grid-cols-4 gap-4 auto-rows-[220px]">
      {certificadosOrdenados.map((cert) => (
        <CertificadoCard key={cert.id} cert={cert} />
      ))}
    </div>
  );
}