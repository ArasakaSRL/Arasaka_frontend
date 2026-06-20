import { useState, useEffect, useCallback } from 'react';
import { getVisitantes, getInteracciones } from '../apis/analisisApi'; // Ajusta la ruta
import { useAuthStore } from '@/stores/authStore';
import type { VisitanteAPI, InteraccionesData } from '../types/analisis'; // Ajusta la ruta

export function useAnalytics() {
  const idPortafolio = useAuthStore(
    s => s.portafolioSeleccionado?.id_portafolio
  );

  const [visitantes, setVisitantes] = useState<VisitanteAPI[]>([]);
  const [interacciones, setInteracciones] = useState<InteraccionesData | null>(null);
  
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [isErrorAnalytics, setIsErrorAnalytics] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoadingAnalytics(true);
      setIsErrorAnalytics(false);

      // Usamos Promise.all para disparar ambas peticiones al mismo tiempo
      const [visitantesData, interaccionesData] = await Promise.all([
        getVisitantes(),
        getInteracciones()
      ]);

      setVisitantes(visitantesData.data ?? []);
      setInteracciones(interaccionesData.data ?? null);

    } catch (err) {
      console.error('Error al obtener las analíticas:', err);
      setVisitantes([]);
      setInteracciones(null);
      setIsErrorAnalytics(true);
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  useEffect(() => {
    if (idPortafolio) {
      fetchAnalytics();
    }
  }, [fetchAnalytics, idPortafolio]);

  return {
    visitantes,
    interacciones,
    isLoadingAnalytics,
    isErrorAnalytics,
    refetchAnalytics: fetchAnalytics
  };
}