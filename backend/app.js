import express from 'express';
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './src/routes/auth.routes.js';
import historyRoutes from './src/routes/history.routes.js';

import generateDiagnosis from './src/controllers/grok.controller.js';
import {generateReportPDF} from "./src/services/pdf.service.js"

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static reports
app.use('/public', express.static(join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);

app.post("/analyze_symptoms",generateDiagnosis)
app.post('/download_report', async (req, res) => {
  try {
      const { category, days, symptoms, report } = req.body;
      
      // Mock user (Replace with actual user data from your auth middleware later)
      const user = { name: "Guest Patient", email: "guest@example.com" };

      // Structure the data to match what the PDF service expects
      const diagnosisData = {
          _id: `AM-${Date.now().toString().slice(-6)}`, // Generate a mock ID
          type: category || "General",
          duration: days || 1,
          symptoms: symptoms || "Visual data only.",
          risk_level: report.risk_level || "Unknown",
          confidence: report.confidence || "N/A",
          description: report.summary || "No summary provided.",
          conditions: report.conditions || [],
          specialists: report.specialists || [],
          recommended_actions: report.next_steps || [],
          advice: report.advice || ""
      };

      // Call the service and pass the 'res' object directly
      await generateReportPDF(diagnosisData, user, res);

  } catch (error) {
      console.error("PDF Generation Error:", error);
      // Important: Only send this if headers haven't already been sent
      if (!res.headersSent) {
          res.status(500).json({ error: "Failed to generate the PDF report." });
      }
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'More to Heal API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
