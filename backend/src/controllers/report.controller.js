/**
 * Report Controller
 *
 * Handles PDF report generation from diagnosis data.
 * Extracted from app.js to keep the codebase modular.
 */

import { generateReportPDF } from '../services/pdf.service.js';

/**
 * POST /api/diagnose/report
 *
 * Expects JSON body:
 *   { category, days, symptoms, report }
 *
 * Streams a PDF file back to the client.
 *
 * NOTE: No auth middleware — open access for now.
 * TODO: Attach auth middleware when user system is enforced.
 */
const downloadReport = async (req, res) => {
    try {
        const { category, days, symptoms, report } = req.body;

        // Mock user — replace with real user data from auth middleware later
        // TODO: Extract user from req.user when auth is active
        const user = { name: 'Guest Patient', email: 'guest@example.com' };

        // Map frontend report shape → PDF service shape
        const diagnosisData = {
            _id: `MTH-${Date.now().toString().slice(-6)}`,
            type: category || 'General',
            duration: days || 1,
            symptoms: symptoms || 'Visual data only.',
            risk_level: report?.risk_level || 'Unknown',
            confidence: report?.confidence || 'N/A',
            description: report?.summary || 'No summary provided.',
            conditions: report?.conditions || [],
            specialists: report?.specialists || [],
            recommended_actions: report?.next_steps || [],
            advice: report?.advice || '',
        };

        await generateReportPDF(diagnosisData, user, res);

    } catch (error) {
        console.error('[Report] PDF generation error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to generate the PDF report.' });
        }
    }
};

export { downloadReport };
