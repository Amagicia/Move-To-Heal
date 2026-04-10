/**
 * History Routes
 *
 * GET  /api/history          — Get all past diagnoses (newest first)
 * GET  /api/history/:id      — Get a single diagnosis record
 * POST /api/history/:id/report — Download PDF report for a specific record
 *
 * NOTE: Auth is not enforced — open access for now (guest mode).
 */

import { Router } from 'express';
import Diagnosis from '../models/Diagnosis.model.js';
import { generateReportPDF } from '../services/pdf.service.js';

const router = Router();

// ─── Get all history (newest first) ────────────────────────
router.get('/', async (_req, res) => {
    try {
        const history = await Diagnosis.find()
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();
        res.json(history);
    } catch (error) {
        console.error('[History] Fetch error:', error.message);
        res.status(500).json({ message: 'Failed to fetch history' });
    }
});

// ─── Get single record ────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        const diagnosis = await Diagnosis.findById(req.params.id).lean();
        if (!diagnosis) return res.status(404).json({ message: 'Report not found' });
        res.json(diagnosis);
    } catch (error) {
        console.error('[History] Fetch single error:', error.message);
        res.status(500).json({ message: 'Failed to fetch report' });
    }
});

// ─── Download PDF for a specific history record ───────────
router.post('/:id/report', async (req, res) => {
    try {
        const diagnosis = await Diagnosis.findById(req.params.id).lean();
        if (!diagnosis) return res.status(404).json({ message: 'Report not found' });

        // Map stored data → PDF service shape
        const pdfData = {
            _id:          diagnosis._id,
            type:         diagnosis.type || 'General',
            duration:     diagnosis.duration || 1,
            symptoms:     diagnosis.symptoms || 'Visual data only.',
            risk_level:   diagnosis.risk_level || 'Unknown',
            confidence:   diagnosis.confidence || 'N/A',
            description:  diagnosis.summary || 'No summary provided.',
            conditions:          diagnosis.conditions || [],
            specialists:         diagnosis.specialists || [],
            recommended_actions: diagnosis.next_steps || [],
            advice:              diagnosis.advice || '',
        };

        const user = { name: 'Guest Patient', email: 'guest@example.com' };

        await generateReportPDF(pdfData, user, res);

    } catch (error) {
        console.error('[History] PDF download error:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Failed to generate PDF report' });
        }
    }
});

export default router;
