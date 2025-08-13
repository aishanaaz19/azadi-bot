app.post("/send-message", async (req, res) => {
  const { userMessage } = req.body;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `You are an Independence Day themed chatbot. ${userMessage}` }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("Gemini API Response:", data); // 🔍 Debug in Render logs

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      return res.status(500).json({
        error: "Invalid response from Gemini API",
        details: data
      });
    }

    res.json({ reply: data.candidates[0].content.parts[0].text });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
