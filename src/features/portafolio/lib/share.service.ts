import apiClient from "@/api/api";

export interface LinkPortafolio {
    slug: string;
    url: string | null;
    link_activo: boolean;
    fecha_expiracion: string | null;
    expirado: boolean;
}

export const obtenerLinkPortafolio = async (slug: string): Promise<LinkPortafolio> => {
    const { data } = await apiClient.get<LinkPortafolio>(
        `/configuracion/portafolio-link/${slug}`
    );
    return data;
};

export const generarLinkPortafolio = async (slug: string): Promise<LinkPortafolio> => {
    const { data } = await apiClient.post<LinkPortafolio>(
        `/configuracion/portafolio-link/${slug}`
    );
    return data;
};