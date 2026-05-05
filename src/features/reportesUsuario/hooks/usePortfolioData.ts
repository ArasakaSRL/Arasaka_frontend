// hooks/usePortfolioData.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

import type {
  Usuario, habilidades, experiencias,
  HabilidadTecnica, HabilidadBlanda,
  Proyectos, configuracion, certificaciones
} from '@/features/portafolio/types/portafolioType';

import { getPortafolioPublic } from '@/features/portafolio/lib/portafolio.service';

interface PortfolioData {
  usuario: Usuario;
  habilidades: habilidades;
  experiencias: experiencias[];
  habilidadesTecnicas: HabilidadTecnica[];
  habilidadesBlandas: HabilidadBlanda[];
  proyectos: Proyectos[];
  configuracion: configuracion;
  certificaciones: certificaciones[];
}

export function usePortfolioData(slug: string | undefined) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [noDisponible, setNoDisponible] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetch = async () => {
      try {
        setLoading(true);
        setNoDisponible(false);
        const res = await getPortafolioPublic(slug);

        setData({
          usuario:             res.usuario,
          habilidades:         res.habilidades,
          experiencias:        res.experiencias,
          habilidadesTecnicas: res.habilidades.tecnicas,   // ← mismo que tenías
          habilidadesBlandas:  res.habilidades.blandas,    // ← mismo que tenías
          proyectos:           res.proyectos,
          configuracion:       res.configuracion,
          certificaciones:     res.certificaciones,
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setNoDisponible(true);
        }
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [slug]);

  return { data, loading, noDisponible };
}