import mongoose from 'mongoose'
const { Schema } = mongoose

const otpSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  otpCode: {
    type: String,
    required: [true, 'Kode OTP harus diisi']
  },
  validUntil: {
    type : Date,
    required: true,
    expires: 300
  }
})

export default mongoose.model('Otp', otpSchema)