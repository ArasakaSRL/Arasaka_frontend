import { Banner } from "@/components/Banner";
import DashboardLayout from "@/layout/DashboardLayout";
import {ConfiguracionGeneral } from "../components/ConfiguracionGeneral";
import { CardHitos } from "@/features/hitos/components/cardHitos";

export default function Configuracion(){
    return(

        <DashboardLayout>
            <Banner titulo="Configuracion del portafolio" descripcion="">
            </Banner>
            
            {/* 👇 PRUEBAS */}
            <div className="mt-6 space-y-4">

                {/* Activo */}
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

            </div>

            <ConfiguracionGeneral titulo="Configuracion General"></ConfiguracionGeneral>
            
        </DashboardLayout>
    );
}