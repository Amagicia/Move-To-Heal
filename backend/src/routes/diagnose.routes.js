import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { runDiagnosisModel } from '../services/ai.service.js';
import { generateReportPDF } from '../services/pdf.service.js';
import Diagnosis from '../models/Diagnosis.model.js';

const router = Router();

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { type, symptoms } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Run AI Model
    const aiResult = await runDiagnosisModel(type, symptoms, imageUrl);

    // Save Diagnosis entry
    const diagnosis = new Diagnosis({
      userId: req.user.id,
      type,
      symptoms,
      imageUrl,
      ...aiResult
    });
    
    // Generate PDF
    const pdfUrl = await generateReportPDF(diagnosis, req.user);
    diagnosis.report_pdf_url = pdfUrl;

    await diagnosis.save();

    res.json(diagnosis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Diagnosis analysis failed" });
  }
});

export default router;
