import apiClient from "@/api/api";

export interface SocialNetworkBackend {
  id_red_profesional?: string;
  id_portafolio?: string;
  nombre: 'LinkedIn' | 'GitHub' | string;
  url: string;
}

export interface SaveSocialNetworksPayload {
  redes: {
    nombre: string;
    url: string;
  }[];
}

export const obtenerRedesProfesionales = async (portfolioId: string): Promise<SocialNetworkBackend[]> => {
  const { data } = await apiClient.get<SocialNetworkBackend[]>(
    `/portafolios/${portfolioId}/redes-profesionales`
  );
  return data;
};


export const guardarRedesProfesionales = async (
  portfolioId: string, 
  payload: SaveSocialNetworksPayload
): Promise<void> => {
  await apiClient.put(
    `/portafolios/${portfolioId}/redes-profesionales`, 
    payload
  );
};