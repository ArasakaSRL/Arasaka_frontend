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


  const [tecnologias, setTecnologias] = useState<string[]>([]);
  useEffect(() => {
    if (proyectoEditar) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormularioData({
        title: proyectoEditar.nombre,
        descripcion: proyectoEditar.descripcion || "",
        startDate: proyectoEditar.fecha_inicio,
        endDate: proyectoEditar.fecha_fin || "",
        projectUrl: proyectoEditar.url_demo || "",
        githubUrl: proyectoEditar.url_repositorio || "",
      });

      setTecnologias(
        proyectoEditar.tecnologias.map(t => t.id_tecnologia)
      );
    }
  }, [proyectoEditar]);

  const resetForm = () => {
    setFormularioData({
      title: "",
      descripcion: "",
      startDate: "",
      endDate: "",
      projectUrl: "",
      githubUrl: "",
    });
    setTecnologias([]);
  };

  return {
    formularioData,
    setFormularioData,
    tecnologias,
    setTecnologias,
    resetForm,
  };
};

