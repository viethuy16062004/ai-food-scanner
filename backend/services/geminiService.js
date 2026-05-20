const { GoogleGenerativeAI } = require("@google/generative-ai");

// Helper to convert buffer to Gemini vision format
function bufferToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType
    },
  };
}

async function analyzeFoodImage(imageBuffer, mimeType) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const prompt = `
    Analyze this image containing food, snack, or meal. 
    You must identify the food item, estimate its nutritional value per typical serving size, and evaluate its healthiness.
    
    Return a JSON response conforming strictly to this schema:
    {
      "isFood": true, // set to false if the image does not contain any recognizable food or beverage
      "foodName": "String (Name of the food in Vietnamese)",
      "calories": number (in kcal, e.g., 250),
      "protein": number (in grams, e.g., 8.5),
      "carbs": number (in grams, e.g., 35.0),
      "fat": number (in grams, e.g., 6.2),
      "healthyScore": number (0 to 100, where 0 is extremely unhealthy/processed and 100 is extremely fresh/nutritious),
      "summary": "String (Detailed description of the food, ingredients, and nutrition overview in Vietnamese)",
      "warnings": ["String (List of potential issues like high sugar, high sodium, harmful preservatives, artificial colorings, etc. in Vietnamese)"],
      "allergens": ["String (List of common allergens present like peanut, gluten, milk, soy, etc. in Vietnamese)"],
      "benefits": ["String (List of healthy aspects like rich in fiber, vitamin C source, good fats, etc. in Vietnamese)"]
    }
    
    If isFood is false, you can set other fields to empty or null, but explain why in the 'summary' field (e.g. "Ảnh không chứa thực phẩm hoặc đồ uống có thể nhận diện.").
    
    Ensure all text fields (foodName, summary, warnings, allergens, benefits) are returned in Vietnamese.
  `;

  try {
    const imagePart = bufferToGenerativePart(imageBuffer, mimeType);
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    
    // Parse response text to JSON
    const jsonResult = JSON.parse(responseText);
    return jsonResult;
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    throw new Error("Failed to analyze image via Gemini API: " + error.message);
  }
}

module.exports = {
  analyzeFoodImage
};
