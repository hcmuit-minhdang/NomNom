# Review thư mục login

[Tổng quan](../README.md) · [Header](header.md) · [Footer](footer.md) · [Login](login.md) · [Signup](signup.md) · [Quy ước chung](class-id.md) · [Nhật ký AI](lich-su-ai.md)


## 1. File và phạm vi hiện tại

| File | Vai trò |
| --- | --- |
| [index.html](../login/index.html) | Trang xem thử mở sẵn Login; chứa cả Login và Signup để thử chuyển popup. |
| [login.css](../login/login.css) | Kiểu form dùng chung `.site-auth`, kiểu Login và phần xem thử. |
| [login.js](../login/login.js) | Nhận submit của Login, kiểm tra dữ liệu rồi hiện thông báo. |
| [auth.js](../auth.js) | Điều phối hai popup, focus, cuộn nền, nút mắt và kiểm tra chung. |

Nguồn thiết kế: [Log_PopUp trong Figma](https://www.figma.com/design/1XVDA0jnedoKuCL9rYodr7/IE104?node-id=226-2711),
khung gốc 411.5 × 471.5px. Popup co theo màn hình và cao thêm khi có lỗi.
Form hiện chỉ kiểm tra dữ liệu; demo, xác thực tài khoản và ghi nhớ phiên làm sau.
Kết quả kiểm tra cũ nằm ở [nhật ký AI](lich-su-ai.md#login-và-signup).

## 2. HTML và class/id riêng

```text
dialog.site-auth.site-login#site-login_dialog
└── div.site-auth_content
    ├── button.site-auth_close
    ├── img.site-auth_logo
    ├── h2.site-auth_title#site-login_title
    ├── form.site-auth_form.site-login_form
    │   ├── Email + câu lỗi
    │   ├── Mật khẩu + nút mắt + câu lỗi
    │   ├── Ghi nhớ tôi / Quên mật khẩu?
    │   ├── button.site-auth_submit
    │   └── p.site-auth_status
    └── p.site-auth_switch → Đăng ký ngay!
```

| Thành phần | Class / id | Cần nhớ |
| --- | --- | --- |
| Popup | `.site-login`, `#site-login_dialog` | Được tìm bằng `data-nomnom-login`. |
| Tiêu đề | `#site-login_title` | `aria-labelledby` của dialog trỏ tới đây. |
| Form | `.site-login_form` | Là điểm bắt đầu của `login.js`. |
| Email | `#site-login_email` | `type="email"`, `required`, tên trường `email`. |
| Lỗi email | `#site-login_email-error` | Được input tham chiếu bằng `aria-describedby`. |
| Mật khẩu | `#site-login_password` | `type="password"`, `required`, tên trường `password`. |
| Lỗi mật khẩu | `#site-login_password-error` | Chỉ hiện khi có lỗi. |
| Tùy chọn | `.site-auth_options`, `.site-auth_check` | Checkbox `remember` chưa lưu phiên. |
| Chuyển form | `.site-auth_switch`, `data-auth-switch="signup"` | Mở Signup, xóa mật khẩu Login. |

Các class `.site-auth_*` dùng chung được tra tại [class-id.md](class-id.md#2-class-dùng-chung-cho-popup).
`label[for]`, `aria-controls` của nút mắt và `aria-describedby` phải trỏ đúng id.

## 3. CSS và JavaScript cần hiểu

### HTML: form và dialog

`<dialog>` là popup có sẵn trong HTML. `showModal()` đưa nó lên trên trang và
chặn thao tác với phần nền. Đóng bằng `close()` hoặc Escape do JS điều phối.

`required` đánh dấu trường bắt buộc; `type="email"` cung cấp quy tắc định dạng
email. `novalidate` trên form tắt hộp báo lỗi mặc định khi submit để JS có thể
hiển thị các câu tiếng Việt ngay dưới từng ô. Quy tắc `validity` vẫn đọc được.

### CSS: các chỗ dễ chỉnh

| Muốn sửa | Tìm trong CSS |
| --- | --- |
| Nền, chữ, màu vàng và màu lỗi | Biến `--auth-*` trong `.site-auth` |
| Chiều rộng popup | `width`, `max-width` của `.site-auth`; phần Signup xem [signup.md](signup.md) |
| Giới hạn chiều cao | `max-height: calc(100dvh - 32px)` |
| Padding | `.site-auth_content` |
| Khoảng cách các trường | `gap` của `.site-auth_form` |
| Ô nhập | `.site-auth_input` |
| Chữ và nút chính | `.site-auth_title`, `.site-auth_submit` |
| Màn hình nhỏ | `@media (max-width: 480px)` |

`overflow: auto` cho phép cuộn trong popup khi nội dung dài hơn màn hình.
Không đặt chiều cao cố định cho form, vì câu lỗi cần thêm chỗ.

### JavaScript: chặn submit và kiểm tra

```js
form.addEventListener("submit", event => {
    event.preventDefault();
    if (!window.NomNomAuth.validateForm(form)) return;
    window.NomNomAuth.showMessage(form, "Thông tin hợp lệ...");
});
```

- `addEventListener` đăng ký việc làm khi xảy ra sự kiện.
- `submit` xảy ra khi bấm nút chính hoặc nhấn Enter trong ô nhập.
- `preventDefault()` chặn việc gửi form / tải lại trang mặc định.
- `validateForm` trả về `true` khi hợp lệ; `!` đảo giá trị, nên dòng `if` có nghĩa:
  nếu chưa hợp lệ thì dừng ở `return`.
- Đọc `input.validity.valueMissing` để biết trường bắt buộc đang trống,
  `typeMismatch` để biết email sai định dạng.
- Quy tắc xác nhận mật khẩu riêng được giải thích trong [Signup](signup.md#4-javascript-cần-hiểu).
- Nút mắt đổi `input.type` giữa `password` và `text`, không thay đổi `input.value`.
- `textContent` đưa thông báo vào trang dưới dạng văn bản.

Ba hàm UI chung của `window.NomNomAuth`:

| Hàm | Tác dụng |
| --- | --- |
| `open("login")` / `open("signup")` | Mở popup tương ứng. |
| `validateForm(form)` | Kiểm tra các input bắt buộc và hiện lỗi, trả boolean. |
| `showMessage(form, message)` | Hiển thị trạng thái trong form. |

Không hàm nào trong đây đăng nhập hoặc đăng ký tài khoản thật. Không có dữ liệu
mật khẩu trong localStorage/sessionStorage, URL hoặc thông báo console.

### Đọc login.js theo thứ tự

1. `querySelector(".site-login_form")` tìm form Login.
2. Nếu thiếu form/API chung hoặc form đã khởi tạo thì `return` để tránh lỗi/gắn sự kiện lặp.
3. Nghe `submit`; chặn gửi form mặc định bằng `preventDefault()`.
4. `validateForm(form)` kiểm tra email/mật khẩu và focus vào lỗi đầu tiên.
5. Khi hợp lệ, chỉ hiện thông báo sẽ bổ sung chức năng đăng nhập ở bước sau.

`const` giữ tham chiếu đến form; `if (!...) return` dừng sớm khi điều kiện chưa đạt.
Đây là kiểm tra phía giao diện, chưa phải kiểm tra tài khoản trong cơ sở dữ liệu.

## 4. Điều phối popup dùng chung

1. Bấm Đăng nhập / Đăng ký trên header: mở đúng popup, focus vào trường đầu tiên.
2. Header phát `nomnom:auth-request`; `auth.js` nhận và gọi `preventDefault()`
   để báo đã xử lý. Cơ chế tài khoản của header được giữ nguyên.
3. Đăng ký ngay trong Login mở Signup; chỉ một popup mở tại một thời điểm.
4. Tab đi trong popup; Escape, dấu X hoặc bấm nền bên ngoài đóng popup.
5. Đóng/chuyển popup xóa mật khẩu, checkbox, lỗi và trạng thái hiện mật khẩu.
   Tên/email giữ trong DOM của lần mở trang hiện tại; code không lưu để khôi phục sau khi tải lại.
6. Đóng popup khôi phục cuộn nền và focus về nút đã mở. Khi mở từ menu nhỏ,
   header có thể đưa focus về nút Menu trước khi mở dialog.

`showModal()` chỉ mở dialog trên cùng và chặn tương tác nền. `auth.js` còn khóa
cuộn, giữ Tab/Shift+Tab trong popup và khôi phục kiểu cuộn/focus khi đóng. `resetDialog()`
xóa mật khẩu, checkbox, câu lỗi và trạng thái nút mắt; không lưu dữ liệu vào trình duyệt.

Ghi nhớ tôi mới giữ trạng thái checkbox trong lần mở popup. Quên mật khẩu hiển thị
thông báo chờ tích hợp. Phần xác nhận mật khẩu và điều khoản được review ở [Signup](signup.md).

## 5. Ghép vào trang khác

Copy **cả hai khối `<dialog>`** nằm giữa `NOMNOM AUTH START` và `NOMNOM AUTH END`
trong một trang xem thử, đặt sau footer và trước `</body>` của trang đích.
Mỗi trang chỉ có một bộ hai dialog. Không copy `<head>`, `<body>` hoặc phần xem thử.

Nạp cả hai CSS và ba JS theo [mẫu ghép chung](../README.md#ghép-thủ-công).

- `auth.js` phải đứng trước hai file JS xử lý form; trang có header vẫn nạp `header.js`.
- Đổi đường dẫn ảnh logo trong hai dialog theo trang HTML đích. URL font trong CSS
  tính từ file CSS nên không phải đổi.
- Không copy `class="auth-preview"` hoặc `data-auth-preview` sang trang thật:
  hai phần đó chỉ dành cho bản xem thử mở sẵn popup.
- HTML hiện ghép thủ công. Sửa một bản không tự sửa các bản đã copy; đồng bộ
  cả hai trang xem thử và trang chủ khi thay đổi cấu trúc popup.
- Hiện mới ghép vào trang chủ. Các trang khác có thể ghép cùng cách này.

## 6. Checklist tự review

- [ ] Mở Login từ header: email nhận focus, header không báo chờ tích hợp?
- [ ] Bỏ trống hoặc nhập email sai: lỗi nằm dưới đúng ô và focus vào lỗi đầu tiên?
- [ ] Nút mắt đổi type/nhãn, nhưng giữ nguyên giá trị mật khẩu kể cả khoảng trắng?
- [ ] Bấm Enter và nút Đăng Nhập chạy cùng xử lý, không tải lại trang?
- [ ] Form hợp lệ chỉ hiện thông báo; header vẫn ở trạng thái khách?
- [ ] Đăng ký ngay mở đúng một Signup; mật khẩu Login bị xóa?
- [ ] Dấu X, Escape và nền ngoài đóng được; Tab/Shift+Tab không ra khỏi popup?
- [ ] Ở 320/375px và màn hình thấp, popup cuộn được và nút đóng còn dùng được?
- [ ] Đóng popup trả focus về nút mở; khi mở từ menu nhỏ thì về nút Menu?

### Tự giải thích

`preventDefault()` ngăn điều gì? `novalidate` có làm mất quy tắc `required` không?
Vì sao không trim mật khẩu? Vì sao `login.css` còn ảnh hưởng đến popup Signup?
