# NomNom — Phần của Thịnh

Header, Footer và hai popup Login/Signup dùng HTML, CSS và JavaScript thuần.
Bắt đầu từ file này; mỗi tài liệu bên dưới có một mục đích riêng.

## Mở xem

Mở bằng Live Server: [Header khách](header/index.html) ·
[Header thành viên](<header/ed - index.html>) · [Footer](footer/index.html) ·
[Login](login/index.html) · [Signup](signup/index.html).

[Trang chủ đã ghép](../Thach/Home-page/index.html) dùng header, footer và cả hai popup.
Hiện popup kiểm tra dữ liệu nhập; demo, xác thực thật, ghi nhớ phiên và quên mật khẩu
sẽ làm ở giai đoạn sau. Các liên kết chưa có trang đích vẫn chờ nhóm tích hợp.

## Tài liệu

| Cần làm gì? | Mở tài liệu |
| --- | --- |
| Review thư mục Header: cấu trúc, class/id, responsive và tự ẩn | [Header](docs/header.md) |
| Review thư mục Footer: bố cục, class, responsive và SVG | [Footer](docs/footer.md) |
| Review thư mục Login: form và điều phối popup dùng chung | [Login](docs/login.md) |
| Review thư mục Signup: xác nhận mật khẩu và điều khoản | [Signup](docs/signup.md) |
| Xem quy ước đặt tên và class/thuộc tính dùng chung | [Quy ước chung](docs/class-id.md) |
| Xem AI đã sửa gì và các kết quả kiểm tra trước đây | [Nhật ký AI thao tác](docs/lich-su-ai.md) |

## Mở file nào để sửa?

| Phần | HTML | CSS | JavaScript |
| --- | --- | --- | --- |
| Header | [Khách](header/index.html), [thành viên](<header/ed - index.html>) | [style.css](header/style.css) | [header.js](header/header.js) |
| Footer | [index.html](footer/index.html) | [style.css](footer/style.css) | Chưa có hành vi cần file JS riêng |
| Login | [index.html](login/index.html) | [login.css](login/login.css) | [login.js](login/login.js) |
| Signup | [index.html](signup/index.html) | [signup.css](signup/signup.css) | [signup.js](signup/signup.js) |

Hai popup cùng dùng [auth.js](auth.js). Kiểu form chung nằm trong `login.css`;
`signup.css` bổ sung bố cục riêng. `assets/` chứa ảnh, icon và font. `docs/` chứa tài liệu.
Các thư mục `P-header/` và `P-footer/` là bản mẫu cũ; trang chủ hiện dùng các thư mục trong bảng trên.

## Ghép thủ công

1. Copy một khối `<header>` và một khối `<footer>` vào trang đích, giữ nội dung riêng của `main`.
2. Copy cả hai `<dialog>` giữa `NOMNOM AUTH START` / `NOMNOM AUTH END`, đặt sau footer.
3. Nạp CSS/JS theo mẫu dưới; đổi đường dẫn ảnh trong các khối HTML theo trang đích.
4. Thử menu, tìm kiếm, hai popup và màn hình nhỏ. Mỗi trang chỉ có một bộ các khối này.

Ví dụ đường dẫn từ `Thach/Home-page/index.html` hoặc `Minh/aboutus/index.html`:

```html
<!-- Đặt sau CSS riêng của trang. -->
<link rel="stylesheet" href="../../Thinh/header/style.css">
<link rel="stylesheet" href="../../Thinh/footer/style.css">
<link rel="stylesheet" href="../../Thinh/login/login.css">
<link rel="stylesheet" href="../../Thinh/signup/signup.css">
<script src="../../Thinh/header/header.js" defer></script>
<script src="../../Thinh/auth.js" defer></script>
<script src="../../Thinh/login/login.js" defer></script>
<script src="../../Thinh/signup/signup.js" defer></script>
```

URL ảnh/font trong CSS tính từ vị trí file CSS; `src` ảnh trong HTML tính từ trang đích.
Không copy `<head>`, `<body>` hay phần xem thử. HTML ghép tay không tự đồng bộ:
khi sửa mẫu, cập nhật các trang đã copy và thử lại. Chi tiết ở các tài liệu review tương ứng phía trên.

Tài liệu học phần About Us/User của Minh giữ tại [Minh/ROADMAP.md](../Minh/ROADMAP.md).
