import apiClient from "@/api/api";
import { mapPortafolio } from "@/features/portafolio/types/mappers/portafolio.mapper";

export const getPortafolio = async (slug: string) => {
    try {
    const { data } = await apiClient.get(`/public/portafolio/${slug}`);

    return mapPortafolio(data);
} catch (error) {
    console.error("Error fetching portfolio:", error);
    throw error;
} 
}