export type createFormacionProfesionalData = {
    id_portafolio: string,
    institucion: string,
    titulo: string,
    nivel: string,
    fecha_inicio: string,
    fecha_fin: string,
    descripcion: string,
}

export type obtenerFormacionProfesionalData = {
    mensaje: string,
    formacion_profesional: data[]
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