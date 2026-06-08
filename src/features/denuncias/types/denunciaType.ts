export interface EtiquetaDenuncia {
    id_etiqueta_denuncia: number
    nombre: string
}

export interface DenunciaForm {
    id_etiqueta_denuncia: number | null
    motivo: string
}
