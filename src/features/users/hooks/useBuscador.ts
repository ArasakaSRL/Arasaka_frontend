import { useMemo, useState } from "react";
import type { Usuario } from "../lib/UserApi";

export const useBuscarUsuarios = (
  usuarios: Usuario[]
) => {
  const [search, setSearch] = useState("");

  const usuariosFiltrados = useMemo(() => {
    if (!search.trim()) return usuarios;

    const term = search.toLowerCase();

    return usuarios.filter(
      usuario =>
        usuario.nombre.toLowerCase().includes(term) ||
        usuario.apellido.toLowerCase().includes(term) ||
        usuario.username.toLowerCase().includes(term) ||
        usuario.correo.toLowerCase().includes(term)
    );
  }, [usuarios, search]);

  return {
    search,
    setSearch,
    usuariosFiltrados,
  };
};