import express from 'express'
import { registerUser, loginUser, currentUser, logoutUser, generateOtpCodeUser, verifikasiUser, refreshTokenUser } from '../controllers/authController.js'
import { protectedMiddleware, verifikasiMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// post /api/v1/auth/register
router.post('/register', registerUser)

// post /api/v1/auth/login
router.post('/login', loginUser)

// get /api/v1/auth/logout
router.get('/logout', protectedMiddleware, logoutUser)

// get /api/v1/auth/getUser
router.get('/getUser', protectedMiddleware, currentUser)

// post /api/v1/auth/generateOtpCode
router.post('/generate-otp-code', protectedMiddleware, generateOtpCodeUser)

// post /api/v1/auth/verifikasi-account
router.post('/verifikasi-account', protectedMiddleware, verifikasiUser)

// post /api/v1/auth/refresh-token
router.post('/refresh-token', protectedMiddleware, refreshTokenUser)

export default router