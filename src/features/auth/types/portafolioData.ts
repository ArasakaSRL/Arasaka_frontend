interface TipoExperiencia {
    id_tipo_experiencia: string
    nombre: string
}

interface Experiencia {
    id_experiencia: string
    id_portafolio: string
    id_tipo_experiencia: string
    cargo: string
    nombre_organizacion: string
    descripcion: string | null
    fecha_inicio: string
    fecha_fin: string | null
    vigente: boolean
    tipo: TipoExperiencia | null
}


interface Habilidad {
    id_habilidad: string
    id_portafolio: string
    nombre: string
    categoria_habilidad: string
    nivel: string
    fecha_creacion: string
    fecha_actualizacion: string
}

interface Proyecto {
    id_proyecto: string
    id_portafolio: string
    nombre: string
    descripcion: string | null
    fecha_inicio: string
    fecha_fin: string | null
    url_demo: string | null
    url_github: string | null
    destacado: boolean
    fecha_creacion: string
    fecha_actualizacion: string
}

interface Servicio {
    id_servicio: string
    id_portafolio: string
    nombre: string
    descripcion: string | null
    activo: boolean
}

export interface PortafolioCompleto {
    id_portafolio: string
    id_usuario: string
    nombre: string
    visibilidad: boolean
    descripcion: string | null
    slug: string
    fecha_creacion: string
    fecha_actualizacion: string
    proyectos: Proyecto[]
    habilidades: Habilidad[]
    experiencias: Experiencia[]
    servicios: Servicio[]
}
