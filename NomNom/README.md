# NomNom — Bộ khung frontend dùng chung

HTML + CSS + JavaScript thuần, không framework, không cần npm hoặc bước build. Font Inter và ảnh/icon được lưu trong dự án nên không cần tải từ mạng lúc chạy.

## Mở xem

Mở `index.html` bằng trình duyệt, hoặc mở thư mục **NomNom** trong VS Code và chạy Live Server. Chọn một trong hai mẫu:

- `templates/pages.html`: header đã đăng nhập, có Góc của tôi.
- `templates/guest.html`: header chưa đăng nhập, có Đăng ký/Đăng nhập.

Đây là hai bản giao diện, không có phiên đăng nhập thật.

## Cấu trúc

```text
NomNom/
├── index.html              # Trang chọn mẫu, không phải trang chủ sản phẩm
├── assets/
│   ├── fonts/              # Inter variable + giấy phép OFL
│   ├── images/logo.png
│   └── icons/              # Icon gốc từ Figma
├── css/common.css          # Font, nền tảng, header, footer, nút, responsive
├── js/main.js              # Menu mobile, dropdown, điểm nối tạm
├── templates/
│   ├── page.html           # Mẫu có Góc của tôi
│   ├── guest.html          # Mẫu có Đăng ký/Đăng nhập
│   └── demo.css            # Chỉ trang trí nội dung minh họa trong main
├── .gitignore
└── README.md
```

Header/footer nằm trực tiếp trong HTML, không dùng fetch để chèn. `common.css` dùng chung. Khi thay cấu trúc hoặc chữ trong header/footer, cập nhật cả hai mẫu và các trang đã chép chúng.

## Tạo trang riêng: ví dụ About Us

1. Tạo `aboutus/`, chép `templates/pages.html` thành `aboutus/index.html`.
2. Tạo `aboutus/aboutus.css`.
3. Đổi title thành `Về chúng tôi — NomNom`.
4. Đổi `<body class="template-page">` thành `<body class="about-page">`.
5. Thay liên kết `demo.css` bằng `aboutus.css`. Giữ `../css/common.css` đứng trước.
6. Giữ header/footer, thay toàn bộ nội dung `main`. Bỏ class `template-demo`, giữ id `main-content` để liên kết bỏ qua menu hoạt động.
7. Thêm nội dung trang và CSS riêng có phạm vi `.about-page ...`.

Ví dụ phần main mới:

```html
<main id="main-content" class="container" tabindex="-1">
    <h1>Về chúng tôi</h1>
</main>
```

Với User, tạo `user/index.html`, `saved.html`, `uploaded.html`, `reviewed.html`, `history.html`, `account.html`. Dùng class `user-page`, cùng nối `user.css`; script riêng nếu cần là `user.js`. Trang tài khoản không bắt buộc có banner/tab như các màn còn lại.

Mẫu hiện ở một cấp thư mục dưới root; chép sang `aboutus` hoặc `user` vẫn giữ đúng đường dẫn `../`. Nếu lồng sâu hơn, điều chỉnh đường dẫn. Đường dẫn ảnh/font trong CSS tính từ file CSS.

## Nối liên kết và chức năng thật

Nhóm chưa chốt tên đường dẫn nên bộ khung không tạo hàng loạt trang rỗng hoặc trỏ tới trang không tồn tại. Các đích đến còn thiếu dùng `data-pending` và một hộp thông báo rõ ràng.

Ví dụ đổi liên kết About Us:

```html
<!-- Trước -->
<a href="#pending-dialog" data-pending="Về NomNom">Về NomNom</a>

<!-- Sau: đã có trang aboutus/index.html -->
<a href="../aboutus/index.html">Về NomNom</a>
```

Phải **bỏ data-pending**, nếu không JavaScript vẫn mở hộp thông báo. Cập nhật các vị trí tương ứng trong header và footer. Với trang hiện tại, có thể thêm `aria-current="page"` vào link tương ứng.

Nút tìm kiếm hiện mở thông báo chưa tích hợp. Khi có form/trang tìm kiếm, bỏ `data-pending` rồi nối chức năng của người phụ trách. Tương tự Đăng ký/Đăng nhập. Không có tìm kiếm, đăng nhập, đăng ký hay cơ sở dữ liệu thật trong bộ này.

Các liên kết mạng xã hội cần URL chính thức của nhóm; không tự đoán tài khoản. Các trang chính sách/hỗ trợ trong Figma cũng là điểm nối tạm, không ngầm mở rộng phân công.

Khi mọi điểm nối đã hoàn thành, xóa dialog `pending-dialog`, khối JS xử lý `[data-pending]` và CSS `.site-dialog` nếu không còn dùng.

## Phần nào được dùng chung?

