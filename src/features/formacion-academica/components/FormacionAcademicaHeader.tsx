import PageHeader from "@/components/ui/PageHeader"
import { LayoutDashboard } from "lucide-react"

export default function FormacionAcademicaHeader() {
    return (
        <PageHeader
            icon={LayoutDashboard}
            title="Formación Académica"
            description="Administra tu información académica y profesional"
        />
    )
}