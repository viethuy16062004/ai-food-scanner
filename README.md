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
*   **✨ Smooth Transition**: Tích hợp các hiệu ứng động mượt mà khi chuyển trang, Splash Loader chào mừng cao cấp và thanh tiến trình ở đầu trang khi tải.

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend (React + Vite Web App)
- **Framework**: React 19 (Vite 8)
- **Ngôn ngữ**: JavaScript (ES6+)
- **Styling**: Tailwind CSS v4
- **Thư viện UI**: Lucide Icons & Recharts (Biểu đồ dinh dưỡng)
- **Animation**: CSS Keyframe Transitions (Splash Loader, Loading bar, Page transitions mượt mà)

### Backend (Spring Boot 3 & Java 21)
- **Framework**: Spring Boot 3.3.0
- **Ngôn ngữ**: Java 21 (LTS)
- **Security**: Spring Security + JWT authentication
- **Database Access**: Spring Data JPA / Hibernate ORM
- **Migration**: Flyway DB Migration
- **API Documentation**: Springdoc OpenAPI v3 (Swagger UI)
- **Build tool**: Maven & Docker Multi-stage builds

### Database & Infrastructure
- **CSDL**: MySQL (Local development) & PostgreSQL (Cloud Production)
- **Containerization**: Docker & Docker Compose
- **Deploy Cloud**: Vercel (Frontend) & Render (Backend)
- **CI/CD**: Tự động redeploy thông qua liên kết GitHub cho cả Vercel và Render.

---

## 📂 Cấu Trúc Dự Án
```text
ai-food-scanner/
├── backend/                  # API Backend Services
│   ├── src/main/java/        # Spring Boot Core API (Xử lý Data, Auth, Notifications)
│   ├── src/main/resources/   # Cấu hình Spring Boot & SQL Migrations
│   ├── Dockerfile.spring     # Dockerfile đa tầng cho Spring Boot
│   └── pom.xml               # Cấu hình Maven dependencies
├── frontend/                 # React + Vite Web Application
│   ├── src/                  # Mã nguồn React (Components, Common, Layouts, Styles)
│   ├── package.json          # Dependencies & Scripts
│   ├── vercel.json           # Cấu hình deploy Vercel
│   └── vite.config.js        # Cấu hình Vite bundler
├── docker-compose.yml        # Chạy toàn bộ hệ thống (App - API - DB)
└── README.md                 # Tài liệu hướng dẫn sử dụng
```

---

## 🚀 Hướng Dẫn Khởi Chạy Nhanh (Bằng Docker)

### Yêu cầu hệ thống:
- Đã cài đặt [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/).
- Có khóa API Google Gemini.

### Bước 1: Thiết lập biến môi trường
Tạo tệp `.env` trong thư mục gốc với các biến:
```env
GEMINI_API_KEY=khoa_api_gemini_cua_ban
```

### Bước 2: Chạy toàn bộ ứng dụng bằng Docker Compose
Mở terminal tại thư mục gốc và chạy lệnh duy nhất:
```bash
docker-compose up -d --build
```
Hệ thống sẽ tự động build frontend, backend Spring Boot, tạo cơ sở dữ liệu MySQL và liên kết mạng giữa các container.

### Địa chỉ truy cập dịch vụ:
- **Frontend Web App**: [http://localhost:5173](http://localhost:5173)
- **Spring Boot Core API**: [http://localhost:8080](http://localhost:8080)
- **MySQL Database**: `localhost:3306`

---

## 🛡️ Tài Khoản Thử Nghiệm Có Sẵn (Demo Accounts)
Database tự động chèn sẵn các tài khoản để bạn có thể trải nghiệm lập tức mà không cần đăng ký:

1.  **Tài khoản Người Dùng (Premium User)**:
    *   **Email/Username**: `Huy@gmail.com`
    *   **Mật khẩu**: `123456`
2.  **Tài khoản Quản Trị Viên (System Admin)**:
    *   **Username**: `admin`
    *   **Mật khẩu**: `admin123` *(Giúp bạn truy cập Admin Dashboard xem phân tích biểu đồ).*

---

## 📈 Triển Khai Lên Cloud (Vercel & Render)

Hệ thống được thiết kế để phân tách độc lập Frontend và Backend giúp tối ưu hóa tài nguyên và tăng độ phản hồi:
- **Frontend (React + Vite)**: Triển khai trên **Vercel** để tối ưu hóa phân phối qua CDN toàn cầu.
- **Backend (Spring Boot)** và **Cơ sở dữ liệu (PostgreSQL)**: Triển khai trên **Render** để chạy dịch vụ API liên tục và bảo mật.

### 1. Triển khai Backend lên Render
1.  **Chuẩn bị Cơ sở dữ liệu**:
    *   Tạo một dịch vụ database **PostgreSQL** mới trên Render.
    *   Sao chép đường dẫn kết nối URL của PostgreSQL (External Database URL).
2.  **Triển khai Spring Boot API**:
    *   Tạo một **Web Service** mới trên Render, liên kết với kho mã nguồn (Repository) của bạn.
    *   Cấu hình thư mục gốc (Root Directory) là `backend`.
    *   Cấu hình Environment là **Docker** để Render tự động build ứng dụng dựa trên `Dockerfile` có sẵn (hoặc cấu hình build Maven thủ công).
    *   Thêm các biến môi trường (Environment Variables) trong tab **Variables**:
        *   `SPRING_DATASOURCE_URL`: Nhập URL kết nối PostgreSQL của Render.
        *   `SPRING_DATASOURCE_USERNAME`: Tên người dùng database.
        *   `SPRING_DATASOURCE_PASSWORD`: Mật khẩu database.
        *   `JWT_SECRET`: Khóa bí mật dùng để mã hóa mã JWT.

### 2. Triển khai Frontend lên Vercel
1.  **Liên kết mã nguồn**:
    *   Truy cập Vercel Dashboard, chọn **Add New Project** và import repository GitHub của bạn.
2.  **Cấu hình dự án**:
    *   Chọn thư mục chạy chính (Root Directory) là `frontend`.
    *   Framework Preset: Chọn **Vite** (hệ thống sẽ tự nhận dạng).
    *   Build Command: `npm run build`.
    *   Output Directory: `dist`.
3.  **Cấu hình biến môi trường**:
    *   Trong tab **Environment Variables**, thêm biến môi trường để cấu hình endpoint gọi API:
        *   `VITE_API_URL`: Nhập địa chỉ URL của Backend Web Service vừa deploy trên Render (ví dụ: `https://ai-food-scanner-backend.onrender.com/api`).
4.  **Triển khai**:
    *   Nhấp **Deploy**. Vercel sẽ tự động build và cung cấp cho bạn một domain `.vercel.app` để truy cập trực tuyến.
