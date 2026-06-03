# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Buid ứng dụng Vite
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy file build từ stage trước
COPY --from=build /app/dist /usr/share/nginx/html
# Copy cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
