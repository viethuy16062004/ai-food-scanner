# AI Nutrition Scanner 🍎 
Ứng dụng quét và phân tích dinh dưỡng thực phẩm thông minh đa nền tảng sử dụng công nghệ AI tiên tiến, mang lại trải nghiệm phân tích Calories, Carbs, Protein, Fat, điểm sức khỏe Healthy Score và quét bao bì OCR trực quan chỉ từ hình ảnh hoặc camera thời gian thực.

Dự án đã được tái cấu trúc toàn diện sang **Spring Boot 3** (LTS Java 21) cho phần Backend, mang lại hiệu năng đỉnh cao, tính bảo mật tối đa và khả năng mở rộng quy mô chuẩn doanh nghiệp.

---

## 🌟 Tính Năng Chính
*   **🥗 Food AI Scanner**: Chụp đĩa thức ăn hoặc tải ảnh từ thư viện. Gemini Vision AI tự động nhận diện tên món ăn, tính toán calories, lượng carbohydrate, đạm, chất béo, bóc tách nguyên liệu và đưa ra điểm sức khỏe (Healthy Score) kèm lời khuyên dinh dưỡng hữu ích bằng Tiếng Việt.
*   **📦 Packaging OCR Scanner**: Chế độ quét bao bì sản phẩm thông minh. Sử dụng AI để đọc nhãn dinh dưỡng (Nutrition Facts table), bóc tách thành phần thô, phát hiện cảnh báo chất gây dị ứng (Allergens) và chấm điểm mức độ an toàn của thực phẩm đóng gói.
*   **📊 Premium Analytics Dashboard**: Dashboard thống kê calories tiêu thụ tích lũy trong ngày, đo lường hạn mức so với mục tiêu người dùng. Trang Admin hiển thị trực quan các biểu đồ tăng trưởng số lượt quét và top thực phẩm phổ biến.
*   **🔐 Secure Authentication**: Luồng đăng nhập, đăng ký và bảo mật thông tin tài khoản được quản lý nghiêm ngặt qua Spring Security và mã hóa JWT (JSON Web Token) Stateless.
*   **📱 Mobile-First Responsive**: Giao diện premium phong cách Glassmorphism mượt mà tối giản, tối ưu hóa 100% trên cả Desktop, Tablet và Mobile.

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend (Next.js 15 Web & PWA)
- **Framework**: Next.js 15 (App Router, React 19)
- **Ngôn ngữ**: TypeScript
- **Styling**: Tailwind CSS
- **Thư viện UI**: Shadcn/ui & Lucide Icons
- **Animation**: Framer Motion (Smooth Micro-interactions)
- **State Management**: Zustand Store

### Backend (Spring Boot 3 & Java 21)
- **Framework**: Spring Boot 3.3.0
- **Ngôn ngữ**: Java 21 (LTS)
- **Security**: Spring Security + JWT authentication
- **Database Access**: Spring Data JPA / Hibernate ORM
- **Migration**: Flyway DB Migration
- **API Documentation**: Springdoc OpenAPI v3 (Swagger UI)
- **Build tool**: Maven & Docker Multi-stage builds

### Database & Infrastructure
- **CSDL**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Deploy Cloud**: Railway Cloud
- **CI/CD**: GitHub Actions (Tự động build, run tests và deploy khi push code lên `main`)

---

## 📂 Cấu Trúc Dự Án
```text
ai-food-scanner/
├── backend/                  # API Backend Services
│   ├── index.js              # Node.js Gateway (Xử lý Gemini AI)
│   ├── src/main/java/        # Spring Boot Core API (Xử lý Data, Auth)
│   ├── Dockerfile.node       # Dockerfile cho Node.js Gateway
│   └── Dockerfile.spring     # Dockerfile đa tầng cho Spring Boot
├── frontend/                 # React + Vite Web Application
│   ├── src/                  # Mã nguồn React
│   ├── .env                  # Biến môi trường kết nối API
│   ├── nginx.conf            # Cấu hình Nginx
│   └── Dockerfile            # Dockerfile đa tầng (Build Vite, Serve Nginx)
├── docker-compose.yml        # Chạy toàn bộ hệ thống (App - API - DB)
└── README.md                 # Tài liệu hướng dẫn sử dụng
```

---

## 🚀 Hướng Dẫn Khởi Chạy Nhanh (Bằng Docker)

### Yêu cầu hệ thống:
- Đã cài đặt [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/).
- Có khóa API Google Gemini.

### Bước 1: Thiết lập biến môi trường
Tạo tệp `.env` trong thư mục `docker-compose.yml` (hoặc cấu hình trực tiếp) với biến:
```env
GEMINI_API_KEY=khoa_api_gemini_cua_ban
```

### Bước 2: Chạy toàn bộ ứng dụng bằng Docker Compose
Mở terminal tại thư mục gốc và chạy lệnh duy nhất:
```bash
docker-compose up -d --build
```
Hệ thống sẽ tự động build frontend, backend Node.js, backend Spring Boot, tạo cơ sở dữ liệu MySQL và liên kết mạng giữa các container.

### Địa chỉ truy cập dịch vụ:
- **Frontend Web App**: [http://localhost:5173](http://localhost:5173)
- **Node.js Gateway API**: [http://localhost:5000](http://localhost:5000)
- **Spring Boot Core API**: [http://localhost:8080](http://localhost:8080)
- **MySQL Database**: `localhost:3306`

---

## 🛡️ Tài Khoản Thử Nghiệm Có Sẵn (Demo Accounts)
Database tự động chèn sẵn 2 tài khoản để bạn có thể trải nghiệm lập tức mà không cần đăng ký:

1.  **Tài khoản Người Dùng (Premium User)**:
    *   **Email**: `user@nutriai.com`
    *   **Mật khẩu**: `user123`
2.  **Tài khoản Quản Trị Viên (System Admin)**:
    *   **Email**: `admin@nutriai.com`
    *   **Mật khẩu**: `admin123` *(Giúp bạn truy cập Admin Dashboard xem phân tích biểu đồ).*

---

## 📈 Triển Khai Lên Cloud Railway & Luồng CI/CD

### 1. Triển khai Railway
- Liên kết kho mã nguồn (Repository GitHub) của bạn với dự án mới trên Railway.
- Railway sẽ tự động quét tệp `railway.json`, đọc `Dockerfile` ở mỗi thư mục và kích hoạt build.
- Cấu hình các biến môi trường `SPRING_DATASOURCE_URL`, `GEMINI_API_KEY` và `JWT_SECRET` trong bảng điều khiển Variables của Railway.

### 2. Tự động hóa CI/CD qua GitHub Actions
Khi bạn đẩy mã nguồn lên nhánh `main` (hoặc merge PR):
- GitHub Actions sẽ tự động chạy quy trình:
  1. Kiểm thử mã nguồn Java Spring Boot (`mvn clean package`).
  2. Kiểm thử và build đóng gói Next.js Web App.
  3. Gọi Railway CLI để tự động redeploy các container trên Cloud.

---

