export type Telefono = {
    numero: string;
};

export type Profession = {
    id_profesion: string;
    nombre: string;
    descripcion: string;
};

export type Usuario = {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    biografia: string | null;
    foto_perfil: string | null;
    telefonos: Telefono[];
    pais: string;
    profesiones: Profession[];
    idiomas: string[];
};

export type Imagenes = {
    url: string;
};

export type tecnologias = {
    nombre: string;
    descripcion: string;
    logo: string;
    categoria: string | null;
};

export type Proyectos = {
    id_proyecto: string;
    nombre: string;
    descripcion: string;
    estados: string[];
    url_demo: string | null;
    url_repositorio: string | null;
    imagenes: Imagenes[];
    tecnologias: tecnologias[];
};

export type HabilidadTecnica = {
    id_habilidad: string;
    nombre: string | null;
    descripcion: string | null;
    nivel: string | null;
    tecnologias: tecnologias[];
};
export type HabilidadBlanda = {
    id_habilidad: string;
    nombre: string | null;
    descripcion: string | null;
    nivel: string | null;
};

export type habilidades = {
    tecnicas: HabilidadTecnica[];
    blandas: HabilidadBlanda[];
};

export type experiencias = {
    id_experiencia: string;
    cargo: string;
    Nombre_empresa: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string | null;
    tipo: string | null;
    vigencia: string | null;
};

export type servicios = {
    id_servicio: string;
    nombre: string;
    descripcion: string | null;
};

export type certificaciones = {
    id_certificacion: string;
    titulo: string;
    descripcion: string;
    institucion: string;
    fecha_emision: string;
    url_certificado: string | null;
    categoria: string;
    orientacion: string;
};

export type redes_profesionales = {
    id_red_profesional: string | null;
    nombre: string;
    url_Red: string;
};

export type formacion_academica = {
    id_formacion_academica: string;
    institucion: string;
    titulo: string;
    nivel: string;
    fecha_inicio: string;
    fecha_fin: string | null;
    descripcion: string | null;
};

export type configuracion = {
    mostrar_proyectos: boolean;
    mostrar_habilidades: boolean;
    mostrar_experiencias: boolean;
    mostrar_servicios: boolean;
    mostrar_certificaciones: boolean;
    mostrar_redes_profesionales: boolean;
    mostrar_cv: boolean;
    mostrar_contacto: boolean;
    paleta_colores: string;
    plantilla?: 'predeterminado' | 'minimalista' | 'profesional' | 'stiloPastel' | string;
};

export type InformacionBasica = {
    id_informacion_basica: string;
    nombre_completo: string;
    gmail: string;
    pais: string;
    foto_perfil: string | null;
    foto_perfil_public_id: string | null;
    biografia: string | null;
};

export type Portafolio = {
    id: string;
    slug: string;
    nombre: string;
    descripcion: string | null;
    visibilidad: boolean;
    usuario: Usuario;
    informacion_basica: InformacionBasica | null;
    proyectos: Proyectos[];
    habilidades: habilidades;
    experiencias: experiencias[];
    servicios: servicios[];
    certificaciones: certificaciones[];
    redes_profesionales: redes_profesionales[];
    formacion_academica: formacion_academica[];
    configuracion: configuracion;
};

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  visibility: 'public' | 'private';
  githubUrl?: string;
  linkedinUrl?: string;
  createdAt: string;
  suspendido?: boolean;
}

export type CreatePortafolio = {
    nombre: string;
    descripcion: string;
    visibilidad: boolean;
    nombre_completo?: string;
    gmail?: string;
    pais?: string;
    redesProfesionales: RedesProfesionales[];
}

export type RedesProfesionales = {
    nombre: string;
    url: string;
};

export type GetPortafolio ={
    success: boolean;
    message: string;
    data: DataPortafolio[];
}

export type DataPortafolio = {
    id_portafolio: string;
    nombre: string;
    descripcion: string;
    slug: string;
    visibilidad: boolean;
    fecha_creacion: string;
    fecha_actualizacion: string;
    suspendido: boolean;
    link_activo: boolean;
    fecha_expiracion_link: string | null;
    duracion_link: string | null;
    informacion_basica?: {
        id_informacion_basica: string;
        nombre_completo: string;
        gmail: string;
        pais: string | null;
        foto_perfil: string | null;
        foto_perfil_public_id: string | null;
        biografia: string | null;
    } | null;
    telefonos?: { id_telefono: string; telefono: string }[];
    profesiones?: { id_profesion: string; nombre: string }[];
    idiomas?: { id_idioma: string; nombre: string }[];
}