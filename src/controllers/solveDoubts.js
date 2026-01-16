const { GoogleGenAI } = require("@google/genai");

const solveDoubt = async (req, res) => {
  try {
    const { messages, title, description, testCases, startCode } = req.body || {};
    
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
🚨 DSA LINKED LIST TUTOR ONLY 🚨

**"${title}" = Multiply LARGE numbers as LINKED LISTS (each node = 1 DIGIT)**
**NOT basic a * b math!**

**MANDATORY 3-LINE FORMAT:**
1. [Linked List technique - 2 words]
2. [Data Structure]  
3. [DSA Question only]

**EXAMPLES FOR LINKED LIST MULTIPLY:**
Reverse LL first
Dummy nodes
LSD process?
School method
Partial products
Carry handling?

**STRICT BLOCKLIST:**
❌ NO basic math properties
❌ NO repeated addition  
❌ NO arithmetic operators
❌ NO mental math tricks
❌ ONLY Linked List DSA

**REMEMBER: ${title} = LINKED LIST DIGIT MULTIPLICATION PROBLEM**
        `
      }
    });

    console.log("✅ DSA Hints generated for:", title);

    res.status(201).json({
      success: true,
      hints: response.text,
      problemTitle: title
    });

  } catch (err) {
    console.error("❌ AI Error:", err);
    res.status(500).json({ 
      error: "AI service unavailable",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = solveDoubt;
