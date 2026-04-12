import { Banner } from "@/components/Banner";
import DashboardLayout from "@/layout/DashboardLayout";
import {ConfiguracionGeneral } from "../components/ConfiguracionGeneral";

export default function Configuracion(){
    return(

        <DashboardLayout>
            <Banner titulo="Configuracion del portafolio" descripcion="">
            </Banner>
            <ConfiguracionGeneral titulo="Configuracion General"></ConfiguracionGeneral>
        </DashboardLayout>
    );
}