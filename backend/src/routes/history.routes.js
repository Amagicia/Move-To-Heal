import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import Diagnosis from '../models/Diagnosis.model.js';

const router = Router();

// Get all history
router.get('/', requireAuth, async (req, res) => {
  try {
    const history = await Diagnosis.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

// Get single report
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findOne({ _id: req.params.id, userId: req.user.id });
    if (!diagnosis) return res.status(404).json({ message: "Report not found" });
    res.json(diagnosis);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch report" });
  }
});

export default router;
