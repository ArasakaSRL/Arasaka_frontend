import { useRef, useState, useEffect } from "react";
import { X, Save, UploadCloud, Trash2 } from "lucide-react";
import { createTecnologia } from "../lib/tegnologia.service";
import { uploadImage } from "@/firebase/firebaseStorage";
import { toast } from "../../../components/Alerta";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const TecnologiaModal = ({ open, onClose, onSuccess }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_NOMBRE = 50;
  const MAX_DESCRIPCION = 100;

  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    logo: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!open) {
      setForm({ nombre: "", descripcion: "", logo: "" });
      setImageFile(null);
      setPreview("");
      setIsSaving(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      setIsSaving(true);

      let imageUrl = "";

      if (imageFile) {
        imageUrl = await uploadImage(
          imageFile,
          `tecnologias/${Date.now()}_${imageFile.name}`
        );
      }
      
      await createTecnologia({
        ...form,
        logo: imageUrl,
      });

      onClose();
      onSuccess && onSuccess();
      toast.success("Tecnología creada exitosamente");
    } catch (error) {
      toast.error("Error al crear tecnología");
      
      setIsSaving(false);
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview("");
    setForm((prev) => ({ ...prev, logo: "" }));

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm relative p-6 shadow-2xl">
        <button
          onClick={onClose}
          disabled={isSaving}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-[#1d2b53] mb-5">
          Subir tecnología
        </h2>

        <div className="space-y-4">
          <div className="flex flex-col items-start gap-1.5 w-full">
            <label className="text-sm font-semibold text-gray-700">
              Nombre
            </label>

            <input
              type="text"
              placeholder="Ej. React, Node.js..."
              value={form.nombre}
              maxLength={MAX_NOMBRE}
              disabled={isSaving}
              onChange={(e) =>
                setForm({ ...form, nombre: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 disabled:opacity-50"
            />

            <div className="w-full flex justify-between text-xs">
              <span
                className={`${
                  form.nombre.length >= MAX_NOMBRE
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              >
                {form.nombre.length >= MAX_NOMBRE &&
                  "Máximo 50 caracteres"}
              </span>

              <span className="text-gray-400">
                {form.nombre.length}/{MAX_NOMBRE}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-1.5 w-full">
            <label className="text-sm font-semibold text-gray-700">
              Descripción
            </label>

            <textarea
              placeholder="Describe brevemente la tecnología"
              value={form.descripcion}
              maxLength={MAX_DESCRIPCION}
              disabled={isSaving}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-3 py-2 h-20 resize-none text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 disabled:opacity-50"
            />

            <div className="w-full flex justify-between text-xs">
              <span
                className={`${
                  form.descripcion.length >= MAX_DESCRIPCION
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              >
                {form.descripcion.length >= MAX_DESCRIPCION &&
                  "Máximo 100 caracteres"}
              </span>

              <span className="text-gray-400">
                {form.descripcion.length}/{MAX_DESCRIPCION}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Logo de la tecnología
            </label>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              disabled={isSaving}
              onChange={handleImage}
            />

            <div className="relative w-full flex justify-center">
             <div
             onClick={() => !isSaving && inputRef.current?.click()}
              className="w-36 h-36 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all overflow-hidden bg-gray-50/50 shadow-sm"
           >
           {preview ? (
            <img
            src={preview}
             alt="preview"
          className="w-full h-full object-cover"
             />
              ) : (
              <div className="flex flex-col items-center text-center px-4">
             <UploadCloud
             size={28}
            className="text-gray-400 mb-1"
             />
          <p className="text-gray-500 text-xs font-medium">
          Subir imagen
               </p>
            </div>
            )}
           </div>

            {preview && !isSaving && (
              <button
             type="button"
             onClick={removeImage}
             className="absolute top-1 right-[calc(50%-72px)] bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all"
            >
      <Trash2 size={14} />
            </button>
           )}
          </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="order-2 sm:order-1 border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>

          <button
            disabled={isSaving}
            className="order-1 sm:order-2 bg-[#1d2b53] hover:bg-[#2a3b6e] text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
          >
            <Save size={15} />
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};
