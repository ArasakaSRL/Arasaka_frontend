import DashboardLayout from "@/layout/DashboardLayout";
import { Banner } from "@/components/Banner";

export default function CambiarPlantilla(){
    return(
        <DashboardLayout>
            <div className="space-y-6">
                <Banner titulo="Cambiar Plantilla del Portafolio" descripcion=""/>
            </div>
        </DashboardLayout>
    );
}