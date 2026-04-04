import { z } from 'zod';

export const perfilSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(12, 'Máximo 12 caracteres permitidos'),

    apellido: z
        .string()
        .trim()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(20, 'Máximo 20 caracteres permitidos'),

    correo: z
        .string()
        .trim()
        .email('Correo inválido')
        .max(30, 'Máximo 30 caracteres permitidos'),

    descripcion_laboral: z
        .string()
        .trim()
        .min(50, 'La descripción debe tener al menos 50 caracteres')
        .max(200, 'Máximo 200 caracteres permitidos'),
});

export type PerfilFormData = z.infer<typeof perfilSchema>;
