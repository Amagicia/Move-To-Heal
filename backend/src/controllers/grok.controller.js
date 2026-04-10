/**
 * Diagnose Controller
 *
 * Handles text-based symptom analysis via Groq LLM.
 * Saves every diagnosis to DB history automatically.
 *
 * POST /api/diagnose
 */

import analyzeWithGrok from '../services/grokService.js';
import Diagnosis from '../models/Diagnosis.model.js';

const generateDiagnosis = async (req, res) => {
    try {
        let { category, durationDays, symptoms } = req.body;
        const file = req.file;

        // Validation — need either text or a file
        const hasNoText = !symptoms || symptoms === 'undefined' || symptoms.trim() === '';

        if (hasNoText && !file) {
            return res.status(400).json({
                error: 'Please provide symptoms or upload a file.',
            });
        }

        // If image uploaded without text, create a system prompt for Groq
        if (hasNoText && file) {
            symptoms = `[SYSTEM NOTE: Patient uploaded a medical image "${file.originalname}" for ${category} without text. Acknowledge the upload, assign risk based on duration, and advise that a doctor should review the scan.]`;
        }

        console.log(`[Diagnose] ${category} | ${durationDays} days`);

        const report = await analyzeWithGrok(category, durationDays, symptoms);

        // ─── Save to DB ────────────────────────────────
        const saved = await Diagnosis.create({
            type:       category || 'general',
            mode:       'symptom',
            duration:   Number(durationDays) || 1,
            symptoms:   symptoms || '',
            risk_level:  report.risk_level,
            confidence:  report.confidence,
            summary:     report.summary,
            advice:      report.advice,
            conditions:          report.conditions  || [],
            specialists:         report.specialists || [],
            next_steps:          report.next_steps  || [],
            recommended_actions: report.next_steps  || [],
        });

        console.log(`[Diagnose] ✅ Saved to history: ${saved._id}`);

        // Return report + saved document ID
        res.status(200).json({ ...report, _id: saved._id });

    } catch (error) {
        console.error('[Diagnose] Error:', error.message);
        res.status(500).json({
            error: 'Diagnosis failed.',
            details: error.message,
        });
    }
};

export default generateDiagnosis;