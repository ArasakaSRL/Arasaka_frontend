import { useState } from 'react';
import { crearCertificacion } from '../apis/certificacionesApi';
import type { CrearCertificacionDTO } from '../types';

export function useCrearCertificacion() {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const registrarCertificacion = async (idPortafolio: string, datosCertificacion: CrearCertificacionDTO) => {
    try {
      setIsCreating(true);
      setError(null);
      
      const nuevaCertificacion = await crearCertificacion(idPortafolio, datosCertificacion);
      
      // Opcional: Aquí podrías retornar la data si necesitas hacer algo tras el éxito
      return nuevaCertificacion; 
    } catch (err: any) {
      console.error('Error al registrar la certificación', err);
      setError(err.message || 'Ocurrió un error al intentar guardar la certificación.');
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return { registrarCertificacion, isCreating, error };
}