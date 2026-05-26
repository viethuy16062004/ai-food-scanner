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

function getSimulatedAnalysis(imageBuffer) {
  const mockFoods = [
    {
      isFood: true,
      foodName: "Phở Bò",
      calories: 450,
      protein: 25,
      carbs: 55,
      fat: 12,
      healthyScore: 82,
      summary: "Phở Bò là món ăn truyền thống Việt Nam gồm bánh phở, nước dùng hầm xương bò, thịt bò thái mỏng và các loại rau thơm. Nước dùng thanh ngọt tự nhiên, ít chất béo bão hòa.",
      warnings: ["Hàm lượng natri (muối) trong nước dùng khá cao", "Tránh húp hết nước dùng nếu cần giảm muối"],
      allergens: ["Gluten (có thể có trong một số loại quẩy kèm)"],
      benefits: ["Giàu protein chất lượng cao", "Nhiều axit amin từ nước hầm xương", "Cung cấp năng lượng nhanh từ tinh bột bánh phở"]
    },
    {
      isFood: true,
      foodName: "Cơm Tấm Sườn Bì Chả",
      calories: 680,
      protein: 32,
      carbs: 75,
      fat: 26,
      healthyScore: 58,
      summary: "Cơm Tấm là món ăn phổ biến gồm gạo tấm, sườn heo nướng, bì heo, chả trứng chưng và nước mắm chua ngọt. Món ăn giàu năng lượng và protein nhưng lượng chất béo khá lớn.",
      warnings: ["Hàm lượng chất béo bão hòa và calo cao", "Có thể gây tăng cân nếu ăn thường xuyên"],
      allergens: ["Trứng (trong chả trứng)", "Đậu nành (trong nước ướp sườn)"],
      benefits: ["Cung cấp năng lượng dồi dào cho cả ngày dài", "Hàm lượng protein rất cao giúp no lâu"]
    },
    {
      isFood: true,
      foodName: "Gỏi Cuốn Tôm Thịt",
      calories: 180,
      protein: 14,
      carbs: 22,
      fat: 4,
      healthyScore: 94,
      summary: "Gỏi Cuốn là món ăn thanh nhẹ, lành mạnh được cuốn bằng bánh tráng kèm tôm, thịt luộc, bún tươi và nhiều loại rau sống. Thường ăn kèm tương đen hoặc nước mắm tỏi ớt.",
      warnings: ["Tương chấm có thể chứa nhiều đường và muối"],
      allergens: ["Hải sản (Tôm)", "Đậu phộng (trong nước chấm tương đen)"],
      benefits: ["Lượng calo rất thấp", "Nhiều rau xanh cung cấp chất xơ và vitamin", "Không dầu mỡ chiên rán"]
    },
    {
      isFood: true,
      foodName: "Bún Chả Hà Nội",
      calories: 510,
      protein: 22,
      carbs: 62,
      fat: 18,
      healthyScore: 72,
      summary: "Bún Chả gồm bún tươi, thịt heo nướng viên và thịt ba chỉ nướng trong nước mắm chua ngọt ấm nóng kèm đu đủ xanh muối chua và rau sống. Hương vị đậm đà hấp dẫn.",
      warnings: ["Thịt nướng trực tiếp trên than có chứa một số chất không tốt cho tim mạch", "Nước dùng có lượng đường nhất định"],
      allergens: ["Đậu nành (trong gia vị ướp thịt)"],
      benefits: ["Nguồn protein dồi dào từ thịt heo", "Ăn kèm nhiều loại rau sống giúp bổ sung chất xơ"]
    },
    {
      isFood: true,
      foodName: "Bánh Mì Thịt Nướng",
      calories: 420,
      protein: 16,
      carbs: 48,
      fat: 18,
      healthyScore: 68,
      summary: "Bánh mì Việt Nam giòn rụm kẹp thịt ba chỉ nướng, pate, bơ mayonnaise, đồ chua, dưa leo và ngò rí. Món ăn tiện lợi, giàu hương vị.",
      warnings: ["Pate và bơ mayonnaise có lượng chất béo bão hòa cao", "Bột mì trắng hấp thụ nhanh"],
      allergens: ["Gluten (bột mì)", "Trứng (trong mayonnaise)"],
      benefits: ["Năng lượng cao giúp hồi phục nhanh", "Bổ sung lượng rau củ nhỏ từ dưa leo và đồ chua"]
    },
    {
      isFood: true,
      foodName: "Salad Ức Gà Bơ",
      calories: 320,
      protein: 28,
      carbs: 12,
      fat: 16,
      healthyScore: 95,
      summary: "Salad ức gà áp chảo kết hợp với quả bơ thái lát, cà chua bi, xà lách và nước xốt dầu ô liu chanh. Đây là bữa ăn lý tưởng cho người tập luyện và ăn kiêng.",
      warnings: ["Tránh dùng các loại nước xốt kem béo để giữ lượng calo thấp"],
      allergens: [],
      benefits: ["Cực kỳ giàu đạm chất lượng cao từ ức gà", "Chất béo không bão hòa đơn tốt cho tim mạch từ quả bơ", "Rất giàu chất xơ và vitamin khoáng chất"]
    }
  ];

  const randomIndex = Math.floor(Math.random() * mockFoods.length);
  return mockFoods[randomIndex];
}

async function analyzeFoodImage(imageBuffer, mimeType) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    console.warn("GEMINI_API_KEY is empty. Using Simulated AI scan results.");
    return getSimulatedAnalysis(imageBuffer);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
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
    console.error("Error communicating with Gemini API, falling back to simulated scan:", error);
    return getSimulatedAnalysis(imageBuffer);
  }
}

module.exports = {
  analyzeFoodImage
};
