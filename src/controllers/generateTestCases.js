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

Generate diverse HIDDEN test cases for this DSA problem.

Title: ${title}
Description: ${description}

Return ONLY valid JSON. No markdown, no explanation text outside JSON, no backticks.

Exact format:
{
  "testCases": [
    { "input": "...", "expectedOutput": "...", "explanation": "..." }
  ]
}

Rules:
- Generate EXACTLY 4 test cases
- Each test case MUST have a brief explanation (1–2 lines) describing why it is important
- Cover a mix of edge, normal, boundary and tricky cases
- No solution code, no hints, no extra fields, no text outside JSON.`
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.2
      }
    });

    // gemini-node SDK: text output
    let text = response.text || "";

    // clean up to get pure JSON
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

    // Safety: ensure array, cap at 4, guarantee explanation field
    const rawCases = Array.isArray(parsed.testCases) ? parsed.testCases : [];
    const limitedCases = rawCases.slice(0, 4).map((tc) => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      explanation:
        tc.explanation || "Hidden test to cover additional edge behaviour."
    }));

    return res.status(201).json({
      success: true,
      testCases: limitedCases,
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
