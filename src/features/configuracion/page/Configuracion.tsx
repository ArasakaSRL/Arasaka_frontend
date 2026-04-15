import { Banner } from "@/components/Banner";
import DashboardLayout from "@/layout/DashboardLayout";
import {ConfiguracionGeneral } from "../components/ConfiguracionGeneral";
import { DropdownCertificaciones } from "@/features/certificaciones/components/DropdownCertificaciones";
import { SwitchVisibilidad } from "../components/SwitchVisibilidad";
import { useState } from "react";

type Option = {
  label: string;
  value: string;
};

export default function Configuracion(){
    const [selected, setSelected] = useState<Option | null>(null);
    const opciones = [
    { label: "Público", value: "publico" },
    { label: "Privado", value: "privado" },
    ];

    const handleChange = (option: Option) => {
    setSelected(option);
    };
    
    return(

        <DashboardLayout>
            <Banner titulo="Configuracion del portafolio" descripcion="">
            </Banner>
            {/*<SeccionVisibilidad titulo="Visibilidad Hitos" maxHeight="20vh" forceScroll >
                 <CardHitos
                    color="green"
                    cargo="Desarrollador Frontend"
                    organizacion="Empresa X"
                    descripcion="Desarrollo de interfaces modernas"
                    diaAbreviado="Lun"
                    diaNumero={12}
                    fechaTexto="Abril 2026"
                />

                 //Desactivado 
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
            </SeccionVisibilidad>*/}
            <ConfiguracionGeneral titulo="Visibilidad Componentes">
                <SwitchVisibilidad nombre="Habilidades" />
                <SwitchVisibilidad nombre="Hitos" />
                <SwitchVisibilidad nombre="Proyectos" />
                <SwitchVisibilidad nombre="Certificaciones" />
            </ConfiguracionGeneral>
            <ConfiguracionGeneral titulo="Configuracion General">
                <DropdownCertificaciones
                    titulo="Visibilidad portafolio"
                    opciones={opciones}
                    value={selected}
                    onChange={handleChange}
                />
            </ConfiguracionGeneral>
            
        </DashboardLayout>
    );
}