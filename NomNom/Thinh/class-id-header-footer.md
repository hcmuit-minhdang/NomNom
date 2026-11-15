# Tra cứu class và id — Header & Footer

Tổng hợp theo code hiện tại: **17 class và 4 id của header**, **12 class của footer**.
Footer hiện chưa có id. Các tên dưới đây đã có trong HTML; không phải danh sách
các thành phần cần tạo thêm.

## 1. Cách đọc

| Trong HTML | Selector trong CSS / JavaScript | Ý nghĩa |
| --- | --- | --- |
| `class="site-header_logo"` | `.site-header_logo` | Chọn phần tử có class này; một class có thể dùng cho nhiều phần tử. |
| `id="site-header_login"` | `#site-header_login` | Chọn phần tử có id này; id phải duy nhất trong một trang. |
| `data-header-guest` | `[data-header-guest]` | Chọn theo thuộc tính; đây không phải class hay id. |

Quy ước: tên khối là `site-header` / `site-footer`; tên phần con dùng **một dấu
gạch dưới `_`**, ví dụ `site-header_logo`, `site-footer_brand`. Dấu `-` nối các từ
trong cùng một tên, ví dụ `logo-box`, `search-field`.

## 2. Header

Nguồn: [HTML khách](header/index.html), [HTML thành viên](<header/ed - index.html>),
[CSS](header/style.css), [JavaScript](header/header.js).

### Sơ đồ các khối chính

```text
header.site-header
├── div.header-container
│   ├── div.site-header_logo-box
│   │   └── a → img.site-header_logo
│   └── div.site-header_controls
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
│               ├── summary → Icon mở / đóng tìm kiếm
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
| `.site-header_navigation` | `div` | Nhóm Công thức, Về chúng tôi, Danh mục và Góc của tôi. |
| `.site-header_nav-item` | `div` | Một mục trong nhóm điều hướng; dùng lặp lại cho cả bốn mục. |
| `.site-header_arrow` | `img` | Mũi tên cạnh tên menu; CSS đổi màu khi dropdown mở. |
| `.site-header_actions` | `div` | Nhóm chứa nút đăng ký / đăng nhập và khối tìm kiếm. |
| `.site-header_auth` | `div` | Nhóm hai nút Đăng ký và Đăng nhập. |
| `.site-header_search` | `details` | Toàn bộ khối tìm kiếm có thể mở / đóng. JavaScript dùng class này để tìm khối tìm kiếm. |
| `.site-header_search-icon` | `img` | Đặt kích thước cho hình kính lúp dùng để mở tìm kiếm. |
| `.site-header_search-open-icon` | `img` | Đánh dấu hình kính lúp để CSS ẩn nó khi tìm kiếm mở. Cùng nằm trên ảnh có class `site-header_search-icon`. |
| `.site-header_search-close-icon` | `img` | Hình dấu X; hiện khi khối tìm kiếm mở. |
| `.site-header_search-field` | `form` | Khung nhập tìm kiếm: chiều rộng, border, bóng và bố trí input / nút gửi. |
| `.site-header_search-submit` | `button` | Nút kính lúp bên trong form để gửi tìm kiếm. |
| `.site-header_status` | `p` | Vùng thông báo chờ tích hợp, mặc định ẩn; JavaScript cập nhật nội dung và trạng thái hiển thị. |

### Toàn bộ id của header

| Id / selector | Phần tử | Vai trò |
| --- | --- | --- |
| `#site-header_categories` | `div.site-header_nav-item` | Xác định riêng mục Danh mục để CSS đặt kích thước / căn link. |
| `#site-header_signup` | `button` | Nút Đăng ký, có màu nền và bóng riêng. |
| `#site-header_login` | `button` | Nút Đăng nhập, có màu nền và bóng riêng. |
| `#site-header_search-bar` | `div` | Vùng mở rộng phía dưới header, chứa form tìm kiếm. |

`aria-controls="site-header_search-bar"` trên `summary` trỏ đến id vùng tìm kiếm.
Nếu đổi id này, phải đổi cả giá trị `aria-controls`.

### Các thuộc tính liên quan đến JavaScript

| Thuộc tính / selector | Nằm ở đâu | Vai trò |
| --- | --- | --- |
| `[data-nomnom-header]` | `header.site-header` | Điểm bắt đầu để `header.js` tìm và khởi tạo header. |
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

## 3. Footer

Nguồn: [HTML](footer/index.html), [CSS](footer/style.css).

### Sơ đồ các khối chính

```text
footer.site-footer
└── div.footer-container
    ├── div.site-footer_brand
    │   ├── div.site-footer_logo-box
    │   │   └── a → img.site-footer_logo
    │   ├── h2.site-footer_tagline
    │   └── p.site-footer_description
    ├── div.site-footer_recipes
    │   ├── h2.site-footer_heading
    │   └── nav.site-footer_links
    ├── div.site-footer_about
    │   ├── h2.site-footer_heading
    │   └── nav.site-footer_links
    └── div.site-footer_contact
        ├── h2.site-footer_heading
        └── nav.site-footer_links
```

### Toàn bộ class của footer

"Có CSS riêng" nghĩa là đã có rule cho chính class đó trong `footer/style.css`.
Class chưa có rule vẫn có thể chịu định dạng mặc định, kế thừa hoặc bố cục từ cha.

| Class / selector | Phần tử | Vai trò | Có CSS riêng? |
| --- | --- | --- | --- |
| `.site-footer` | `footer` | Toàn bộ footer: font, kích thước, căn nội dung và đường viền. | Có |
| `.footer-container` | `div` | Khung chung chứa bốn cột và phân bố khoảng cách giữa chúng. | Có |
| `.site-footer_brand` | `div` | Cột thương hiệu: logo, câu giới thiệu ngắn và đoạn mô tả; đang đặt rộng 492px. | Có |
| `.site-footer_logo-box` | `div` | Khung chứa link và ảnh logo. | Có |
| `.site-footer_logo` | `img` | Ảnh logo: kích thước và góc xoay. | Có |
| `.site-footer_tagline` | `h2` | Câu “Ăn ngon trọn vị, chi tiêu hợp lý.” | Chưa |
| `.site-footer_description` | `p` | Đoạn mô tả về NomNom. | Chưa |
| `.site-footer_recipes` | `div` | Cột Công thức. | Chưa |
| `.site-footer_about` | `div` | Cột Giới thiệu. | Chưa |
| `.site-footer_contact` | `div` | Cột Liên hệ, gồm các link mạng xã hội. | Chưa |
| `.site-footer_heading` | `h2` | Tiêu đề dùng chung cho ba cột Công thức / Giới thiệu / Liên hệ. | Chưa |
| `.site-footer_links` | `nav` | Nhóm link trong mỗi cột; hiện đang xếp theo chiều dọc. | Có |

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
