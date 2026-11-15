# NomNom — Phần của Thịnh
Chưa làm xong con mẹ gì hết

HTML, CSS và JavaScript thuần. Bốn phần bạn phụ trách nằm trong bốn thư mục riêng.

## Mở xem

Mở bằng Live Server: [Header khách](header/index.html),
[Header thành viên](<header/ed - index.html>), [Footer](footer/index.html),
[Login](login/index.html), [Signup](signup/index.html).

Login và Signup đã có popup và kiểm tra form. Chức năng tài khoản thật và chế độ
demo sẽ làm sau. Hướng dẫn và nhật ký: [AI thao tác — Auth](AUTH-HISTORY.md).

## Cây thư mục

```text
Thinh/
├── README.md
├── auth.js             # Điều phối hai popup và thao tác UI chung
├── AUTH-HISTORY.md     # Hướng dẫn, class/id và nhật ký AI thao tác
├── assets/             # Ảnh, icon, font có sẵn
├── header/
│   ├── index.html      # Xem thử Header khách
│   ├── ed - index.html # Xem thử Header thành viên
│   ├── style.css
│   └── header.js
├── footer/
│   ├── index.html      # Xem thử Footer
│   └── style.css
├── login/
│   ├── index.html      # Xem thử mở sẵn Login, chứa hai popup
│   ├── login.css
│   └── login.js
└── signup/
    ├── index.html      # Xem thử mở sẵn Signup, chứa hai popup
    ├── signup.css
    └── signup.js
```

Chưa cần tạo `footer.js`: Footer hiện chỉ có liên kết. Khi có hành vi riêng cần JS mới thêm file đó.

## Muốn sửa phần nào thì mở đâu?

| Phần | File HTML | Kiểu dáng | Tương tác |
| --- | --- | --- | --- |
| Header khách | `header/index.html` | `header/style.css` | `header/header.js` |
| Header thành viên | `header/ed - index.html` | Cùng `header/style.css` | Cùng `header/header.js` |
| Footer | `footer/index.html` | `footer/style.css` | Chưa cần JS riêng |
| Login | `login/index.html` | `login/login.css` | `login/login.js` |
| Sign up | `signup/index.html` | `signup/signup.css` | `signup/signup.js` |

Hai popup cùng nạp `auth.js`, `login/login.css`, `signup/signup.css`,
`login/login.js` và `signup/signup.js`. Kiểu form chung nằm trong `login.css`;
`signup.css` điều chỉnh bố cục riêng của Signup. Class `.auth-preview...` chỉ dùng
trên trang xem thử. Khi ghép, chỉ copy hai khối `<dialog>`.

## Ghép vào trang của nhóm

HTML nằm trực tiếp trong từng trang. Các file `index.html` trên là trang xem thử đầy đủ, không phải file được tự động chèn vào trang khác.

1. Chép khối `<header>...</header>` và `<footer>...</footer>` vào trang cần ghép, giữ nội dung riêng trong `main`.
2. Nối CSS của trang rồi CSS Header/Footer; nạp `header.js` với `defer`.
3. Chép hai dialog sau footer và nạp hai CSS, ba JS của Auth theo [hướng dẫn ghép](AUTH-HISTORY.md#4-ghép-tay-vào-trang-khác).
4. Đổi đường dẫn logo/icon trong HTML theo trang đích. Mỗi trang có một header và một bộ hai dialog.
5. Hai popup nối với sự kiện header sẵn có; form hợp lệ hiện chỉ thông báo trạng thái.

Ví dụ Header/Footer từ `NomNom/Thach/Home-page/index.html`:

```html
<link rel="stylesheet" href="../../Thinh/header/style.css">
<link rel="stylesheet" href="../../Thinh/footer/style.css">
<script src="../../Thinh/header/header.js" defer></script>
```

Từ `NomNom/Minh/aboutus/index.html`, cũng dùng tiền tố `../../Thinh/`.
URL ảnh/font trong CSS tính từ file CSS nên không đổi khi chép khối HTML.

Khi chỉnh mẫu, các trang đã chép không tự cập nhật. Nhóm cần đồng bộ và thử lại sau khi ghép.

## Những gì còn phải làm

- Đối chiếu nội dung và màu dropdown với Figma.
- Bổ sung demo hoặc xác thực tài khoản khi đến giai đoạn tiếp theo.
- Nối link thật, thử desktop/mobile và kiểm tra lỗi console.

Nguồn Figma và kết quả kiểm tra popup được ghi trong [AUTH-HISTORY.md](AUTH-HISTORY.md).

