import mongoose from 'mongoose'
const { Schema } = mongoose

const taskSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Nama tugas harus diisi']
  },
  duration: {
    type: Number,
    required: [true, 'Durasi tugas harus diisi']
  },
  description: {
    type: String,
    required: [true, 'Deskripsi tugas harus diisi']
  },
  category: {
    type: String,
    required: [true, 'Kategori tugas harus diisi'],
    enum: ['penting', 'sangat penting']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

export default mongoose.model('Task', taskSchema)