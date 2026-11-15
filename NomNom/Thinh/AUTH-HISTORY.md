# AI thao tác — Login và Signup

**Đánh dấu: AI thao tác.** Ngày 15/11/2026, thực hiện bởi Codex theo kế hoạch đã duyệt.

## 1. Phạm vi và nguồn thiết kế

Hai popup bằng HTML/CSS/JS thuần, không thêm thư viện hoặc trang sản phẩm mới.

- [Log_PopUp trong Figma](https://www.figma.com/design/1XVDA0jnedoKuCL9rYodr7/IE104?node-id=226-2711): khung 411.5 × 471.5px.
- [Sign_PopUp trong Figma](https://www.figma.com/design/1XVDA0jnedoKuCL9rYodr7/IE104?node-id=229-2837): khung 411 × 551px.
- Giữ logo, Inter, nền trắng, nút vàng, các trường nhập và nội dung của Figma.
- Chiều cao được tăng để hiển thị chữ dễ đọc và các lỗi. Trên điện thoại, ô nhập
  cao 44px; đoạn điều khoản xuống dòng. Vì vậy chiều cao thực tế có thể khác Figma.

Giai đoạn này chỉ kiểm tra form. Form hợp lệ hiển thị thông báo sẽ bổ sung chức
năng tài khoản sau; không tạo tài khoản hoặc chuyển header sang thành viên.
Demo đăng nhập, ghi nhớ phiên, đặt lại mật khẩu và xác thực thật thuộc giai đoạn sau.

## 2. Những file AI thao tác

| File | Vai trò |
| --- | --- |
| [auth.js](auth.js) | Mở/đóng/chuyển popup, focus, khóa cuộn nền, nút mắt và hàm kiểm tra UI chung. |
| [login/index.html](login/index.html) | Trang xem thử mở sẵn Login, chứa cả hai popup. |
| [login/login.css](login/login.css) | Font, kiểu chung `.site-auth`, kiểu Login và nền của trang xem thử. |
| [login/login.js](login/login.js) | Chặn submit mặc định, kiểm tra Login và thông báo khi hợp lệ. |
| [signup/index.html](signup/index.html) | Trang xem thử mở sẵn Signup, chứa cùng hai popup. |
| [signup/signup.css](signup/signup.css) | Kích thước Signup, khoảng cách giữa trường và phần điều khoản. |
| [signup/signup.js](signup/signup.js) | Kiểm tra Signup, xác nhận mật khẩu và thông báo khi hợp lệ. |
| [Trang chủ](../Thach/Home-page/index.html) | Nạp CSS/JS và ghép hai dialog sau footer; giữ nguyên các khối header/main/footer. |
| [header/README.md](header/README.md) | Bổ sung cách kết nối với popup; sửa liên kết tài liệu header về HISTORY.md. |
| [Bảng class/id header-footer](class-id-header-footer.md) | Sửa liên kết tài liệu header về HISTORY.md. |
| [README.md](README.md) | Cập nhật trạng thái hai popup, cây thư mục và cách ghép đang dùng. |

## 3. Luồng hiện tại

1. Bấm Đăng nhập / Đăng ký trên header: mở đúng popup, focus vào trường đầu tiên.
2. Header phát `nomnom:auth-request`; `auth.js` nhận và gọi `preventDefault()`
   để báo đã xử lý. Cơ chế tài khoản của header được giữ nguyên.
3. Đăng ký ngay trong Login mở Signup; chỉ một popup mở tại một thời điểm.
4. Tab đi trong popup; Escape, dấu X hoặc bấm nền bên ngoài đóng popup.
5. Đóng/chuyển popup xóa mật khẩu, checkbox, lỗi và trạng thái hiện mật khẩu.
   Tên/email giữ trong DOM của lần mở trang hiện tại; code không lưu để khôi phục sau khi tải lại.
6. Đóng popup khôi phục cuộn nền và focus về nút đã mở. Khi mở từ menu nhỏ,
   header có thể đưa focus về nút Menu trước khi mở dialog.

Ghi nhớ tôi chỉ giữ trạng thái checkbox trong lần mở popup. Quên mật khẩu,
Điều khoản sử dụng và Chính sách quyền riêng tư hiển thị thông báo chờ tích hợp.

## 4. Ghép tay vào trang khác

Copy **cả hai khối `<dialog>`** nằm giữa `NOMNOM AUTH START` và `NOMNOM AUTH END`
trong một trang xem thử, đặt sau footer và trước `</body>` của trang đích.
Mỗi trang chỉ có một bộ hai dialog. Không copy `<head>`, `<body>` hoặc phần xem thử.

Nạp cả hai CSS và ba JS. Ví dụ đường dẫn từ trang chủ đang dùng:

```html
<link rel="stylesheet" href="../../Thinh/login/login.css">
<link rel="stylesheet" href="../../Thinh/signup/signup.css">
<script src="../../Thinh/auth.js" defer></script>
<script src="../../Thinh/login/login.js" defer></script>
<script src="../../Thinh/signup/signup.js" defer></script>
```

- `auth.js` phải đứng trước hai file JS xử lý form; trang có header vẫn nạp `header.js`.
- Đổi đường dẫn ảnh logo trong hai dialog theo trang HTML đích. URL font trong CSS
  tính từ file CSS nên không phải đổi.
- Không copy `class="auth-preview"` hoặc `data-auth-preview` sang trang thật:
  hai phần đó chỉ dành cho bản xem thử mở sẵn popup.
- HTML hiện ghép thủ công. Sửa một bản không tự sửa các bản đã copy; đồng bộ
  cả hai trang xem thử và trang chủ khi thay đổi cấu trúc popup.
- Hiện mới ghép vào trang chủ. Các trang khác có thể ghép cùng cách này.

## 5. Tra cứu class và id

Tên dùng một dấu `_`; dấu `-` nối các từ trong vai trò.

| Nhóm | Class / id |
| --- | --- |
| Hai popup | `.site-auth.site-login`, `.site-auth.site-signup`; `#site-login_dialog`, `#site-signup_dialog` |
| Nội dung và đầu popup | `.site-auth_content`, `.site-auth_close`, `.site-auth_logo`, `.site-auth_title` |
| Tiêu đề | `#site-login_title`, `#site-signup_title` |
| Hai form | `.site-auth_form.site-login_form`, `.site-auth_form.site-signup_form` |
| Một trường | `.site-auth_field`, `.site-auth_label`, `.site-auth_input`, `.site-auth_error` |
| Mật khẩu | `.site-auth_password`, `.site-auth_password-toggle`, `.site-auth_eye-slash` |
| Tùy chọn và thông báo | `.site-auth_options`, `.site-auth_check`, `.site-auth_link`, `.site-auth_submit`, `.site-auth_status`, `.site-auth_switch` |
| Điều khoản Signup | `.site-signup_terms`, `#site-signup_terms` |
| Input Login | `#site-login_email`, `#site-login_password` |
| Input Signup | `#site-signup_username`, `#site-signup_email`, `#site-signup_password`, `#site-signup_confirm-password` |
| Lỗi dưới input | Id input + `-error`, ví dụ `#site-login_email-error` |
| Trang xem thử | `.auth-preview`, `.auth-preview_main`, `.auth-preview_actions`, `.auth-preview_button` |

`label[for]` trỏ vào id input, `aria-describedby` trỏ vào đoạn lỗi, và
`aria-controls` trên nút mắt trỏ vào input mật khẩu. Nếu đổi id, sửa cả những tham chiếu này.

Các thuộc tính điều khiển:

| Thuộc tính | Công dụng |
| --- | --- |
| `data-nomnom-login`, `data-nomnom-signup` | Giúp JS tìm hai dialog. |
| `data-auth-close` | Nút đóng dialog hiện tại. |
| `data-auth-open="login"` / `"signup"` | Nút mở popup, dùng trên trang xem thử. |
| `data-auth-switch="signup"` | Chuyển từ Login sang Signup. |
| `data-auth-password` | Đánh dấu input mật khẩu, kể cả khi type đang là text. |
| `data-auth-password-toggle` | Nút mắt; `aria-pressed` ghi trạng thái đang hiện hay ẩn. |
| `data-show-label`, `data-hide-label` | Tên nút mắt tương ứng với trạng thái. |
| `data-required-message` | Câu lỗi khi trường bắt buộc đang trống. |
| `data-auth-pending` | Nội dung thông báo cho tính năng chờ tích hợp. |

## 6. Học cách chỉnh HTML, CSS và JavaScript

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
| Chiều rộng popup | `width`, `max-width` của `.site-auth` / `.site-signup` |
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
- `setCustomValidity("câu lỗi")` đánh dấu lỗi tự đặt cho xác nhận mật khẩu;
  `setCustomValidity("")` xóa lỗi đó khi hai giá trị khớp.
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

## 7. Kiểm tra bàn giao

- [x] Ba file JS qua `node --check`; phần thay đổi qua `git diff --check`.
- [x] Ba bản HTML có cùng hai dialog sau khi chuẩn hóa đường dẫn ảnh; id không trùng,
  các tham chiếu label/ARIA và tài nguyên nội bộ hợp lệ.
- [x] Link Markdown nội bộ trong tài liệu đã cập nhật trỏ đến file có thật.
- [x] Hai trang xem thử mở đúng popup mặc định, focus vào trường đầu tiên.
- [x] Với viewport 320 × 220px, input đầu tiên nhận focus và được cuộn vào vùng nhìn.
- [x] Bố cục ở 320, 375, 768, 1440px không tràn ngang.
- [x] Ở 320 × 320px, kể cả đang hiện lỗi, popup nằm trong lề 16px và cuộn bên trong.
- [x] Các trường trống, tên chỉ có khoảng trắng, email sai, xác nhận mật khẩu sai và
  chưa đồng ý điều khoản đều báo lỗi ngay dưới ô.
- [x] Nút mắt đổi type/nhãn đúng; tên/email được trim, mật khẩu giữ nguyên khoảng trắng.
- [x] Sửa mật khẩu gốc cập nhật lại lỗi xác nhận đang hiện.
- [x] Form hợp lệ hiện thông báo, không điều hướng, không ghi localStorage/sessionStorage,
  không phát `nomnom:auth-change` hoặc đổi header thành thành viên.
- [x] Enter gửi qua cùng xử lý kiểm tra form và không tải lại trang.
- [x] Chuyển Login → Signup giữ đúng một popup mở, không mở cuộn nền giữa chừng.
- [x] Đóng/chuyển popup xóa cả mật khẩu đang hiện dưới dạng text và lỗi đã báo.
- [x] Tab / Shift+Tab đi vòng trong popup; Escape ưu tiên popup trước menu header.
- [x] Dấu X và nền bên ngoài đóng được; focus và kiểu cuộn/padding nền được khôi phục.
- [x] Header trên desktop mở đúng popup và không hiện thông báo chờ tích hợp.
- [x] Từ menu nhỏ, popup vẫn dùng được sau hơn 4 giây khi header tự ẩn;
  đóng popup trả về nút Menu và header hiện lại.
- [x] Khóa cuộn nền không làm thay đổi bề ngang main.
- [x] Quên mật khẩu / Điều khoản hiện thông báo chờ tích hợp; giảm chuyển động tắt animation.
- [x] Không có lỗi JavaScript runtime trong các luồng form đã kiểm tra.

Kiểm tra bằng Microsoft Edge với viewport giả lập; chưa thử trên điện thoại thật.
Các file không được tự commit hoặc push.
