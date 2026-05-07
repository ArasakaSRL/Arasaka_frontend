

import { safeArray } from "./helpers";
import type { Proyectos } from "../portafolioType";

export const mapTecnologia = (t: any) => {
    return {
        nombre: t.nombre,
        descripcion: t.descripcion,
        logo: t.logo,
        categoria: t.categoria ?? null,
    };
};
export const mapProyecto = (p: any): Proyectos => {
    return {
        id_proyecto: p.id_proyecto,
        nombre: p.nombre,
        descripcion: p.descripcion,
        estados: safeArray(p.estados),
        url_demo: p.url_demo,
        url_repositorio: p.url_repositorio,
        imagenes: safeArray(p.imagenes),
        tecnologias: safeArray(p.tecnologias).map(mapTecnologia),
    };
};