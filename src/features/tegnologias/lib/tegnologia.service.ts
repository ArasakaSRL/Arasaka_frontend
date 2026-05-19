import  type { Tecnologia, TecnologiaResponse, CreateTecnologia } from "../types/tecnologia.types"; 
import apiClient from "@/api/api"


export const createTecnologia = async (data: CreateTecnologia) : Promise<TecnologiaResponse> => { 
    try{
        const  response = await apiClient.post("/tecnologia", data);
        return response.data;
    }catch (err){
        console.error("Error al crear tecnología:", err);
         return {
            success: false,
            message: "Error al crear tecnología",
            data: [],
            pagination: {
                current_page: 0,
                last_page: 0,
                per_page: 0,
                total: 0,
            },
        };
    }
}

export const getTecnologias = async (page: number): Promise<TecnologiaResponse> => {
    try {
        const response = await apiClient.get(`/tecnologia?page=${page}`);
        return response.data;
    } catch (err) {
        console.error("Error al obtener tecnologías:", err);
        return {
            success: false,
            message: "Error al obtener tecnologías",
            data: [],
            pagination: {
                current_page: 0,
                last_page: 0,
                per_page: 0,
                total: 0,
            },
        };
    }
}