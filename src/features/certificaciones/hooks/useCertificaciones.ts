// src/features/certificaciones/hooks/useCertificaciones.ts
import { useState, useEffect } from 'react';

import type { Certificado } from '../components/CertificadoCard';
import type { CertificacionAPI } from '../types';
import { getCertificacionesPorCategoria, getTodasCertificaciones } from '../apis/certificacionesApi';

// Tu mock original como respaldo por si la base de datos se cae
const certificadosMock: Certificado[] = [
  { id: "1", titulo: "Certificado 1", imagen: "https://res.cloudinary.com/dkopjpuqx/image/upload/v1774753657/de-reconocimiento_b95guz.png", orientacion: "horizontal" },
  { id: "3", titulo: "Certificado vertical", imagen: "https://res.cloudinary.com/dkopjpuqx/image/upload/v1774753667/imagen-ce-aenor_fqwiir.jpg", orientacion: "vertical" },
  { id: "2", titulo: "Certificado 2", imagen: "https://res.cloudinary.com/dkopjpuqx/image/upload/v1774753657/de-reconocimiento_b95guz.png", orientacion: "horizontal" },
  { id: "4", titulo: "Certificado 4", imagen: "https://res.cloudinary.com/dkopjpuqx/image/upload/v1774753657/de-reconocimiento_b95guz.png", orientacion: "horizontal" },
];

export function useCertificaciones(idPortafolio: string, idCategoriaFiltro: string | null) {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [isLoadingCerts, setIsLoadingCerts] = useState<boolean>(true);
  const [isUsingFallbackCerts, setIsUsingFallbackCerts] = useState<boolean>(false);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        setIsLoadingCerts(true);
        let data: CertificacionAPI[];

        // Decidimos a qué API llamar basado en si hay un filtro seleccionado
        if (idCategoriaFiltro) {
          data = await getCertificacionesPorCategoria(idPortafolio, idCategoriaFiltro);
        } else {
          data = await getTodasCertificaciones(idPortafolio);
        }

        if (data && data.length > 0) {
          // Mapeamos los datos de la API al formato que espera tu UI
          const certificadosMapeados: Certificado[] = data.map(apiCert => ({
            id: apiCert.id_certificacion,
            titulo: apiCert.titulo,
            imagen: apiCert.url_archivo,
            orientacion: apiCert.orientacion_imagen
          }));
          setCertificados(certificadosMapeados);
          setIsUsingFallbackCerts(false);
        } else {
          setCertificados(certificadosMock);
          setIsUsingFallbackCerts(true);
        }
      } catch (err) {
        console.error('Base de datos caída, usando mock de certificados', err);
        setCertificados(certificadosMock);
        setIsUsingFallbackCerts(true);
      } finally {
        setIsLoadingCerts(false);
      }
    };

    fetchCerts();
  }, [idPortafolio, idCategoriaFiltro]); // Se vuelve a ejecutar si cambia el filtro o el portafolio

  return { certificados, isLoadingCerts, isUsingFallbackCerts };
}