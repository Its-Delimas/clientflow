import {z} from 'zod'

export const createClientSchema = z.object ({
    name:z.string().min(1,'Name is required'),
    email:z.email('Invalid email address').optional(),
    company: z.string().optional(),
    status: z.enum(['active','inactive']).optional(),
})

export const updateClientSchema = createClientSchema.partial()

export type CreateClientInput = z.infer<typeof createClientSchema>
export type updateClientSchema = z.infer<typeof updateClientSchema>