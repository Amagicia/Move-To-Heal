/**
 * Diagnose Controller
 *
 * Handles text-based symptom analysis via Groq LLM.
 * Used when the user selects a symptom-based focus area
 * (general, dermatology, respiratory, cardiology, radiology).
 *
 * POST /api/diagnose
 *
 * NOTE: No auth middleware — open access for now.
 * TODO: Attach auth middleware when user system is enforced.
 */

import analyzeWithGrok from '../services/grokService.js';

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
        res.status(200).json(report);

    } catch (error) {
        console.error('[Diagnose] Error:', error.message);
        res.status(500).json({
            error: 'Diagnosis failed.',
            details: error.message,
        });
    }
};

export default generateDiagnosis;