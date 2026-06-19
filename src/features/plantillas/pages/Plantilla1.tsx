import React, { useState, useEffect } from 'react';
import CardsSecciones from "@/features/plantillas/components/plantilla1/cards/CardsSecciones";
import FondoPortada from "@/features/plantillas/components/plantilla1/FondoPortada";
import { useParams } from 'react-router-dom';
import { usePortfolioData } from '@/features/reportesUsuario/hooks/usePortfolioData';
import DetallesPerfil from '../components/plantilla1/cards/DetallesPerfil';

import { generateCV } from "@/features/portafolio/lib/cv.generator";
import { toast } from "@/components/Alerta";


export default function Plantilla1() {

  const [bannerVisible, setBannerVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  const { slug } = useParams<{ slug: string }>();

  const { data, loading, noDisponible } = usePortfolioData(slug);

  const [descargandoCV, setDescargandoCV] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setBannerVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    const banner = document.getElementById("banner-portada");

    if (banner) {
      observer.observe(banner);
    }

    return () => observer.disconnect();
  }, []);

  if (!slug)        return <div>No tienes un portafolio asignado.</div>;
  if (loading)      return <div>Cargando...</div>;
  if (noDisponible || !data) return <div>Portafolio no disponible.</div>;

  const { usuario} = data;

  const handleDescargarCV = async () => {
    if (descargandoCV) return;

    setDescargandoCV(true);

    try {
      await generateCV({
        usuario,
        informacion_basica: data.informacion_basica,
        proyectos: data.proyectos ?? [],
        tecnicas: data.habilidadesTecnicas ?? [],
        blandas: data.habilidadesBlandas ?? [],
        experiencias: data.experiencias ?? [],
        certificaciones: data.certificaciones ?? [],
        formacion_academica: data.formacion_academica ?? [],
      });

      toast.success("PDF generado con éxito");
    } catch (err) {
      console.error(err);
      toast.error("Error al generar PDF");
    } finally {
      setDescargandoCV(false);
    }
  };

  return (
    <div className="w-full mx-auto">

        <FondoPortada imagenUrl="" />

      {/* CONTENIDO */}
      <div
        className={`
          mt-4 grid grid-cols-12 gap-10
          ${bannerVisible ? "" : "md:min-h-screen"}
        `}
      >

        {/* PERFIL */}
        <div className="col-span-12 lg:col-span-4">
          <div
            className={`
              transition-all duration-500
              ${
                !bannerVisible && isDesktop
                  ? "fixed"
                  : ""
              }
            `}
            style={
              !bannerVisible && isDesktop
                ? {
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "380px",
                  }
                : undefined
            }
          >
            <DetallesPerfil
              nombre={`${usuario.nombre} ${usuario.apellido}`}
              pais={usuario.pais || "No especificado"}
              profesion={usuario.profesiones?.[0]?.nombre || "Profesional"}
              correo={usuario.correo}
              foto={usuario.foto_perfil || undefined}
              mostrarContacto={
                data.configuracion?.mostrar_contacto ?? true
              }
              mostrarCV={
                data.configuracion?.mostrar_cv ?? true
              }
              onDescargarCV={handleDescargarCV}
              descargandoCV={descargandoCV}
            />
          </div>
        </div>

        {/* SECCIONES */}
        <div className="col-span-12 lg:col-span-8">
          <CardsSecciones />
        </div>

      </div>

    </div>
  );
}