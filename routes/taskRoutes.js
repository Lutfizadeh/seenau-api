import express from 'express'
import { createTask, allTask, detailTask, updateTask, deleteTask } from '../controllers/taskController.js'
import { protectedMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// post /api/v1/task/
router.post('/', protectedMiddleware, createTask)

// get /api/v1/task/
router.get('/', protectedMiddleware, allTask)

// get /api/v1/task/
router.get('/:id', protectedMiddleware, detailTask)

// put /api/v1/task/
router.put('/:id', protectedMiddleware, updateTask)

// delete /api/v1/task/
router.delete('/:id', protectedMiddleware, deleteTask)


export default router