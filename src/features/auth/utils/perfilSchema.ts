import { z } from 'zod';

const soloLetrasYEspacios = /^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/;
const mendajeError = 'El campo solo puede contener letras y espacios';

export const perfilSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(3, 'El nombre debe tener al menos 2 caracteres')
        .max(40, 'Máximo 40 caracteres permitidos')
        .regex(soloLetrasYEspacios, mendajeError),

    apellido: z
        .string()
        .trim()
        .min(6, 'El apellido debe tener al menos 6 caracteres')
        .max(40, 'Máximo 40 caracteres permitidos')
        .regex(soloLetrasYEspacios, mendajeError),

    correo: z
        .string()
        .trim()
        .email('Ingresa un formato de correo válido')
        .min(15, 'Minimo 15 caracteres permitidos')
        .max(50, 'Máximo 50 caracteres permitidos'),

    biografia: z
        .string()
        .trim()
        .min(0, 'La descripción debe tener al menos 10 caracteres')
        .max(270, 'Máximo 270 caracteres permitidos'),
});

export type PerfilFormData = z.infer<typeof perfilSchema>;
