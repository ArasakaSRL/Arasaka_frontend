import DashboardLayout from "@/layout/DashboardLayout";
import { Banner } from "@/components/Banner";
import DetallesPerfil from "@/features/plantillas/components/plantilla1/cards/DetallesPerfil";
import CardsSecciones from "@/features/plantillas/components/plantilla1/cards/CardsSecciones";

export default function CambiarPlantilla(){
    return(
        <DashboardLayout>
            <div className="space-y-6">
                <Banner titulo="Cambiar Plantilla del Portafolio" descripcion=""/>
                <DetallesPerfil
                    nombre="Katherine Michelle Pérez Taipe"
                    pais="Quito, Ecuador"
                    profesion="Comunicación Social y Producción Multimedia"
                    correo="katherine@email.com"
                    foto="https://res.cloudinary.com/dkopjpuqx/image/upload/v1775345490/look-my-medal_apeb4v.jpg"
                ></DetallesPerfil>
                <CardsSecciones></CardsSecciones>
                
            </div>
        </DashboardLayout>
    );
}