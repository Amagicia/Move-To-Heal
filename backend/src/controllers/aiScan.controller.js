/**
 * AI Scan Controller
 *
 * Flow: React → Node.js (this) → Python FastAPI (.h5 model) → Groq LLM → React
 * Saves every scan result to DB history automatically.
 *
 * POST /api/ai-scan       — Upload scan image → model prediction + Groq report
 * GET  /api/ai-scan/status — Check Python AI service health
 */

import fs from 'fs';
import analyzeWithGrok from '../services/grokService.js';
import Diagnosis from '../models/Diagnosis.model.js';

const AI_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
const VALID_TYPES = ['brain', 'chest', 'skin'];

const TYPE_TO_GROQ_CATEGORY = {
    brain: 'neurology',
    chest: 'respiratory',
    skin:  'dermatology',
};

/**
 * POST /api/ai-scan
 *
 * FormData: scanType (brain|chest|skin), scanImage (file), symptoms? (text), durationDays? (number)
 */
const analyzeWithAI = async (req, res) => {
    try {
        const { scanType, symptoms, durationDays } = req.body;
        const file = req.file;

        // --- Validation ---
        if (!file) {
            return res.status(400).json({ error: 'Please upload a medical scan image.' });
        }
        if (!scanType || !VALID_TYPES.includes(scanType)) {
            return res.status(400).json({ error: `Invalid scan type "${scanType}". Must be: ${VALID_TYPES.join(', ')}` });
        }

        // --- Step 1: Send image to Python AI model ---
        console.log(`[AI Scan] ${scanType.toUpperCase()} → ${AI_URL}/predict/${scanType}`);

        const imageBuffer = fs.readFileSync(file.path);
        const blob = new Blob([imageBuffer], { type: file.mimetype });
        const form = new FormData();
        form.append('file', blob, file.originalname);

        const aiRes = await fetch(`${AI_URL}/predict/${scanType}`, {
            method: 'POST',
            body: form,
        });

        if (!aiRes.ok) {
            const err = await aiRes.json().catch(() => ({}));
            console.error('[AI Scan] Python error:', err);
            return res.status(502).json({
                error: err.detail || 'AI model service unavailable. Make sure Python server is running.',
                fix: 'Run: cd ai && python main.py',
            });
        }

        const modelResult = await aiRes.json();
        console.log(`[AI Scan] Prediction: ${modelResult.prediction} (${modelResult.confidence}%)`);

        // --- Step 2: Enrich with Groq LLM report ---
        const prompt = [
            '[AI MODEL SCAN RESULT]',
            `Scan Type: ${scanType.toUpperCase()}`,
            `Prediction: ${modelResult.prediction}`,
            `Confidence: ${modelResult.confidence}%`,
            `Probabilities: ${JSON.stringify(modelResult.class_probabilities)}`,
            symptoms ? `Patient Notes: ${symptoms}` : 'No additional notes from patient.',
            '',
            'IMPORTANT: Base risk assessment on the AI prediction above.',
            'Tumor/cancer/TB → HIGH RISK. Normal/benign → LOW RISK.',
        ].join('\n');

        const groqReport = await analyzeWithGrok(
            TYPE_TO_GROQ_CATEGORY[scanType] || 'general',
            durationDays || 1,
            prompt,
        );

        // --- Step 3: Combine and respond ---
        const report = {
            ...groqReport,
            ai_model_result: {
                prediction: modelResult.prediction,
                confidence: modelResult.confidence,
                class_probabilities: modelResult.class_probabilities,
                model_type: modelResult.model_type,
            },
        };

        // --- Step 4: Save to DB ────────────────────────
        const saved = await Diagnosis.create({
            type:       scanType,
            mode:       'scan',
            duration:   Number(durationDays) || 1,
            symptoms:   symptoms || '',
            risk_level:  groqReport.risk_level,
            confidence:  groqReport.confidence,
            summary:     groqReport.summary,
            advice:      groqReport.advice,
            conditions:          groqReport.conditions  || [],
            specialists:         groqReport.specialists || [],
            next_steps:          groqReport.next_steps  || [],
            recommended_actions: groqReport.next_steps  || [],
            ai_model_result: {
                prediction:          modelResult.prediction,
                confidence:          modelResult.confidence,
                class_probabilities: modelResult.class_probabilities,
                model_type:          modelResult.model_type,
            },
        });

        console.log(`[AI Scan] ✅ Saved to history: ${saved._id}`);

        // Cleanup temp file
        try { fs.unlinkSync(file.path); } catch (_) {}

        console.log('[AI Scan] ✅ Report generated');
        res.status(200).json({ ...report, _id: saved._id });

    } catch (error) {
        console.error('[AI Scan] Error:', error.message);
        res.status(500).json({ error: 'AI analysis failed.', details: error.message });
    }
};

/**
 * GET /api/ai-scan/status
 */
const getAIStatus = async (_req, res) => {
    try {
        const r = await fetch(`${AI_URL}/`, { signal: AbortSignal.timeout(3000) });
        if (!r.ok) throw new Error('unreachable');
        res.status(200).json(await r.json());
    } catch {
        res.status(503).json({
            status: 'offline',
            error: 'Python AI server not running. Start with: cd ai && python main.py',
        });
    }
};

export { analyzeWithAI, getAIStatus };
