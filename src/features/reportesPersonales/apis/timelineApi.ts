import apiClient from "@/api/api";
import { useAuthStore } from "@/stores/authStore";

const getIdPortafolio = (): string => {
  const id =
    useAuthStore.getState().portafolioSeleccionado?.id_portafolio;

  if (!id) {
    throw new Error("No hay portafolio seleccionado");
  }

  return id;
};

export const getTimelineExperiencias = async () => {
  const id = getIdPortafolio();

  const response = await apiClient.get(
    `/portafolios/${id}/experiencias/timeline`
  );

  return response.data.data;
};

export const getTimelineCertificaciones = async () => {
  const id = getIdPortafolio();

  const response = await apiClient.get(
    `/portafolios/${id}/certificaciones/timeline`
  );

  return response.data.data;
};