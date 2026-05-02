import DashboardLayout from "@/layout/DashboardLayout";
import { BoxCantidad } from "../components/BoxCantidad";
import { Banner } from "@/components/Banner";
import { TotalVisitas } from "../components/TotalVisitas";
import SkillsChart, { type SkillItem } from "../components/Skillschart";
import { BarChartVisitas } from "../components/BarChartVisitas";

export default function ReportesUsr(){

    const skills: SkillItem[] = [
    { label: "Principiante", value: 100, color: "#D85A30" },
    { label: "Avanzado",     value: 80,  color: "#378ADD" },
    { label: "Intermedio",   value: 60,  color: "#EF9F27" },
    { label: "Competente",   value: 40,  color: "#1D9E75" },
    { label: "Experto",      value: 10,  color: "#7F77DD" },
    ];

    return(
        <DashboardLayout>
            <Banner titulo="Reportes y Estadisticas" descripcion=""></Banner>
            <TotalVisitas nombre="visitas al Portafolio" total={999999}></TotalVisitas>
            <BoxCantidad nombre="Habilidades Blandas" total={999999}></BoxCantidad>
            <BoxCantidad nombre="Habilidades Tecnicas" total={999999}></BoxCantidad>
            <BoxCantidad nombre="Proyectos realizados" total={999999}></BoxCantidad>
             <SkillsChart
                title="Habilidades desarrolladas"
                skills={skills}
                strokeWidth={32}   
                radius={130}       
            />
            <BarChartVisitas
                data={[
                    { mes: "Ene", visitas: 2000 },
                    { mes: "Feb", visitas: 5000 },
                    { mes: "Mar", visitas: 8000 },
                    { mes: "Abr", visitas: 4000 },
                    { mes: "May", visitas: 10000 },
                    { mes: "Jun", visitas: 3000 },
                ]}
            />
            </DashboardLayout>
    );
}