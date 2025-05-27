import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import Otp from "../models/otp.js";

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_TOKEN_REFRESH, {
        expiresIn: "7d",
    });
};

const createResToken = async (user, statusCode, res) => {
    const accessToken = signToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await User.findByIdAndUpdate(user._id, {
        refreshToken,
    });

    const cookieOptionToken = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        environment: process.env.NODE_ENV,
    };

    const cookieOptionRefresh = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        environment: process.env.NODE_ENV,
    };

    res.cookie("cookie", accessToken, cookieOptionToken);
    res.cookie("refresh", refreshToken, cookieOptionRefresh);

    user.password = undefined;

    res.status(statusCode).json({
        user,
    });
};

export const registerUser = asyncHandler(async (req, res) => {
    const isFirstUser = (await User.countDocuments()) === 0 ? "admin" : "user";
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: isFirstUser,
    });

    const otpData = await user.generateOtpCode();

    await sendEmail({
        to: user.email,
        subject: "Register Berhasil!",
        html: `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>
                    </head>
                    <body>
                        <h1>Selamat! ${user.name} berhasil mendaftar!</h1>
                        <h6>Silahkan gunakan OTP Code di bawah untuk verifikasi akun. OTP code akan expired dalam 5 menit.</h6>
                        <p style="text-align: center; background-color: yellow; font-weight: bold; font-size: 30;">${otpData.otpCode}</p>
                    </body>
                    </html>`,
    });

    createResToken(user, 201, res);
});

export const generateOtpCodeUser = asyncHandler(async (req, res) => {
    const currentUser = await User.findById(req.user._id);

    const otpData = await currentUser.generateOtpCode();

    await sendEmail({
        to: currentUser.email,
        subject: "Berhasil! Generate Ulang OTP Code",
        html: `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>
                    </head>
                    <body>
                        <h1>Selamat! ${currentUser.name} berhasil generate OTP code baru!</h1>
                        <h6>Silahkan gunakan OTP Code di bawah untuk verifikasi akun. OTP code akan expired dalam 5 menit.</h6>
                        <p style="text-align: center; background-color: yellow; font-weight: bold; font-size: 30;">${otpData.otpCode}</p>
                    </body>
                    </html>`,
    });

    return res.status(200).json({
        message: "OTP Code berhasil dikirim ke email",
    });
});

export const verifikasiUser = asyncHandler(async (req, res) => {
    // Validasi jika OTP tidak diisi
    if (!req.body.otpCode) {
        res.status(400);
        throw new Error("OTP Code harus diisi");
    }

    // Validasi jika OTP tidak valid
    const otp = await Otp.findOne({
        otpCode: req.body.otpCode,
        user: req.user._id,
    });

    if (!otp) {
        res.status(400);
        throw new Error("OTP Code tidak valid/salah");
    }

    // Update user menjadi verified
    const userData = await User.findById(req.user._id);

    await User.findByIdAndUpdate(req.user._id, {
        isVerified: true,
        isVerifiedAt: Date.now(),
    });

    return res.status(200).json({
        message: "Berhasil verifikasi akun",
    });
});

export const loginUser = asyncHandler(async (req, res) => {
    // Cek apakah email dan password diisi
    if (!req.body.email && !req.body.password) {
        res.status(400);
        throw new Error("Email dan password harus diisi");
    } else if (!req.body.email) {
        res.status(400);
        throw new Error("Email harus diisi");
    } else if (!req.body.password) {
        res.status(400);
        throw new Error("Password harus diisi");
    }

    const userData = await User.findOne({
        email: req.body.email,
    });

    // Cek apakah email terdaftar
    if (userData) {
        // Cek apakah password benar
        if (userData && (await userData.matchPassword(req.body.password))) {
            createResToken(userData, 200, res);
        } else {
            res.status(400);
            throw new Error("Password salah");
        }
    } else {
        res.status(400);
        throw new Error("Email tidak terdaftar");
    }
});

export const currentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");

    if (user) {
        res.status(200).json({
            user,
        });
    } else {
        res.status(401);
        throw new Error("Pengguna tidak ditemukan");
    }
});

export const logoutUser = async (req, res) => {
    res.cookie("cookie", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    await User.findByIdAndUpdate(req.user._id, {
        refreshToken: null,
    });

    res.cookie("refresh", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({
        message: "Berhasil keluar",
    });
};

export const refreshTokenUser = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refresh;

    if (!refreshToken) {
        res.status(401);
        throw new Error("Tidak ada refresh token");
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
        return res.status(401);
        throw new Error("Invalid user token");
    }

    jwt.verify(refreshToken, process.env.JWT_TOKEN_REFRESH, (err, decoded) => {
        if (err) {
            res.status(401);
            throw new Error("Invalid refresh token");
        }

        // const newToken = generateRefreshToken(decoded.id)
        createResToken(user, 200, res);
    });
});
