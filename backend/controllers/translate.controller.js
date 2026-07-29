// translate.controller.js
import axios from "axios";

export const translateText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text required" });

    try {
      // Primary: LibreTranslate
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
      if (!response.data || !response.data.translatedText) {
        throw new Error("Invalid or empty translation from LibreTranslate");
      }
      return res.json({ translatedText: response.data.translatedText });
    } catch (libreErr) {
      console.warn("LibreTranslate failed, falling back to Google Translate API:", libreErr.message);
      
      // Fallback: Google Translate GTX endpoint (highly reliable and free)
      const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ur&dt=t&q=${encodeURIComponent(text)}`;
      const gRes = await axios.get(gUrl);
      const translatedText = gRes.data[0].map(x => x[0]).join("");
      
      return res.json({ translatedText: translatedText || "Translation failed" });
    }
  } catch (err) {
    console.error("Translation Error:", err.message);
    res.status(500).json({ translatedText: "Translation failed" });
  }
};