import express from 'express'
import { protectedMiddleware, isAdmin, verifikasiMiddleware } from '../middleware/authMiddleware.js'
import { getAllUsers } from '../controllers/userController.js'

const router = express.Router()

// post /api/v1/auth/user
router.get('/', protectedMiddleware, isAdmin, getAllUsers)

// get /api/v1/auth/user/verifikasi
router.get('/verifikasi', protectedMiddleware, verifikasiMiddleware, (req, res) => {
    return res.status(200).json({
        message: "Email sudah terverifikasi"
    })
})

export default router