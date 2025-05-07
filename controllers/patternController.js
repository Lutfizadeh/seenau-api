import asyncHandler from "../middleware/asyncHandler.js";
import Pattern from "../models/pattern.js";

export const createPattern = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const newPattern = await Pattern.create({
        ...req.body,
        user: userId,
    });

    return res.status(201).json({
        message: "Berhasil membuat pola belajar",
        data: newPattern,
    });
});

export const allPattern = asyncHandler(async (req, res) => {
    // Req query
    const queryObj = { ...req.query };

    // Abaikan field
    const excludeFields = ["page", "limit", "name"];

    excludeFields.forEach((element) => delete queryObj[element]);

    let query = Pattern.find({
        name: {
            $regex: req.query.name,
            $options: "i",
        }
    });

    if (req.user) {
        // Autentikasi role
        if (req.user.role === "admin") {
            if (req.query.name) {
                query
            } else {
                query = Pattern.find(queryObj);
            }
        } else {
            if (req.query.name) {
                query.find({
                    user: req.user.id
                })                
            } else {
                if(req.query.category) {
                    query = Pattern.find({
                        user: req.user.id,
                        category: req.query.category,
                    })
                } else {
                    query = Pattern.find({
                        user: req.user.id,
                    });
                }
            }
        }
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limitData = req.query.limit * 1 || 7;
    const skipData = (page - 1) * limitData;

    query = query.skip(skipData).limit(limitData);

    const data = await query
    let count = await Pattern.countDocuments()
    if (req.query.page) {
        if (skipData >= count) {
            res.status(404);
            throw new Error("Halaman tidak ditemukan");
        }
    }

    return res.status(200).json({
        message: "Berhasil menampilkan seluruh pola belajar",
        data,
        count,
    })
})

export const detailPattern = asyncHandler(async (req, res) => {
    const paramId = req.params.id;
    const data = await Pattern.findById(paramId);

    if (!data) {
        res.status(404);
        throw new Error("ID tidak ditemukan");
    }

    return res.status(200).json({
        message: "Berhasil menampilkan detail pola belajar",
        data,
    });
});

export const updatePattern = asyncHandler(async (req, res) => {
    const paramId = req.params.id;
    const data = await Pattern.findByIdAndUpdate(paramId, req.body, {
        runValidators: false,
        new: true,
    });

    return res.status(200).json({
        message: "Berhasil memperbarui pola belajar",
        data,
    });
});

export const deletePattern = asyncHandler(async (req, res) => {
    const paramId = req.params.id;
    await Pattern.findByIdAndDelete(paramId);

    return res.status(200).json({
        message: "Berhasil menghapus pola belajar",
    });
});
