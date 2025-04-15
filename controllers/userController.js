import User from '../models/user.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find()

    res.status(200).json({
        message: 'Berhasil mengambil data seluruh pengguna',
        data: users
    })
})