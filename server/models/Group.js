import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  groupName: { type: String, required: true },
  groupPrice: { type: Number, required: true },
  targetCount: { type: Number, required: true, default: 2 },
  currentCount: { type: Number, default: 1 },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinTime: { type: Date, default: Date.now }
  }],
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'ongoing', 'completed', 'expired'],
    default: 'ongoing' 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Group', groupSchema);
