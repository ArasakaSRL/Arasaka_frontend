import { z } from 'zod';

export const perfilSchema = z.object({
    nombre_completo: z
        .string()
        .trim()
        .min(3, 'El nombre completo debe tener al menos 3 caracteres')
        .max(150, 'Máximo 150 caracteres permitidos'),

    gmail: z
        .string()
        .trim()
        .email('Ingresa un formato de correo válido')
        .max(150, 'Máximo 150 caracteres permitidos'),

    pais: z
        .string()
        .max(100, 'Máximo 100 caracteres permitidos')
        .optional(),

    biografia: z
        .string()
        .max(180, 'Máximo 180 caracteres permitidos')
        .optional(),
});

export type PerfilFormData = z.infer<typeof perfilSchema>;
