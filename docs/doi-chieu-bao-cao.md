# Đối chiếu dự án NomNom với báo cáo tham khảo

Nguồn so sánh: *Báo cáo MyTicket* (4/2025) và *Báo cáo Game Store Website, Nhóm 1* (11/2025). Cả hai có cùng khung chương nên nhóm dùng khung đó cho báo cáo NomNom.

## 1. Phương pháp chọn

| Nội dung | MyTicket | Game Store | NomNom chọn |
|---|---|---|---|
| Đặt tên CSS | BEM | BEM | **BEM** (xem `STRUCTURE.md`) |
| Đặt tên JS | camelCase | camelCase | **camelCase** |
| Tổ chức CSS | style chung + CSS riêng từng trang, id từng trang | giống MyTicket | CSS chung trong `css/components/`, riêng trong `css/pages/` (không dùng id trang) |
| Component | header, footer, card, modal, slider... | tương tự | header, footer, login/signup, filter, pager, fridge-filter |
| Git | nhánh riêng từng tính năng + Pull Request | giống MyTicket | giống, ghi trong `STRUCTURE.md` |
| Khung báo cáo | 2 chương + tổng kết | 4 chương: giới thiệu, triển khai, kiểm thử và tối ưu, tổng kết | **4 chương như Game Store** |

## 2. Khung báo cáo và phần NomNom đã có

| Mục trong báo cáo mẫu | NomNom có sẵn gì | Còn thiếu |
|---|---|---|
| Bìa, nhận xét GVHD, mục lục, danh mục bảng/hình, từ viết tắt, thuật ngữ | không có (là văn bản) | viết |
| Bảng phân công và đánh giá thành viên | README có bảng thành viên, phân công, tiến độ | chép vào báo cáo |
| 1.x Giới thiệu, mục tiêu, công nghệ | README: Tính năng, Công nghệ | viết |
| Wireframe, thiết kế chi tiết | Figma (xem mục 3) | chụp hình đưa vào |
| Sitemap | không có | vẽ từ danh sách trang (16 file HTML) |
| Quy tắc đặt tên, component, CSS, Git | `STRUCTURE.md` mục Quy tắc | chép vào |
| Cấu trúc mã nguồn | `STRUCTURE.md`, README | chụp cây thư mục |
| 2.x Từng trang kèm bảng mô tả thành phần | code có đủ trang | viết bảng mô tả cho từng trang (mẫu: bảng thành phần trang chủ) |
| 3.1 Kiểm thử HTML (W3C validator) | chưa chạy | chạy validator cho 16 trang, ghi bảng kết quả |
| 3.1 Kiểm thử responsive (tablet, mobile) | đã thử tay ở 1440, 768, 375px | lập bảng các trang theo thiết bị |
| 3.1 Kiểm thử JavaScript | đã thử tay mọi luồng chính (đăng nhập, lưu, đánh giá, đăng, sửa, xóa) | lập bảng kịch bản và kết quả |
| 3.2 Tối ưu ảnh | có ảnh WebP, ảnh tải lên thu về 800px; còn nhiều PNG/JPG (khoảng 46 MB thư mục images) | nén thêm, chụp kích thước trước/sau |
| 3.2 Tối ưu CSS/JS | không minify; phần lớn script nạp `defer` (riêng `store.js` nạp đồng bộ) | tùy chọn |
| 3.2 Tối ưu SEO | đã thêm `meta description`, Open Graph, `lang`, `alt` đủ cho mọi ảnh, `loading="lazy"` (chỉ cho ảnh do JS tạo, ảnh tĩnh trong HTML chưa có) | đã có sitemap.xml, robots.txt và trang 404; chưa có canonical; mọi trang đều có đúng một `h1` (trang chủ, so sánh giá và Góc của tôi dùng `h1` ẩn) |
| 3.2 Lighthouse | chưa chạy | chạy trên bản Vercel, chụp điểm |
| 4. Tổng kết, ưu/khuyết, hướng phát triển | không có | viết (README mục Giới hạn là nguyên liệu tốt) |
| Tài liệu tham khảo | không có | liệt kê |

## 3. Figma so với code

Figma (file 1XVDA0jnedoKuCL9rYodr7, khung rộng 1600px) có: Trang chủ (3 trạng thái: đã/chưa đăng nhập), Header/Nav (menu thả xuống), Category và Search (nhiều trạng thái), User (Overview, Reviewed, Saved, Uploaded, History), Recipe, About Us, Trang cá nhân, Login/Sign và các component (card, slider, avatar).

Code có nhưng Figma chưa có khung riêng: **Đăng tải công thức, So sánh giá nguyên liệu, Tủ lạnh và kết quả tủ lạnh, Chính sách**. Figma cũng không có khung tablet/mobile (chỉ một khung 390px), trong khi code đã responsive. Khi viết báo cáo, mục thiết kế nên chụp phần có sẵn và ghi rõ các trang còn lại thiết kế trực tiếp khi code, hoặc bổ sung khung Figma cho 4 trang trên.

## 4. Việc nên làm trước khi nộp

1. Chạy W3C validator và Lighthouse trên bản Vercel, lưu ảnh chụp kết quả.
2. Thêm thẻ `canonical` và `og:image`.
3. Nén ảnh PNG/JPG lớn sang WebP.
4. Viết các chương theo khung mục 2; nhóm tự điền link YouTube trong README.
