
import { useRef, useState, useEffect } from "react";
import { X, Save, UploadCloud } from "lucide-react";
import type { Tecnologia } from "../types/tecnologia.types";
import { createTecnologia } from "../lib/tegnologia.service";
import  { uploadImage } from "@/firebase/firebaseStorage";
type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const TecnologiaModal = ({ open, onClose, onSuccess }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    logo: "",
  });

  useEffect(() => {
    if (!open) {
      setForm({ nombre: "", descripcion: "", logo: "" });
    }
  }, [open]);

  if (!open) return null;
  const handleSubmit = async () => {
    try {
      await createTecnologia(form);
      onClose();
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Error al crear tecnología:", error);
    }
  };
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file, `tecnologias/${Date.now()}_${file.name}`)
        .then((url) => setForm((prev) => ({ ...prev, logo: url })))
        .catch((err) => console.error("Error al subir imagen:", err));
    }
  };

  return (
<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
  <div className="bg-white rounded-3xl w-full max-w-sm relative p-6 shadow-2xl">
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
    >
      <X size={20} />
    </button>

    <h2 className="text-xl font-bold text-[#1d2b53] mb-5">
      Subir tecnología
    </h2>

    <div className="space-y-4">
      {/* Campo Nombre */}
      <div className="flex flex-col items-start gap-1.5">
        <label className="text-sm font-semibold text-gray-700">
          Nombre
        </label>
        <input
          type="text"
          placeholder="Ej. React, Node.js..."
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
        />
      </div>

      {/* Campo Descripción */}
      <div className="flex flex-col items-start gap-1.5">
        <label className="text-sm font-semibold text-gray-700">
          Descripción
        </label>
        <textarea
          placeholder="Describe brevemente la tecnología"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 h-20 resize-none text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
        />
      </div>

      {/* Campo Imagen */}
      <div className="flex flex-col items-start gap-1.5">
        <label className="text-sm font-semibold text-gray-700">
          Logo de la tecnología
        </label>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          
        />

        <div
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-200 rounded-2xl h-28 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all overflow-hidden bg-gray-50/50"
        >
          {form.logo ? (
            <img
              src={form.logo}
              alt="preview"
              className="w-full h-full object-contain p-3"
            />
          ) : (
            <div className="flex flex-col items-center text-center px-4">
              <UploadCloud size={24} className="text-gray-400 mb-1" />
              <p className="text-gray-500 text-xs font-medium">
                Click para subir imagen
              </p>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Botones de acción */}
    <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
      <button
        onClick={onClose}
        className="order-2 sm:order-1 border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        Cancelar
      </button>

      <button className="order-1 sm:order-2 bg-[#1d2b53] hover:bg-[#2a3b6e] text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 transition-all"
        onClick={handleSubmit}>
        <Save size={15} />
        Guardar
      </button>
    </div>
  </div>
</div>
  );
};