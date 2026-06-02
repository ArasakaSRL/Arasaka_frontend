import apiClient from "@/api/api";
import type {createFormacionProfesionalData, obtenerFormacionProfesionalData} from "@/features/portafolio/types/formacionProfecional.type";

export const crearFormacionProfesional = async (data: createFormacionProfesionalData) => {
    try {
        const response = await apiClient.post('/formacion-academica', data);
        return response.data;
    } catch (error) {
        console.error('Error al crear formación profesional:', error);
        throw error;
    }
};