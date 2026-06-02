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

function getSimulatedChatReply(message) {
  const msg = message.toLowerCase();
  if (msg.includes("calo") || msg.includes("calori") || msg.includes("năng lượng")) {
    return "Để điều chỉnh lượng Calo nạp vào hôm nay, bạn có thể tăng cường rau xanh và đạm lành mạnh, đồng thời giảm các món chiên xào nhiều dầu mỡ nhé.";
  }
  if (msg.includes("đạm") || msg.includes("protein") || msg.includes("cơ bắp")) {
    return "Protein rất quan trọng để duy trì cơ bắp và giúp no lâu. Bạn nên bổ sung ức gà, trứng, cá hồi hoặc các loại đậu hũ trong bữa ăn nhé.";
  }
  if (msg.includes("nước") || msg.includes("uống")) {
    return "Uống đủ nước giúp tăng cường trao đổi chất. Hãy duy trì thói quen uống khoảng 2 - 2.5 lít nước mỗi ngày, chia nhỏ ra uống nhé!";
  }
  if (msg.includes("tối") || msg.includes("sáng") || msg.includes("trưa") || msg.includes("thực đơn") || msg.includes("ăn gì")) {
    return "Thực đơn hôm nay nên cân bằng với 1 phần tinh bột hấp thu chậm (như gạo lứt), 1 phần đạm và thật nhiều rau xanh. Bạn cần mình gợi ý món ăn cụ thể nào không?";
  }
  if (msg.includes("keto")) {
    return "Chế độ Keto cắt giảm tối đa tinh bột và tăng cường chất béo tốt. Bạn nên ưu tiên bơ, trứng, thịt nạc và các loại hạt nhé.";
  }
  if (msg.includes("chay") || msg.includes("chay trường")) {
    return "Ăn chay lành mạnh cần đa dạng hóa các loại nấm, đậu hũ, rau xanh và ngũ cốc nguyên hạt để đảm bảo đầy đủ vitamin và protein.";
  }
  if (msg.includes("mệt") || msg.includes("oải") || msg.includes("yếu")) {
    return "Nếu cảm thấy mệt mỏi, có thể cơ thể bạn đang thiếu nước hoặc hạ đường huyết nhẹ. Hãy uống một cốc nước ấm và nghỉ ngơi một chút nhé!";
  }
  return "Chào bạn! Mình là AI Coach. Mình có thể giúp bạn gợi ý thực đơn lành mạnh, tính toán calo nạp vào hoặc tư vấn thói quen dinh dưỡng tốt. Bạn cần mình hỗ trợ gì hôm nay?";
}

async function chatWithCoach(message, history = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    console.warn("GEMINI_API_KEY is empty. Using Simulated AI Chat Coach replies.");
    return getSimulatedChatReply(message);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "Bạn là AI Coach, một chuyên gia dinh dưỡng và huấn luyện viên sức khỏe thân thiện, chuyên nghiệp tại Việt Nam. Hãy đưa ra những lời khuyên ngắn gọn, thiết thực, khoa học và dễ hiểu bằng tiếng Việt về chế độ ăn uống, tập luyện, lượng calo, chất dinh dưỡng và các món ăn lành mạnh. Luôn trả lời ngắn gọn (dưới 4 câu) và khuyến khích người dùng duy trì lối sống lành mạnh."
    });

    // Format history for Gemini chat API: must start with 'user' and alternate roles
    const formattedHistory = [];
    let expectedRole = "user";
    for (const item of (history || [])) {
      const role = item.sender === "user" ? "user" : "model";
      if (role === expectedRole) {
        formattedHistory.push({
          role,
          parts: [{ text: item.text }]
        });
        expectedRole = expectedRole === "user" ? "model" : "user";
      }
    }

    const chat = model.startChat({
      history: formattedHistory
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error("Error communicating with Gemini API for chat, falling back to simulation:", error);
    return getSimulatedChatReply(message);
  }
}

module.exports = {
  analyzeFoodImage,
  chatWithCoach
};

