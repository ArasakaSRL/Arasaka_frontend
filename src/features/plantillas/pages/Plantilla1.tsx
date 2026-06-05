import React, { useState, useEffect } from 'react';
import CardsSecciones from "@/features/plantillas/components/plantilla1/cards/CardsSecciones";
import DetallesPerfil from "@/features/plantillas/components/plantilla1/cards/DetallesPerfil";
import FondoPortada from "@/features/plantillas/components/plantilla1/FondoPortada";



export default function Plantilla1() {

  const [bannerVisible, setBannerVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

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
            nombre="Katherine Michelle Pérez Taipe"
            pais="Quito, Ecuador"
            profesion="Comunicación Social y Producción Multimedia"
            correo="katherine@email.com"
            foto="https://res.cloudinary.com/dkopjpuqx/image/upload/v1775345490/look-my-medal_apeb4v.jpg"
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