export type createFormacionProfesionalData = {
    id_portafolio: string,
    institucion: string,
    titulo: string,
    nivel: string,
    fecha_inicio: string,
    fecha_fin: string,
    descripcion: string,
}

export type FormacionAcademica = {
    id_formacion_academica: string,
    id_portafolio: string,
    institucion: string,
    titulo: string,
    nivel: string,
    fecha_inicio: string,
    fecha_fin: string,
    descripcion: string,
}

export type obtenerFormacionProfesionalData = {
    message: string,
    data: FormacionAcademica[]
}
export type data ={
    id_formacion_profesional: string,
    id_portafolio: string,
    institucion: string,
    titulo: string,
    nivel: string,
    fecha_inicio: string,
    fecha_fin: string,
    descripcion: string,
}