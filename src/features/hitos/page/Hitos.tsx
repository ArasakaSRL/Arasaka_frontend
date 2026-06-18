import { useState, useEffect } from "react";
import { Banner } from "@/components/Banner";
import DashboardLayout from "@/layout/DashboardLayout";
import { CardHitos } from "../components/cardHitos";
import { getExperiencias, crearExperiencia, eliminarExperiencia } from "../apis/experienciasApi";
import { useAuthStore } from "@/stores/authStore";

// Importamos date-fns para las fechas y el idioma español
import { parseISO, isAfter, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Input } from "@/components/ui/input";
import { toast } from "@/components/Alerta";
import { CircleX } from "lucide-react";
import EliminarModal from "@/features/certificaciones/components/EliminarModal";
import Modal from "@/features/certificaciones/components/Modal";

type Experiencia = {
  id: string;
  cargo: string;
  nombre_organizacion: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  vigente: boolean;
}


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
  } catch{
    return { diaAbreviado: "---", mes: "---", diaNumero: 0, anio: "----" };
  }
};

export default function Hitos() {
  const idPortafolio = useAuthStore(s => s.portafolioSeleccionado?.id_portafolio)
  // 1. TODOS LOS ESTADOS VAN ARRIBA
  const [openModal, setOpenModal] = useState(false);

  const [cargoForm, setCargoForm] = useState("");
  const [organizacionForm, setOrganizacionForm] = useState("");
  const [descripcionForm, setDescripcionForm] = useState("");
  const [fechaInicioForm, setFechaInicioForm] = useState("");
  const [fechaFinForm, setFechaFinForm] = useState("");
  
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [experienciaEliminar, setExperienciaEliminar] = useState<Experiencia | null>(null);
  const [modoAccion, setModoAccion] = useState<"editar" | "eliminar" | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 2. FUNCIONES DE CARGA Y EFECTOS
  const cargarExperiencias = async () => {
    try {
      setIsLoading(true);
      const data = await getExperiencias();
      setExperiencias(data);
    } catch (error) {
      console.error("Error al cargar experiencias", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!idPortafolio) return
    cargarExperiencias();
  }, [idPortafolio]);

  useEffect(() => {
  if (openModal) {
    setSubmitted(false);
  }
}, [openModal]);

const handleEliminar = () => {
    // Activamos el modo eliminar; la selección se hace tarjeta por tarjeta
    toast.warning("Selecciona una experiencia para eliminar");
    setModoAccion("eliminar");
  };

const handleEliminarSeleccionado = async () => {
  if (!experienciaEliminar) return;

  try {
    setIsDeleting(true);

    await eliminarExperiencia(experienciaEliminar.id);

    toast.success("Experiencia eliminada correctamente");

    setExperienciaEliminar(null);
    setModoAccion(null);

    await cargarExperiencias();
  } catch (error) {
    toast.error("Ocurrió un error al intentar eliminar la experiencia");
    console.error(error);
  } finally {
    setIsDeleting(false);
  }
};

  // 3. LA FUNCIÓN PARA GUARDAR (Con validaciones)
  const handleSubmit = async () => {
    setSubmitted(true);
    
    // 1. Agregamos fechaFinForm a la validación de campos vacíos
    if (!cargoForm || !organizacionForm || !descripcionForm || !fechaInicioForm || !fechaFinForm) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    // Validaciones de fecha con date-fns
    const hoy = new Date();
    const fechaInicioDate = parseISO(fechaInicioForm);
    const fechaFinDate = parseISO(fechaFinForm); // Como ya es obligatoria, la parseamos directo

    if (isAfter(fechaInicioDate, hoy)) {
      toast.error("La fecha de inicio no puede ser posterior a la fecha actual.");
      return;
    }

    if (isAfter(fechaFinDate, hoy)) {
      toast.error("La fecha de fin no puede ser posterior a la fecha actual.");
      return;
    }

    if (isAfter(fechaInicioDate, fechaFinDate)) {
      toast.error("La fecha de inicio no puede ser mayor a la fecha de finalización.");
      return;
    }

    // Si pasa todas las validaciones, enviamos a la API
    try {
      setIsSubmitting(true);
      const payload = {
        cargo: cargoForm,
        nombre_organizacion: organizacionForm,
        descripcion: descripcionForm,
        fecha_inicio: fechaInicioForm,
        fecha_fin: fechaFinForm, // Ya no mandamos null
        vigente: false // Como la fecha fin es obligatoria, la experiencia ya no está "vigente"
      };

      await crearExperiencia(payload);
      toast.success("Experiencia guardada exitosamente");
      
      setCargoForm("");
      setOrganizacionForm("");
      setDescripcionForm("");
      setFechaInicioForm("");
      setFechaFinForm("");
      setOpenModal(false);
      
      cargarExperiencias();
      
    } catch (error) {
      console.error(error);
      toast.warning("Ocurrió un error al guardar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const coloresCard = ["green", "blue", "red", "orange"] as const;
  const resetForm = () => {
    setCargoForm("");
    setOrganizacionForm("");
    setDescripcionForm("");
    setFechaInicioForm("");
    setFechaFinForm("");
    setSubmitted(false);
  };

  return (
    <DashboardLayout>
      <div className="mb-6 sm:mb-8 md:mb-10">
        {/**onOpenModal={() => setOpenModal(true)} */}
        <Banner 
        titulo="Experiencias " 
        descripcion="" 
        totalItems={experiencias.length}
        eliminando={modoAccion === "eliminar"}
        onAgregar={() => {
          resetForm();

          setOpenModal(true);
        }}
        onEliminar={handleEliminar}
        onCancelar={() => {
          setModoAccion(null);
          setExperienciaEliminar(null);
        }}
        />
      </div>

      <Modal 
        isOpen={openModal} 
        closeModal={() => {
          resetForm();
          setOpenModal(false);
        }}
        maxWidth="max-w-sm"
      >
        <div className="p-6 space-y-4">
          
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold text-primary-500">
              Registrar Hito
            </h2>
            <button onClick={() => {
                resetForm();
                setOpenModal(false);
              }}>
              <CircleX size={20} />
            </button>
          </div>

          <Input
            label="Nombre del cargo"
            type="text"
            placeholder="Ingresar cargo..."
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
            label="Fecha de inicio"
            placeholder=""
            type="date"
            value={fechaInicioForm}
            max={new Date().toISOString().split("T")[0]}
            onChange={(val) => {
              setFechaInicioForm(val);

              // 🔥 lógica que reemplaza tu componente anterior
              if (fechaFinForm && fechaFinForm < val) {
                setFechaFinForm("");
                toast.warning("La fecha fin se reinició porque era menor a la fecha inicio");
              }
            }}
            required
            error={submitted && !fechaInicioForm ? "Este campo es obligatorio" : undefined}
          />

          <Input
            label="Fecha de fin"
            placeholder=""
            type="date"
            value={fechaFinForm}
            min={fechaInicioForm}
            max={new Date().toISOString().split("T")[0]}
            onChange={(val) => {
              setFechaFinForm(val);

              if (fechaInicioForm && val < fechaInicioForm) {
                toast.error("La fecha fin no puede ser menor a la fecha inicio");
              }
            }}
            required
            error={submitted && !fechaFinForm ? "Este campo es obligatorio" : undefined}
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
          
          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={() => {
                resetForm();
                setOpenModal(false);
              }}
              className="text-sm px-4 py-2 rounded-md border-2 border-primary-500 text-primary-500 hover:bg-secondary-500 hover:text-white cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`text-sm px-4 py-2 rounded-md text-white 
              ${isSubmitting 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-primary-500 hover:bg-secondary-500 cursor-pointer"
              }`}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>

          </div>

        </div>
      </Modal>

      {/* RENDERIZADO DE LAS TARJETAS DINÁMICAS */}
      <div
        className="
          flex
          flex-col
          items-center

          px-4
          sm:px-0
          md:px-10
          lg:px-40
        "
      >
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
                fechaInicio={exp.fecha_inicio}
                fechaFin={exp.fecha_fin}
                diaAbreviado={datosFecha.diaAbreviado}
                diaNumero={datosFecha.diaNumero}
                fechaTexto={`${datosFecha.mes}, ${datosFecha.anio}`}
                eliminando={modoAccion === "eliminar"}
                seleccionado={experienciaEliminar?.id === exp.id}
                onSelect={() => {
                  if (modoAccion === "eliminar") {
                    setExperienciaEliminar(exp);
                  }
                }}
              />
            );
          })
        )}

      </div>

      <EliminarModal
        isOpen={!!experienciaEliminar}
        onClose={() => {
          setExperienciaEliminar(null);
          setModoAccion(null);
        }}
        onConfirm={handleEliminarSeleccionado} // 🔥 ESTA ES LA QUE REALMENTE BORRA
        titulo="¿Eliminar experiencia?"
        nombre={experienciaEliminar?.cargo ?? ""}
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}