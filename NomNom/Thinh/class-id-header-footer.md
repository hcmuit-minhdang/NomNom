# Tra cứu class và id — Header & Footer

Tổng hợp theo code hiện tại: **20 class trong HTML, 2 class trạng thái do JS thêm
và 5 id của header**, **20 class của footer**. Footer hiện chưa có id.
Các tên dưới đây là thành phần đang dùng, không phải danh sách cần tạo thêm.

## 1. Cách đọc

| Trong HTML | Selector trong CSS / JavaScript | Ý nghĩa |
| --- | --- | --- |
| `class="site-header_logo"` | `.site-header_logo` | Chọn phần tử có class này; một class có thể dùng cho nhiều phần tử. |
| `id="site-header_login"` | `#site-header_login` | Chọn phần tử có id này; id phải duy nhất trong một trang. |
| `data-header-guest` | `[data-header-guest]` | Chọn theo thuộc tính; đây không phải class hay id. |

Quy ước: tên khối là `site-header` / `site-footer`; tên phần con dùng **một dấu
gạch dưới `_`**, ví dụ `site-header_logo`, `site-footer_brand`. Dấu `-` nối các từ
trong cùng một tên, ví dụ `logo-box`, `search-field`.

### Công thức đặt tên class và id

Đây là quy ước riêng đang dùng cho header / footer của NomNom, không phải cú pháp
bắt buộc của HTML hay một tên mà trình duyệt tự hiểu chức năng.

```text
Khối chính:       site-{khu-vực}
Thành phần con:   site-{khu-vực}_{vai-trò}
Khung nội dung:   {khu-vực}-container
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

## 2. Header

Nguồn: [HTML khách](header/index.html), [HTML thành viên](<header/ed - index.html>),
[CSS](header/style.css), [JavaScript](header/header.js).

### Sơ đồ các khối chính

```text
header.site-header
├── div.header-container
│   ├── div.site-header_logo-box
│   │   └── a → img.site-header_logo
│   ├── button.site-header_menu-toggle[data-header-menu-toggle]
│   │   └── span.site-header_menu-icon → ba nét của nút Menu
│   └── div.site-header_controls#site-header_controls
│       ├── div.site-header_navigation
│       │   ├── div.site-header_nav-item → Công thức
│       │   ├── div.site-header_nav-item → Về chúng tôi
│       │   ├── div.site-header_nav-item#site-header_categories
│       │   └── div.site-header_nav-item[data-header-member] → Góc của tôi
│       └── div.site-header_actions
│           ├── div.site-header_auth[data-header-guest]
│           │   ├── button#site-header_signup
│           │   └── button#site-header_login
│           └── details.site-header_search
│               ├── summary → Icon mở / đóng + span.site-header_search-label
│               └── div#site-header_search-bar
│                   └── form.site-header_search-field
│                       ├── input[name="q"]
│                       └── button.site-header_search-submit
└── p.site-header_status
```

### Toàn bộ class của header

| Class / selector | Phần tử | Vai trò / phần giao diện được điều khiển |
| --- | --- | --- |
| `.site-header` | `header` | Toàn bộ thanh header: nền, chiều cao, font, bóng đổ và vị trí gốc cho thanh tìm kiếm. |
| `.header-container` | `div` | Khung nội dung: giới hạn chiều rộng, padding hai bên và khoảng cách giữa logo với các nhóm điều khiển. |
| `.site-header_logo-box` | `div` | Khung chứa link và ảnh logo. |
| `.site-header_logo` | `img` | Ảnh logo: kích thước và góc xoay. |
| `.site-header_controls` | `div` | Nhóm bên phải logo, chứa điều hướng và các hành động tài khoản / tìm kiếm. |
| `.site-header_menu-toggle` | `button` | Nút mở / đóng Menu trên màn hình từ 1000px trở xuống. |
| `.site-header_menu-icon` | `span` | Ba nét CSS chuyển thành dấu X khi Menu mở. |
| `.site-header_navigation` | `div` | Nhóm Công thức, Về chúng tôi, Danh mục và Góc của tôi. |
| `.site-header_nav-item` | `div` | Một mục trong nhóm điều hướng; dùng lặp lại cho cả bốn mục. |
| `.site-header_arrow` | `img` | Mũi tên cạnh tên menu; CSS đổi màu khi dropdown mở. |
| `.site-header_actions` | `div` | Nhóm chứa nút đăng ký / đăng nhập và khối tìm kiếm. |
| `.site-header_auth` | `div` | Nhóm hai nút Đăng ký và Đăng nhập. |
| `.site-header_search` | `details` | Toàn bộ khối tìm kiếm có thể mở / đóng. JavaScript dùng class này để tìm khối tìm kiếm. |
| `.site-header_search-icon` | `img` | Đặt kích thước cho hình kính lúp dùng để mở tìm kiếm. |
| `.site-header_search-open-icon` | `img` | Đánh dấu hình kính lúp để CSS ẩn nó khi tìm kiếm mở. Cùng nằm trên ảnh có class `site-header_search-icon`. |
| `.site-header_search-close-icon` | `img` | Hình dấu X; hiện khi khối tìm kiếm mở. |
| `.site-header_search-label` | `span` | Nhãn Tìm công thức, hiện trong Menu trên màn hình nhỏ. |
| `.site-header_search-field` | `form` | Khung nhập tìm kiếm: chiều rộng, border, bóng và bố trí input / nút gửi. |
| `.site-header_search-submit` | `button` | Nút kính lúp bên trong form để gửi tìm kiếm. |
| `.site-header_status` | `p` | Vùng thông báo chờ tích hợp, mặc định ẩn; JavaScript cập nhật nội dung và trạng thái hiển thị. |
| `.site-header_menu-open` | `header`, JS thêm / xóa | Trạng thái Menu nhỏ đang mở; điều khiển panel và hình dấu X. |
| `.site-header_hidden` | `header`, JS thêm / xóa | Trạng thái tự ẩn sau 4 giây không tương tác. |

### Toàn bộ id của header

| Id / selector | Phần tử | Vai trò |
| --- | --- | --- |
| `#site-header_categories` | `div.site-header_nav-item` | Xác định riêng mục Danh mục để CSS đặt kích thước / căn link. |
| `#site-header_signup` | `button` | Nút Đăng ký, có màu nền và bóng riêng. |
| `#site-header_login` | `button` | Nút Đăng nhập, có màu nền và bóng riêng. |
| `#site-header_search-bar` | `div` | Vùng mở rộng phía dưới header, chứa form tìm kiếm. |
| `#site-header_controls` | `div` | Vùng điều khiển được nút Menu tham chiếu bằng `aria-controls`. |

