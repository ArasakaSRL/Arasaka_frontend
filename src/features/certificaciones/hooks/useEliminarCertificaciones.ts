import { useState } from "react";
import { eliminarMultiplesCertificaciones } from "../apis/certificacionesApi";

export const useEliminarCertificaciones = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const eliminarCertificaciones = async (ids: string[]) => {
    setIsDeleting(true);
    try {
      const response = await eliminarMultiplesCertificaciones(ids);
      return response;
    } finally {
      setIsDeleting(false);
    }
  };

  return { eliminarCertificaciones, isDeleting };
};