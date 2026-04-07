import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ReportCard from '../components/ReportCard';

const mockReports = {
  skin: {
    condition: "Benign Nevus",
    confidence: "94.2%",
    risk_level: "low",
    description: "The AI model analyzed the uploaded image and identified characteristics consistent with a benign nevus. No immediate signs of melanoma or malignant growth were detected.",
    precautions: ["Avoid excessive sun exposure during peak hours", "Use zinc-based sunscreen daily"],
    recommended_actions: ["Monitor for changes in size, shape, or color", "Routine annual dermatological checkup"]
  },
  xray: {
    condition: "Clear Lungs",
    confidence: "98.1%",
    risk_level: "low",
    description: "The chest X-ray shows clear lung fields with no noticeable infiltrates, masses, or effusions. Heart size is within normal limits.",
    precautions: ["Stay hydrated to maintain mucous membrane health"],
    recommended_actions: ["Continue healthy habits", "Consult physician if symptoms persist"]
  },
  tumor: {
    condition: "Suspicious Mass Identified",
    confidence: "89.5%",
    risk_level: "high",
    description: "The detection model identified a defined mass that requires further investigation. The morphology appears irregular with lobulated margins.",
    precautions: ["Do not ignore these results", "Avoid strenuous physical activity until cleared by a doctor"],
    recommended_actions: ["IMMEDIATE: Schedule a biopsy", "Consult an oncologist", "Obtain a high-resolution MRI"]
  },
  general: {
    condition: "Viral Infection Pattern",
    confidence: "90.7%",
    risk_level: "medium",
    description: "Based on the reported symptoms, the pattern strongly matches a standard viral influenza infection. No severe acute markers detected.",
    precautions: ["Isolate to prevent spreading", "Rest adequately for at least 48 hours"],
    recommended_actions: ["Take fever-reducing medication if needed", "Drink plenty of electrolytes", "See doctor if fever persists > 3 days"]
  }
};

const Report = () => {
  const location = useLocation();
  const [report, setReport] = useState(null);

  useEffect(() => {
    // Determine which mock report to show
    const type = location.state?.scanType || 'general';
    setReport(mockReports[type]);
  }, [location.state]);

  return (
    <div className="w-full">
      <Link to="/history" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-bold mb-8 transition-colors">
        <ChevronLeft className="w-5 h-5" /> Back to History
      </Link>
      
      {report && <ReportCard report={report} />}
    </div>
  );
};

export default Report;