`aria-controls="site-header_search-bar"` trên `summary` trỏ đến id vùng tìm kiếm.
Nếu đổi id này, phải đổi cả giá trị `aria-controls`.

### Các thuộc tính liên quan đến JavaScript

| Thuộc tính / selector | Nằm ở đâu | Vai trò |
| --- | --- | --- |
| `[data-nomnom-header]` | `header.site-header` | Điểm bắt đầu để `header.js` tìm và khởi tạo header. |
| `[data-header-menu-toggle]` | `button.site-header_menu-toggle` | Điểm để JS tìm nút Menu. |
| `[data-header-guest]` | `div.site-header_auth` | Đánh dấu nhóm dành cho khách. |
| `[data-header-member]` | `div.site-header_nav-item` | Đánh dấu nhóm Góc của tôi dành cho thành viên. |
| `[data-header-route]` | Các link điều hướng | Chứa khóa đường dẫn như `home`, `search`, `about`, `saved` để JavaScript cập nhật `href`. |
| `[data-header-action]` | Các nút điều hướng chưa có trang đích | Chứa hành động `ingredients`, `random`, `collections`, `guide`, `faq`, `contact`. |
| `[data-auth-action]` | Nút đăng ký, đăng nhập, đăng xuất | Chứa hành động `signup`, `login`, `logout` để gửi cho phần tài khoản. |
| `data-initialized` | Được JavaScript thêm vào `header` lúc chạy | Đánh dấu header đã khởi tạo để tránh gắn sự kiện lặp. |

`hidden` là thuộc tính ẩn phần tử. Bản HTML khách ẩn nhóm thành viên; bản HTML
thành viên ẩn nhóm khách. Cả hai bản có cùng bộ class / id và dùng chung CSS / JS.
Khi ghép vào một trang, chỉ chép **một bản header** để tránh trùng id.

Các selector trạng thái thường gặp trong CSS:

| Selector | Đọc là |
| --- | --- |
| `.site-header_search[open]` | Khối tìm kiếm đang mở. |
| `.site-header_navigation details[open]` | Dropdown đang mở trong nhóm điều hướng. |
| `[data-nomnom-header] [hidden]` | Phần tử có thuộc tính `hidden` nằm bên trong header. |
| `#site-header_login:hover` | Nút đăng nhập khi con trỏ chuột đặt lên nó. |
| `.site-header_search-field:focus-within` | Form tìm kiếm khi một phần tử bên trong đang nhận focus. |
| `.site-header.site-header_menu-open` | Header đang mở Menu trên màn hình nhỏ. |
| `.site-header.site-header_hidden` | Header đang trượt lên để ẩn. |

