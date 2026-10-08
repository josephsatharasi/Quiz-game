import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const teacherSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
}, { timestamps: true })

teacherSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

teacherSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

teacherSchema.methods.toSafeObject = function () {
  const { password, ...obj } = this.toObject()
  return obj
}

export default mongoose.model('Teacher', teacherSchema)
