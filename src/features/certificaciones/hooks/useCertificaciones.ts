// src/features/certificaciones/hooks/useCertificaciones.ts
import { useState, useEffect } from 'react';

import type { Certificado } from '../components/CertificadoCard';
import type { CertificacionAPI } from '../types';
import { getCertificacionesPorCategoria, getTodasCertificaciones } from '../apis/certificacionesApi';

export function useCertificaciones( idCategoriaFiltro: string | null) {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [isLoadingCerts, setIsLoadingCerts] = useState<boolean>(true);
  const [isUsingFallbackCerts, setIsUsingFallbackCerts] = useState<boolean>(false);

  useEffect(() => {
  

    const fetchCerts = async () => {
      try {
        setIsLoadingCerts(true);
        let data: CertificacionAPI[];

        if (idCategoriaFiltro) {
          data = await getCertificacionesPorCategoria( idCategoriaFiltro);
        } else {
          data = await getTodasCertificaciones();
        }

        if (data) {
          const certificadosMapeados: Certificado[] = data.map(apiCert => ({
            id: apiCert.id_certificacion,
            titulo: apiCert.titulo,
            imagen: apiCert.url_archivo,
            orientacion: apiCert.orientacion_imagen
          }));
          
          setCertificados(certificadosMapeados);
          setIsUsingFallbackCerts(false);
        }
      } catch (err) {
        console.error('Error al obtener los certificados', err);
        setCertificados([]); 
        setIsUsingFallbackCerts(true);
      } finally {
        setIsLoadingCerts(false);
      }
    };

    fetchCerts();
  }, [idCategoriaFiltro]);

  return { certificados, isLoadingCerts, isUsingFallbackCerts };
}