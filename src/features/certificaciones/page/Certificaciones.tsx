import { useState } from "react";
import { useCategorias } from '../hooks/useCategorias';
import { useCertificaciones } from "../hooks/useCertificaciones";
import { useCrearCertificacion } from "../hooks/useCrearCertificacion"; 

import { Banner } from "@/components/Banner";
import { ImagenUploader } from "../components/ImagenUploader";
import { DropdownCertificaciones } from "../components/DropdownCertificaciones";
import DashboardLayout from "@/layout/DashboardLayout";
import { uploadImage } from "@/firebase/firebaseStorage";
import { Carousel } from "../components/carruselCards/Carrusel";
import { CategoriaCard } from "../components/carruselCards/CategoriaCard";
import { toast } from "@/components/Alerta";
import ModalForm from "@/components/Modal";
import { CircleX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SeccionCertificados } from "../components/SeccionCertificados";
import { BotonEliminar } from "../components/BotonEliminar";
import { useEliminarCertificaciones } from "../hooks/useEliminarCertificaciones";

export default function Certificaciones() {
  const [openModal, setOpenModal] = useState(false);
  const [filtroCategoriaId, setFiltroCategoriaId] = useState<string | null>(null);
  const [modoAccion, setModoAccion] = useState<"editar" | "eliminar" | null>(null);
  const [certificadosEliminar, setCertificadosEliminar]= useState<string[]>([]);

  // ESTADOS DEL FORMULARIO
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<{label: string, value: string} | null>(null);
  const [tituloForm, setTituloForm] = useState("");
  const [institucionForm, setInstitucionForm] = useState("");
  const [descripcionForm, setDescripcionForm] = useState("");
  const [fechaObtencionForm, setFechaObtencionForm] = useState("");
  
  // CAMBIO CLAVE: Ahora guardamos un File físico, no un texto/url
  const [archivoImagenForm, setArchivoImagenForm] = useState<File | null>(null); 
  const [orientacionForm, setOrientacionForm] = useState<"horizontal" | "vertical">("horizontal");
  
  // Estado extra para saber si estamos subiendo a firebase
  const [isUploadingToFirebase, setIsUploadingToFirebase] = useState(false);

  const { categorias, isLoading, isUsingFallback } = useCategorias();
  const { registrarCertificacion, isCreating} = useCrearCertificacion();
  const { eliminarCertificaciones, isDeleting } = useEliminarCertificaciones();
  
  //error
  const { 
    certificados, 
    isLoadingCerts, 
    isUsingFallbackCerts 
  } = useCertificaciones( filtroCategoriaId); // <-- Aquí pasamos el filtro de categoría

  const isBusy = isCreating || isUploadingToFirebase || isDeleting;

  const opcionesCategorias = categorias.map((cat) => ({
    label: cat.nombre,
    value: String(cat.id), 
  }));

  const [errores, setErrores] = useState({
    categoria: false,
    titulo: false,
    institucion: false,
    imagen: false,
    fecha: false,
  });

  const toggleEliminar = (id: string) => {
    setCertificadosEliminar((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleEliminarSeleccionados = async () => {
    try {
      await eliminarCertificaciones(certificadosEliminar); // string[]
      toast.success(`${certificadosEliminar.length} certificación(es) eliminada(s)`);
      setCertificadosEliminar([]);
      setModoAccion(null);
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleEliminar = async () => {

    // activar modo eliminar
    if (modoAccion !== "eliminar") {

      toast.warning(
        "Selecciona una certificación"
      );

      setModoAccion("eliminar");

      return;
    }

    // validar selección
    if (certificadosEliminar.length === 0) {

      toast.warning(
        "No seleccionaste certificados"
      );

      return;
    }
    await handleEliminarSeleccionados();
  };

  // FUNCIÓN PARA ENVIAR A FIREBASE Y LUEGO AL BACKEND
  const handleSubmit = async () => {
    
    //  Agregamos institucionForm a la validación
    const nuevosErrores = {
      categoria: !categoriaSeleccionada,
      titulo: !tituloForm.trim(),
      institucion: !institucionForm.trim(),
      imagen: !archivoImagenForm,
      fecha: !fechaObtencionForm,
    };

    setErrores(nuevosErrores);

    if (Object.values(nuevosErrores).some(Boolean)) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }
    try {
      setIsUploadingToFirebase(true);

      const orientacionFinal = await new Promise<"horizontal" | "vertical">((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(archivoImagenForm!);
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve(img.width > img.height ? "horizontal" : "vertical");
        };
        img.src = url;
      });

      const nombreArchivo = `${Date.now()}_${archivoImagenForm!.name}`;
      const rutaFirebase = `certificaciones/${nombreArchivo}`; 
      const url_archivo_firebase = await uploadImage(archivoImagenForm!, rutaFirebase);

      const datosDelFormulario = {
        titulo: tituloForm,
        descripcion: descripcionForm,
        institucion_emisora: institucionForm, 
        fecha_obtencion: fechaObtencionForm || new Date().toISOString().split('T')[0],
        url_archivo: url_archivo_firebase,
        orientacion_imagen: orientacionFinal,
        id_categoria_certificacion: categoriaSeleccionada!.value
      };

      await registrarCertificacion(datosDelFormulario);
      toast.success("Certificación creada exitosamente!");
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      setOpenModal(false);
      setTituloForm("");
      setInstitucionForm(""); 
      setDescripcionForm("");
      setFechaObtencionForm("");
      setArchivoImagenForm(null);
      setCategoriaSeleccionada(null);
      
    } catch (err) {
      console.error(err);
      toast.warning("Hubo un error al procesar tu certificación");
    } finally {
      setIsUploadingToFirebase(false); // Detenemos el loading de Firebase
    }
  };

  const resetForm = () => {
    setTituloForm("");
    setInstitucionForm("");
    setDescripcionForm("");
    setFechaObtencionForm("");
    setArchivoImagenForm(null);
    setCategoriaSeleccionada(null);
    setErrores({
    categoria: false,
    titulo: false,
    institucion: false,
    imagen: false,
    fecha: false,
  });
  };
  const cerrarModal = () => {
    resetForm();
    setOpenModal(false);
  };

  
  return (
    <DashboardLayout>
      <div className="mb-6 sm:mb-8 md:mb-10">
        <Banner 
          titulo="Certificaciones"
          descripcion=""
          totalItems={certificados.length}
          eliminando={modoAccion === "eliminar"}
          onAgregar={() => {
            setModoAccion(null);
            setOpenModal(true);
          }}
          onEliminar={handleEliminar}
          onCancelar={() => {
            setModoAccion(null);
            setCertificadosEliminar([]);
          }}
        />

        <ModalForm isOpen={openModal} closeModal={cerrarModal} maxWidth="max-w-5xl">
          <div className="p-6 space-y-4">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold text-primary-500">
              Subir certificación
            </h2>
            <button onClick={cerrarModal}>
              <CircleX size={20} />
            </button>
          </div>

          {/* CONTENIDO */}
          <div className="flex flex-col md:flex-row gap-6">

            {/* FORM */}
            <div className="flex-1 flex flex-col gap-1.5">
              <DropdownCertificaciones
                titulo="Categoría"
                opciones={opcionesCategorias}
                value={categoriaSeleccionada}
                onChange={(option) => {
                  setCategoriaSeleccionada(option);
                  setErrores(prev => ({ ...prev, categoria: false }));
                }}
                placeholder="Selecciona una categoría"
                error={errores.categoria}
                required   // 👈 ESTO ES CLAVE
              />

              <Input
                label="Título"
                type="text"
                placeholder="Ingrese el título"
                value={tituloForm}
                onChange={(val) => {
                  setTituloForm(val);
                  setErrores(prev => ({ ...prev, titulo: false }));
                }}
                required
                error={errores.titulo ? "Este campo es obligatorio" : undefined}
              />

              <Input
                label="Institución emisora"
                type="text"
                placeholder="Ingrese la institución"
                value={institucionForm}
                onChange={(val) => {
                  setInstitucionForm(val);
                  setErrores(prev => ({ ...prev, institucion: false }));
                }}
                required
                error={errores.institucion ? "Este campo es obligatorio" : undefined}
              />

              <Input
                label="Fecha de emisión"
                placeholder=""
                type="date"
                value={fechaObtencionForm}
                max={new Date().toISOString().split("T")[0]}
                onChange={setFechaObtencionForm}
                required
                error={errores.fecha ? "Este campo es obligatorio" : undefined}
              />

              <Input
                label="Descripción"
                type="textarea"
                placeholder="Describe la certificación"
                value={descripcionForm}
                onChange={setDescripcionForm}
                maxLength={300}
                showCounter
              />

            </div>

            {/* IMAGEN */}
            <div className="flex-1">
              <ImagenUploader 
                onImageReady={(file) => {
                  setArchivoImagenForm(file);
                  setErrores(prev => ({ ...prev, imagen: false }));
                }} 
                onOrientationDetected={(orientacion) => setOrientacionForm(orientacion)}
              />

              {errores.imagen && (
                <p className="text-red-600 text-[12px] mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                  Este campo es obligatorio
                </p>
              )}
            </div>

          </div>

          {/* BOTONES */}
          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={cerrarModal}
              disabled={isBusy}
              className="text-sm px-4 py-2 rounded-md border-2 border-primary-500 text-primary-500 hover:bg-secondary-500 hover:text-white"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isBusy}
              className={`text-sm px-4 py-2 rounded-md text-white 
              ${isBusy 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-primary-500 hover:bg-secondary-500"
              }`}
            >
              {isBusy ? "Procesando..." : "Guardar"}
            </button>

          </div>

        </div>
        </ModalForm>

         {/* CATEGORÍAS (responsivo corregido anteriormente) */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
            <h3 className="text-2xl text-dark-500 font-medium-ui text-left flex flex-wrap items-center gap-2 py-1">
              Categorías
              {isUsingFallback && (
                <span className="text-xs text-orange-500 font-normal">
                  (Modo de prueba)
                </span>
              )}
            </h3>

            {filtroCategoriaId && (
              <button 
                onClick={() => setFiltroCategoriaId(null)}
                className="text-xs text-blue-500 hover:underline cursor-pointer gap-10"
              >
                Ver todas las certificaciones
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="h-25 flex items-center justify-center text-gray-400">
              Cargando categorías...
            </div>
          ) : (
            <Carousel>
              {/* Mismo mapeo de categorías */}
              {categorias.map((cat) => (
                <div 
                  key={cat.id}
                  onClick={() => setFiltroCategoriaId(cat.id)}
                  className={`cursor-pointer transition-all duration-200 ${
                    filtroCategoriaId === cat.id ? 'ring-2 ring-blue-500 rounded-lg scale-105' : 'hover:scale-105'
                  }`}
                >
                  <CategoriaCard
                    title={cat.nombre}
                    description={cat.descripcion}
                    image={cat.url_imagen}
                  />
                </div>
              ))}
            </Carousel>
          )}
        </div>

        {/* Manejo de carga y grid de certificados igual */}
        {isLoadingCerts ? (
          <div className="flex justify-center items-center h-40 text-gray-400">
            Cargando certificaciones...
          </div>
        ) : certificados.length === 0 ? (
           <div className="text-center text-gray-500 py-10">
             No hay certificaciones en esta categoría.
           </div>
        ) : (
          <SeccionCertificados
            certificados={certificados}
            modoAccion={modoAccion}
            certificadosEliminar={certificadosEliminar}
            onEliminar={(cert) => {
              toggleEliminar(cert.id);
            }}
          />
        )}
        <BotonEliminar
          count={certificadosEliminar.length}
          onDeleteAll={handleEliminarSeleccionados}
          onDeselectAll={() => {
            setCertificadosEliminar([]);
            setModoAccion(null);
          }}
        />
      </div>
      
    </DashboardLayout>
  );
}