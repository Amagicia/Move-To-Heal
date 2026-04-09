
import analyzeWithGrok from '../services/grokService.js';

const generateDiagnosis = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        // Extract form data fields
        console.log("func called generatediagnosis");
        
        const { category, durationDays, symptoms } = req.body;
        
        // Extract the uploaded file (if provided)
        // const file = req.file; 

        // Basic Validation
        // if ((!req.body.symptoms || req.body.symptoms.trim() === "") && !req.file) {
        //     return res.status(400).json({
        //       error: "Provide symptoms or telemetry file",
        //     });
        //   }

        console.log(`[AegisMed] Processing scan for ${category} (${durationDays} days)`);

        // NOTE: For this MVP, we are passing the text to Grok. 
        // If Grok supports vision in your current tier, you would process 'file' here as well.
        
        // Call the Grok Service
        const aiReport = await analyzeWithGrok(category, durationDays, symptoms);

        // Send the AI generated JSON back to React
        res.status(200).json(aiReport);

    } catch (error) {
        console.error("Diagnosis Controller Error:", error);
        
        // Fallback gracefully if the AI fails or JSON parsing breaks
        res.status(500).json({ 
            error: "Neural Engine failed to synthesize data.",
            details: error.message
        });
    }
};

export default generateDiagnosis ;