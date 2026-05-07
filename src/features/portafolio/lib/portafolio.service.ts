import apiClient from "@/api/api";
import { mapPortafolio } from "@/features/portafolio/types/mappers/portafolio.mapper";

export const getPortafolioPublic = async (slug: string) => {
    try {
        const { data } = await apiClient.get(`/public/portafolio/${slug}`);

        return mapPortafolio(data);
    } catch (error) {
        console.error("Error fetching portfolio:", error);
        throw error;
    }



}

export const getPortafolioPrivate = async (slug: string) => {
    try {
        const { data } = await apiClient.get(`/configuracion/portafolio/${slug}`);

        return mapPortafolio(data);
    } catch (error) {
        console.error("Error fetching portfolio:", error);
        throw error;
    }



}