# NomNom — Phần của Thịnh

HTML, CSS và JavaScript thuần. Bốn phần bạn phụ trách nằm trong bốn thư mục riêng.

## Mở xem

Mở [index.html](index.html) bằng Live Server để chọn Header khách, Header thành viên hoặc Footer.

Login và Sign up hiện là file rỗng, chưa có giao diện hay xác thực thật.

## Cây thư mục

```text
Thinh/
├── index.html          # Trang chọn phần để mở thử
├── README.md
├── common.css          # Font, màu, logo, nút và kiểu dáng xem thử dùng chung
├── common.js           # Hộp thông báo cho link/chức năng chưa tích hợp
├── assets/             # Ảnh, icon, font có sẵn
├── header/
│   ├── index.html      # Xem thử Header khách
│   ├── member.html     # Xem thử Header thành viên
│   ├── header.css
│   └── header.js
├── footer/
│   ├── index.html      # Xem thử Footer
│   └── footer.css
├── login/
│   ├── index.html      # File rỗng để làm popup Login
│   ├── login.css
│   └── login.js
└── signup/
    ├── index.html      # File rỗng để làm popup Sign up
    ├── signup.css
    └── signup.js
```

Chưa cần tạo `footer.js`: Footer hiện chỉ có liên kết. Khi có hành vi riêng cần JS mới thêm file đó.

## Muốn sửa phần nào thì mở đâu?

| Phần | File HTML | Kiểu dáng | Tương tác |
| --- | --- | --- | --- |
| Header khách | `header/index.html` | `header/header.css` | `header/header.js` |
| Header thành viên | `header/member.html` | Cùng `header/header.css` | Cùng `header/header.js` |
| Footer | `footer/index.html` | `footer/footer.css` | Chưa cần JS riêng |
| Login | `login/index.html` | `login/login.css` | `login/login.js` |
| Sign up | `signup/index.html` | `signup/signup.css` | `signup/signup.js` |

`common.css` chỉ giữ phần dùng chung. Các class `.template-demo...` trong đó trang trí vùng xem thử; khi ghép vào trang thật không cần chép nội dung demo.

`common.js` mở dialog tạm cho `data-pending`. Khi nối link/chức năng thật phải bỏ thuộc tính này; chỉ đổi `href` thì JS vẫn chặn.

Header/Footer được tách từ bộ khung đã có; không phải giao diện mới dựng lại từ Figma. Menu hiện tại vẫn cần đối chiếu thiết kế. Các file Login/Sign up chưa có code; yêu cầu thiết kế vẫn là popup, không bắt buộc trở thành trang đăng nhập riêng trong sản phẩm.

## Ghép vào trang của nhóm

HTML nằm trực tiếp trong từng trang. Các file `index.html` trên là trang xem thử đầy đủ, không phải file được tự động chèn vào trang khác.

1. Chép khối `<header>...</header>` và `<footer>...</footer>` vào trang cần ghép, giữ nội dung riêng trong `main`.
2. Nối CSS chung trước CSS Header/Footer, rồi CSS riêng của trang.
3. Nối `header.js` nếu có Header. Nối `common.js` và giữ dialog tạm nếu vẫn còn `data-pending`; chỉ dùng một dialog có id `pending-dialog` trên mỗi trang.
4. Giữ skip link và `id="main-content"` nếu dùng chúng. Sửa đường dẫn logo/icon trong HTML theo vị trí trang đích.
5. Khi Login/Sign up hoàn thành, chép HTML popup và nối CSS/JS tương ứng. Chưa triển khai cơ chế này trong bộ khung hiện tại.

Ví dụ từ `NomNom/Thach/index.html`:

```html
<link rel="stylesheet" href="../Thinh/common.css">
<link rel="stylesheet" href="../Thinh/header/header.css">
<link rel="stylesheet" href="../Thinh/footer/footer.css">
<link rel="stylesheet" href="css/styles.css">
<script src="../Thinh/header/header.js" defer></script>
<script src="../Thinh/common.js" defer></script>
```

Từ `NomNom/Minh/aboutus/index.html`, thay tiền tố `../Thinh/` bằng `../../Thinh/`. URL ảnh/font trong CSS tính từ file CSS nên không đổi khi chép khối HTML.

Khi chỉnh mẫu, các trang đã chép không tự cập nhật. Nhóm cần đồng bộ và thử lại sau khi ghép.

## Những gì còn phải làm

- Đối chiếu nội dung và màu dropdown với Figma.
- Dựng hai popup, kiểm tra form, ẩn/hiện mật khẩu và hỗ trợ bàn phím.
- Chốt chức năng tài khoản thật hay chỉ frontend với nhóm/giảng viên.
- Nối link thật, thử desktop/mobile và kiểm tra lỗi console.

Chi tiết phân công và Figma: [tài liệu ở gốc repo](../../phan-cong-header-footer-auth.md). Ghi chú Git: [github-co-ban.md](../../docs/github-co-ban.md).

