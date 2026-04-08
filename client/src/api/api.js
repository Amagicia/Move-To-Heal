// Simulating API network latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const submitDiagnosis = async (payload) => {
  await delay(2000); 

  const input = payload.symptoms?.toLowerCase() || "";

  // Mock AI logic based on keywords
  if (input.includes('pain') && input.includes('chest')) {
    return {
      risk_level: "High",
      possible_conditions: ["Cardiac Event", "Severe Angina", "Pulmonary Embolism"],
      advice: "Seek immediate emergency medical attention. Do not wait."
    };
  }

  if (input.includes('pain') || input.includes('fever')) {
    return {
      risk_level: "Medium",
      possible_conditions: ["Viral Infection", "Muscular Strain"],
      advice: "Rest and hydration recommended. Monitor fever. If pain persists beyond 48 hours, seek physical medical evaluation."
    };
  }

  return {
    risk_level: "Low",
    possible_conditions: ["General Fatigue", "Minor Allergic Reaction"],
    advice: "No immediate critical indicators detected. Ensure adequate sleep, hydration, and monitor for changes."
  };
};