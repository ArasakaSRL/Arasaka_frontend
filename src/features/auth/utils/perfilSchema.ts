import { z } from 'zod';

export const perfilSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(3, 'El nombre debe tener al menos 2 caracteres')
        .max(40, 'Máximo 40 caracteres permitidos'),

    apellido: z
        .string()
        .trim()
        .min(6, 'El apellido debe tener al menos 6 caracteres')
        .max(40, 'Máximo 20 caracteres permitidos'),

    correo: z
        .string()
        .trim()
        .email('Ingresa un formato de correo válido')
        .min(15, 'Minimo 15 caracteres permitidos')
        .max(50, 'Máximo 50 caracteres permitidos'),

    biografia: z
        .string()
        .trim()
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .max(200, 'Máximo 200 caracteres permitidos'),
});

export type PerfilFormData = z.infer<typeof perfilSchema>;
