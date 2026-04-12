import { Banner } from "@/components/Banner";
import DashboardLayout from "@/layout/DashboardLayout";
import {VisibilidadPortafolio } from "../components/VisibilidadPortafolio";

export default function Configuracion(){
    return(

        <DashboardLayout>
            <Banner titulo="Configuracion del portafolio" descripcion="">
            </Banner>
            <VisibilidadPortafolio titulo="Configuracion General"></VisibilidadPortafolio>
        </DashboardLayout>
    );
}