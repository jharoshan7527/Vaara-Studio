
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['3D Modeling', 'Animation', 'Web Development', 'Other'], default: 'Other' },
  description: { type: String, required: true },
  priceFrom: { type: Number, default: 0 },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: [{ type: String }],
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
