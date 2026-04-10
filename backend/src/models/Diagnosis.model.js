import mongoose from 'mongoose';

const diagnosisSchema = new mongoose.Schema({
  // Optional — allows saving without auth (guest mode)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  date: { type: Date, default: Date.now },

  // "general", "respiratory", "cardiology", "dermatology", "brain", "chest", "skin"
  type: { type: String, required: true },

  // "symptom" or "scan"
  mode: { type: String, enum: ['symptom', 'scan'], default: 'symptom' },

  // Duration in days
  duration: { type: Number, default: 1 },

  // Free-text symptoms
  symptoms: { type: String, default: '' },

  // ─── Groq Report Fields ───────────────────────────
  risk_level:  { type: String, default: 'Unknown' },
  confidence:  { type: String, default: 'N/A' },
  summary:     { type: String, default: '' },
  advice:      { type: String, default: '' },

  conditions:          [{ type: String }],
  specialists:         [{ type: String }],
  next_steps:          [{ type: String }],
  recommended_actions: [{ type: String }],

  // ─── AI Model Result (scan mode only) ─────────────
  ai_model_result: {
    prediction:          { type: String },
    confidence:          { type: Number },
    class_probabilities: { type: mongoose.Schema.Types.Mixed },
    model_type:          { type: String },
  },

}, { timestamps: true });

export default mongoose.model('Diagnosis', diagnosisSchema);
