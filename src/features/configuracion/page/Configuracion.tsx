import { Banner } from "@/components/Banner";
import DashboardLayout from "@/layout/DashboardLayout";
import {ConfiguracionGeneral } from "../components/ConfiguracionGeneral";
import { SeccionVisibilidad } from "../components/visibilidadComponentes/SeccionVisibilidad";
import { CardHitos } from "@/features/hitos/components/cardHitos";

export default function Configuracion(){
    return(

        <DashboardLayout>
            <Banner titulo="Configuracion del portafolio" descripcion="">
            </Banner>
            <SeccionVisibilidad titulo="Visibilidad Hitos" maxHeight="20vh" forceScroll >
                 <CardHitos
                    color="green"
                    cargo="Desarrollador Frontend"
                    organizacion="Empresa X"
                    descripcion="Desarrollo de interfaces modernas"
                    diaAbreviado="Lun"
                    diaNumero={12}
                    fechaTexto="Abril 2026"
                />

                {/* Desactivado */}
                <CardHitos
                    color="green"
                    cargo="Desarrollador Backend"
                    organizacion="Empresa Y"
                    descripcion="API REST con Node.js"
                    diaAbreviado="Mar"
                    diaNumero={15}
                    fechaTexto="Abril 2026"
                    disabled 
                />

                <CardHitos
                    color="blue"
                    cargo="Desarrollador Backend"
                    organizacion="Empresa Y"
                    descripcion="API REST con Node.js"
                    diaAbreviado="Mar"
                    diaNumero={15}
                    fechaTexto="Abril 2026"
                />
            </SeccionVisibilidad>
            <ConfiguracionGeneral titulo="Configuracion General"></ConfiguracionGeneral>
            
        </DashboardLayout>
    );
}