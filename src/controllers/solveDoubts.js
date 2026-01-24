const { GoogleGenAI } = require("@google/genai");

const solveDoubt = async (req, res) => {
  try {
    const { messages, title, description } = req.body || {};

    if (!messages || !title) {
      return res.status(400).json({ error: "messages and title required" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages,
      generationConfig: {
        maxOutputTokens: 80,
        temperature: 0.1,
        topK: 1,
        topP: 0.1,
        systemInstruction: `
ROLE: Strict DSA Learning Tutor for "${title}".

GOAL: Give ONLY conceptual help. No code, no full solution.

GUIDELINES:
1. NO CODE: Do NOT return any code, syntax, or language-specific keywords. If user asks for code, reply: "Bhai, main sirf logic hints de sakta hoon."
2. HINTS ONLY: Explain the high-level idea, data structures, and steps.
3. BE CONCISE: Keep total answer within 3–4 short lines.
4. SCOPE: Focus only on DSA logic related to this problem:
   "${description}"

MANDATORY RESPONSE FORMAT (exact):
- Concept: [1 short phrase name, e.g. "Two-pointer + Sorting"]
- Hint: [1–2 line logic explanation, no code]
- Edge Case: [1 line showing what to watch out for]
        `,
      },
    });

    console.log("✅ DSA Hints generated for:", title);

    res.status(201).json({
      success: true,
      hints: response.text,
      problemTitle: title,
    });
  } catch (err) {
    console.error("❌ AI Error:", err);
    res.status(500).json({
      error: "AI service unavailable",
      details:
        process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

module.exports = solveDoubt;
