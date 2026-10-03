# Rhythm of Soul - Content Service

## Thông tin dự án
- **Domain**: Nền tảng âm nhạc mạng xã hội (Social music platform).
- **Kiến trúc**: Clean Architecture thông qua Maven multi-module (`domain`, `application`, `controller`, `infrastructure`, `start`).

## Công nghệ sử dụng
- **Ngôn ngữ**: Java 23 (Amazon Corretto 23.0.2)
- **Framework**: Spring Boot 3.3.5, Spring Data JPA
- **Database**: PostgreSQL
- **Storage/File Upload**: MinIO (Object Storage)
- **Caching & Messaging**: Redis (Caching & Event Pub/Sub), RabbitMQ
- **Mapping**: MapStruct

## Quy tắc thiết kế (Design Rules) & Refactoring đã thực hiện
1. **Design Patterns**: 
   - Sử dụng **Factory Pattern** (`PostContentFactory`, `FileUploadFactory`) và **Strategy Pattern** (`PostContentStrategy`, `FileUploadStrategy`) để quản lý logic tạo/cập nhật bài viết và xử lý file upload theo từng loại.
   - Thêm enum **`FileType`** (`SONG`, `IMAGE`, `COVER`) trong `domain` model để chuẩn hoá định dạng loại file khi upload.
   - Xây dựng lớp cơ sở **`AbstractPostContentStrategy`** nhằm loại bỏ mã lặp (DRY) trong các strategy (`AlbumPostContentStrategy`, `PlaylistPostContentStrategy`, `SongPostContentStrategy`) cho công việc validation, update các trường dùng chung và enrich presigned URLs.

2. **Xử lý File & MinIO**:
   - Tách rời thông tin domain/host cứng (không hardcode `"http://localhost:9000"`). Việc kiểm tra URL đã qua presigned/upload hay chưa được đối chiếu linh hoạt qua `minioConfig.getUrl()`.
   - Bài viết dạng Text sẽ không có xử lý file, trong khi các loại bài viết khác sẽ được xử lý theo strategy của từng type post.

3. **Chuẩn hoá Lỗi (Error Handling)**:
   - Các exception được ném ra phải sử dụng exception đã được chuẩn hoá là `AppException` kết hợp với `ErrorCode` (ví dụ: `ErrorCode.INVALID_POST_TYPE`, `ErrorCode.INVALID_FILE_TYPE`).
   - Có `GlobalExceptionHandler` (`@ControllerAdvice`) để bắt và format response lỗi chuẩn.

4. **Code Convention**:
   - Tên factory ngắn gọn, đúng ngữ nghĩa (vd: `PostContentFactory`, `FileUploadFactory`).
   - Xoá bỏ các hàm tạo/cập nhật riêng lẻ từng loại post trong controller/service và gom về 1 luồng duy nhất gọi qua Factory/Strategy.

## Lưu ý về Môi trường (Environment)
- Phải đảm bảo `JAVA_HOME` trỏ tới JDK 23 (vd: `C:\Users\Boot10\.jdks\corretto-23.0.2`).
- File `pom.xml` cấu hình `<maven.compiler.source>23</maven.compiler.source>` và `<maven.compiler.target>23</maven.compiler.target>`.
