require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.static("public"));
app.use(express.json());

app.post("/translate", async (req, res) => {
  const { words } = req.body;
  try {
    const response = await axios.post(
      "https://api.openai.com/v4/completions",
      {
        model: "text-davinci-003", // Update with the latest model if necessary
        prompt: words.map((word) => `Translate "${word}" to Dutch.`).join("\n"),
        temperature: 0.3,
        max_tokens: 60,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const translations = response.data.choices[0].text.trim().split("\n");
    res.json({ translations });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).send("Failed to translate words");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
