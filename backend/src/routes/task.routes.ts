import { Router } from 'express'
import { authGuard } from '../middleware/auth.middleware'
import {
  getTasks,
  getTask,
  createTaskHandler,
  deleteTaskHandler,
  updateTaskHandler,
} from '../controllers/task.controller'

const router = Router({ mergeParams: true })

router.use(authGuard)

router.get('/', getTasks)
router.get('/:id', getTask)
router.post('/', createTaskHandler)
router.put('/:id', updateTaskHandler)
router.delete('/:id', deleteTaskHandler)

export default router
