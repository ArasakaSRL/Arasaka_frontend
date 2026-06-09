import { useEffect, useState } from "react"
import { useAuthStore } from "@/stores/authStore"
import { toast } from "../../../components/Alerta";
import {
    crearFormacionProfesional,
    obtenerFormacionAcademica
} from "../lib/formacionAcademica.service"

export const useFormacionAcademica = () => {

    const portafolioSeleccionado = useAuthStore(
        state => state.portafolioSeleccionado
    )

    const [loading, setLoading] = useState(false)
    const [tieneFormacion, setTieneFormacion] = useState(false)

    const [formData, setFormData] = useState({
        institucion: '',
        titulo: '',
        nivel: '',
        fecha_inicio: '',
        fecha_fin: '',
        descripcion: '',
    })

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {

        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {

        const fetchData = async () => {

            if (!portafolioSeleccionado?.id_portafolio) return

            try {

                setLoading(true)

                const response =
                    await obtenerFormacionAcademica(
                        portafolioSeleccionado.id_portafolio
                    )

                if (response.data.length > 0) {

                    const formacion = response.data[0]

                    setFormData({
                        institucion: formacion.institucion,
                        titulo: formacion.titulo,
                        nivel: formacion.nivel,
                        fecha_inicio: formacion.fecha_inicio,
                        fecha_fin: formacion.fecha_fin,
                        descripcion: formacion.descripcion,
                    })

                    setTieneFormacion(true)
                }

            } finally {
                setLoading(false)
            }
        }

        fetchData()

    }, [portafolioSeleccionado])

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault()

        if (!portafolioSeleccionado?.id_portafolio) return

        try {

            setLoading(true)

            const payload = {
                ...formData,
                id_portafolio:
                    portafolioSeleccionado.id_portafolio,
            }

            await crearFormacionProfesional(payload)
            toast.success(
                tieneFormacion
                    ? "Formación académica actualizada"
                    : "Formación académica creada"
            )
            setTieneFormacion(true)

        } catch (error) {
            toast.error("Error al guardar la formación académica")
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        tieneFormacion,
        formData,
        handleChange,
        handleSubmit,
    }
}