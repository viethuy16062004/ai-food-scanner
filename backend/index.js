require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const Jimp = require("jimp");
const { analyzeFoodImage, chatWithCoach } = require("./services/geminiService");

const app = express();
const PORT = process.env.PORT || 5000;
const SPRINGBOOT_URL = process.env.SPRINGBOOT_URL || "http://localhost:8080";

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Configure multer for file uploads in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper to optimize image using Jimp
async function optimizeImage(buffer) {
  try {
    const image = await Jimp.read(buffer);
    
    // Resize to width of 1280px if larger, maintaining aspect ratio
    // Higher resolution needed for reading text on food packaging labels
    if (image.bitmap.width > 1280) {
      image.resize(1280, Jimp.AUTO);
    }
    
    // Compress quality to 85% (higher quality for label readability)
    image.quality(85);
    
    // Convert back to jpeg buffer
    return await image.getBufferAsync(Jimp.MIME_JPEG);
  } catch (error) {
    console.warn("Image optimization failed, using raw buffer:", error.message);
    return buffer;
  }
}

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Node.js Gemini Gateway" });
});

// Scan endpoint
app.post("/api/gateway/scan", upload.single("image"), async (req, res) => {
  try {
    let imageBuffer;
    let mimeType = "image/jpeg";

    // 1. Check if the image is in multipart file upload
    if (req.file) {
      imageBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
    } 
    // 2. Check if the image is Base64 in JSON body
    else if (req.body.image) {
      const base64Str = req.body.image;
      const match = base64Str.match(/^data:([^;]+);base64,(.+)$/);
      
      if (match) {
        mimeType = match[1];
        imageBuffer = Buffer.from(match[2], "base64");
      } else {
        // Fallback for raw base64 string
        imageBuffer = Buffer.from(base64Str, "base64");
      }
    } else {
      return res.status(400).json({ error: "No image file or base64 string provided." });
    }

    console.log(`Received image of size ${imageBuffer.length} bytes. Optimizing...`);
    
    // Optimize the image
    const optimizedBuffer = await optimizeImage(imageBuffer);
    console.log(`Optimized image to size ${optimizedBuffer.length} bytes. Calling Gemini...`);

    // Call Gemini API
    const analysis = await analyzeFoodImage(optimizedBuffer, "image/jpeg");
    console.log("Gemini API call success.");

    // If it is food and the request has Authorization header (JWT), forward to Spring Boot backend
    const authHeader = req.headers["authorization"];
    let savedToHistory = false;
    let scanLog = null;

    if (analysis.isFood && authHeader) {
      try {
        console.log("Forwarding scan log to Spring Boot backend...");
        const base64Image = "data:image/jpeg;base64," + optimizedBuffer.toString("base64");
        const response = await axios.post(`${SPRINGBOOT_URL}/api/scans`, {
          foodName: analysis.foodName,
          calories: analysis.calories,
          protein: analysis.protein,
          carbs: analysis.carbs,
          fat: analysis.fat,
          healthyScore: analysis.healthyScore,
          rawJsonResult: JSON.stringify(analysis),
          imageUrl: base64Image
        }, {
          headers: {
            "Authorization": authHeader,
            "Content-Type": "application/json"
          }
        });
        savedToHistory = true;
        scanLog = response.data;
        console.log("Successfully logged scan history to Spring Boot.");
      } catch (springError) {
        console.error("Failed to save to Spring Boot backend:", springError.response?.data || springError.message);
        // We do not fail the request if Spring Boot sync fails, just report the warning.
      }
    }

    res.json({
      success: true,
      analysis,
      savedToHistory,
      scanLog
    });

  } catch (error) {
    console.error("Error in scan endpoint:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Chat endpoint
app.post("/api/gateway/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }
    
    console.log(`Received chat message. Forwarding to Gemini AI Coach...`);
    const reply = await chatWithCoach(message, history);
    res.json({ success: true, reply });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Node.js Gemini Gateway running on port ${PORT}`);
});
