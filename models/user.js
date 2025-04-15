import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import Randomstring from 'randomstring'
import Otp from './otp.js'
const { Schema } = mongoose

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Nama harus diisi'],
    minlength: [3, 'Nama minimal 3 karakter']
  },
  email: {
    type: String,
    required: [true, 'Email harus diisi'],
    unique: true,
    validate: {
        validator: validator.isEmail,
        message: 'Format email salah'
    }
  },
  password: {
    type: String,
    required: [true, 'Password harus diisi'],
    minlength: [6, 'Password minimal 6 karakter']
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String,
  },
  isVerifiedAt: {
    type: Date
  }
})

userSchema.pre('save', async function() {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateOtpCode = async function() {
  const randomString = Randomstring.generate({
    length: 6,
    charset: 'numeric'
  })

  let now = new Date()

  const otpCode = await Otp.findOneAndUpdate({
    'user': this._id,
  }, {
    'otpCode': randomString,
    'validUntil': now.setMinutes(now.getMinutes() + 5)
  }, {
    new: true,
    upsert: true,
  })

  return otpCode
}

export default mongoose.model('User', userSchema)