import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import {
  createClientSchema,
  updateClientSchema,
} from '../validators/client.validator'

import {
  getAllClients,
  getClientsById,
  createClient,
  updateClient,
  deleteClient,
} from '../services/client.service'

export const getClients = async (req: AuthRequest, res: Response) => {
  try {
    const clients = await getAllClients(req.user!.id)
    res.json(clients)
  } catch (err: any) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const getClient = async (req: AuthRequest, res: Response) => {
  try {
    const client = await getClientsById(req.user!.id, Number(req.params.id))
    res.json(client)
  } catch (err: any) {
    if (err.message === 'Client not found') {
      return res.status(404).json({ error: err.message })
    }
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const createClientHandler = async (req: AuthRequest, res: Response) => {
  try {
    const input = createClientSchema.parse(req.body)
    const client = await createClient(req.user!.id, input)
    res.status(201).json(client)
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors })
    }
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const updateClientHandler = async (req: AuthRequest, res: Response) => {
  try {
    const input = updateClientSchema.parse(req.body)
    const client = await updateClient(
      req.user!.id,
      Number(req.params.id),
      input
    )
    res.json(client)
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

export const deleteClientHandler = async (req: AuthRequest, res: Response) => {
  try {
    const result = await deleteClient(req.user!.id, Number(req.params.id))
    res.json(result)
  } catch (err: any) {
    if (err.message === 'Client not found') {
      return res.status(404).json({ error: err.message })
    }
    res.status(500).json({ error: 'Something went wrong' })
  }
}
