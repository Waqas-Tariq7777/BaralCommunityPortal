// translate.controller.js
import axios from "axios";

export const translateText = async (req, res) => {
  try {
    const { text } = req.body;
    console.log(req.body)
    if (!text) return res.status(400).json({ message: "Text required" });

   const response = await axios.post(
  "https://libretranslate.de/translate",
  {
    q: text,
    source: "auto",
    target: "ur",
    format: "text",
  },
  { headers: { "Content-Type": "application/json" } }
);

    console.log("Libre FULL Response:", response.data);

    res.json({ translatedText: response.data.translatedText || "N/A" });
  } catch (err) {
    console.error("Translation Error:", err.response?.data || err.message);
    res.status(500).json({ translatedText: "Translation failed" });
  }
};