import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Inalid date format')
    .optional(),
})

export const updateTaskSchema = createTaskSchema.partial()

export type createTaskInput = z.infer<typeof createTaskSchema>
export type updateTaskInput = z.infer<typeof updateTaskSchema>
