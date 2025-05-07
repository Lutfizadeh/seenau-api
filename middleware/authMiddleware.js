import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import asyncHandler from './asyncHandler.js'
import Pattern from "../models/pattern.js"

export const protectedMiddleware = asyncHandler(async(req, res, next) => {
    let token

    token = req.cookies.cookie
    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch(error) {
            res.status(401)
            throw new Error('Not authorized, token gagal')
        }
    } else {
        res.status(401)
        throw new Error('Not authorized, tidak ada token')
    }
})

export const isAdmin = asyncHandler(async(req, res, next) => {
    if(req.user) {
        if(req.user.role === 'admin') {
            next()
        } else {
            res.status(403)
            throw new Error('Gagal mengambil data, bukan admin!')
        }
    }
})

export const verifikasiMiddleware = asyncHandler(async(req, res, next) => {
    if(req.user && req.user.isVerified && req.user.isVerifiedAt) {
        next()
    } else {
        res.status(401)
        throw new Error('Email belum terverifikasi')
    }
})