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

// NUEVO: Servicio para descargar el PDF directo desde el backend
export const descargarReportePdf = async (data: ReportDataPayload) => {
    try {
        const response = await apiClient.post(`reportes/enviar-pdf`, data, {
            responseType: 'blob' // CRÍTICAL: Permite recibir el flujo binario del archivo PDF
        });
        return response.data; // Esto será un objeto de tipo Blob
    } catch (error) {
        console.error('Error al descargar el PDF directo:', error);
        throw error;
    }
};