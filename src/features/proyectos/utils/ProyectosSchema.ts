import { z } from "zod";

export const ProyectoSchema = z
  .object({
    titulo:z
      .string()
      .min(5, "El título es muy corto")
      .max(35, "Has alcanzado el límite de caracteres")
      .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s-]+$/, "El título solo permite letras, números y guiones"),  

    descripcion: z
      .string()
      .min(1, "Campo obligatorio")
      .max(160, "La descripción no puede exceder los 160 caracteres")
      .transform((val) => val.replace(/<[^>]*>?/gm, "")),
      
    tecnologias: z
      .array(z.string())
      .min(1, "Seleccione al menos una tecnología"),
    
    fechaInicio: z
      .string()
      .min(1, "Campo obligatorio"),

    fechaFin: z
      .string()
      .min(1, "Campo obligatorio"),

    projectUrl: z
      .string()
      .optional()
      .refine((val) => !val || val.startsWith("https://"), {
        message: "Formato de enlace inválido",
      }),

    githubUrl: z
      .string()
      .optional()
      .refine((val) => !val || val.startsWith("https://"), {
        message: "Formato de enlace inválido",
      }),
    imagenes: z
      .array(z.any())
      .min(1, "Debe subir al menos una imagen")
      .max(5, "No puedes subir más de 5 imágenes")
  });