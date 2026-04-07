import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const generateReportPDF = async (diagnosis, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const filename = `report-${diagnosis._id}.pdf`;
      const reportsDir = path.join(__dirname, '../../public/reports');
      
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      
      const filepath = path.join(reportsDir, filename);
      const stream = fs.createWriteStream(filepath);
      
      doc.pipe(stream);
      
      // Header
      doc.fontSize(24).fillColor('#78AAC3').text('More to Heal', { align: 'center' });
      doc.fontSize(12).fillColor('#64748b').text('Official Medical Diagnosis Report', { align: 'center' });
      doc.moveDown(2);
      
      // Patient Info
      doc.fontSize(16).fillColor('#1e293b').text('Patient Information');
      doc.fontSize(12).fillColor('#475569');
      doc.text(`Name: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      doc.text(`Date of Analysis: ${new Date().toLocaleDateString()}`);
      doc.text(`Scan Type: ${diagnosis.type.toUpperCase()}`);
      doc.moveDown(2);

      // Diagnosis Results
      doc.fontSize(16).fillColor('#1e293b').text('Analysis Results');
      doc.fontSize(14).fillColor('#0284c7').text(`Condition: ${diagnosis.condition}`);
      
      let riskColor = '#475569';
      if(diagnosis.risk_level === 'high') riskColor = '#dc2626';
      if(diagnosis.risk_level === 'medium') riskColor = '#f97316';
      if(diagnosis.risk_level === 'low') riskColor = '#16a34a';

      doc.fontSize(12).fillColor(riskColor).text(`Risk Level: ${diagnosis.risk_level.toUpperCase()}`);
      doc.fillColor('#475569').text(`AI Confidence: ${diagnosis.confidence}`);
      doc.moveDown();
      
      doc.text(`Description:`, { underline: true });
      doc.text(diagnosis.description);
      doc.moveDown();
      
      // Precautions & Actions
      doc.text(`Precautions:`, { underline: true });
      diagnosis.precautions.forEach(p => doc.text(`• ${p}`));
      doc.moveDown();
      
      doc.text(`Recommended Actions:`, { underline: true });
      diagnosis.recommended_actions.forEach(a => doc.text(`• ${a}`));
      
      doc.end();
      
      stream.on('finish', () => {
        resolve(`/public/reports/${filename}`);
      });
      stream.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
};
