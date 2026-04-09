import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagePath = path.join(__dirname, "../pulse.png");

/**
 * Generates a highly professional, clinical-grade PDF report and streams it to the HTTP response.
 */
export const generateReportPDF = (diagnosis, user, res) => {
  return new Promise((resolve, reject) => {
    try {
      // Initialize document with A4 size and tighter margins for a modern look
      const doc = new PDFDocument({ margin: 0, size: 'A4', bufferPages: true });
      const filename = `MoveToHeal_Clinical_Report_${diagnosis._id || Date.now()}.pdf`;

      // 1. SET HTTP HEADERS FOR REAL-TIME DOWNLOADING
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      // 2. PIPE DIRECTLY TO EXPRESS RESPONSE
      doc.pipe(res);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const margin = 50;
      const contentWidth = pageWidth - margin * 2;

      // ==========================================
      // 🎨 BACKGROUND WATERMARK
      // ==========================================
      doc.save();
      doc.opacity(0.05); // Very faint watermark

      try {
        doc.image(imagePath, margin, pageHeight / 3, {
          width: contentWidth,
          align: "center",
        });
      } catch (e) {
        console.warn("pulse.png not found for watermark:", imagePath);
      }
      doc.restore();

      // ==========================================
      // 🚨 TOP CLINICIAN DISCLAIMER BANNER
      // ==========================================
      doc.rect(0, 0, pageWidth, 35).fill('#fee2e2'); // Light Red Banner
      doc.fillColor('#991b1b') // Dark Red Text
         .font('Helvetica-Bold')
         .fontSize(9)
         .text(
           'ATTENTION CLINICIAN: PRELIMINARY AI-GENERATED TELEMETRY REPORT. NOT REVIEWED BY A HUMAN.', 
           0, 14, 
           { align: 'center', width: pageWidth, letterSpacing: 1 }
         );

      // Reset starting Y coordinate below the banner
      doc.y = 70;

      // ==========================================
      // 🏥 HEADER SECTION WITH LOGO
      // ==========================================
      const headerY = doc.y;
      
      try {
        // Add the logo next to the title
        doc.image(imagePath, margin, headerY, { height: 26 });
        // Shift text to the right of the logo
        doc.font('Helvetica-Bold').fontSize(26).fillColor('#0f172a').text('MoveToHeal', margin + 35, headerY - 2);
        doc.font('Helvetica').fontSize(12).fillColor('#0284c7').text('Neural Diagnostic Output', margin + 35, doc.y);
      } catch (e) {
        // Fallback if logo is missing
        doc.font('Helvetica-Bold').fontSize(26).fillColor('#0f172a').text('MoveToHeal', margin, headerY);
        doc.font('Helvetica').fontSize(12).fillColor('#0284c7').text('Neural Diagnostic Output', margin, doc.y - 2);
      }
      
      doc.moveDown(1.5);

      // ==========================================
      // --- HELPER: CUSTOM VECTOR ICON HEADERS ---
      // ==========================================
      // Instead of text letters, we draw native SVG paths inside the rounded squares
      const drawSectionHeader = (title, iconSvgPath, color) => {
        const yPos = doc.y;
        
        // Draw Icon Box Background
        doc.roundedRect(margin, yPos - 2, 22, 22, 4).fill(color);
        
        // Draw Vector SVG Icon inside the box
        doc.save();
        // Scale and shift the 24x24 SVG path to fit nicely in the 22x22 box
        doc.translate(margin + 4, yPos + 1).scale(0.60);
        doc.path(iconSvgPath).fill('#ffffff');
        doc.restore();
        
        // Draw Title
        doc.fillColor('#1e293b').font('Helvetica-Bold').fontSize(14).text(title, margin + 35, yPos + 3);
        doc.moveDown(0.8);
        
        // Draw subtle divider line
        doc.moveTo(margin, doc.y).lineTo(pageWidth - margin, doc.y).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
        doc.moveDown(0.8);
      };

      // SVG Paths (Based on standard 24x24 Material Design Icons)
      const iconUser = "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z";
      const iconDoc = "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z";
      const iconPulse = "M16 6l-2.92 9.27-2.4-14.41L7.54 12H4v2h4.54l1.92-5.46 2.36 14.18L16.48 12H20v-2h-3.52z";
      const iconChecklist = "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z";

      // ==========================================
      // 👤 PATIENT DEMOGRAPHICS (2-Column Grid)
      // ==========================================
      drawSectionHeader('Patient Demographics', iconUser, '#64748b'); // Slate color
      
      const gridY = doc.y;
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#94a3b8');
      doc.text('PATIENT NAME', margin, gridY);
      doc.text('SCAN DATE', margin + 200, gridY);
      
      doc.font('Helvetica').fontSize(11).fillColor('#1e293b');
      doc.text(user.name || 'Anonymous', margin, gridY + 12);
      doc.text(new Date().toLocaleString(), margin + 200, gridY + 12);

      const gridY2 = doc.y + 10;
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#94a3b8');
      doc.text('PATIENT EMAIL', margin, gridY2);
      doc.text('REFERENCE ID', margin + 200, gridY2);

      doc.font('Helvetica').fontSize(11).fillColor('#1e293b');
      doc.text(user.email || 'N/A', margin, gridY2 + 12);
      doc.font('Courier-Bold').text(diagnosis._id || `REQ-${Math.floor(Math.random() * 10000)}`, margin + 200, gridY2 + 12);
      
      doc.y = gridY2 + 45; // Move down below grid

      // ==========================================
      // 📥 CLINICAL INPUT PROFILE
      // ==========================================
      drawSectionHeader('Input Telemetry', iconDoc, '#0284c7'); // Blue color

      doc.font('Helvetica-Bold').fontSize(11).fillColor('#334155').text(`Focus Area: `, margin, doc.y, { continued: true })
         .font('Helvetica').text((diagnosis.type || 'General').toUpperCase());
      
      doc.font('Helvetica-Bold').text(`Duration: `, { continued: true })
         .font('Helvetica').text(`${diagnosis.duration || 1} Days`);
      
      doc.moveDown(0.5);
      
      // Highlighted symptom box
      doc.roundedRect(margin, doc.y, contentWidth, 40, 4).fill('#f8fafc');
      doc.fillColor('#475569').font('Helvetica-Oblique').fontSize(11)
         .text(`"${diagnosis.symptoms || 'Visual data analyzed.'}"`, margin + 15, doc.y + 12, { width: contentWidth - 30 });
      doc.y += 30; // Step past the box

      // ==========================================
      // 🧠 NEURAL ANALYSIS & RISK ASSESSMENT
      // ==========================================
      drawSectionHeader('Neural Analysis Output', iconPulse, '#8b5cf6'); // Purple color

      // Risk Logic & Styling
      let riskColor = '#64748b'; // Default Slate
      let riskBg = '#f1f5f9';
      const riskLevel = (diagnosis.risk_level || 'Unknown').toUpperCase();
      
      if (riskLevel.includes('HIGH')) { riskColor = '#b91c1c'; riskBg = '#fef2f2'; } // Red
      if (riskLevel.includes('MEDIUM')) { riskColor = '#b45309'; riskBg = '#fffbeb'; } // Orange
      if (riskLevel.includes('LOW')) { riskColor = '#15803d'; riskBg = '#f0fdf4'; } // Green

      const currentY = doc.y;
      
      // Draw Custom Risk Badge (Pill shape)
      doc.roundedRect(margin, currentY, 130, 22, 11).fill(riskBg);
      doc.fillColor(riskColor).font('Helvetica-Bold').fontSize(10).text(riskLevel, margin, currentY + 6, { width: 130, align: 'center' });

      // Confidence Score next to badge
      doc.fillColor('#64748b').font('Helvetica').fontSize(11)
         .text(`Engine Confidence: `, margin + 145, currentY + 6, { continued: true })
         .font('Helvetica-Bold').fillColor('#0f172a').text(`${diagnosis.confidence || 'N/A'}`);

      doc.moveDown(2);

      // Clinical Summary
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#1e293b').text('Clinical Synopsis:');
      doc.font('Helvetica').fontSize(11).fillColor('#334155').text(diagnosis.description || "No synopsis available.", { align: 'justify', lineGap: 3 });
      doc.moveDown(1.5);

      // Detected Pathology
      if (diagnosis.conditions && diagnosis.conditions.length > 0) {
        doc.font('Helvetica-Bold').fontSize(11).fillColor('#1e293b').text('Flagged Pathology:');
        doc.font('Helvetica').fontSize(11).fillColor('#334155');
        diagnosis.conditions.forEach((c) => {
            doc.circle(margin + 5, doc.y + 5, 2).fill('#0284c7'); // Draw custom bullet point
            doc.text(c, margin + 15, doc.y);
        });
        doc.moveDown(1.5);
      }

      // ==========================================
      // 🪜 ACTION PLAN & SPECIALISTS
      // ==========================================
      drawSectionHeader('Actionable Next Steps', iconChecklist, '#10b981'); // Emerald green color

      if (diagnosis.recommended_actions && diagnosis.recommended_actions.length > 0) {
        doc.font('Helvetica-Bold').fontSize(11).fillColor('#1e293b');
        diagnosis.recommended_actions.forEach((a, i) => {
            doc.text(`${i + 1}. ${a}`, margin, doc.y, { lineGap: 3 });
        });
      }
      doc.moveDown(1);

      if (diagnosis.specialists && diagnosis.specialists.length > 0) {
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#64748b').text('RECOMMENDED SPECIALISTS:');
        doc.font('Helvetica').fontSize(11).fillColor('#0284c7');
        doc.text(diagnosis.specialists.join('   |   '));
      }

      // ==========================================
      // ⚠️ FOOTER DISCLAIMER
      // ==========================================
      // Apply footer to all pages dynamically
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        
        doc.moveTo(margin, pageHeight - 65).lineTo(pageWidth - margin, pageHeight - 65).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
        
        doc.font('Helvetica-Bold').fontSize(8).fillColor('#ef4444')
           .text('DISCLAIMER: AI-GENERATED INFORMATIONAL TOOL ONLY', margin, pageHeight - 55, { align: 'center', width: contentWidth });
           
        doc.font('Helvetica').fontSize(7).fillColor('#94a3b8')
           .text('This report was generated autonomously by MoveToHeal AI. It does not constitute a medical diagnosis. Do not ignore professional medical advice or delay seeking it because of information contained herein. In emergencies, dial 112 immediately.', margin, pageHeight - 42, { align: 'center', width: contentWidth, lineGap: 2 });
      }

      // Finalize the PDF
      doc.end();

      // Resolve/Reject Handlers
      res.on('finish', () => resolve());
      res.on('error', (err) => reject(err));

    } catch (err) {
      reject(err);
    }
  });
};