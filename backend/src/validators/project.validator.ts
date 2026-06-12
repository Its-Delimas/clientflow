import { z } from 'zod'

export const CreateProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'completed', 'on_hold']).optional(),
  deadline: z.iso.date('Invalid date format').optional(),
})

export const updateProjectSchema = CreateProjectSchema.partial()

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
