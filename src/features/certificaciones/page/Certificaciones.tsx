import { useState } from "react";
import { useCategorias } from '../hooks/useCategorias';
import { useCertificaciones } from "../hooks/useCertificaciones";
import { useCrearCertificacion } from "../hooks/useCrearCertificacion"; 

import { Banner } from "@/components/Banner";
import { InputCertificaciones } from "../components/InputCertificaciones";
import { FechaInput } from "../components/FechaInput";
import { ImagenUploader } from "../components/ImagenUploader";
import { DropdownCertificaciones } from "../components/DropdownCertificaciones";
import DashboardLayout from "@/layout/DashboardLayout";
import { uploadImage } from "@/firebase/firebaseStorage";
import { CertificadosGrid } from "../components/CertificadosGrid";
import { Carousel } from "../components/carruselCards/Carrusel";
import { CategoriaCard } from "../components/carruselCards/CategoriaCard";
import { toast } from "@/components/Alerta";
import ModalForm from "@/components/Modal";

const ID_PORTAFOLIO_ACTUAL = "0b069f23-7b3f-45e5-bf20-96608d4b3f4c";

export default function Certificaciones() {
  const [openModal, setOpenModal] = useState(false);
  const [filtroCategoriaId, setFiltroCategoriaId] = useState<string | null>(null);
  
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
  const { registrarCertificacion, isCreating, error } = useCrearCertificacion();
  
  const { 
    certificados, 
    isLoadingCerts, 
    isUsingFallbackCerts 
  } = useCertificaciones(ID_PORTAFOLIO_ACTUAL, filtroCategoriaId);

  const opcionesCategorias = categorias.map((cat) => ({
    label: cat.nombre,
    value: cat.id,
  }));

  // FUNCIÓN PARA ENVIAR A FIREBASE Y LUEGO AL BACKEND
  const handleSubmit = async () => {
    // 👇 1. Agregamos institucionForm a la validación
    if (!categoriaSeleccionada || !tituloForm || !institucionForm || !archivoImagenForm) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    try {
      setIsUploadingToFirebase(true);

      const nombreArchivo = `${Date.now()}_${archivoImagenForm.name}`;
      const rutaFirebase = `certificaciones/${nombreArchivo}`; 
      const url_archivo_firebase = await uploadImage(archivoImagenForm, rutaFirebase);

      const datosDelFormulario = {
        titulo: tituloForm,
        descripcion: descripcionForm,
        institucion_emisora: institucionForm, // 👇 2. USAMOS EL ESTADO AQUÍ
        fecha_obtencion: fechaObtencionForm || new Date().toISOString().split('T')[0],
        url_archivo: url_archivo_firebase,
        orientacion_imagen: orientacionForm,
        id_categoria_certificacion: categoriaSeleccionada.value
      };

      await registrarCertificacion(ID_PORTAFOLIO_ACTUAL, datosDelFormulario);
      toast.success("Certificación creada exitosamente!");
      
      setOpenModal(false);
      setTituloForm("");
      setInstitucionForm(""); // 👇 3. LIMPIAMOS EL ESTADO
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

  const isBusy = isCreating || isUploadingToFirebase; // Variable para desactivar botones mientras carga
  const resetForm = () => {
    setTituloForm("");
    setInstitucionForm("");
    setDescripcionForm("");
    setFechaObtencionForm("");
    setArchivoImagenForm(null);
    setCategoriaSeleccionada(null);
  };
  const cerrarModal = () => {
    resetForm();
    setOpenModal(false);
  };
  return (
    <DashboardLayout>
      <div className="mb-6 sm:mb-8 md:mb-10">
        <Banner onOpenModal={() => setOpenModal(true)} textoBoton="Añadir Certificacion" titulo="Certificaciones y logros" descripcion=""  ></Banner>

        <ModalForm isOpen={openModal} closeModal={cerrarModal} maxWidth="max-w-2xl">
          <h2 className="text-lg font-semibold mb-6 text-left text-gray-700">
            Subir certificación
          </h2>

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
            
            {/* FORMULARIO */}
            <div className="w-full md:w-[280px] flex flex-col gap-4">
              <DropdownCertificaciones
                titulo="Categoría"
                placeholder={isLoading ? "Cargando categorías..." : "Categorías"}
                opciones={opcionesCategorias}
                value={categoriaSeleccionada}
                onChange={(opcion) => setCategoriaSeleccionada(opcion)}
              />
              
              <InputCertificaciones 
                titulo="Título" 
                tamMax={100} 
                height={40}
                value={tituloForm}
                onChange={(e) => setTituloForm(e.target.value)} 
              />

              <InputCertificaciones 
                titulo="Institucion Emisora" 
                tamMax={100} 
                height={40}
                value={institucionForm}
                onChange={(e) => setInstitucionForm(e.target.value)}
              />
              
              <FechaInput 
                titulo="Fecha de emisión"
                value={fechaObtencionForm}
                onChange={(valorString) => setFechaObtencionForm(valorString)}
              />
              
              <InputCertificaciones 
                titulo="Descripción" 
                tamMax={300} 
                height={80}
                value={descripcionForm}
                onChange={(e) => setDescripcionForm(e.target.value)}
              />
            </div>

            {/* IMAGEN */}
            <div className="flex-1 w-full">
              <div className="w-full h-auto md:h-[260px]">
                {/* CAMBIO CLAVE: Usamos onImageReady que devuelve un File */}
                <ImagenUploader 
                  onImageReady={(file) => setArchivoImagenForm(file)} 
                  onOrientationDetected={(orientacion) => setOrientacionForm(orientacion)}
                />
              </div>
            </div>
          </div>

          {/* Muestra mensaje de error si falla la creación */}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              onClick={() => setOpenModal(false)}
              className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center"
              disabled={isBusy}
            >
              Cancelar
            </button>
            
            {/* BOTÓN CON ESTADO DE CARGA UNIFICADO */}
            <button 
              onClick={handleSubmit}
              disabled={isBusy}
              className={`${isBusy ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded w-full sm:w-auto text-center flex justify-center items-center gap-2 transition-colors`}
            >
              {isBusy ? "Procesando..." : "Subir"}
            </button>
          </div>
        </ModalForm>

         {/* CATEGORÍAS (responsivo corregido anteriormente) */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
            <h3 className="text-sm text-dark-500 font-medium-ui text-left flex flex-wrap items-center gap-2">
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
                className="text-xs text-blue-500 hover:underline cursor-pointer"
              >
                Ver todas las certificaciones
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="h-32 flex items-center justify-center text-gray-400">
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

        {/* CERTIFICACIONES (responsivo corregido anteriormente) */}
        <h2 className="
          text-lg
          sm:text-xl
          md:text-4xl
          lg:text-5xl
          text-dark-500
          tracking-widest
          font-semibold-ui
          mt-6
          flex justify-center text-center items-center gap-2
        ">
          CERTIFICACIONES
          {isUsingFallbackCerts && (
            <span className="text-xs text-orange-500 font-normal tracking-normal hidden sm:inline"></span>
          )}
        </h2>
        
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
          <CertificadosGrid certificados={certificados} />
        )}
        
      </div>
    </DashboardLayout>
  );
}