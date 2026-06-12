import { AuthRequest } from '../middleware/auth.middleware'
import { Response } from 'express'
import {
  CreateProjectSchema,
  updateProjectSchema,
} from '../validators/project.validator'
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../services/project.service'

export const getProjects = async (req: AuthRequest, res: Response) => {
  console.log('params: ', req.params)
  try {
    const projects = await getAllProjects(
      req.user!.id,
      Number(req.params.clientId)
    )
    res.json(projects)
  } catch (err: any) {
    if (err.message === 'Client not found') {
      return res.status(404).json({ error: err.message })
    }
    res.status(500).json({ error: 'Somethng went wrong' })
  }
}

export const getProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await getProjectById(
      req.user!.id,
      Number(req.params.clientId),
      Number(req.params.id)
    )
    res.json(project)
  } catch (err: any) {
    console.error(err)
    if (
      err.message === 'Client not found' ||
      err.message === 'Project not found'
    ) {
      return res.status(404).json({ error: err.message })
    }
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const createProjectHandler = async (req: AuthRequest, res: Response) => {
  try {
    const input = CreateProjectSchema.parse(req.body)
    const project = await createProject(
      req.user!.id,
      Number(req.params.clientId),
      input
    )
    res.status(201).json(project)
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors })
    }
    if (err.message === 'Client not found') {
      return res.status(404).json({ error: err.message })
    }
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const updateProjectHandler = async (req: AuthRequest, res: Response) => {
  try {
    const input = updateProjectSchema.parse(req.body)
    const project = await updateProject(
      req.user!.id,
      Number(req.params.clientId),
      Number(req.params.id),
      input
    )
    res.json(project)
  } catch (err: any) {
    if (err.message === 'ZodError') {
      return res.status(400).json({ error: err.errors })
    }
    if (
      err.message === 'Client not found' ||
      err.message === 'Project not found'
    ) {
      return res.status(404).json({ error: err.message })
    }
    res.status(500).json({ eror: 'Something went wrong' })
  }
}

export const deleteProjectHandler = async (req: AuthRequest, res: Response) => {
  try {
    const result = await deleteProject(
      req.user!.id,
      Number(req.params.clientId),
      Number(req.params.id)
    )
    res.json(result)
  } catch (err: any) {
    if (
      err.message === 'Client not found' ||
      err.message === 'Project not found'
    ) {
      return res.status(404).json({ error: err.message })
    }
    res.status(500).json({ error: 'Something went wrong' })
  }
}
