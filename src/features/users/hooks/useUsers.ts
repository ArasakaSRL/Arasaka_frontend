import { useEffect, useState } from "react";
import { obtenerUsuarios, type Usuario } from "../lib/UserApi";

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarUsuarios = async () => {
    try {
      setLoading(true);

      const data = await obtenerUsuarios();

      setUsuarios(data);
    } catch (err) {
      console.error(err);
      setError("Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return {
    usuarios,
    loading,
    error,
    recargarUsuarios: cargarUsuarios,
  };
};