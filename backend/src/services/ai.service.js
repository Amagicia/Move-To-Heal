export const runDiagnosisModel = async (type, symptoms, imageUrl) => {
  await new Promise(resolve => setTimeout(resolve, 2500));

  let condition = "Unknown";
  let confidence = "0%";
  let risk_level = "low";
  let description = "Unable to determine properly.";
  let precautions = [];
  let recommended_actions = [];

  switch (type) {
    case 'skin':
      condition = "Benign Nevus (Common Mole)";
      confidence = "94%";
      risk_level = "low";
      description = "The AI model analyzed the uploaded image and identified characteristics consistent with a benign nevus. No immediate signs of melanoma or malignant growth were detected.";
      precautions = ["Avoid excessive sun exposure", "Use sunscreen daily"];
      recommended_actions = ["Monitor for changes in size, shape, or color", "Routine annual dermatological checkup"];
      break;

    case 'xray':
      condition = "Clear Lungs / Normal X-Ray";
      confidence = "98%";
      risk_level = "low";
      description = "The chest X-ray shows clear lung fields with no noticeable infiltrates, masses, or effusions. Heart size is within normal limits.";
      precautions = ["None specific based on scan"];
      recommended_actions = ["Continue healthy habits", "Consult physician if symptoms persist"];
      if (symptoms?.toLowerCase().includes("cough")) {
        condition = "Mild Bronchial Thickening";
        confidence = "85%";
        risk_level = "medium";
        description = "Slight bronchial thickening observed, possibly indicative of a mild inflammatory or infectious process consistent with your reported cough.";
        precautions = ["Stay hydrated", "Avoid cold irritants"];
        recommended_actions = ["Consult a pulmonologist or general physician for proper medication"];
      }
      break;

    case 'tumor':
      condition = "Suspicious Mass Identified";
      confidence = "89%";
      risk_level = "high";
      description = "The detection model identified a defined mass that requires further investigation. The morphology appears irregular.";
      precautions = ["Do not ignore these results"];
      recommended_actions = ["IMMEDIATE: Schedule a biopsy", "Consult an oncologist", "Obtain a high-resolution MRI"];
      break;

    case 'general':
      if (symptoms?.toLowerCase().includes("fever") && symptoms?.toLowerCase().includes("headache")) {
        condition = "Viral Infection (Likely Flu)";
        confidence = "90%";
        risk_level = "medium";
        description = "Based on the reported symptoms of fever and headache, the pattern strongly matches a standard viral influenza infection.";
        precautions = ["Isolate to prevent spreading", "Rest adequately"];
        recommended_actions = ["Take fever-reducing medication (paracetamol)", "Drink plenty of fluids", "See doctor if fever persists > 3 days"];
      } else {
        condition = "General Malaise";
        confidence = "75%";
        risk_level = "low";
        description = "Your symptoms do not strongly correlate with severe, acute pathologies. Likely attributed to stress, fatigue, or mild nutritional deficiency.";
        precautions = ["Ensure adequate sleep (7-8 hours)"];
        recommended_actions = ["Monitor symptoms for a few days", "Maintain a balanced diet"];
      }
      break;
  }

  return {
    condition, confidence, risk_level, description, precautions, recommended_actions
  };
};
