# 🎵 Rhythm of Soul - Content Service

Một dịch vụ nội dung (Content Service) cho nền tảng mạng xã hội âm nhạc **Rhythm of Soul**. Dịch vụ này cho phép người dùng tạo, chia sẻ, bình luận và tương tác với nội dung âm nhạc.

## 🎯 Tính Năng Chính

### 📝 Quản Lý Bài Viết (Posts)
- **Tạo bài viết** với các loại nội dung khác nhau (Text, Song, Album, Playlist, Repost)
- **Lập lịch bài viết** tự động xuất bản vào thời gian chỉ định
- **Quản lý quyền riêng tư** (công khai/riêng tư)
- **Theo dõi thống kê**: lượt xem, lượt thích, số bình luận
- **Soft delete** - xóa mềm để có thể khôi phục sau này

### 💬 Hệ Thống Bình Luận (Comments)
- **Bình luận phân cấp** (trả lời bình luận của người khác)
- **Xóa bình luận kèm phụ** (xóa một bình luận sẽ xóa tất cả bình luận con)
- **Sắp xếp theo thời gian** (bình luận gốc mới nhất, trả lời cũ nhất)
- **Lưu giữ thông tin người dùng** (username, avatar, xác nhận artist)

### 👍 Hệ Thống Yêu Thích (Likes)
- **Like/Unlike bài viết**
- **Kiểm tra trạng thái like** của người dùng
- **Tính toán tổng số like** cho mỗi bài viết

### 📊 Lịch Sử Nghe Nhạc (Listening History)
- **Ghi nhận hoạt động nghe nhạc** của người dùng
- **Phân loại theo thể loại** (Tag)
- **Session tracking** để phân tích hành vi người dùng

## 🏗️ Kiến Trúc

Dự án này tuân theo **Clean Architecture** với các layer sau:

```
┌─────────────────────────────────────┐
│     Presentation Layer (REST API)   │
│    (Controllers, DTOs, Responses)   │
├─────────────────────────────────────┤
│     Application Layer (Services)    │
│   (Business Logic, Use Cases)       │
├─────────────────────────────────────┤
│     Domain Layer (Entities, Models) │
│  (Business Rules, Interfaces)       │
├─────────────────────────────────────┤
│   Infrastructure Layer (Persistence)│
│ (Repositories, Database, External)  │
└─────────────────────────────────────┘
```

## 🔧 Công Nghệ Sử Dụng

| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|----------|---------|
| **Java** | 23 | Ngôn ngữ lập trình chính |
| **Spring Boot** | Latest | Framework web |
| **Spring Data JPA** | Latest | ORM & Persistence |
| **Maven** | 3.6+ | Build Tool & Dependency Management |


### Dependencies Sẽ Thêm (Dự Kiến)
- **spring-boot-starter-web** - REST API support
- **spring-boot-starter-validation** - Bean Validation
- **spring-boot-starter-data-redis** - Caching (tuỳ chọn)
- **postgresql** hoặc **mysql-connector** - Database Driver
- **lombok** - Reduce boilerplate code
- **junit5** - Unit Testing
- **mockito** - Mocking for Testing

### Entity Relationships

```
Account (từ User Service)
  └─ 1:N ─ Post
           └─ 1:N ─ Comment
           │        └─ 1:N ─ Comment (Replies)
           └─ 1:N ─ Like
           └─ 1:1 ─ Content

Account (từ User Service)
  └─ 1:N ─ ListeningHistory
           └─ M:1 ─ Post
```

## 🚀 Hướng Dẫn Setup

### Yêu Cầu
- **Java 23** hoặc cao hơn
- **Maven 3.6.0** hoặc cao hơn
- **Git** (tuỳ chọn)

### Cài Đặt

1. **Clone dự án**
```bash
git clone <repository-url>
cd content_service
```

2. **Build dự án**
```bash
mvn clean install
```

3. **Chạy unit tests**
```bash
mvn test
```

4. **Xây dựng artifacts**
```bash
mvn package
```


```
HTTP Request
    ↓
┌─────────────────────────┐
│ REST Controller          │  ← Presentation Layer
│ (Validate Input)         │
└──────────┬───────────────┘
           ↓
┌─────────────────────────┐
│ Service                  │  ← Application Layer
│ (Business Logic)         │
│ (Transform to Domain)    │
└──────────┬───────────────┘
           ↓
┌─────────────────────────┐
│ Domain Model/Entity      │  ← Domain Layer
│ (Business Rules)         │
└──────────┬───────────────┘
           ↓
┌─────────────────────────┐
│ Repository Interface     │  ← Domain Layer
└──────────┬───────────────┘
           ↓
┌─────────────────────────┐
│ Repository Impl (JPA)    │  ← Infrastructure Layer
│ (Database Operations)    │
└──────────┬───────────────┘
           ↓
       Database
           ↓
     HTTP Response
```

## 📚 Tài Liệu Tham Khảo

- **Clean Architecture**: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- **Spring Boot**: https://spring.io/projects/spring-boot
- **Spring Data JPA**: https://spring.io/projects/spring-data-jpa
- **Maven**: https://maven.apache.org/