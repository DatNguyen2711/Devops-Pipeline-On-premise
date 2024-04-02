Pharmacy-Website
Overview
Pharmacy-Website là một ứng dụng web dành cho các nhà thuốc để quản lý hàng tồn kho, đơn hàng, và thông tin khách hàng. Dự án này được xây dựng với sự kết hợp giữa .NET 8, ReactJS, và SQL Server. Ứng dụng được triển khai trong một môi trường Docker và hỗ trợ việc triển khai trên hệ điều hành Linux.

Cài đặt
Yêu cầu tiền điều kiện
Docker và Docker Compose đã được cài đặt trên hệ thống của bạn.
Triển khai
Clone dự án từ repository:
bash
Copy code
git clone https://github.com/yourusername/pharmacy-website.git
Di chuyển vào thư mục dự án:
bash
Copy code
cd pharmacy-website
Sử dụng Docker Compose để triển khai dự án:
bash
Copy code
docker-compose up --build
Truy cập ứng dụng qua trình duyệt web:
bash
Copy code
http://localhost:3000
Cấu trúc thư mục
/backend: Chứa mã nguồn backend viết bằng .NET 8.
/frontend: Chứa mã nguồn frontend viết bằng ReactJS.
/docker-compose.yml: Tệp cấu hình Docker Compose cho việc triển khai ứng dụng.
Công nghệ
Backend: .NET 8 được sử dụng để xây dựng API cho ứng dụng.
Frontend: ReactJS được sử dụng để xây dựng giao diện người dùng của ứng dụng.
Database: SQL Server được sử dụng làm cơ sở dữ liệu cho ứng dụng.
