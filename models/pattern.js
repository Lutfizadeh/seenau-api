import mongoose from 'mongoose'
const { Schema } = mongoose

const patternSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Nama pola belajar harus diisi']
  },
  focus_time: {
    type: Number,
    required: [true, 'Waktu fokus harus diisi']
  },
  break_time: {
    type: Number,
    required: [true, 'Waktu istirahat harus diisi']
  },
  period: {
    type: Number,
    required: [true, 'Periode harus diisi']
  },
  description: {
    type: String,
    required: [true, 'Deskripsi harus diisi']
  },
  category: {
    type: String,
    required: [true, 'Kategori pola belajar harus diisi'],
    enum: ['pemula', 'menengah', 'mahir']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

export default mongoose.model('Pattern', patternSchema)