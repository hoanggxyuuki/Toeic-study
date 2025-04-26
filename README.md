
# TOEIC Learning Platform

## Tổng quan
Ứng dụng học tiếng Anh TOEIC là một nền tảng học trực tuyến được xây dựng với React và Vite, cho phép người học truy cập và tương tác với nhiều tài liệu học TOEIC được tổ chức theo cấu trúc phân cấp. Nền tảng này hỗ trợ nhiều định dạng nội dung khác nhau như video, hình ảnh, PDF, âm thanh và các tài liệu khác.

## Tính năng chính
- **Cấu trúc khóa học phân cấp**: Hỗ trợ nhiều cấp độ (Khóa học > Phần học > Thư mục > Thư mục con)
- **Hỗ trợ đa định dạng**: Xem trực tiếp các video, hình ảnh, tài liệu PDF, nghe file âm thanh
- **Giao diện thân thiện**: Điều hướng dễ dàng với breadcrumbs, menu thư mục và danh sách tài liệu
- **Phản hồi đa thiết bị**: Giao diện tương thích với cả máy tính và thiết bị di động
- **Tích hợp backend**: Kết nối với API để quản lý và phân phối tài liệu học tập

## Công nghệ sử dụng
### Frontend
- React: Thư viện JavaScript để xây dựng giao diện người dùng
- Vite: Công cụ xây dựng hiện đại cho ứng dụng web
- React Router: Điều hướng trong ứng dụng
- CSS: Styling tùy chỉnh cho giao diện người dùng

### Backend
- Node.js: Môi trường runtime JavaScript phía máy chủ
- Express: Framework web cho Node.js
- File System API: Quản lý và phục vụ tệp tin học tập

## Cài đặt và chạy ứng dụng
### Yêu cầu hệ thống
- Node.js (phiên bản 14.0.0 trở lên)
- npm hoặc yarn

### Các bước cài đặt
1. Clone repository:
   ```bash
   git clone [url-repository]
   cd toeic
   ```
2. Cài đặt dependencies cho frontend:
   ```bash
   cd toeic
   npm install
   ```
3. Cài đặt dependencies cho backend:
   ```bash
   cd backend
   npm install
   ```
4. Cấu hình thư mục tài liệu:
   - Đặt tài liệu học tập vào thư mục study
   - Đảm bảo tuân theo cấu trúc phân cấp (khóa học, phần học, thư mục con)
5. Chạy backend:
   ```bash
   cd backend
   npm start
   ```
6. Chạy frontend (trong terminal khác):
   ```bash
   cd toeic
   npm run dev
   ```
7. Truy cập ứng dụng tại `http://localhost:5173`

## Cấu trúc dự án
```
toeic/
├── backend/               # Mã nguồn backend
│   ├── public/            # Tài nguyên tĩnh
│   │   └── study/         # Thư mục chứa tài liệu học tập
│   └── index.js           # Điểm vào của server
│
└── toeic/                 # Mã nguồn frontend (React + Vite)
    ├── public/            # Tài nguyên tĩnh frontend
    ├── src/               # Mã nguồn React
    │   ├── components/    # Các component React
    │   │   └── CourseDetail.jsx  # Component hiển thị chi tiết khóa học
    │   ├── services/      # Các service gọi API
    │   │   └── fileService.js    # Service xử lý tệp và thư mục
    │   ├── App.jsx        # Component gốc
    │   └── main.jsx       # Điểm vào ứng dụng
    ├── index.html         # HTML gốc
    └── vite.config.js     # Cấu hình Vite
```

## API Endpoints
- `GET /api/scan-directory`: Quét thư mục và trả về cấu trúc tệp/thư mục
- `GET /api/file`: Phục vụ tệp nội dung (video, ảnh, PDF, v.v.)

## Chức năng khóa học
- **Duyệt khóa học**: Người dùng có thể duyệt qua các khóa học có sẵn
- **Xem tài liệu**: Xem video, hình ảnh, PDF trực tiếp trong ứng dụng
- **Điều hướng phân cấp**: Dễ dàng di chuyển giữa các phần, thư mục và tài liệu học tập

## Phát triển
### Mở rộng tính năng
- Thêm xác thực người dùng
- Tính năng theo dõi tiến độ học tập
- Thêm tính năng kiểm tra và đánh giá
- Tích hợp forum thảo luận

### Đóng góp
1. Fork repository
2. Tạo branch tính năng (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi (`git commit -m 'Add some amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## Tác giả
h4x0rc

