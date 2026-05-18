// src/features/certificaciones/hooks/useCertificaciones.ts
import { useState, useEffect } from 'react';
import type { CertificacionAPI } from '../types';
import { getCertificacionesPorCategoria, getTodasCertificaciones } from '../apis/certificacionesApi';

export function useCertificaciones(idCategoriaFiltro: string | null) {
  const [certificados, setCertificados] = useState<CertificacionAPI[]>([]);
  const [isLoadingCerts, setIsLoadingCerts] = useState<boolean>(true);
  const [isUsingFallbackCerts, setIsUsingFallbackCerts] = useState<boolean>(false);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        setIsLoadingCerts(true);
        let data: CertificacionAPI[];

        if (idCategoriaFiltro) {
          data = await getCertificacionesPorCategoria(idCategoriaFiltro);
        } else {
          data = await getTodasCertificaciones();
        }

        if (data) {
          // 👇 LA DATA YA VIENE PERFECTA ("nombre"), LA PASAMOS DIRECTO
          setCertificados(data);
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