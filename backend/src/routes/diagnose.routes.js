import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware.js';
import generateDiagnosis from '../controllers/grok.controller.js';
import { downloadReport } from '../controllers/report.controller.js';

const router = Router();

/**
 * POST /api/diagnose
 * Text-based symptom analysis → Groq LLM
 *
 * FormData:
 *   - category:      string (general, dermatology, respiratory, etc.)
 *   - durationDays:  number
 *   - symptoms:      string
 *   - telemetryFile: (optional) image file
 *
 * NOTE: No auth middleware attached — open access for now.
 * TODO: Add auth middleware when user authentication is enforced.
 */
router.post('/', upload.single('telemetryFile'), generateDiagnosis);

/**
 * POST /api/diagnose/report
 * Generate and download a PDF report from diagnosis data.
 *
 * JSON Body: { category, days, symptoms, report }
 */
router.post('/report', downloadReport);

export default router;
