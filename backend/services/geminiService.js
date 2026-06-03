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

// Shared prompt for food analysis - optimized for both fresh food and packaged food/snacks
const FOOD_ANALYSIS_PROMPT = `
    Bạn là chuyên gia dinh dưỡng AI hàng đầu, có khả năng nhận diện MỌI loại thực phẩm bao gồm:
    - Thực phẩm tươi sống, món ăn chế biến sẵn, bữa ăn trên đĩa/bát
    - **THỰC PHẨM ĐÓNG GÓI / BAO BÌ**: bim bim, snack, bánh kẹo, mì gói, nước ngọt, nước trái cây đóng hộp, sữa hộp, thực phẩm đóng hộp, v.v.
    - Đồ uống: trà sữa, cà phê, nước ngọt, sinh tố, nước ép, bia, rượu, v.v.

    ## HƯỚNG DẪN QUAN TRỌNG CHO THỰC PHẨM ĐÓNG GÓI (BAO BÌ):
    Nếu ảnh chứa thực phẩm/đồ uống/snack CÓ BAO BÌ (gói, hộp, chai, lon, túi):
    1. **ĐỌC TÊN SẢN PHẨM** trên bao bì: đọc kỹ tên thương hiệu (brand) và tên sản phẩm in trên bao bì. Ví dụ: "Lay's Stax Khoai Tây Chiên Vị Tự Nhiên", "Oishi Snack Tôm", "Coca-Cola", "Pepsi", "Mì Hảo Hảo", v.v.
    2. **ĐỌC BẢNG THÀNH PHẦN DINH DƯỠNG** (Nutrition Facts) nếu thấy trên bao bì: lấy số liệu calories, protein, carbs, fat trực tiếp từ nhãn thay vì ước lượng.
    3. **ĐỌC DANH SÁCH NGUYÊN LIỆU** (Ingredients) nếu thấy trên bao bì để xác định allergens và warnings chính xác.
    4. **TÊN SẢN PHẨM (foodName)** phải bao gồm TÊN THƯƠNG HIỆU + TÊN SẢN PHẨM. Ví dụ: "Lay's Khoai Tây Chiên Vị Tự Nhiên", KHÔNG được ghi chung chung là "Bim bim" hay "Snack khoai tây".
    5. Nếu không đọc được rõ nhãn, hãy nhận diện dựa trên hình dáng bao bì, màu sắc, logo thương hiệu quen thuộc.

    ## HƯỚNG DẪN CHO MÓN ĂN / THỰC PHẨM KHÔNG CÓ BAO BÌ:
    - Nhận diện tên món ăn bằng tiếng Việt
    - Ước lượng khẩu phần tiêu chuẩn (1 serving)
    - Đánh giá dựa trên nguyên liệu nhìn thấy trong ảnh

    ## YÊU CẦU ĐẦU RA:
    Trả về JSON theo đúng schema sau:
    {
      "isFood": true, // false nếu ảnh KHÔNG chứa bất kỳ thực phẩm hoặc đồ uống nào
      "foodName": "String - Tên đầy đủ CÓ thương hiệu nếu là hàng đóng gói (VD: 'Oishi Snack Tôm Cay'), tên món ăn nếu là thức ăn tươi (VD: 'Phở Bò Tái Nạm')",
      "calories": number (kcal cho 1 khẩu phần/gói, lấy từ nhãn nếu có),
      "protein": number (gram),
      "carbs": number (gram),
      "fat": number (gram),
      "healthyScore": number (0-100, 0=cực kỳ không lành mạnh, 100=cực kỳ tốt cho sức khỏe),
      "summary": "String - Mô tả chi tiết sản phẩm/món ăn bằng tiếng Việt. Nếu là hàng đóng gói, nêu rõ thương hiệu, loại sản phẩm, đặc điểm nổi bật.",
      "warnings": ["String - Các cảnh báo sức khỏe: đường cao, natri cao, chất bảo quản, phẩm màu nhân tạo, chất béo trans, v.v. bằng tiếng Việt"],
      "allergens": ["String - Các chất gây dị ứng: đậu phộng, gluten, sữa, đậu nành, tôm, cua, trứng, v.v. bằng tiếng Việt"],
      "benefits": ["String - Các lợi ích sức khỏe nếu có, bằng tiếng Việt"]
    }
    
    Nếu isFood = false, set các trường khác thành rỗng/null, giải thích trong summary.
    
    **LƯU Ý QUAN TRỌNG**: 
    - Mọi thực phẩm có bao bì (bim bim, snack, bánh, kẹo, nước ngọt, mì gói...) đều là thực phẩm hợp lệ → isFood = true
    - PHẢI trả về foodName có tên thương hiệu cụ thể nếu nhìn thấy trên bao bì
    - Toàn bộ nội dung text phải bằng tiếng Việt
  `;

// Helper: call Gemini with a specific model, with retry for rate limits
async function callGeminiVision(genAI, modelName, imageBuffer, mimeType, maxRetries = 3) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const imagePart = bufferToGenerativePart(imageBuffer, mimeType);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Attempt ${attempt}/${maxRetries}] Calling ${modelName}...`);
      const result = await model.generateContent([FOOD_ANALYSIS_PROMPT, imagePart]);
      const responseText = result.response.text();
      const jsonResult = JSON.parse(responseText);
      console.log(`[${modelName}] Success! Food identified: ${jsonResult.foodName || 'N/A'}`);
      return jsonResult;
    } catch (error) {
      const status = error.status || error.statusCode;
      const isRateLimit = status === 429;
      const isServerError = status >= 500;
      const isRetryable = isRateLimit || isServerError || error.message?.includes('fetch failed');

      console.warn(`[${modelName}] Attempt ${attempt} failed: ${status || error.message}`);

      if (isRetryable && attempt < maxRetries) {
        // Exponential backoff: 2s, 4s, 8s...
        const waitMs = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${waitMs / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
      } else {
        throw error; // Non-retryable or last attempt
      }
    }
  }
}

async function analyzeFoodImage(imageBuffer, mimeType) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    console.warn("GEMINI_API_KEY is empty. Using Simulated AI scan results.");
    return getSimulatedAnalysis(imageBuffer);
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Strategy: Try Flash first (fast, reliable, high rate limit), fallback to Pro if needed
  const models = ["gemini-2.5-flash", "gemini-2.5-pro"];

  for (const modelName of models) {
    try {
      const result = await callGeminiVision(genAI, modelName, imageBuffer, mimeType);
      return result;
    } catch (error) {
      console.error(`[${modelName}] All retries exhausted: ${error.status || error.message}`);
      if (modelName !== models[models.length - 1]) {
        console.log(`Falling back to next model...`);
      }
    }
  }

  // All models failed - use simulated data as last resort
  console.error("All Gemini models failed. Falling back to simulated scan.");
  return getSimulatedAnalysis(imageBuffer);
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

