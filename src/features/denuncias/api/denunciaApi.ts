import apiClient from '@/api/api'
import type { EtiquetaDenuncia, DenunciaForm } from '../types/denunciaType'

export async function getEtiquetas(): Promise<EtiquetaDenuncia[]> {
    const { data } = await apiClient.get<{ success: boolean; data: EtiquetaDenuncia[] }>(
        '/portafolios/etiquetas-denuncia'
    )
    return data.data
}

export async function denunciarPortafolio(idPortafolio: string, form: DenunciaForm): Promise<void> {
    await apiClient.post(`/portafolios/${idPortafolio}/denunciar`, form)
}
