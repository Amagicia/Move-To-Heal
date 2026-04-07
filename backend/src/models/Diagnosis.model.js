import mongoose from 'mongoose';

const diagnosisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['skin', 'xray', 'tumor', 'general'], required: true },
  symptoms: { type: String },
  imageUrl: { type: String },
  condition: { type: String },
  confidence: { type: String },
  risk_level: { type: String, enum: ['low', 'medium', 'high'] },
  description: { type: String },
  precautions: [{ type: String }],
  recommended_actions: [{ type: String }],
  report_pdf_url: { type: String }
}, { timestamps: true });

export default mongoose.model('Diagnosis', diagnosisSchema);
