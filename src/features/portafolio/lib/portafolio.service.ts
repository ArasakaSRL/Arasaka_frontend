import apiClient from "@/api/api";
import { mapPortafolio } from "@/features/portafolio/types/mappers/portafolio.mapper";
import type {CreatePortafolio, GetPortafolio} from "@/features/portafolio/types/portafolioType";
import { data } from "react-router-dom";
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

export const createPortafolio = async(data: CreatePortafolio) => {
    try  {
        const response = await apiClient.post('/portafolios', data);
        return response.data;
    }catch (error){
        console.error("Error creating portfolio:", error);
        throw error;
    }
}

export const obtnerPortafolio = async (): Promise<GetPortafolio> => {
    try {
        const response = await apiClient.get('/portafolios');
        return response.data;
    } catch (error) {
        console.error("Error fetching portfolio:", error);
        throw error;
    }
}