import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve frontend files
app.use(express.static("public"));

// API endpoint
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
    res.json({ reply: data.candidates[0].content.parts[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Root route (optional, since index.html will load automatically)
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

const PORT = process.env.PORT || 3000; // 3000 for local dev
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

