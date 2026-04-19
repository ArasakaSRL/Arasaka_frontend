import apiClient from "@/api/api";

export type DuracionLink = "semana" | "mes" | "anio" | "sin_limite";

export interface LinkPortafolio {
    slug: string;
    url: string | null;
    link_activo: boolean;
    duracion: DuracionLink | null;
    fecha_expiracion: string | null;
    expirado: boolean;
}

export const obtenerLinkPortafolio = async (): Promise<LinkPortafolio> => {
    const { data } = await apiClient.get<LinkPortafolio>("/configuracion/portafolio-link");
    return data;
};

export const generarLinkPortafolio = async (
    duracion: DuracionLink,
): Promise<LinkPortafolio> => {
    const { data } = await apiClient.post<LinkPortafolio>(
        "/configuracion/portafolio-link",
        { duracion },
    );
    return data;
};
