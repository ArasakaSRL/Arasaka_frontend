import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { useState } from "react";

import type { Imagen } from "@/features/proyectos/lib/ProyectosApi";

interface Props {
  imagenes: Imagen[];
}

export const ImagenProyecto = ({
  imagenes,
}: Props) => {

  const [indexActual, setIndexActual] =
    useState(0);

  if (!imagenes?.length) {
    return (
      <div
        className=" w-full h-70 rounded-3xl border flex items-center justify-center bg-gray-100
        "
      >
        <ImageOff
          size={80}
          className="text-gray-400"
        />
      </div>
    );
  }

  const siguiente = () => {
    setIndexActual((prev) =>
      prev === imagenes.length - 1
        ? 0
        : prev + 1
    );
  };

  const anterior = () => {
    setIndexActual((prev) =>
      prev === 0
        ? imagenes.length - 1
        : prev - 1
    );
  };

  return (
    <div className="space-y-5">

      <div className="relative overflow-hidden rounded-3xl">

        <AnimatePresence mode="wait">

          <motion.img
            key={imagenes[indexActual].url_imagen}
            src={imagenes[indexActual].url_imagen}
            alt="Proyecto"
            className=" w-full h-70 object-cover rounded-3xl
            "
            initial={{
              opacity: 0,
              scale: 1.02,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
            }}
            transition={{
              duration: 0.35,
            }}
          />

        </AnimatePresence>

        {imagenes.length > 1 && (
          <>
            <button
              onClick={anterior}
              className=" absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/35 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/50 transition
              "
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={siguiente}
              className=" absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/35 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/50 transition
              "
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {imagenes.length > 1 && (
          <div
            className=" absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2
            "
          >
            {imagenes.map((_, i) => (
              <div
                key={i}
                className={` h-2 rounded-full transition-all
                  ${
                    i === indexActual
                      ? "w-8 bg-white"
                      : "w-2 bg-white/50"
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>

      {/* THUMBNAILS */}
      {imagenes.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">

          {imagenes.map((img, i) => (

            <button
              key={i}
              onClick={() => setIndexActual(i)}
              className={` relative min-w-22.5 h-17.5 rounded-2xl overflow-hidden border-2 transition-all
                ${
                  i === indexActual
                    ? "border-primary-500 scale-105"
                    : "border-transparent opacity-70 hover:opacity-100"
                }
              `}
            >
              <img
                src={img.url_imagen}
                alt={`Preview ${i}`}
                className=" w-full h-full object-cover
                "
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};