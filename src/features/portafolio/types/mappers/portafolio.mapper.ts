import type { Portafolio } from "../portafolioType";
import { mapUsuario } from "./usuario.mapper";
import { mapProyecto } from "./proyecto.mapper";
import { safeArray } from "./helpers";
import { mapTecnologia } from "./proyecto.mapper";

export const mapPortafolio = (api: any): Portafolio => {
    const data = api?.data ?? api;

    return {
        id: data.id,
        slug: data.slug,
        nombre: data.nombre,
        descripcion: data.descripcion,
        visibilidad: data.visibilidad,

        usuario: mapUsuario(data.usuario),

        proyectos: safeArray(data.proyectos).map(mapProyecto),
        
        habilidades: {
    tecnicas: safeArray(data.habilidades?.tecnicas).map((h: any) => ({
        id_habilidad: h.id_habilidad,
        nombre: h.nombre,
        descripcion: h.descripcion,
        nivel: h.nivel,
        tecnologias: safeArray(h.tecnologias).map(mapTecnologia),
    })),

    blandas: safeArray(data.habilidades?.blandas).map((h: any) => ({
        id_habilidad: h.id_habilidad,
        nombre: h.nombre,
        descripcion: h.descripcion,
        nivel: h.nivel,
    })),
},
        experiencias: safeArray(data.experiencias),
        servicios: safeArray(data.servicios),
        certificaciones: safeArray(data.certificaciones),
        redes_profesionales: safeArray(data.redes_profesionales),

        configuracion: {
            mostrar_proyectos: data.configuracion?.mostrar_proyectos ?? false,
            mostrar_habilidades: data.configuracion?.mostrar_habilidades ?? false,
            mostrar_experiencias: data.configuracion?.mostrar_experiencias ?? false,
            mostrar_servicios: data.configuracion?.mostrar_servicios ?? false,
            mostrar_certificaciones: data.configuracion?.mostrar_certificaciones ?? false,
            mostrar_redes_profesionales: data.configuracion?.mostrar_redes_profesionales ?? true,
            mostrar_cv: data.configuracion?.mostrar_cv ?? true,
            mostrar_contacto: data.configuracion?.mostrar_contacto ?? true,
            paleta_colores: data.configuracion?.paleta_colores ?? "default",
        },
    };
};