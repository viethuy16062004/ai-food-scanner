# Stage 1: Build ứng dụng Vite
FROM node:20-alpine AS build
WORKDIR /app

# Cache dependencies (Chỉ cài lại nếu package.json / package-lock.json thay đổi)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Khai báo ARG để nhận biến môi trường lúc build (Vite yêu cầu)
ARG VITE_NODE_GATEWAY_URL
ENV VITE_NODE_GATEWAY_URL=$VITE_NODE_GATEWAY_URL

ARG VITE_SPRINGBOOT_URL
ENV VITE_SPRINGBOOT_URL=$VITE_SPRINGBOOT_URL

# Build ứng dụng Vite
RUN npm run build

# Stage 2: Production chạy Nginx
FROM nginx:alpine

# Copy file build từ stage trước
COPY --from=build /app/dist /usr/share/nginx/html
# Copy cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
