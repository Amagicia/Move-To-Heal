import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware.js';
import { analyzeWithAI, getAIStatus } from '../controllers/aiScan.controller.js';

const router = Router();

/**
 * POST /api/ai-scan
 * Upload a medical scan image for AI model prediction + Groq report
 * 
 * FormData fields:
 *   - scanType:     "brain" | "chest" | "skin"
 *   - scanImage:    image file
 *   - symptoms:     (optional) text
 *   - durationDays: (optional) number
 */
router.post('/', upload.single('scanImage'), analyzeWithAI);

/**
 * GET /api/ai-scan/status
 * Check Python AI service health + which models are available
 */
router.get('/status', getAIStatus);

export default router;
