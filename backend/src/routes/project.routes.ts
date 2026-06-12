import { Router } from 'express'
import { authGuard } from '../middleware/auth.middleware'
import {
  getProjects,
  getProject,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
} from '../controllers/project.controller'

const router = Router({ mergeParams: true })

router.use(authGuard)

router.get('/', getProjects)
router.get('/:id', getProject)
router.post('/', createProjectHandler)
router.put('/:id', updateProjectHandler)
router.delete('/:id', deleteProjectHandler)

export default router
