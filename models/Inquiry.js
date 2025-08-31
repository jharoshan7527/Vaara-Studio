
const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  status: { type: String, enum: ['new','in_progress','closed'], default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', InquirySchema);
