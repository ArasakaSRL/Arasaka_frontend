// src/features/certificaciones/hooks/useCertificaciones.ts
import { useState, useEffect } from 'react';
import type { CertificacionAPI } from '../types';
import { getCertificacionesPorCategoria, getTodasCertificaciones } from '../apis/certificacionesApi';
import { useAuthStore } from '@/stores/authStore';

export function useCertificaciones( idCategoriaFiltro: string | null) {
  const idPortafolio = useAuthStore(s => s.portafolioSeleccionado?.id_portafolio)
  // 1. 👇 El estado ahora guarda la interfaz completa de la API
  const [certificados, setCertificados] = useState<CertificacionAPI[]>([]);
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
          // 2. 👇 EL CAMBIO CLAVE: Guardamos la data tal cual llega del backend
          // Sin recortarla, para que la UI reciba las fechas, instituciones y categorías completas.
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

    if (idPortafolio) fetchCerts();
  }, [idCategoriaFiltro, idPortafolio]);

  return { certificados, isLoadingCerts, isUsingFallbackCerts };
}