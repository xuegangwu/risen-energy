import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  type: { type: String, enum: ['storage', 'solar', 'hybrid'], default: 'storage' },
  category: { type: String, default: 'industrial' },
  icon: { type: String, default: '🔋' },
  coverImage: { type: String },
  description: { type: String },
  features: [{ type: String }],
  specs: {
    capacity: { type: String },
    power: { type: String },
    efficiency: { type: String },
    warranty: { type: String }
  },
  applications: [{ type: String }],
  benefits: [{ type: String }],
  caseStudy: {
    title: { type: String },
    description: { type: String },
    results: [{ type: String }]
  },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Solution = mongoose.model('Solution', solutionSchema);

export default Solution;
