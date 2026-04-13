import { safeArray } from "./helpers";
import type { Usuario } from "../portafolioType";

export const mapUsuario = (u: any): Usuario => {
    return {
        id: u.id,
        nombre: u.nombre,
        apellido: u.apellido,
        correo: u.correo,
        biografia: u.biografia,
        foto_perfil: u.foto_perfil,
        telefonos: safeArray(u.telefonos),
        pais: u.pais,
        profesiones: safeArray(u.profesiones),
        idiomas: safeArray(u.idiomas),
    };
};