`inert` được JS bật trên `#site-header_controls` khi Menu nhỏ đóng: các mục bên
trong không nhận click hoặc Tab. Đọc cách chỉnh thời gian, media và hiệu ứng tại
[AI thao tác — Header](header/HISTORY.md).

## 3. Footer

Nguồn: [HTML](footer/index.html), [CSS](footer/style.css).

### Sơ đồ các khối chính

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

### Toàn bộ class của footer

"Có CSS riêng" nghĩa là đã có rule cho chính class đó trong `footer/style.css`.
Class chưa có rule vẫn có thể chịu định dạng mặc định, kế thừa hoặc bố cục từ cha.

| Class / selector | Phần tử | Vai trò | Có CSS riêng? |
| --- | --- | --- | --- |
| `.site-footer` | `footer` | Toàn bộ footer: font, kích thước, căn nội dung và mốc đặt đường phân cách phía trên. | Có |
| `.footer-container` | `div` | Khung chung chứa bốn cột nội dung. | Có |
| `.site-footer_brand` | `div` | Cột thương hiệu: logo, câu giới thiệu ngắn và đoạn mô tả; tối đa 400px trên màn hình rộng, chiếm cả hàng khi màn hình từ 1000px trở xuống. | Có |
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

### Media query và bố cục footer

Các mốc đang dùng trong `footer/style.css`:

| Chiều rộng vùng hiển thị | Bố cục |
| --- | --- |
| Trên 1000px | Bốn cột nội dung nằm trên cùng một hàng. Thương hiệu rộng tối đa 400px. |
| Trên 600px đến 1000px | Thương hiệu chiếm một hàng; ba nhóm Công thức / Giới thiệu / Liên hệ nằm ở hàng kế tiếp. |
| Từ 600px trở xuống | Bốn khối nội dung xếp dọc, cách nhau 24px. |

CSS mặc định đặt trước, media `max-width: 1000px` đặt sau, cuối cùng là
`max-width: 600px`. Khi chiều rộng không quá 600px, cả hai media đều áp dụng;
các khai báo ở media nhỏ ghi đè thuộc tính tương ứng khi có cùng độ ưu tiên.

- Footer dùng `height: auto` và `min-height: 418px`: giữ chiều cao tối thiểu
  nhưng có thể cao thêm khi nội dung xuống hàng.
- `.footer-container` dùng `width: 100%`, `max-width: 1252px` và `height: auto`.
- Ở mốc 1000px, `flex-wrap: wrap` cho phép tạo hàng mới; khối thương hiệu có
  `flex-basis: 100%` và bỏ giới hạn 400px để chiếm cả hàng.
- Ở mốc 600px, `flex-direction: column` xếp nội dung dọc; đặt lại `flex` cho các
  cột để kích thước theo nội dung thay vì giữ quy tắc của hàng ngang.
- `.site-footer_legal` dùng `position: static`, `max-width: 700px`, `flex-wrap: wrap`
  và `gap`. Phần legal xuống hàng sẽ góp vào chiều cao footer, tránh chồng lên các cột.
- Chỉnh mốc `1000px` / `600px` trong điều kiện media; chỉnh khoảng cách bằng
  `gap` và `padding`, thay vì tăng chiều rộng lớn hơn 100% để bù bố cục.

### Chỉnh các đường kẻ SVG theo Figma

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

### Id và thuộc tính khác của footer

- Footer hiện **không có id**.
- Logo footer đang có `data-header-route="home"`, nhưng `header.js` chỉ tìm link
  bên trong header. Logo footer hiện điều hướng bằng chính `href` đã viết trong HTML.
- Các icon mạng xã hội hiện chưa có class riêng; không có tên class icon nào cần tra thêm.

## 4. Khi tự sửa code

- Sửa phần nào thì tìm class / id tương ứng trong bảng, sau đó mở file CSS của phần đó.
- Một phần tử có thể có nhiều class: ảnh kính lúp mở tìm kiếm là một ví dụ.
- Khi đổi tên class / id, cập nhật cả HTML, CSS và selector JavaScript có sử dụng nó.
- `site-header` và `site-footer` có tiền tố riêng để dễ phân biệt khi ghép vào cùng trang.
- Những class footer được ghi “Chưa” là các phần bạn có thể tiếp tục tự viết CSS.

Đây là bản tra cứu tĩnh. Khi thêm, xóa hoặc đổi tên class / id trong code, cập nhật
lại bảng và sơ đồ tương ứng để tài liệu tiếp tục khớp với code.
