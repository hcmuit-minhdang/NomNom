# Review thư mục footer

[Tổng quan](../README.md) · [Header](header.md) · [Footer](footer.md) · [Login](login.md) · [Signup](signup.md) · [Quy ước chung](class-id.md) · [Nhật ký AI](lich-su-ai.md)

Nguồn: [index.html](../footer/index.html), [style.css](../footer/style.css). Mở [bản xem thử](../footer/index.html) bằng Live Server và so với [trang chủ đã ghép](../../Thach/Home-page/index.html).

Footer hiện gồm thương hiệu, ba nhóm liên kết và hàng bản quyền/chính sách. Phần này dùng HTML/CSS; chưa có `footer.js`. Cách đặt tên xem [quy ước chung](class-id.md), cách ghép xem [README](../README.md#ghép-thủ-công).

## 1. Cấu trúc HTML

```text
footer.site-footer
├── svg.site-footer_divider
├── div.footer-container
│   ├── div.site-footer_brand
│   │   ├── div.site-footer_logo-box
│   │   │   └── a → img.site-footer_logo
│   │   ├── h2.site-footer_tagline
│   │   └── p.site-footer_description
│   ├── div.site-footer_recipes
│   │   ├── h2.site-footer_heading
│   │   │   └── svg.site-footer_heading-line
│   │   └── nav.site-footer_links
│   ├── div.site-footer_about
│   │   ├── h2.site-footer_heading
│   │   │   └── svg.site-footer_heading-line
│   │   └── nav.site-footer_links
│   └── div.site-footer_contact
│       ├── h2.site-footer_heading
│       │   └── svg.site-footer_heading-line
│       └── nav.site-footer_links
└── div.site-footer_legal
    ├── p.site-footer_copyright
    ├── a.site-footer_legal-link.site-footer_privacy
    ├── a.site-footer_legal-link.site-footer_terms
    └── a.site-footer_legal-link.site-footer_accessibility
```

## 2. Class của footer

"Có CSS riêng" nghĩa là đã có rule cho chính class đó trong `footer/style.css`.
Class chưa có rule vẫn có thể chịu định dạng mặc định, kế thừa hoặc bố cục từ cha.

| Class / selector | Phần tử | Vai trò | Có CSS riêng? |
| --- | --- | --- | --- |
| `.site-footer` | `footer` | Toàn bộ footer: font, kích thước, căn nội dung và mốc đặt đường phân cách phía trên. | Có |
| `.footer-container` | `div` | Khung chung chứa bốn cột nội dung. | Có |
| `.site-footer_brand` | `div` | Cột thương hiệu: logo, câu giới thiệu ngắn và đoạn mô tả; rộng tối đa 400px; từ 600px trở xuống xếp dọc cùng các khối còn lại. | Có |
| `.site-footer_logo-box` | `div` | Khung chứa link và ảnh logo. | Có |
| `.site-footer_logo` | `img` | Ảnh logo: kích thước và góc xoay. | Có |
| `.site-footer_tagline` | `h2` | Câu “Ăn ngon trọn vị, chi tiêu hợp lý.” | Chưa |
| `.site-footer_description` | `p` | Đoạn mô tả về NomNom. | Chưa |
| `.site-footer_recipes` | `div` | Cột Công thức. | Chưa |
| `.site-footer_about` | `div` | Cột Giới thiệu. | Chưa |
| `.site-footer_contact` | `div` | Cột Liên hệ, gồm các link mạng xã hội. | Chưa |
| `.site-footer_heading` | `h2` | Tiêu đề dùng chung cho ba cột Công thức / Giới thiệu / Liên hệ. | Chưa |
| `.site-footer_links` | `nav` | Nhóm link trong mỗi cột; hiện đang xếp theo chiều dọc. | Có |
| `.site-footer_legal` | `div` | Khối chứa dòng bản quyền và ba link chính sách / hỗ trợ tiếp cận; nằm sau `footer-container` trong luồng bố cục và được phép xuống hàng. | Có |
| `.site-footer_copyright` | `p` | Dòng “© 2026 NomNom. All rights reserved.”; bỏ margin mặc định để dùng khoảng cách chung của khối legal. | Có |
| `.site-footer_legal-link` | `a` | Class dùng chung cho cả ba link trong khối legal để đặt font, màu, khoảng cách hoặc hiệu ứng giống nhau. | Chưa |
| `.site-footer_privacy` | `a` | Class riêng của link Chính sách bảo mật. | Chưa |
| `.site-footer_terms` | `a` | Class riêng của link Điều khoản sử dụng. | Chưa |
| `.site-footer_accessibility` | `a` | Class riêng của link Hỗ trợ tiếp cận. | Chưa |
| `.site-footer_divider` | `svg` | Đường phân cách xám phía trên footer; dài 1252px, dày 1px, màu `#DEDEDE`, cách đỉnh footer 30px. | Có |
| `.site-footer_heading-line` | `svg` | Nét vàng dùng chung bên trong ba tiêu đề; dài 32px, dày 3px, màu `#FBC41C`, cách chữ 12px. | Có |

Mỗi link legal có **hai class**: `site-footer_legal-link` để định dạng chung và
một class riêng để chọn đúng link khi cần. Ví dụ:

```html
<a class="site-footer_legal-link site-footer_privacy" href="#">Chính sách bảo mật</a>
```

Khối legal đã có CSS bố trí chung. Các class con riêng vẫn để bạn định dạng thêm khi cần.

## 3. CSS: layout và responsive

Đối chiếu với [footer/style.css](../footer/style.css), hiện chỉ có mốc **600px**:

| Chiều rộng vùng hiển thị | Bố cục hiện có |
| --- | --- |
| Trên 600px | Bốn khối nằm cùng một hàng ngang; khối thương hiệu rộng tối đa 400px. |
| Từ 600px trở xuống | Bốn khối xếp dọc, cách nhau 24px. |

CSS mặc định đặt trước, `@media (max-width: 600px)` đặt sau để ghi đè các thuộc
tính tương ứng khi màn hình hẹp. Mốc tablet 1000px từng được đề xuất nhưng **chưa có
trong CSS hiện tại**; không dùng bản đề xuất làm mô tả của code đang chạy.

- Footer rộng 100%, dùng `height: auto`, `min-height: 418px`, nền trắng.
- `.footer-container` có `max-width: 1252px`, chiều cao theo nội dung.
- Ở mốc 600px, `flex-direction: column` chuyển các khối sang chiều dọc; `flex`
  của từng khối được đặt lại để kích thước theo nội dung.
- `.site-footer_legal` nằm trong luồng bố cục, `max-width: 700px`, được xuống hàng
  bằng `flex-wrap: wrap`; chiều cao footer tăng theo phần legal.
- Chỉnh khoảng cách qua `gap` / `padding`, không tăng chiều rộng quá 100% để bù bố cục.

## 4. SVG: các đường kẻ

Thông số lấy từ component **Footer Full → Footer / NomNom**:

| Layer Figma | Class | Chiều dài | Độ dày | Màu | Vị trí / khoảng cách |
| --- | --- | --- | --- | --- | --- |
| Divider / Top | `.site-footer_divider` | 1252px | 1px | `#DEDEDE` | Cách đỉnh footer 30px, căn giữa ngang. |
| Accent / Egg yellow | `.site-footer_heading-line` | 32px | 3px | `#FBC41C` | Nằm dưới chữ tiêu đề, cách 12px. |

Mỗi SVG chứa một `<rect width="100%" height="100%" fill="currentColor" />`, tương
ứng với hình chữ nhật mỏng trong Figma. Bạn sửa trực tiếp trong `footer/style.css`:

- `width`: chiều dài đường kẻ.
- `height`: độ dày đường kẻ.
- `color`: màu của hình chữ nhật; `currentColor` lấy màu từ thuộc tính này.
- `top` của `.site-footer_divider`: vị trí đường xám so với đỉnh footer.
- `margin-top` của `.site-footer_heading-line`: khoảng cách nét vàng với chữ.

Không cần sửa tọa độ hay `path` khi thay kích thước. Đường xám có `max-width`
để tự thu ngắn theo footer khi khung hiển thị hẹp. Các SVG là trang trí, nên có
`aria-hidden="true"` và không tham gia điều hướng bằng bàn phím.

## 5. Id và liên kết

- Footer hiện **không có id**.
- Logo footer đang có `data-header-route="home"`, nhưng `header.js` chỉ tìm link
  bên trong header. Logo footer hiện điều hướng bằng chính `href` đã viết trong HTML.
- Các icon mạng xã hội hiện chưa có class riêng; không có tên class icon nào cần tra thêm.


## 6. Các đoạn cần hiểu khi review

### Khoảng cách và vị trí

```css
.site-footer {
    position: relative;
    padding: 67px 24px 24px;
}

.site-footer_divider {
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
}
```

- `relative` tạo mốc cho đường phân cách `absolute` bên trong.
- `top: 30px` tính từ đỉnh footer; `left: 50%` kết hợp `translateX(-50%)` để căn giữa đường kẻ.
- `padding` là khoảng trống **bên trong** footer. Khoảng trống giữa main và footer
  còn có thể đến từ `margin-bottom` của khối cuối main; cần xem phần tử gây ra nó.
- Hàng `.site-footer_legal` dùng `position: static` để góp vào chiều cao bố cục,
  tránh đè lên nội dung khi chữ xuống hàng.
- `gap` tạo khoảng cách giữa các phần tử Flex; `flex-wrap: wrap` cho phép hàng
  bản quyền xuống dòng. Việc này khác với xếp dọc bốn khối ở media 600px.

### Có cần JavaScript không?

Hiện liên kết và bố cục footer chưa cần JS. Các `href="#"` là vị trí chờ URL thật,
không phải trang đích đã hoàn thiện. Chỉ thêm JS khi đã xác định hành vi cụ thể.

## 7. Checklist tự review

- [ ] So bản xem thử và bản đã ghép: logo, font, lề và khoảng cách có bị CSS trang chủ ảnh hưởng không?
- [ ] Xem ở 1440, 768, 600 và 375px: chữ có tràn hoặc cột bị bóp quá hẹp không?
- [ ] Đường xám/nét vàng đúng màu, chiều dài, độ dày và vị trí chưa?
- [ ] Hàng bản quyền nằm sau nội dung, xuống dòng được và không chồng lên các cột?
- [ ] Link nào đã có URL thật, link nào còn `#`? Đường dẫn ảnh/icon còn đúng khi ghép?
- [ ] Khi đổi hoặc thêm class, cập nhật bảng trong tài liệu này.

### Tự giải thích

Vì sao footer dùng `height: auto` cùng `min-height`? Khi nào nên chỉnh `padding`,
`gap` hoặc `margin`? Vì sao đường kẻ dùng SVG có `currentColor` lại dễ sửa?
