import mongoose from 'mongoose'

const participantSchema = new mongoose.Schema({
  socketId: String,
  name:     { type: String, required: true },
  score:    { type: Number, default: 0 },
  answers:  { type: Map, of: String, default: {} },  // questionIndex → optionId
}, { _id: false })

const sessionSchema = new mongoose.Schema({
  quiz:             { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  teacher:          { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  pin:              { type: String, required: true, unique: true },
  status:           { type: String, enum: ['waiting', 'live', 'ended'], default: 'waiting' },
  currentQuestion:  { type: Number, default: 0 },
  phase:            { type: String, enum: ['idle', 'running', 'paused', 'answer_shown', 'leaderboard_shown', 'ended'], default: 'idle' },
  participants:     { type: [participantSchema], default: [] },
}, { timestamps: true })

export default mongoose.model('Session', sessionSchema)
