# NomNom — Phần của Thịnh

Header, Footer và hai popup Login/Signup dùng HTML, CSS và JavaScript thuần.
Bắt đầu từ file này; mỗi tài liệu bên dưới có một mục đích riêng.

## Mở xem

Mở bằng Live Server: [Header khách](header/index.html) ·
[Header thành viên](<header/ed - index.html>) · [Footer](footer/index.html) ·
[Login](login/index.html) · [Signup](signup/index.html).

[Trang chủ đã ghép](../Thach/Home-page/index.html) dùng header qua placeholder, footer ghép tay và cả hai popup.
Ba trang Phát cũng dùng chung loader header; phần nạp footer vẫn nằm trong JS của từng trang.
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

## Ghép header bằng placeholder (khuyên dùng)

Ví dụ từ `Thach/Home-page/index.html`, `Phat/category-page-1/index.html` hoặc
`Minh/aboutus/index.html`:

```html
<!-- Trong head, sau CSS riêng của trang. Header tự nạp style.css nếu chưa có. -->
<script src="../../Thinh/header/header.js" defer></script>

<!-- Trong body, trước main. -->
<div id="header-placeholder"></div>
```

- Chỉ cần chỉnh đường dẫn của thẻ `script` theo vị trí trang. Ảnh, link và form trong
  header được tính từ file mẫu / file JS, không phải sửa bằng cách thay chuỗi `../`.
- Loader lấy khối header khách từ `Thinh/header/index.html`; không chèn cả head/body
  hoặc chạy script của file mẫu. Sửa mẫu này sẽ cập nhật header ở các trang dùng placeholder.
- Mặc định là khách. Muốn hiển thị thành viên, dùng `NomNomHeaderConfig.user` hoặc API
  `NomNomHeader.updateHeaderAuth(user)`; loader không tạo hay lưu phiên đăng nhập.
- Header đã được chép tay vẫn dùng được; nếu cùng có placeholder thì giữ bản chép tay,
  không tạo header thứ hai. Nạp script / gọi `init()` nhiều lần không gắn listener lặp.
- Phải chạy bằng Live Server / HTTP. Cách nạp này cần JavaScript và `fetch`; nếu cần
  header đầy đủ khi tắt JS, dùng cách ghép thủ công bên dưới.
- Footer và popup Login/Signup vẫn ghép riêng. Chỉ nạp header.js chưa tự chèn hai popup;
  nếu trang chưa có phần nhận sự kiện tài khoản, header sẽ báo đang chờ tích hợp.

Trang muốn đánh dấu mục Danh mục đang được xem có thể dùng:

```html
<div id="header-placeholder" data-header-active="categories"></div>
```

JS riêng cần đợi header xuất hiện thì dùng `window.NomNomHeader.ready` (Promise),
hoặc nghe `nomnom:header-ready`; xem [hướng dẫn Header](docs/header.md).
Khi tải HTML/CSS thất bại, placeholder hiện thông báo và nút Thử lại.

## Ghép thủ công

Cách này dành cho trang cần giữ HTML header ngay trong file; không dùng đồng thời
với placeholder nếu không cần. Footer và các dialog hiện vẫn ghép theo các bước này.

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
khi sửa mẫu, cập nhật các trang đã copy và thử lại. Trang chủ hiện dùng placeholder
cho header nên không cần chép lại khối header; footer/dialog vẫn cần đồng bộ riêng.
Chi tiết ở các tài liệu review tương ứng phía trên.

Tài liệu học phần About Us/User của Minh giữ tại [Minh/ROADMAP.md](../Minh/ROADMAP.md).
