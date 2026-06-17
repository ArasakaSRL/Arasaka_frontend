/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { obtenerUsuarios, type Usuario, type SortBy, type Order } from "../lib/UserApi";
export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sortBy, setSortBy] = useState<SortBy>("nombre");
  const [order, setOrder] = useState<Order>("asc");

  const convertirFecha = (fecha: string) => {
  const [fechaPart, horaPart] = fecha.split(" ");

  const [dia, mes, anio] = fechaPart
    .split("-")
    .map(Number);

  const [hora, minuto, segundo] = horaPart
    .split(":")
    .map(Number);

  return new Date(
    anio,
    mes - 1,
    dia,
    hora,
    minuto,
    segundo
  );
};

  const cargarUsuarios = async () => {
    try {
      setLoading(true);

      const data = await obtenerUsuarios(
        sortBy,
        order
      );

      if (sortBy === "created_at") {
        data.sort((a, b) => {
          const fechaA = convertirFecha(a.created_at);
          const fechaB = convertirFecha(b.created_at);

          return order === "asc"
            ? fechaA.getTime() - fechaB.getTime()
            : fechaB.getTime() - fechaA.getTime();
        });
      }

      console.log(
        "primer usuario recibido",
        data[0]?.nombre,
        data[0]?.created_at
      );

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
  }, [sortBy, order]);

  return {
    usuarios,
    loading,
    error,
    sortBy,
    order,
    recargarUsuarios: cargarUsuarios,
    setSortBy,
    setOrder,
  };
};