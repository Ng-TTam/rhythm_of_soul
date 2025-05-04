# Sử dụng image Maven để build và chạy ứng dụng
FROM maven:3.8.5-openjdk-17 AS builder

# Tạo thư mục và copy mã nguồn vào container
WORKDIR /app
COPY . .

# Build ứng dụng
RUN mvn clean package -DskipTests

# Tạo image từ JDK để chạy ứng dụng
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy file JAR từ stage builder
COPY --from=builder /app/target/*.jar app.jar

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
