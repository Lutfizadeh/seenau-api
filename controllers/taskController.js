import asyncHandler from "../middleware/asyncHandler.js"
import Task from "../models/task.js"

export const createTask = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const newTask = await Task.create({
        ...req.body,
        user: userId,
    });

    return res.status(201).json({
        message: "Berhasil membuat tugas",
        data: newTask,
    });
});

export const allTask = asyncHandler(async (req, res) => {
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
    const data = await Task.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));
    
    const totalCount = await Task.countDocuments(filter)

    if(skip >= totalCount) {
        res.status(404);
        throw new Error("Halaman tidak ditemukan")
    }

    res.status(200).json({
        message: "Berhasil menampilkan semua tugas",
        data,
        total: totalCount,
    })
});

export const detailTask = asyncHandler(async (req, res) => {
    const paramId = req.params.id;
    const data = await Task.findById(paramId);

    if (!data) {
        res.status(404);
        throw new Error("ID tidak ditemukan");
    }

    return res.status(200).json({
        message: "Berhasil menampilkan detail tugas",
        data,
    });
});

export const updateTask = asyncHandler(async (req, res) => {
    const paramId = req.params.id;
    const data = await Task.findByIdAndUpdate(paramId, req.body, {
        runValidators: false,
        new: true,
    });

    return res.status(200).json({
        message: "Berhasil memperbarui tugas",
        data,
    });
});

export const deleteTask = asyncHandler(async (req, res) => {
    const paramId = req.params.id;
    await Task.findByIdAndDelete(paramId);

    return res.status(200).json({
        message: "Berhasil menghapus tugas",
    });
});
