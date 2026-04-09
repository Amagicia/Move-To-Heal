import Groq from "groq-sdk";

const analyzeWithGrok = async (category, durationDays, symptoms) => {
    try {
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        // 🧠 THE FIX: Give the AI a strict grading rubric for Risk Levels
        const systemPrompt = `
        You are AegisMed, an advanced medical AI triage system. Your job is to analyze patient symptoms and categorize their risk level accurately.

        CRITICAL RISK RUBRIC:
        - "High Risk": MUST be selected if symptoms include chest pain, severe shortness of breath, sudden numbness/weakness, signs of stroke, severe head trauma, or anything life-threatening.
        - "Medium Risk": MUST be selected if symptoms include severe persistent pain (e.g., sharp abdominal pain), high fever over multiple days, suspected fractures, or chronic symptoms worsening after 7+ days.
        - "Low Risk": Selected for mild, non-threatening issues like common colds, minor rashes, general fatigue, or minor muscle aches lasting 1-3 days.

        You MUST respond with ONLY a valid JSON object matching this exact schema:
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
        - Output ONLY valid JSON. No markdown formatting.
        - DO NOT default to Low Risk. You MUST evaluate the severity of the text.
        `;

        const userPrompt = `
        Category: ${category}
        Duration: ${durationDays} days
        Symptoms: ${symptoms}
        `;

        const response = await groq.chat.completions.create({
            model: "llama3-70b-8192", // 👈 Use Groq's most accurate reasoning model
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.2, // 👈 Keep this low! High temp causes invalid JSON.
            response_format: { type: "json_object" }, // 👈 FORCES Groq to return JSON only
        });

        let rawContent = response.choices[0]?.message?.content?.trim();

        if (!rawContent) {
            throw new Error("Empty response from Groq");
        }

        // Sanitize: Sometimes the AI wraps JSON in markdown blocks despite instructions
        if (rawContent.startsWith("```json")) {
            rawContent = rawContent.replace(/^```json\n/, "").replace(/\n```$/, "");
        } else if (rawContent.startsWith("```")) {
            rawContent = rawContent.replace(/^```\n/, "").replace(/\n```$/, "");
        }

        let parsed;
        try {
            parsed = JSON.parse(rawContent);
            console.log("=== SUCCESSFUL GROQ AI RESPONSE ===");
            console.log("Risk Assessed:", parsed.risk_level);
        } catch (err) {
            console.error("❌ Invalid JSON from Groq:\n", rawContent);
            return {
                risk_level: "Error",
                confidence: "0%",
                conditions: [],
                summary: "AI response could not be parsed.",
                specialists: [],
                next_steps: [],
                advice: "Please try again.",
            };
        }

        return parsed;
    } catch (error) {
        console.error("🔥 Groq Service Error:", error.message);
        return {
            risk_level: "Error",
            confidence: "0%",
            conditions: ["System Error"],
            summary: "System error during diagnosis.",
            specialists: [],
            next_steps: ["Please try again later."],
            advice: "Try again later.",
        };
    }
};

export default analyzeWithGrok;