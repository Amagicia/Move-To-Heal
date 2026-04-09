import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagePath = path.join(__dirname, '../pulse.png');

/**
 * Generates a clinical-grade PDF report and streams it to the HTTP response.
 *
 * Key fix: All text is constrained within page margins using `width: contentWidth`.
 * Auto page-break is enabled so long content flows to new pages automatically.
 * Footer disclaimer is applied to every page after content is written.
 */
export const generateReportPDF = (diagnosis, user, res) => {
  return new Promise((resolve, reject) => {
    try {
      const margin = 50;
      const doc = new PDFDocument({
        size: 'A4',
        bufferPages: true,
        margins: { top: margin, bottom: 80, left: margin, right: margin },
      });

      const filename = `MoveToHeal_Report_${diagnosis._id || Date.now()}.pdf`;

      // HTTP headers for download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      doc.pipe(res);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const contentWidth = pageWidth - margin * 2;

      // ==========================================
      // HELPER: Check if we need a new page
      // ==========================================
      const ensureSpace = (needed = 80) => {
        if (doc.y + needed > pageHeight - 90) {
          doc.addPage();
        }
      };

      // ==========================================
      // HELPER: Section header with icon box
      // ==========================================
      const iconUser = 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z';
      const iconDoc = 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z';
      const iconPulse = 'M16 6l-2.92 9.27-2.4-14.41L7.54 12H4v2h4.54l1.92-5.46 2.36 14.18L16.48 12H20v-2h-3.52z';
      const iconChecklist = 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z';

      const drawSectionHeader = (title, iconSvgPath, color) => {
        ensureSpace(60);
        const yPos = doc.y;

        // Icon box
        doc.roundedRect(margin, yPos - 2, 22, 22, 4).fill(color);
        doc.save();
        doc.translate(margin + 4, yPos + 1).scale(0.60);
        doc.path(iconSvgPath).fill('#ffffff');
        doc.restore();

        // Title
        doc.fillColor('#1e293b').font('Helvetica-Bold').fontSize(14)
           .text(title, margin + 35, yPos + 3, { width: contentWidth - 35 });
        doc.moveDown(0.8);

        // Divider
        doc.moveTo(margin, doc.y).lineTo(pageWidth - margin, doc.y)
           .lineWidth(0.5).strokeColor('#e2e8f0').stroke();
        doc.moveDown(0.8);
      };

      // ==========================================
      // WATERMARK (very faint, page 1 only)
      // ==========================================
      doc.save();
      doc.opacity(0.05);
      try {
        doc.image(imagePath, margin, pageHeight / 3, { width: contentWidth });
      } catch (_) { /* pulse.png missing — skip */ }
      doc.restore();

      // ==========================================
      // TOP DISCLAIMER BANNER
      // ==========================================
      doc.rect(0, 0, pageWidth, 35).fill('#fee2e2');
      doc.fillColor('#991b1b').font('Helvetica-Bold').fontSize(9)
         .text(
           'ATTENTION: PRELIMINARY AI-GENERATED REPORT. NOT REVIEWED BY A HUMAN.',
           0, 14,
           { align: 'center', width: pageWidth, letterSpacing: 1 }
         );

      doc.y = 70;

      // ==========================================
      // HEADER + LOGO
      // ==========================================
      const headerY = doc.y;
      try {
        doc.image(imagePath, margin, headerY, { height: 26 });
        doc.font('Helvetica-Bold').fontSize(26).fillColor('#0f172a')
           .text('MoveToHeal', margin + 35, headerY - 2, { width: contentWidth - 35 });
        doc.font('Helvetica').fontSize(12).fillColor('#0284c7')
           .text('Neural Diagnostic Output', margin + 35, doc.y, { width: contentWidth - 35 });
      } catch (_) {
        doc.font('Helvetica-Bold').fontSize(26).fillColor('#0f172a')
           .text('MoveToHeal', margin, headerY, { width: contentWidth });
        doc.font('Helvetica').fontSize(12).fillColor('#0284c7')
           .text('Neural Diagnostic Output', margin, doc.y, { width: contentWidth });
      }
      doc.moveDown(1.5);

      // ==========================================
      // PATIENT DEMOGRAPHICS
      // ==========================================
      drawSectionHeader('Patient Demographics', iconUser, '#64748b');

      const gridY = doc.y;
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#94a3b8');
      doc.text('PATIENT NAME', margin, gridY, { width: 180 });
      doc.text('SCAN DATE', margin + 200, gridY, { width: contentWidth - 200 });

      doc.font('Helvetica').fontSize(11).fillColor('#1e293b');
      doc.text(user.name || 'Anonymous', margin, gridY + 14, { width: 180 });
      doc.text(new Date().toLocaleString(), margin + 200, gridY + 14, { width: contentWidth - 200 });

      const gridY2 = gridY + 36;
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#94a3b8');
      doc.text('PATIENT EMAIL', margin, gridY2, { width: 180 });
      doc.text('REFERENCE ID', margin + 200, gridY2, { width: contentWidth - 200 });

      doc.font('Helvetica').fontSize(11).fillColor('#1e293b');
      doc.text(user.email || 'N/A', margin, gridY2 + 14, { width: 180 });
      doc.font('Courier-Bold').text(
        diagnosis._id || `REQ-${Math.floor(Math.random() * 10000)}`,
        margin + 200, gridY2 + 14, { width: contentWidth - 200 }
      );
      doc.y = gridY2 + 45;

      // ==========================================
      // INPUT TELEMETRY
      // ==========================================
      drawSectionHeader('Input Telemetry', iconDoc, '#0284c7');

      doc.font('Helvetica-Bold').fontSize(11).fillColor('#334155')
         .text('Focus Area: ', margin, doc.y, { continued: true, width: contentWidth })
         .font('Helvetica').text((diagnosis.type || 'General').toUpperCase());

      doc.font('Helvetica-Bold')
         .text('Duration: ', { continued: true, width: contentWidth })
         .font('Helvetica').text(`${diagnosis.duration || 1} Days`);

      doc.moveDown(0.5);

      // Symptom box — calculate height dynamically based on text
      const symptomText = `"${diagnosis.symptoms || 'Visual data analyzed.'}"`;
      const symptomHeight = doc.heightOfString(symptomText, {
        width: contentWidth - 30, fontSize: 11
      });
      const boxHeight = Math.max(symptomHeight + 20, 36);

      ensureSpace(boxHeight + 10);
      const boxY = doc.y;
      doc.roundedRect(margin, boxY, contentWidth, boxHeight, 4).fill('#f8fafc');
      doc.fillColor('#475569').font('Helvetica-Oblique').fontSize(11)
         .text(symptomText, margin + 15, boxY + 10, { width: contentWidth - 30 });
      doc.y = boxY + boxHeight + 10;

      // ==========================================
      // NEURAL ANALYSIS & RISK ASSESSMENT
      // ==========================================
      drawSectionHeader('Neural Analysis Output', iconPulse, '#8b5cf6');

      // Risk badge
      let riskColor = '#64748b';
      let riskBg = '#f1f5f9';
      const riskLevel = (diagnosis.risk_level || 'Unknown').toUpperCase();

      if (riskLevel.includes('HIGH'))   { riskColor = '#b91c1c'; riskBg = '#fef2f2'; }
      if (riskLevel.includes('MEDIUM')) { riskColor = '#b45309'; riskBg = '#fffbeb'; }
      if (riskLevel.includes('LOW'))    { riskColor = '#15803d'; riskBg = '#f0fdf4'; }

      const badgeY = doc.y;
      doc.roundedRect(margin, badgeY, 130, 22, 11).fill(riskBg);
      doc.fillColor(riskColor).font('Helvetica-Bold').fontSize(10)
         .text(riskLevel, margin, badgeY + 6, { width: 130, align: 'center' });

      doc.fillColor('#64748b').font('Helvetica').fontSize(11)
         .text('Engine Confidence: ', margin + 145, badgeY + 6, { continued: true })
         .font('Helvetica-Bold').fillColor('#0f172a')
         .text(`${diagnosis.confidence || 'N/A'}`);

      doc.moveDown(2);

      // Clinical Summary
      ensureSpace(60);
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#1e293b')
         .text('Clinical Synopsis:', margin, doc.y, { width: contentWidth });
      doc.font('Helvetica').fontSize(11).fillColor('#334155')
         .text(diagnosis.description || 'No synopsis available.', margin, doc.y, {
           width: contentWidth, align: 'justify', lineGap: 3,
         });
      doc.moveDown(1.5);

      // Conditions
      if (diagnosis.conditions && diagnosis.conditions.length > 0) {
        ensureSpace(40);
        doc.font('Helvetica-Bold').fontSize(11).fillColor('#1e293b')
           .text('Flagged Pathology:', margin, doc.y, { width: contentWidth });
        doc.font('Helvetica').fontSize(11).fillColor('#334155');
        diagnosis.conditions.forEach((c) => {
          ensureSpace(20);
          doc.circle(margin + 5, doc.y + 5, 2).fill('#0284c7');
          doc.fillColor('#334155').text(c, margin + 15, doc.y, { width: contentWidth - 15 });
        });
        doc.moveDown(1.5);
      }

      // ==========================================
      // ACTION PLAN & SPECIALISTS
      // ==========================================
      drawSectionHeader('Actionable Next Steps', iconChecklist, '#10b981');

      if (diagnosis.recommended_actions && diagnosis.recommended_actions.length > 0) {
        doc.font('Helvetica-Bold').fontSize(11).fillColor('#1e293b');
        diagnosis.recommended_actions.forEach((a, i) => {
          ensureSpace(20);
          doc.text(`${i + 1}. ${a}`, margin, doc.y, { width: contentWidth, lineGap: 3 });
        });
      }
      doc.moveDown(1);

      if (diagnosis.specialists && diagnosis.specialists.length > 0) {
        ensureSpace(30);
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#64748b')
           .text('RECOMMENDED SPECIALISTS:', margin, doc.y, { width: contentWidth });
        doc.font('Helvetica').fontSize(11).fillColor('#0284c7')
           .text(diagnosis.specialists.join('   |   '), margin, doc.y, { width: contentWidth });
      }

      // ==========================================
      // FOOTER — applied to every page
      // ==========================================
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);

        doc.moveTo(margin, pageHeight - 65)
           .lineTo(pageWidth - margin, pageHeight - 65)
           .lineWidth(0.5).strokeColor('#e2e8f0').stroke();

        doc.font('Helvetica-Bold').fontSize(8).fillColor('#ef4444')
           .text('DISCLAIMER: AI-GENERATED INFORMATIONAL TOOL ONLY',
             margin, pageHeight - 55, { align: 'center', width: contentWidth });

        doc.font('Helvetica').fontSize(7).fillColor('#94a3b8')
           .text(
             'This report was generated by MoveToHeal AI. It does not constitute a medical diagnosis. Always seek advice from a qualified physician. In emergencies, dial 112.',
             margin, pageHeight - 42, { align: 'center', width: contentWidth, lineGap: 2 }
           );
      }

      // Finalize
      doc.end();
      res.on('finish', () => resolve());
      res.on('error', (err) => reject(err));

    } catch (err) {
      reject(err);
    }
  });
};