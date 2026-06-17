import { z } from 'zod'

export const PASSWORD_MIN = 12
export const PASSWORD_MAX = 64

export const passwordSchema = z
    .string()
    .min(PASSWORD_MIN, `Mínimo ${PASSWORD_MIN} caracteres`)
    .max(PASSWORD_MAX, `Máximo ${PASSWORD_MAX} caracteres`)
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener un carácter especial')

export function getPasswordError(pwd: string): string | undefined {
    const r = passwordSchema.safeParse(pwd)
    return r.success ? undefined : r.error.issues[0].message
}
