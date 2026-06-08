export interface EtiquetaDenunciaAdmin {
    id_etiqueta_denuncia: number
    nombre: string
}

export interface PortafolioResumen {
    id_portafolio: string
    nombre: string
    slug: string
    suspendido: boolean
}

export interface UsuarioResumen {
    id_usuario: string
    nombre: string
    apellido: string
    username: string
    correo: string
    url_foto: string | null
    suspendido: boolean
}

export interface DenunciaAdmin {
    id_denuncia_portafolio: string
    motivo: string | null
    created_at: string
    portafolio: PortafolioResumen & { usuario: UsuarioResumen }
    etiqueta: EtiquetaDenunciaAdmin
}

export interface PortafolioSuspendido {
    id_portafolio: string
    nombre: string
    slug: string
    suspendido: boolean
    suspendido_hasta: string | null
    usuario: UsuarioResumen
    denuncias: { etiqueta: EtiquetaDenunciaAdmin }[]
}

export interface UsuarioSuspendido {
    id_usuario: string
    nombre: string
    apellido: string
    username: string
    correo: string
    url_foto: string | null
    suspendido: boolean
    suspendido_hasta: string | null
    portafolios: PortafolioResumen[]
}

export interface SystemConfig {
    id: number
    denuncias_advertencia: number
    denuncias_suspension: number
    portafolios_advertencia: number
    portafolios_suspension: number
    dias_suspension_portafolio: number
    dias_suspension_usuario: number
}
