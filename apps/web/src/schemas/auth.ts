import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

export const signUpSchema = z
  .object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    passwordConfirmation: z
      .string()
      .min(6, 'A senha deve ter no mínimo 6 caracteres'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'As senhas não conferem',
    path: ['passwordConfirmation'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
