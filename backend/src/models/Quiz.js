import mongoose from 'mongoose'

const optionSchema = new mongoose.Schema({
  id:    { type: String, required: true },   // 'a' | 'b' | 'c' | 'd'
  label: { type: String, required: true },   // 'A' | 'B' | 'C' | 'D'
  text:  { type: String, required: true },
}, { _id: false })

const questionSchema = new mongoose.Schema({
  text:      { type: String, required: true },
  code:      { type: String, default: '' },
  options:   { type: [optionSchema], required: true },
  correctId: { type: String, required: true },
}, { _id: false })

const quizSchema = new mongoose.Schema({
  teacher:         { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  title:           { type: String, required: true, trim: true },
  subject:         { type: String, required: true },
  timePerQuestion: { type: Number, default: 20 },
  questions:       { type: [questionSchema], default: [] },
  status:          { type: String, enum: ['draft', 'ready', 'live'], default: 'draft' },
}, { timestamps: true })

export default mongoose.model('Quiz', quizSchema)
