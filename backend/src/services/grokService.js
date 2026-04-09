import Groq from "groq-sdk";

const analyzeWithGrok = async (category, durationDays, symptoms) => {
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const systemPrompt = `
        You are AegisMed, an advanced medical AI triage system. Analyze the patient's symptoms and output ONLY a valid JSON object.

        CRITICAL RISK RUBRIC:
        - "High Risk": Chest pain, severe shortness of breath, sudden numbness/weakness, stroke signs, severe trauma, or life-threatening issues.
        - "Medium Risk": Severe persistent pain, high fever over 3 days, suspected fractures, or chronic symptoms worsening after 7 days.
        - "Low Risk": Mild issues like common colds, minor rashes, general fatigue, or minor muscle aches.

        REQUIRED JSON SCHEMA:
        {
          "risk_level": "High Risk" | "Medium Risk" | "Low Risk",
          "confidence": "percentage string (e.g., '92%')",
          "conditions": ["1-3 possible medical conditions"],
          "summary": "A clinical explanation of why you chose this risk level based on the symptoms",
          "specialists": ["1-3 recommended doctors"],
          "next_steps": ["3-4 actionable steps"],
          "advice": "One urgent sentence of advice"
        }
        
        STRICT RULES:
        - Output ONLY valid JSON.
        - Do not include markdown tags like \`\`\`json.
        - DO NOT default to Low Risk. You MUST evaluate the severity of the text.
        `;

        const userPrompt = `
        Category: ${category}
        Duration: ${durationDays} days
        Symptoms: ${symptoms}
        `;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile", // The absolute best Groq model for JSON
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.1, // Low temp for clinical consistency
            response_format: { type: "json_object" }, 
        });

        let rawContent = response.choices[0]?.message?.content?.trim();
        if (!rawContent) throw new Error("Empty response from Groq");

        // Parse JSON safely
        let parsed;
        try {
            parsed = JSON.parse(rawContent);
            console.log(`=== AI ASSESSED RISK LEVEL: ${parsed.risk_level} ===`);
        } catch (err) {
            console.error("❌ Invalid JSON from Groq:", rawContent);
            throw new Error("Failed to parse AI output into JSON");
        }

        return parsed;

    } catch (error) {
        console.error("🔥 Groq Service Error:", error.message);
        return {
            risk_level: "Error",
            confidence: "0%",
            conditions: ["System Error"],
            summary: "System error during diagnosis connection.",
            specialists: [],
            next_steps: ["Please try again later."],
            advice: "Try again later.",
        };
    }
};

export default analyzeWithGrok;