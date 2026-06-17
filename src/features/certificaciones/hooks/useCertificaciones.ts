import { useState, useEffect, useCallback } from 'react';
import type { CertificacionAPI } from '../types';
import {
  getCertificacionesPorCategoria,
  getTodasCertificaciones
} from '../apis/certificacionesApi';
import { useAuthStore } from '@/stores/authStore';

export function useCertificaciones(idCategoriaFiltro: string | null) {
  const idPortafolio = useAuthStore(
    s => s.portafolioSeleccionado?.id_portafolio
  );

  const [certificados, setCertificados] = useState<CertificacionAPI[]>([]);
  const [isLoadingCerts, setIsLoadingCerts] = useState(true);
  const [isUsingFallbackCerts, setIsUsingFallbackCerts] = useState(false);

  const fetchCerts = useCallback(async () => {
    try {
      setIsLoadingCerts(true);

      let data: CertificacionAPI[];

      if (idCategoriaFiltro) {
        data = await getCertificacionesPorCategoria(idCategoriaFiltro);
      } else {
        data = await getTodasCertificaciones();
      }

      setCertificados(data ?? []);
      setIsUsingFallbackCerts(false);

    } catch (err) {
      console.error('Error al obtener los certificados', err);
      setCertificados([]);
      setIsUsingFallbackCerts(true);
    } finally {
      setIsLoadingCerts(false);
    }
  }, [idCategoriaFiltro]);

  useEffect(() => {
    if (idPortafolio) {
      fetchCerts();
    }
  }, [fetchCerts, idPortafolio]);

  return {
    certificados,
    isLoadingCerts,
    isUsingFallbackCerts,
    refetchCertificaciones: fetchCerts
  };
}