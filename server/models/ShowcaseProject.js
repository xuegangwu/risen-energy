import mongoose from 'mongoose';

const showcaseProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: String, required: true },
  type: { type: String, enum: ['storage', 'solar'], default: 'storage' },
  image: { type: String, default: '🏭' },
  description: { type: String },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  createdAt: { type: Date, default: Date.now }
});

const ShowcaseProject = mongoose.model('ShowcaseProject', showcaseProjectSchema);

export default ShowcaseProject;
