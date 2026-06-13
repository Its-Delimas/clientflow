import { AuthRequest } from '../middleware/auth.middleware'
import { Response } from 'express'
import {
  createTaskSchema,
  updateTaskSchema,
} from '../validators/task.validator'
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../services/task.service'

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getAllTasks(
      req.user!.id,
      Number(req.params.clientId),
      Number(req.params.projectId)
    )
    res.json(result)
  } catch (err: any) {
    if (err.message === 'Project not found') {
      return res.status(404).json({ error: err.message })
    }
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getTaskById(
      req.user!.id,
      Number(req.params.clientId),
      Number(req.params.projectId),
      Number(req.params.id)
    )
    res.json(result)
  } catch (err: any) {
    if (
      err.message === 'Task not found' ||
      err.message === 'Project not found'
    ) {
      return res.status(404).json({ error: err.message })
    }
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createTaskHandler = async (req: AuthRequest, res: Response) => {
  try {
    const input = createTaskSchema.parse(req.body)
    const result = await createTask(
      req.user!.id,
      Number(req.params.clientId),
      Number(req.params.projectId),
      input
    )
    res.status(201).json(result)
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors })
    }
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const updateTaskHandler = async (req: AuthRequest, res: Response) => {
  try {
    const input = updateTaskSchema.parse(req.body)
    const result = await updateTask(
      req.user!.id,
      Number(req.params.clientId),
      Number(req.params.projectId),
      Number(req.params.id),
      input
    )
    res.status(200).json(result)
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors })
    }
    if (
      err.message === 'Task not found' ||
      err.message === 'Project not found'
    ) {
      return res.status(404).json({ error: err.message })
    }
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const deleteTaskHandler = async (req: AuthRequest, res: Response) => {
  try {
    const result = await deleteTask(
      req.user!.id,
      Number(req.params.clientId),
      Number(req.params.projectId),
      Number(req.params.id)
    )
    res.json(result)
  } catch (err: any) {
    if (
      err.message === 'Task not found' ||
      err.message === 'Project not found'
    ) {
      return res.status(404).json({ error: err.message })
    }
    res.status(500).json({ message: 'Something went wrong' })
  }
}
