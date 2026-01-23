const { GoogleGenAI } = require("@google/genai");

const solveDoubt = async (req, res) => {
  try {
    const { messages, title, description, testCases, startCode } =
      req.body || {};

    if (!messages || !title) {
      return res.status(400).json({ error: "messages and title required" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages,
      generationConfig: {
        maxOutputTokens: 60,
        temperature: 0.0,
        topK: 1,
        topP: 0.1,
        systemInstruction: `
ROLE: Strict DSA Learning Tutor for "${title}".
      STRICT GUIDELINES:
      1. NO CODE: Do not provide any code or syntax. If asked, say "Bhai, I can only provide logic hints."
      2. HINTS ONLY: Explain the logic/algorithm only.
      3. BE CONCISE: Max 3-4 lines.
      4. SCOPE: Focus only on DSA logic for: "${description}".
      
      MANDATORY RESPONSE FORMAT:
      - Concept: [Name]
      - Hint: [One sentence logic]
      - Edge Case: [One short tip]
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
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

module.exports = solveDoubt;
