import {z} from "zod"

export const registerSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6,'Password must e atleast 6 characters'),
})

export const loginSchema = z.object ({
    email:z.email('Invalid email address'),
    password: z.string().min(1,'Password is rewuired'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>