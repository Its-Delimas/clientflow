import { Router } from 'express'
import {
  getClient,
  getClients,
  createClientHandler,
  updateClientHandler,
  deleteClientHandler,
} from '../controllers/client.controller'
import { authGuard } from '../middleware/auth.middleware'

const router = Router()

router.use(authGuard)

router.get('/', getClients)
router.get('/:id', getClient)
router.post('/', createClientHandler)
router.put('/:id', updateClientHandler)
router.delete('/:id', deleteClientHandler)

export default router
