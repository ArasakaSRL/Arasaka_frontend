// hooks/usePortfolioData.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

import type {
  Usuario, habilidades, experiencias,
  HabilidadTecnica, HabilidadBlanda,
  Proyectos, configuracion, certificaciones,
  InformacionBasica, formacion_academica
} from '@/features/portafolio/types/portafolioType';

import { getPortafolioPublic } from '@/features/portafolio/lib/portafolio.service';

interface PortfolioData {
  usuario: Usuario;
  informacion_basica: InformacionBasica | null;
  habilidades: habilidades;
  experiencias: experiencias[];
  habilidadesTecnicas: HabilidadTecnica[];
  habilidadesBlandas: HabilidadBlanda[];
  proyectos: Proyectos[];
  configuracion: configuracion;
  certificaciones: certificaciones[];
  formacion_academica: formacion_academica[];
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
          informacion_basica:  res.informacion_basica ?? null,
          habilidades:         res.habilidades,
          experiencias:        res.experiencias,
          habilidadesTecnicas: res.habilidades.tecnicas,   // ← mismo que tenías
          habilidadesBlandas:  res.habilidades.blandas,    // ← mismo que tenías
          proyectos:           res.proyectos,
          configuracion:       res.configuracion,
          certificaciones:     res.certificaciones,
          formacion_academica: res.formacion_academica ?? [],
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