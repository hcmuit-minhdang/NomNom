# Quy ước class/id và thành phần dùng chung

[Tổng quan](../README.md) · [Header](header.md) · [Footer](footer.md) · [Login](login.md) · [Signup](signup.md) · [Quy ước chung](class-id.md) · [Nhật ký AI](lich-su-ai.md)

Class/id riêng được đặt cùng tài liệu review để mở đúng một thư mục là tra được:

| Thư mục | Tài liệu |
| --- | --- |
| `header/` | [Header](header.md#1-cấu-trúc-và-classid) |
| `footer/` | [Footer](footer.md#2-class-của-footer) |
| `login/` | [Login](login.md#2-html-và-classid-riêng) |
| `signup/` | [Signup](signup.md#2-html-và-classid-riêng) |

## 1. Quy ước đặt tên và cách đọc selector

| Trong HTML | Selector trong CSS / JavaScript | Ý nghĩa |
| --- | --- | --- |
| `class="site-header_logo"` | `.site-header_logo` | Chọn phần tử có class này; một class có thể dùng cho nhiều phần tử. |
| `id="site-header_login"` | `#site-header_login` | Chọn phần tử có id này; id phải duy nhất trong một trang. |
| `data-header-guest` | `[data-header-guest]` | Chọn theo thuộc tính; đây không phải class hay id. |

Quy ước: tên khối là `site-header` / `site-footer`; tên phần con dùng **một dấu
gạch dưới `_`**, ví dụ `site-header_logo`, `site-footer_brand`. Dấu `-` nối các từ
trong cùng một tên, ví dụ `logo-box`, `search-field`.

### Công thức đặt tên class và id

Đây là quy ước riêng đang dùng cho header / footer / Auth của NomNom, không phải cú pháp
bắt buộc của HTML hay một tên mà trình duyệt tự hiểu chức năng.

```text
Khối chính:       site-{khu-vực}
Thành phần con:   site-{khu-vực}_{vai-trò}
Khung nội dung:   {khu-vực}-container
Phần dùng chung:  site-auth_{vai-trò} (hai popup)
```

Phần trong `{...}` là chỗ thay bằng tên thực tế; không gõ dấu ngoặc nhọn vào tên.

| Thành phần muốn đặt tên | Cách ghép | Tên thực tế |
| --- | --- | --- |
| Toàn bộ header | `site-` + `header` | `site-header` |
| Toàn bộ footer | `site-` + `footer` | `site-footer` |
| Logo của header | `site-header` + `_` + `logo` | `site-header_logo` |
| Khung chứa logo footer | `site-footer` + `_` + `logo-box` | `site-footer_logo-box` |
| Nhóm bản quyền / chính sách | `site-footer` + `_` + `legal` | `site-footer_legal` |
| Dòng bản quyền | `site-footer` + `_` + `copyright` | `site-footer_copyright` |
| Khung nội dung header | `header` + `-container` | `header-container` |
| Khung nội dung footer | `footer` + `-container` | `footer-container` |

Quy tắc khi tự thêm tên:

- Dùng chữ thường, tên tiếng Anh dễ hiểu, không dấu và không khoảng trắng trong một tên.
- Dùng **một dấu `_`** để ngăn tiền tố khu vực với vai trò: `site-footer_legal`.
- Dùng dấu `-` để nối các từ trong vai trò: `site-header_search-submit`.
- Chọn tên theo chức năng / nội dung; tránh tên khó nhận biết như `P1`, `P2`, `box1`.
- Không cần đưa toàn bộ tên các phần tử cha vào tên con. Dòng bản quyền dùng
  `site-footer_copyright`, không cần nối thành `site-footer_legal_copyright`.

### Khi nào dùng class, khi nào dùng id?

| Nhu cầu | Cách chọn | Ví dụ hiện có |
| --- | --- | --- |
| Định dạng một thành phần hoặc nhiều thành phần giống nhau | Dùng `class`. Class có thể lặp trong cùng trang. | `class="site-footer_legal-link"` dùng cho ba link. |
| Đánh dấu một phần tử duy nhất để tham chiếu cụ thể | Có thể dùng `id`. Mỗi id chỉ xuất hiện một lần trong cùng trang. | `id="site-header_search-bar"` được `aria-controls` tham chiếu. |

Tên id dùng cùng công thức `site-{khu-vực}_{vai-trò}`, ví dụ `site-header_login`.
Không cần thêm id cho mọi phần tử; chỉ có class vẫn có thể viết CSS và chọn bằng JS.

Trong HTML, tên class / id không có dấu `.` hoặc `#` ở đầu:

```html
<button id="site-header_login" type="button">Đăng nhập</button>
<p class="site-footer_copyright">© 2026 NomNom. All rights reserved.</p>
```

Khi viết selector trong CSS hoặc truyền vào `querySelector`, mới thêm `.` cho
class và `#` cho id:

```css
#site-header_login {
    /* CSS của nút đăng nhập */
}

.site-footer_copyright {
    /* CSS của dòng bản quyền */
}
```

### Đặt class chung và class riêng

Khi nhiều phần tử có định dạng giống nhau, dùng một class chung. Nếu cần chọn
riêng từng phần tử, thêm một class riêng, ngăn cách bằng dấu cách:

```html
<a class="site-footer_legal-link site-footer_privacy" href="#">Chính sách bảo mật</a>
<a class="site-footer_legal-link site-footer_terms" href="#">Điều khoản sử dụng</a>
```

- `site-footer_legal-link`: class chung để định dạng các link legal giống nhau.
- `site-footer_privacy`, `site-footer_terms`: class riêng theo nội dung từng link.
- Hai tên cách nhau bằng dấu cách là **hai class trên cùng một phần tử**, không
  tạo thêm phần tử HTML. Chỉ cần class riêng khi có nhu cầu phân biệt từng thành phần.

## 2. Class dùng chung cho popup

Tên dùng một dấu `_`; dấu `-` nối các từ trong vai trò.

| Nhóm | Class / id |
| --- | --- |
| Khung dùng chung | `.site-auth`, `.site-auth_form` |
| Nội dung và đầu popup | `.site-auth_content`, `.site-auth_close`, `.site-auth_logo`, `.site-auth_title` |
| Một trường | `.site-auth_field`, `.site-auth_label`, `.site-auth_input`, `.site-auth_error` |
| Mật khẩu | `.site-auth_password`, `.site-auth_password-toggle`, `.site-auth_eye-slash` |
| Tùy chọn và thông báo | `.site-auth_options`, `.site-auth_check`, `.site-auth_link`, `.site-auth_submit`, `.site-auth_status`, `.site-auth_switch` |
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

## 3. Khi tự sửa code

- Sửa phần nào thì tìm class / id tương ứng trong tài liệu của thư mục tương ứng, sau đó mở file CSS của phần đó.
- Một phần tử có thể có nhiều class: ảnh kính lúp mở tìm kiếm là một ví dụ.
- Khi đổi tên class / id, cập nhật cả HTML, CSS và selector JavaScript có sử dụng nó.
- `site-header`, `site-footer`, `site-auth`, `site-login` và `site-signup` có tiền tố riêng để dễ phân biệt khi ghép vào cùng trang.
- Những class footer chưa có rule riêng được đánh dấu trong [footer.md](footer.md#2-class-của-footer).

Đây là bản tra cứu tĩnh. Khi thêm, xóa hoặc đổi tên class / id trong code, cập nhật
lại bảng và sơ đồ tương ứng để tài liệu tiếp tục khớp với code.
