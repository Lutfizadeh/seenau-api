import express from 'express'
import { createPattern, allPattern, detailPattern, updatePattern, deletePattern } from '../controllers/patternController.js'
import { protectedMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// post /api/v1/pattern/
router.post('/', protectedMiddleware, createPattern)

// get /api/v1/pattern/
router.get('/', protectedMiddleware, allPattern)

// get /api/v1/pattern/
router.get('/:id', protectedMiddleware, detailPattern)

// put /api/v1/pattern/
router.put('/:id', protectedMiddleware, updatePattern)

// delete /api/v1/pattern/
router.delete('/:id', protectedMiddleware, deletePattern)


export default router