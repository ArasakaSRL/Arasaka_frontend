/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import type { Proyecto } from "../lib/ProyectosApi";

export const useEditarProyecto = (proyectoEditar: Proyecto | null) => {

  const [formularioData, setFormularioData] = useState({
    title: "",
    descripcion: "",
    startDate: "",
    endDate: "",
    projectUrl: "",
    githubUrl: "",
  });

  const [datosIniciales, setDatosIniciales] = useState(formularioData);

  const [tecnologias, setTecnologias] = useState<string[]>([]);
  const [tecnologiasIniciales, setTecnologiasIniciales] = useState<string[]>([]);
  const [imagenesIniciales, setImagenesIniciales] = useState<string[]>([]);
  const [imagenesActuales, setImagenesActuales] = useState<string[]>([]);

  const formatoFecha = (fecha: string) => {
    if (!fecha) return "";
    const [day, month, year] = fecha.split("-");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (proyectoEditar) {
      const urls = proyectoEditar.url_imagen
        .map(img => img.logo)
        .filter((logo): logo is string => logo !== undefined);
      setImagenesIniciales(urls);
      setImagenesActuales(urls);

      const data = {
        title: proyectoEditar.nombre,
        descripcion: proyectoEditar.descripcion || "",
        startDate: formatoFecha(proyectoEditar.fecha_inicio),
        endDate: proyectoEditar.fecha_fin
          ? formatoFecha(proyectoEditar.fecha_fin)
          : "",
        projectUrl: proyectoEditar.url_demo || "",
        githubUrl: proyectoEditar.url_github || "",
      };

      const techs = proyectoEditar.tecnologias.map(
        (t) => t.id_tecnologia
      );

      setFormularioData(data);
      setTecnologias(techs);

      setDatosIniciales(data);
      setTecnologiasIniciales(techs);
    }
  }, [proyectoEditar]);

  const isDirty =
    JSON.stringify(formularioData) !== JSON.stringify(datosIniciales) ||
    JSON.stringify(tecnologias) !== JSON.stringify(tecnologiasIniciales) ||
    JSON.stringify(imagenesActuales) !== JSON.stringify(imagenesIniciales);

  const resetForm = () => {
    const emptyData = {
      title: "",
      descripcion: "",
      startDate: "",
      endDate: "",
      projectUrl: "",
      githubUrl: "",
    };

    setFormularioData(emptyData);
    setDatosIniciales(emptyData);
    setTecnologias([]);
    setTecnologiasIniciales([]);
  };

  return {
    formularioData,
    setFormularioData,
    tecnologias,
    setTecnologias,
    resetForm,
    isDirty,
    imagenesActuales,
    setImagenesActuales,
    imagenesIniciales,
  };
};