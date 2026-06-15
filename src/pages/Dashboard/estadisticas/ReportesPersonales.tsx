import DashboardLayout from "@/layout/DashboardLayout";
import {Banner} from "@/components/Banner"

export default function ReportesPersonales(){
    return(
        <DashboardLayout>
            <div className="space-y-8">
                <Banner
                    titulo="Reportes Personales"
                    descripcion=""
                />
            </div>
        </DashboardLayout>
    );
}