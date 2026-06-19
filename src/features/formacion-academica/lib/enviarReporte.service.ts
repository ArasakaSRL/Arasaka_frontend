import  apiClient from "@/api/api";
import type {ReportDataPayload} from "../types/ReporteGmail.type";

export const enviarReporteGmail = async (data: ReportDataPayload) => {
    try {
        const response = await apiClient.post(`reportes/enviar-pdf`, data);
        return response.data;
    } catch (error) {
        console.error('Error al enviar reporte por Gmail:', error);
        throw error;
    }
};


export const descargarReportePdf = async (data: ReportDataPayload) => {
    try {
        const response = await apiClient.post(`reportes/enviar-pdf`, data, {
            responseType: 'blob' 
        });
        return response.data; 
    } catch (error) {
        console.error('Error al descargar el PDF directo:', error);
        throw error;
    }
};