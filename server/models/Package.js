import mongoose from 'mongoose';

const componentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  brand: { type: String },
  model: { type: String },
  spec: { type: String },
  price: { type: Number, required: true }
});

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['storage', 'solar'], default: 'storage' },
  category: { type: String, required: true },
  description: { type: String },
  capacity: { type: String },
  power: { type: String },
  application: { type: String },
  image: { type: String },
  components: [componentSchema],
  basePrice: { type: Number, required: true },
  groupPrice: { type: Number },
  minGroupSize: { type: Number, default: 1 },
  stock: { type: Number, default: 100 },
  isHot: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Package', packageSchema);
