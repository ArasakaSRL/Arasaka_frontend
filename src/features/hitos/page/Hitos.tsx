import { useState, useEffect } from "react";
import { Banner } from "@/components/Banner";
import { Modal } from "../components/Modal";
import { InputHitos } from "../components/InputHitos";
import { FechaInputHitos } from "../components/FechaInputHitos";
import DashboardLayout from "@/layout/DashboardLayout";
import { CardHitos } from "../components/cardHitos";
import { getExperiencias, crearExperiencia } from "../apis/experienciasApi";

// Importamos date-fns para las fechas y el idioma español
import { parseISO, isAfter, format } from 'date-fns';
import { es } from 'date-fns/locale';
import ModalForm from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/Alerta";

// ID estático (Cámbialo por el tuyo real de PostgreSQL)
const ID_PORTAFOLIO_ACTUAL = "0b069f23-7b3f-45e5-bf20-96608d4b3f4c";

// Función auxiliar para extraer el día, mes (en español) y año
const obtenerDatosDeFecha = (fechaString: string) => {
  if (!fechaString) return { diaAbreviado: "---", mes: "---", diaNumero: 0, anio: "----" };
  
  try {
    const fecha = parseISO(fechaString);
    
    // Obtenemos el mes y lo ponemos con mayúscula inicial (Ej: "Octubre")
    let mes = format(fecha, 'MMMM', { locale: es });
    mes = mes.charAt(0).toUpperCase() + mes.slice(1);
    
    // Obtenemos el día en texto y sacamos las 3 primeras letras (Ej: "jueves" -> "JUE")
    let diaAbreviado = format(fecha, 'EEEE', { locale: es }).substring(0, 3).toUpperCase();
    
    const diaNumero = parseInt(format(fecha, 'dd'), 10);
    const anio = format(fecha, 'yyyy');
    
    return { diaAbreviado, mes, diaNumero, anio };
  } catch (e) {
    return { diaAbreviado: "---", mes: "---", diaNumero: 0, anio: "----" };
  }
};

export default function Hitos() {
  // 1. TODOS LOS ESTADOS VAN ARRIBA
  const [openModal, setOpenModal] = useState(false);

  const [cargoForm, setCargoForm] = useState("");
  const [organizacionForm, setOrganizacionForm] = useState("");
  const [descripcionForm, setDescripcionForm] = useState("");
  const [fechaInicioForm, setFechaInicioForm] = useState("");
  const [fechaFinForm, setFechaFinForm] = useState("");
  
  const [experiencias, setExperiencias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 2. FUNCIONES DE CARGA Y EFECTOS
  const cargarExperiencias = async () => {
    try {
      setIsLoading(true);
      const data = await getExperiencias(ID_PORTAFOLIO_ACTUAL);
      setExperiencias(data);
    } catch (error) {
      console.error("Error al cargar experiencias", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarExperiencias();
  }, []);

  // 3. LA FUNCIÓN PARA GUARDAR (Con validaciones)
  const handleSubmit = async () => {
    setSubmitted(true);
    // Validar campos vacíos
    if (!cargoForm || !organizacionForm || !descripcionForm || !fechaInicioForm) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    // Validaciones de fecha con date-fns
    const hoy = new Date();
    const fechaInicioDate = parseISO(fechaInicioForm);

    if (isAfter(fechaInicioDate, hoy)) {
      toast.error("La fecha de inicio no puede ser posterior a la fecha actual.");
      return;
    }

    if (fechaFinForm) {
      const fechaFinDate = parseISO(fechaFinForm);

      if (isAfter(fechaFinDate, hoy)) {
        toast.error("La fecha de fin no puede ser posterior a la fecha actual.");
        return;
      }

      if (isAfter(fechaInicioDate, fechaFinDate)) {
        toast.error("La fecha de inicio no puede ser mayor a la fecha de finalización.");
        return;
      }
    }

    // Si pasa todas las validaciones, enviamos a la API
    try {
      setIsSubmitting(true);
      
      const payload = {
        id_portafolio: ID_PORTAFOLIO_ACTUAL,
        cargo: cargoForm,
        nombre_organizacion: organizacionForm,
        descripcion: descripcionForm,
        fecha_inicio: fechaInicioForm,
        fecha_fin: fechaFinForm || null,
        vigente: !fechaFinForm 
      };

      await crearExperiencia(payload);
      alert("Experiencia guardada exitosamente");
      
      // Limpiar formulario y recargar
      setCargoForm("");
      setOrganizacionForm("");
      setDescripcionForm("");
      setFechaInicioForm("");
      setFechaFinForm("");
      setOpenModal(false);
      
      cargarExperiencias();
      
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al guardar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const coloresCard = ["green", "blue", "red", "orange"] as const;

  return (
    <DashboardLayout>
      <div className="mb-6 sm:mb-8 md:mb-10">
        {/**onOpenModal={() => setOpenModal(true)} */}
        <Banner onOpenModal={() => setOpenModal(true)} textoBoton="Añadir Hito" titulo="Experiencias e hitos importantes" descripcion="" />
      </div>

      <ModalForm 
        isOpen={openModal} 
        closeModal={() => setOpenModal(false)}
        maxWidth="max-w-sm"
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Registrar Hito
          </h2>

          <Input
            label="Nombre del cargo"
            type="text"
            placeholder="Escribe algo..."
            value={cargoForm}
            onChange={setCargoForm}
            required
            error={submitted && !cargoForm ? "Este campo es obligatorio" : undefined}
          />

          <Input
            label="Nombre de la Organización"
            type="text"
            placeholder="Escribe el nombre de la organización"
            value={organizacionForm}
            onChange={(val) => setOrganizacionForm(val)}
            required
            error={submitted && !organizacionForm ? "Este campo es obligatorio" : undefined}
          />

          <Input
            label="Descripción"
            type="textarea"
            placeholder="Escribe una descripción"
            value={descripcionForm}
            onChange={(val) => setDescripcionForm(val)}
            maxLength={300}
            required
            error={submitted && !descripcionForm? "Este campo es obligatorio" : undefined}
            showCounter
          />

          <FechaInputHitos titulo="Fecha de inicio" value={fechaInicioForm} onChange={setFechaInicioForm} />
          <FechaInputHitos titulo="Fecha de fin" value={fechaFinForm} onChange={setFechaFinForm} />
          

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setOpenModal(false)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>

            <button
              onClick={handleSubmit}
              className="bg-primary-600 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
          </div>
        </div>
      </ModalForm>

      {/* RENDERIZADO DE LAS TARJETAS DINÁMICAS */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {isLoading ? (
          <p className="text-center text-gray-500">Cargando experiencias...</p>
        ) : experiencias.length === 0 ? (
          <p className="text-center text-gray-500">Aún no hay hitos registrados.</p>
        ) : (
          experiencias.map((exp, index) => {
            // Extraemos la información de la fecha para pasársela a la tarjeta
            const datosFecha = obtenerDatosDeFecha(exp.fecha_inicio);
            
            return (
              <CardHitos
                key={exp.id}
                color={coloresCard[index % coloresCard.length]} 
                cargo={exp.cargo}
                organizacion={exp.nombre_organizacion}
                descripcion={exp.descripcion}
                diaAbreviado={datosFecha.diaAbreviado}
                diaNumero={datosFecha.diaNumero}
                fechaTexto={`${datosFecha.mes}, ${datosFecha.anio}`} // Ej: "Octubre, 2019"
              />
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}