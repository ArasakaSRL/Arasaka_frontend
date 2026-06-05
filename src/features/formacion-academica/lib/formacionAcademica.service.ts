import apiClient from "@/api/api";
import type {
    createFormacionProfesionalData,
    obtenerFormacionProfesionalData
} from "../types/formacionAcademica.type";

export const crearFormacionProfesional = async (data: createFormacionProfesionalData) => {
    try {
        const response = await apiClient.post('/formacion-academica', data);
        return response.data;
    } catch (error) {
        console.error('Error al crear formación profesional:', error);
        throw error;
    }
};

export const obtenerFormacionAcademica = async (
    idPortafolio: string
): Promise<obtenerFormacionProfesionalData> => {
    try {
        const response = await apiClient.get(
            `/formacion-academica/portafolio/${idPortafolio}`
        );

        return response.data;
    } catch (error) {
        console.error('Error al obtener formación profesional:', error);
        throw error;
    }
};