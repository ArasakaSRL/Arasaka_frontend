import z from "zod";

export const HabilidadSchema = z
  .object({
    categoria: z
      .string()
      .min(1, "La categoría es obligatoria"),
    tecnologia: z.
      string().
      optional(),
    nivel: z
      .string()
      .min(1, "El nivel de dominio es obligatorio"),
    habilidad: z
      .string()
      .optional(),
    tipo: z
      .string()
      .min(1, "El tipo de habilidad es obligatorio"),
  }).superRefine((data, ctx) => {
  if (data.tipo === "Tecnica" && !data.tecnologia) {
    ctx.addIssue({
      path: ["tecnologia"],
      message: "Seleccione una tecnología",
      code: z.ZodIssueCode.custom,
    });
  }

  if (data.tipo === "Blanda" && !data.habilidad?.trim()) {
    ctx.addIssue({
      path: ["habilidad"],
      message: "Ingrese una habilidad",
      code: z.ZodIssueCode.custom,
    });
  }
});