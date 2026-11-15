# Review thư mục signup

[Tổng quan](../README.md) · [Header](header.md) · [Footer](footer.md) · [Login](login.md) · [Signup](signup.md) · [Quy ước chung](class-id.md) · [Nhật ký AI](lich-su-ai.md)


## 1. File và phạm vi hiện tại

| File | Vai trò |
| --- | --- |
| [index.html](../signup/index.html) | Trang xem thử mở sẵn Signup; chứa cả hai popup. |
| [signup.css](../signup/signup.css) | Chiều rộng, khoảng cách trường và phần điều khoản riêng của Signup. |
| [signup.js](../signup/signup.js) | Kiểm tra xác nhận mật khẩu và submit Signup. |
| [login.css](../login/login.css) | Font, dialog, ô nhập, nút và responsive dùng chung. |
| [auth.js](../auth.js) | Vòng đời popup, focus, nút mắt, câu lỗi và thông báo chung. |

Nguồn thiết kế: [Sign_PopUp trong Figma](https://www.figma.com/design/1XVDA0jnedoKuCL9rYodr7/IE104?node-id=229-2837),
khung gốc 411 × 551px. Nội dung/lỗi có thể làm popup cao thêm.
Hiện form chưa tạo tài khoản; demo và xác thực thật làm sau.
Kết quả kiểm tra cũ nằm ở [nhật ký AI](lich-su-ai.md#login-và-signup).

## 2. HTML và class/id riêng

```text
dialog.site-auth.site-signup#site-signup_dialog
└── div.site-auth_content
    ├── button.site-auth_close
    ├── img.site-auth_logo
    ├── h2.site-auth_title#site-signup_title
    └── form.site-auth_form.site-signup_form
        ├── Tên tài khoản + câu lỗi
        ├── Email + câu lỗi
        ├── Mật khẩu + nút mắt + câu lỗi
        ├── Xác nhận mật khẩu + nút mắt + câu lỗi
        ├── div.site-auth_field.site-signup_terms
        ├── button.site-auth_submit
        └── p.site-auth_status
```

| Thành phần | Class / id | Cần nhớ |
| --- | --- | --- |
| Popup | `.site-signup`, `#site-signup_dialog` | Được tìm bằng `data-nomnom-signup`. |
| Tiêu đề | `#site-signup_title` | `aria-labelledby` của dialog trỏ tới đây. |
| Form | `.site-signup_form` | Điểm bắt đầu của `signup.js`. |
| Tên tài khoản | `#site-signup_username` | `name="username"`, bắt buộc, được trim. |
| Email | `#site-signup_email` | `name="email"`, `type="email"`, bắt buộc, được trim. |
| Mật khẩu | `#site-signup_password` | `name="password"`, bắt buộc, giữ nguyên giá trị. |
| Xác nhận | `#site-signup_confirm-password` | `name="confirmPassword"`, phải trùng mật khẩu. |
| Điều khoản | `.site-signup_terms`, `#site-signup_terms` | Checkbox `terms` bắt buộc. |
| Lỗi từng trường | `#site-signup_username-error`, `#site-signup_email-error`, `#site-signup_password-error`, `#site-signup_confirm-password-error`, `#site-signup_terms-error` | Input dùng `aria-describedby` để tham chiếu. |

Các class `.site-auth_*` được tra tại [quy ước và class chung](class-id.md#2-class-dùng-chung-cho-popup).
Chỉ đổi id khi cập nhật cả label, vùng lỗi và `aria-controls` của nút mắt liên quan.

## 3. CSS cần hiểu

| Selector | Phần riêng trong signup.css |
| --- | --- |
| `.site-signup` | Chiều rộng 411px. |
| `.site-signup .site-auth_content` | Chiều cao nội dung tối thiểu 549px, padding dưới 16px. |
| `.site-signup .site-auth_form` | Khoảng cách giữa các trường `gap: 8px`. |
| `.site-signup .site-auth_field` | Khoảng cách bên trong mỗi trường `gap: 2px`. |
| `.site-signup_terms` | Chữ điều khoản 12px, giãn dòng 1.5. |

Các quy tắc còn lại đến từ `login.css`. Không đặt chiều cao cố định cho dialog:
`max-height` và `overflow: auto` trong CSS chung giúp cuộn khi có lỗi hoặc màn hình thấp.
Ở màn hình tối đa 480px, ô nhập dùng chiều cao 44px và padding ngang popup được thu lại.

## 4. JavaScript cần hiểu

`signup.js` tìm form, lấy `form.elements.password` và `form.elements.confirmPassword`.
Hàm kiểm tra chính đang dùng:

```js
function checkConfirmation() {
    const mismatch = confirmation.value && confirmation.value !== password.value;
    confirmation.setCustomValidity(mismatch ? "Mật khẩu xác nhận chưa trùng khớp." : "");
    if (confirmation.hasAttribute("aria-invalid")) {
        confirmation.dispatchEvent(new Event("change", { bubbles: true }));
    }
}
```

- `&&` chỉ xét khác nhau khi ô xác nhận có giá trị; ô trống được `required` xử lý.
- `!==` so sánh hai giá trị; ở đây so sánh nguyên chuỗi mật khẩu.
- `điềuKiện ? A : B` chọn câu lỗi nếu không khớp, hoặc chuỗi rỗng nếu khớp.
- `setCustomValidity("")` xóa lỗi tự đặt. Nếu quên xóa, trình duyệt vẫn coi ô là lỗi.
- Sự kiện `input` trên cả hai ô gọi hàm này để xử lý cả khi mật khẩu gốc bị sửa.
- `new Event("change", { bubbles: true })` tạo sự kiện đi lên form để phần chung
  trong `auth.js` cập nhật lại câu lỗi xác nhận đang hiển thị.

Khi submit, JS chặn gửi mặc định, kiểm tra lại xác nhận (kể cả tự điền), rồi gọi
`NomNomAuth.validateForm(form)` để kiểm tra các trường bắt buộc, email và checkbox.
Khi hợp lệ, form chỉ hiện thông báo; không tạo tài khoản hoặc phát trạng thái thành viên.
Tên/email được trim, mật khẩu giữ nguyên. Không có quy tắc độ mạnh mật khẩu bổ sung ở giai đoạn này.

## 5. Popup và cách ghép

Dấu X, Escape, nền ngoài, nút mắt, khóa cuộn và trả focus do `auth.js` xử lý.
Đọc [điều phối popup dùng chung](login.md#4-điều-phối-popup-dùng-chung) và
[cách ghép](login.md#5-ghép-vào-trang-khác). Cần cả hai CSS và ba JS; chỉ nạp
`signup.css` / `signup.js` sẽ thiếu kiểu và hàm chung.

Copy cả hai dialog trong đoạn `NOMNOM AUTH START` / `NOMNOM AUTH END`. Không copy
`data-auth-preview` sang trang sản phẩm. Khi đóng/chuyển popup, mật khẩu, checkbox
và lỗi bị xóa; tên/email chỉ giữ trong DOM hiện tại. Điều khoản/chính sách mới hiện
thông báo chờ tích hợp, chưa điều hướng đến trang nội dung thật.

## 6. Checklist tự review

- [ ] Mở Signup nhận focus vào tên tài khoản; chỉ một popup mở?
- [ ] Bỏ trống từng trường hoặc nhập tên chỉ có khoảng trắng: báo lỗi đúng?
- [ ] Email sai, mật khẩu khác xác nhận, chưa đồng ý điều khoản: đều bị chặn?
- [ ] Sửa mật khẩu gốc sau khi xác nhận: câu lỗi có cập nhật ngay không?
- [ ] Sửa cho hai mật khẩu khớp lại: lỗi tự đặt có được xóa không?
- [ ] Hai nút mắt hoạt động riêng, không thay giá trị và không gửi form?
- [ ] Nhấn Enter và nút Đăng Ký dùng cùng kiểm tra; form hợp lệ chưa đổi header sang thành viên?
- [ ] Điều khoản/chính sách có phản hồi chờ tích hợp; đóng popup xóa checkbox và hai mật khẩu?
- [ ] Xem 320/375px, màn hình thấp và trạng thái nhiều lỗi: cuộn được, không tràn ngang?
- [ ] Thử Tab/Shift+Tab, Escape, bấm nền và kiểm tra focus sau khi đóng?

### Tự giải thích

Tại sao phải nghe `input` ở cả hai ô mật khẩu? Vì sao dùng `setCustomValidity("")`
khi hợp lệ? `bubbles: true` giúp phần nào nhận được sự kiện? Chọn checkbox điều khoản
có đồng nghĩa với tạo tài khoản thật không?