| File | Vai trò | Người sửa |
| --- | --- | --- |
| common.css | Font Inter, màu, container, header/footer/nút | Người điều phối phần chung, thay đổi qua trao đổi/PR |
| main.js | Mở/đóng menu; tương tác dùng chung | Người điều phối phần chung |
| CSS/JS trong thư mục trang | Giao diện và hành vi riêng | Người phụ trách trang |
| templates | Bản mẫu chuẩn của phần chung | Đồng bộ khi sửa HTML chung |

Không viết hero About Us hoặc banner User trong common.css. Không tự đổi `.container` vì một trang cần rộng hơn; tạo class riêng hoặc đề xuất điều chỉnh chung. Không dùng selector rộng như `header`, `section`, `h2` trong CSS riêng. Không dùng `!important` để ép thắng nhau.

## Các đoạn cần hiểu để báo cáo

1. **@font-face** tải Inter từ file; `:root` giữ màu và chiều rộng dùng lại bằng `var(...)`.
2. **Box model**: `box-sizing: border-box` tính cả padding/viền trong chiều rộng khai báo.
3. **Flexbox header**: `justify-content: space-between` chia logo và menu; `align-items: center` căn dọc.
4. **Dropdown**: HTML `details/summary` tự mở/đóng bằng click hoặc bàn phím. JS đóng các dropdown khác và xử lý Escape/click bên ngoài.
5. **Grid footer**: cột thương hiệu và ba nhóm link; media query đổi bố cục khi màn hình hẹp.
6. **Menu mobile**: JS đổi class `is-open` và `aria-expanded`. Nếu JS chưa chạy, menu vẫn hiển thị để không mất các liên kết.
7. **Dialog**: `showModal()` mở; form `method="dialog"` đóng. Không dùng hộp này giả làm chức năng tài khoản.
8. **Logo**: wrapper cắt ảnh và xoay theo Figma, không sửa file ảnh gốc.

## Phạm vi thiết kế và các điểm nhóm cần chốt

Nguồn: [Figma IE104](https://www.figma.com/design/1XVDA0jnedoKuCL9rYodr7/IE104?node-id=0-1).

- Header member: `108:840`; guest: `193:3237`; footer trắng: `307:2373`.
- Logo, tìm kiếm và icon mạng xã hội là tài nguyên xuất từ Figma đã tải vào assets.
- Font: [Inter trong Google Fonts](https://github.com/google/fonts/tree/main/ofl/inter), giấy phép trong `assets/fonts/OFL.txt`.
- Figma hết hạn mức đọc khi kiểm tra các menu con; nội dung dropdown hiện là **đề xuất ghép trang**, không cam kết giống từng mục của dropdown gốc. Cần đối chiếu khi nhóm chốt menu.
- Không có thư viện component React trong dự án; mũi tên dropdown được làm bằng CSS và phần tử HTML thuần.
- Responsive và nội dung minh họa giữa trang là bổ sung cho bộ khung, không phải một frame sản phẩm mới trong Figma.
- About Us hiện có header/footer riêng khác mẫu chung. Nhóm cần quyết định dùng mẫu chung hay giữ biến thể trước khi ghép trang đó.
- Chưa tạo nội dung About Us/User và chưa đẩy lên GitHub.

## Quy trình fork và PR

1. Đưa bộ khung được nhóm duyệt vào main của repo gốc.
2. Thành viên fork hoặc đồng bộ fork hiện có từ repo gốc.
3. Tạo nhánh như `feat/about-us`, `feat/user-pages` trong fork.
4. Làm phần riêng, kiểm tra, commit rồi push lên nhánh của fork.
5. Gửi PR về main repo gốc; mô tả trang đã làm, cách kiểm tra và file chung đã sửa nếu có.
6. Người tích hợp review rồi merge; nhóm đồng bộ trước khi làm tiếp.

Nếu repo gốc có yêu cầu PR cho main thì dùng PR cả với bộ khung. Không xóa `.git` hoặc thay file của thành viên khác khi chép bộ này vào repo đang có.

## Kiểm tra đã thực hiện

- Hai mẫu ở chiều rộng 1600, 1024, 768 và 390px: không tràn ngang.
- Font Inter tải từ local; ảnh đều tải thành công.
- Menu mobile mở/đóng; dropdown mở và đóng bằng Escape; hộp điểm nối tạm mở/đóng.
- Không có lỗi JavaScript được ghi nhận trong các lượt kiểm tra.
- Xem ảnh chụp desktop/mobile để kiểm tra logo và footer.

Nhóm vẫn cần kiểm tra lại sau khi thêm nội dung hoặc đổi link. Đây là bộ nền để phát triển tiếp, không phải frontend đầy đủ của website.

