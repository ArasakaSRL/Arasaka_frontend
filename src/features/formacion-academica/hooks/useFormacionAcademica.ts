import { useEffect, useState } from "react"
import { useAuthStore } from "@/stores/authStore"
import { toast } from "../../../components/Alerta"
import {
    crearFormacionProfesional,
    obtenerFormacionAcademica
} from "../lib/formacionAcademica.service"

export type FormacionType = {
    id_formacion?: number
    institucion: string
    titulo: string
    nivel: string
    fecha_inicio: string
    fecha_fin: string
    descripcion: string
}

const initialFormState: FormacionType = {
    institucion: '',
    titulo: '',
    nivel: '',
    fecha_inicio: '',
    fecha_fin: '',
    descripcion: '',
}

export const useFormacionAcademica = () => {
    const portafolioSeleccionado = useAuthStore(state => state.portafolioSeleccionado)

    const [loading, setLoading] = useState(false)
    const [formaciones, setFormaciones] = useState<FormacionType[]>([])
    const [formData, setFormData] = useState<FormacionType>(initialFormState)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const resetForm = () => setFormData(initialFormState)

    const fetchData = async () => {
        if (!portafolioSeleccionado?.id_portafolio) return
        try {
            setLoading(true)
            const response = await obtenerFormacionAcademica(portafolioSeleccionado.id_portafolio)
           
            setFormaciones(response.data || [])
        } catch (error) {
            console.error("Error al cargar formaciones", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [portafolioSeleccionado])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!portafolioSeleccionado?.id_portafolio) return

        try {
            setLoading(true)
            const payload = {
                ...formData,
                id_portafolio: portafolioSeleccionado.id_portafolio,
            }

            await crearFormacionProfesional(payload)
            toast.success("Formación académica agregada con éxito")
            resetForm()
            await fetchData() 
            return true 
        } catch (error) {
            toast.error("Error al guardar la formación académica")
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        formaciones,
        formData,
        handleChange,
        handleSubmit,
        resetForm
    }
}