import asyncHandler from "../middleware/asyncHandler.js";
import Pattern from "../models/pattern.js";
import user from "../models/user.js";

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
    const {
        name,
        category,
        sortBy,
        sortOrder,
        page = 1,
        limit = 5,
    } = req.query;

    // Validasi user role
    let filter = {};

    if (req.user.role !== "admin") {
        filter = {user: req.user.id}
    }

    //   Searching name
    if (name) {
        filter.$or = [
            {
                name: {
                    $regex: name,
                    $options: "i",
                },
            },
        ];
    }

    //   Filtering by category
    if (category) {
        filter.category = category;
    }

    // Sorting
    const sortOptions = {};
    if (sortBy) {
        const order = sortOrder === "desc" ? -1 : 1;
        sortOptions[sortBy] = order;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    // Eksekusi query
    const data = await Pattern.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));
    
    const totalCount = await Pattern.countDocuments(filter)

    if(skip >= totalCount) {
        res.status(404);
        throw new Error("Halaman tidak ditemukan")
    }

    res.status(200).json({
        message: "Berhasil menampilkan semua pola belajar",
        data,
        total: totalCount,
    })
});

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
