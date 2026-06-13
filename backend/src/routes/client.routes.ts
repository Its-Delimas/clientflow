import { Router } from 'express'
import {
  getClient,
  getClients,
  createClientHandler,
  updateClientHandler,
  deleteClientHandler,
} from '../controllers/client.controller'
import { authGuard } from '../middleware/auth.middleware'

import projectRoutes from './project.routes'

const router = Router({ mergeParams: true })

router.use(authGuard)

router.get('/', getClients)
router.get('/:id', getClient)
router.post('/', createClientHandler)
router.put('/:id', updateClientHandler)
router.delete('/:id', deleteClientHandler)

router.use('/:clientId/projects', projectRoutes)

export default router
