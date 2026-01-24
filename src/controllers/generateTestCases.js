const { GoogleGenAI } = require("@google/genai");

const generateTestCases = async (req, res) => {
  try {
    const { title, description } = req.body || {};

    if (!title || !description) {
      return res.status(400).json({ error: "title and description required" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a strict JSON generator.

Generate diverse test cases for this DSA problem.

Title: ${title}
Description: ${description}

Return ONLY valid JSON. No markdown, no explanation, no backticks.

Exact format:
{
  "testCases": [
    { "input": "...", "expectedOutput": "...", "explanation": "..." }
  ]
}

Rules:
- 5 to 8 test cases
- Include edge, normal, and boundary cases
- No solution code, no hints, no text outside JSON.`
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.2
      }
    });

    let text = response.text || "";

    // Try to extract JSON safely
    let jsonString = text.trim();

    // If model wrapped json in ```json ... ```
    const codeBlockMatch = jsonString.match(/```json([\s\S]*?)```/i);
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1].trim();
    }

    // If text has junk before/after, try to find first { and last }
    const firstBrace = jsonString.indexOf("{");
    const lastBrace = jsonString.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonString = jsonString.slice(firstBrace, lastBrace + 1);
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      console.error("JSON parse failed. Raw text:", text);
      return res.status(500).json({
        error: "AI did not return valid JSON",
        raw: text
      });
    }

    return res.status(201).json({
      success: true,
      testCases: parsed.testCases || [],
      problemTitle: title
    });
  } catch (err) {
    console.error("❌ AI Error:", err);
    return res.status(500).json({
      error: "Test case generation failed"
    });
  }
};

module.exports = generateTestCases;
