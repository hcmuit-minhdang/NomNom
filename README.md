<p align="center">
  <img src="images/logo.png" alt="NomNom" width="240" />
</p>

<h1 align="center">NomNom: Website công thức nấu ăn</h1>

<p align="center">
  <em>Tìm công thức, nấu theo nguyên liệu đang có trong tủ lạnh, so sánh giá nguyên liệu và chia sẻ món của chính bạn.</em>
</p>

---

## 📖 Giới thiệu

NomNom là website công thức nấu ăn giúp bạn trả lời câu hỏi quen thuộc: **"Tủ lạnh của mình đang có gì, hôm nay nấu món gì?"**. Bạn có thể tra cứu hơn 130 công thức, chọn nguyên liệu đang có để được gợi ý món phù hợp, so sánh giá nguyên liệu giữa các cửa hàng, rồi lưu, đánh giá hoặc đăng công thức của riêng mình.

Đây là đồ án môn **IE104 - Internet và Công nghệ Web** (GV: ThS. Võ Tấn Khoa), làm theo nhóm 5 người. Điểm nhấn của sản phẩm:

- **Nấu theo tủ lạnh:** chọn nguyên liệu đang có (hoặc tự nhập) và nhận gợi ý kèm nhãn *Đủ / Chưa đủ nguyên liệu*, phần trăm khớp, nguyên liệu còn thiếu.
- **So sánh giá nguyên liệu:** xem giá một nguyên liệu ở 6 cửa hàng, sắp từ rẻ đến đắt, có ảnh minh họa cho 154 nguyên liệu.
- **Cộng đồng:** đăng tải công thức kèm ảnh, lưu món yêu thích, đánh giá sao và bình luận.
- **Chỉ dùng HTML, CSS và JavaScript thuần:** không framework, không thư viện ngoài, không backend; mọi xử lý chạy ngay trong trình duyệt.
- **Bố cục theo Figma và co giãn:** hiển thị tốt trên máy tính, máy tính bảng và điện thoại.

## 🔗 Các thông tin liên quan

- 🌐 **Demo trực tuyến:** https://nomnom-taupe.vercel.app
- 💻 **Mã nguồn (bản hoàn chỉnh):** https://github.com/hcmuit-minhdang/ie104
- 👥 **Repo làm việc nhóm (lịch sử đóng góp theo từng thành viên):** https://github.com/hcmuit-minhdang/NomNom
- 🎨 **Thiết kế Figma:** https://www.figma.com/design/1XVDA0jnedoKuCL9rYodr7/IE104
- 🗂️ **Quản lý công việc:** https://app.notion.com/p/IE104-NomNom-41c2218b6ea98086b85be6ce87b3a267?source=copy_link
- 🎬 **Video báo cáo và demo (YouTube, unlisted):** _(điền link)_

**Mục lục:** [Thành viên](#-thành-viên-nhóm) · [Công nghệ](#-công-nghệ) · [Chạy trên máy](#-chạy-trên-máy) · [Cấu trúc](#-cấu-trúc-thư-mục) · [Quy tắc đặt tên](#-quy-tắc-đặt-tên-và-làm-việc-nhóm) · [Component và CSS](#-component-và-quy-tắc-css)

---

## 👥 Thành viên nhóm

Nhóm: **11**

| STT | Họ tên | MSSV | Phần phụ trách |
|---|---|---|---|
| 1 | Đặng Lê Thanh Minh | 24521051 | Thiết kế Figma và code trang Về chúng tôi (About Us), trang cá nhân (lịch sử, đã lưu, đã đánh giá, đã đăng); tạo và thiết lập repository GitHub; kiểm tra và sửa lỗi website |
| 2 | Trương Tấn Phát | 24521322 | Thiết kế Figma và code trang danh mục, trang kết quả tìm kiếm; slide; thuyết trình |
| 3 | Lê Hải Thạch | 24521590 | Thiết kế Figma và code trang chủ, chi tiết công thức, đăng công thức, so sánh nguyên liệu |
| 4 | Võ Thị Thanh Thư | 23521547 | Viết mô tả chức năng chính; thiết kế Figma và code trang công thức theo nguyên liệu tủ lạnh và trang kết quả; bảng phân công, file text; slide; thuyết trình |
| 5 | Nguyễn Quốc Thịnh | 24521695 | Thiết kế Figma và code header, footer, đăng nhập, đăng ký; quay video demo; viết báo cáo |

---

## 🧰 Công nghệ

| Mục | Nội dung |
|---|---|
| Ngôn ngữ | **HTML5, CSS3, JavaScript thuần (ES6+)** |
| Bố cục | Flexbox, CSS Grid, container query, media query |
| Dữ liệu | **Fetch API** tải file JSON tĩnh (`data/db.json`), xử lý trong `js/store.js` |
| Lưu trên trình duyệt | `localStorage` (tài khoản, phiên đăng nhập, ảnh đại diện/ảnh bìa, công thức đã lưu/đã đăng, đánh giá, lịch sử, góp ý, bản nháp form đăng tải) |

**Không có máy chủ (backend).** Toàn bộ website là file tĩnh nằm ngay trong thư mục gốc của dự án. Không dùng Bootstrap, jQuery, Tailwind hay thư viện nào khác, không dùng template có sẵn, không có dependency npm. Tài nguyên ngoài chỉ gồm Google Fonts và các liên kết: mạng xã hội, trang chủ các cửa hàng (nút *Mua ngay*), WebMD (gợi ý tra dinh dưỡng ở trang đăng tải) và Facebook (chia sẻ công thức).

---

## 🚀 Chạy trên máy

Chỉ cần một web server tĩnh phục vụ thư mục gốc của dự án (thư mục chứa `index.html`), chọn một trong các cách:

```bash
# Cách 1: VS Code → cài tiện ích "Live Server" → chuột phải index.html → Open with Live Server
# Cách 2: Python
python -m http.server 3000
# Cách 3: Node.js
npx serve . -l 3000      # hoặc: npm start
```

Rồi mở http://localhost:3000 (Live Server dùng cổng 5500).

> Phải mở qua web server (không mở trực tiếp bằng `file://`) và lấy thư mục chứa `index.html` làm thư mục gốc, vì trang dùng đường dẫn tuyệt đối `/css/...`, `/js/...`, `/images/...` và cần `fetch` được `/data/db.json`.

### Tài khoản dùng thử

| Trường | Giá trị |
|---|---|
| Tên đăng nhập | `demo` (hoặc email `demo@nomnom.vn`) |
| Mật khẩu | `demo123` |

Tài khoản này có sẵn 5 công thức đã lưu, 2 công thức đã đăng, 4 đánh giá và lịch sử xem. Bạn cũng có thể tự đăng ký tài khoản mới.

---

## 📁 Cấu trúc thư mục

```text
NomNom/
├─ index.html                # Trang chủ
├─ about.html                # Về chúng tôi (có mục Góp ý)
├─ README.md, STRUCTURE.md   # tài liệu
├─ package.json              # chỉ có script start, không có dependency
├─ vercel.json               # cấu hình triển khai tĩnh
├─ 404.html, robots.txt, sitemap.xml
├─ .gitignore
├─ pages/
│  ├─ category.html          # chọn danh mục / danh sách món theo danh mục
│  ├─ search.html            # kết quả tìm kiếm
│  ├─ recipe.html            # chi tiết công thức
│  ├─ upload.html            # đăng tải công thức
│  ├─ ingredients.html       # so sánh giá nguyên liệu
│  ├─ fridge.html            # chọn nguyên liệu tủ lạnh
│  ├─ fridge-results.html    # kết quả công thức theo nguyên liệu tủ lạnh
│  ├─ policy.html            # chính sách và điều khoản
│  └─ account/               # Góc của tôi: index, overview, saved, uploaded, reviewed, history
├─ css/                      # components/ (header, footer, login, signup, filter, pager, ...), pages/ (mỗi trang một file)
├─ js/                       # data.js, store.js, components/ (header, auth, login, signup, filter, ...), pages/ (mỗi trang một file)
├─ docs/                     # tài liệu phụ (đối chiếu báo cáo)
├─ data/db.json              # dữ liệu gốc (công thức, tài khoản demo, lượt lưu/đánh giá/lịch sử mẫu)
├─ images/                   # hình ảnh (icons/ biểu tượng, ingredients/ ảnh 154 nguyên liệu kèm CREDITS.md, backgrounds/ họa tiết nền)
└─ fonts/                    # font chữ Inter
```

---

## 📏 Quy tắc đặt tên và làm việc nhóm

Nhóm thống nhất một bộ quy tắc chung, theo hai báo cáo tham khảo của môn học (MyTicket, Game Store): **BEM cho class CSS**, **camelCase cho JavaScript**, kèm quy tắc component, quy tắc CSS và quy tắc Git. Toàn bộ code hiện tại đã được sửa theo bộ quy tắc này; riêng tên class phẳng của các trang lớn còn như mô tả ở mục BEM bên dưới.

**Tóm tắt 8 quy tắc bắt buộc:**

1. Class CSS viết thường, kebab-case, theo BEM: `block`, `block__element`, `block--modifier`.
2. Phần tử con của một khối đặt tên bằng `__`, **không** nối vào tên khối bằng một dấu `-` (ví dụ `comment__list`, không phải `comment-list`).
3. Trạng thái do JavaScript bật tắt dùng tiền tố `is-` hoặc `has-` (`is-open`, `is-active`, `has-error`).
4. Id viết kebab-case, không trùng trong một trang; tên file chữ thường, kebab-case.
5. JavaScript: biến và hàm viết camelCase, hằng số `UPPER_SNAKE`, lớp `PascalCase`; chỉ dùng `const` và `let`.
6. Tên biến và hàm dài ít nhất 3 ký tự và nói rõ vai trò; chỉ `i`, `j`, `k` (đếm vòng lặp), `e` (sự kiện, lỗi), `a`, `b` (hàm so sánh) và `$`, `$$` được ngắn hơn.
7. HTML không có `style="..."`; mọi ảnh có `alt` (ảnh trang trí để `alt=""`); mỗi trang có đúng một `h1`; nút bấm chỉ có biểu tượng thì có `aria-label`.
8. Chú thích viết tiếng Việt; không để `console.log` khi nộp.

### Class CSS: áp dụng quy tắc BEM

Giao diện NomNom gồm nhiều khối lặp lại ở nhiều trang như header, footer, thẻ công thức, bộ lọc, phân trang, hộp thoại chọn nguyên liệu. Nhóm dùng phương pháp đặt tên **BEM** (Block, Element, Modifier) để mã CSS có cấu trúc rõ ràng, tách biệt chức năng và tránh trùng class giữa các trang.

**BEM gồm 3 thành phần chính:**

- **Block:** thành phần độc lập, đại diện cho một khu vực giao diện hoàn chỉnh.
  Ví dụ: `site-header`, `site-footer`, `filter-sidebar`, `pagination`, `fridge-dialog`, `ingredient-picker`, `comment`, `hero`, `toc`.
- **Element:** thành phần con thuộc block, nối bằng hai dấu gạch dưới (`__`).
  Ví dụ: `site-header__logo`, `filter-group__trigger`, `pagination__link`, `fridge-dialog__submit`, `ingredient-picker__pill`.
- **Modifier:** thể hiện trạng thái, phiên bản hoặc kiểu của block hoặc element, nối bằng hai dấu gạch ngang (`--`).
  Ví dụ: `pagination__link--dots`, `skeleton__line--short`, `recipe-status--missing`. Trạng thái do JavaScript bật tắt dùng tiền tố `is-` (`is-open`, `is-active`, `is-loading`).

Tất cả viết chữ thường, các từ trong một tên nối bằng dấu gạch ngang (kebab-case).

**Lợi ích khi áp dụng BEM cho NomNom:**

- Tách biệt rõ từng phần giao diện như bộ lọc, phân trang, hộp thoại tủ lạnh.
- Dễ mở rộng khi thêm biến thể mới (ví dụ thêm kiểu liên kết phân trang mới chỉ cần thêm một modifier).
- Hạn chế trùng class giữa các trang: tên `filter-sidebar__title` không thể đụng với `title` của trang khác.
- Phù hợp khi có nhiều thành viên cùng phát triển, nhìn tên class là biết nó thuộc khối nào.

**Phạm vi đã áp dụng:** mọi phần tử con có tên bắt đầu bằng tên một khối đã chuyển sang `__` (ví dụ `comment__list`, `hero__content`, `step__preview`, `cta__sign-up-button`, `card__image`), và các class chỉ trạng thái (`show`, `on`, `toc-active`, `toc-current`) đã đổi sang `is-visible`, `is-on`, `is-active`, `is-current`. Tính chung có **47%** tên class theo BEM (250/536 tên class xuất hiện trong CSS có `__` hoặc `--`). Phần còn lại là tên khối viết phẳng theo từng trang, mỗi tên là một khối độc lập của trang đó, không phải con của khối khác. Các lớp biến thể trước đây viết phẳng (`slide-1`, `tag-du`, `recipe-card-full`...) đã đổi thành modifier hoặc tên khối riêng (`slide--first`, `food-tag--enough`, `full-recipe-card`).

### ID

Id đặt theo kebab-case, mô tả đúng vai trò phần tử: `sort-select`, `recipe-grid`, `filter-form`, `search-page-input`. Id của khối BEM có thể có dạng `block__element` (`site-login__email`).

### JavaScript: sử dụng camelCase

Trong phần JavaScript, nhóm thống nhất dùng **camelCase** để đặt tên biến và hàm. Đây là chuẩn đặt tên phổ biến nhất trong lập trình web, giúp mã dễ đọc và nhất quán.

**Quy tắc camelCase:**

- Chữ cái đầu viết thường.
- Các từ sau viết hoa chữ cái đầu tiên.
- Hằng số dùng `UPPER_SNAKE`, chỉ khai báo bằng `const` hoặc `let` (không dùng `var`).

**Ví dụ trong dự án NomNom:**

- **Biến:** `sortSel`, `servingsInput`, `prepTime`, `savedSet`, `activeLink`; hằng số: `COLLECTIONS`, `DRAFT_KEY`.
- **Hàm:** `loadCategories()`, `renderGallery()`, `renderQuickSteps()`, `requireLogin()`, `initScrollSpy()`, `showError()`.

Tên hàm bắt đầu bằng động từ (`load`, `render`, `show`, `init`, `handle`); biến đúng/sai bắt đầu bằng `is` hoặc `has`.

**Lợi ích trong chạy dự án:**

- Dễ hiểu và đồng nhất giữa các file JavaScript như `home.js`, `category.js`, `recipe.js`, `upload.js`, `account.js`.
- Thuận tiện khi xử lý các hành vi người dùng: lọc và sắp xếp công thức, lưu món, đăng tải công thức, mở hộp thoại chọn nguyên liệu.
- Nhìn tên hàm là biết hàm vẽ giao diện (`render...`), tải dữ liệu (`load...`) hay xử lý sự kiện (`handle...`).

Ngoại lệ: lớp và hàm khởi tạo viết PascalCase (`Router`, `HttpError`, `ApiError`) và hai hàm tắt chọn phần tử `$`, `$$`. Tên biến và hàm dài ít nhất 3 ký tự; chỉ `i`, `j`, `k`, `e`, `a`, `b` được ngắn hơn. Toàn bộ `js/` đã đổi theo quy tắc này (ví dụ `r` thành `recipe`, `li` thành `listItem`), kiểm tra bằng ESLint `id-length`: 0 vi phạm.

### Tên file và thư mục

- Chữ thường, kebab-case: `fridge-results.html`, `ingredient-picker.js`, `search-input.svg`.
- CSS và JS riêng của một trang trùng tên với trang (`recipe.html`, `css/pages/recipe.css`, `js/pages/recipe.js`); phần dùng chung đặt ở `css/components` và `js/components`.
- Ngoại lệ là các tài liệu theo thông lệ: `README.md`, `STRUCTURE.md`, `images/ingredients/CREDITS.md`, `fonts/OFL.txt`.

### Làm việc nhóm với Git

- Commit viết dạng `loại: mô tả ngắn` (`feat`, `fix`, `style`, `docs`, `refactor`), mô tả rõ nội dung thay đổi.
- Repo làm việc nhóm có nhánh riêng cho từng thành viên (`Minh`, `Thach`, `Thinh`, `Thu`, `Phat`); mỗi nhánh gộp vào `main` bằng Pull Request. Repo `ie104` là bản ghép hoàn chỉnh cuối cùng.

---

## 🧩 Component và quy tắc CSS

Phần này theo mục "Rule code" trong báo cáo: sau quy tắc đặt tên là component, quy tắc CSS và quy tắc làm việc với Git (ở trên).

### Component

Giao diện chia theo thành phần có chức năng rõ ràng, dùng lại được ở nhiều trang. Mỗi component có một file CSS trong `css/components/` và (nếu có xử lý) một file JS cùng tên trong `js/components/`.

| Component | Vai trò | File |
|---|---|---|
| `site-header`, `site-footer` | Đầu và cuối trang, có mặt ở mọi trang | `header.css/js`, `footer.css` |
| `site-login`, `site-signup` | Cửa sổ đăng nhập và đăng ký | `login.css/js`, `signup.css/js`, `auth.js` |
| `filter-sidebar`, `filter-group`, `filter-other` | Bộ lọc dùng chung cho danh mục và tủ lạnh | `filter.css/js` |
| `result-toolbar` | Thanh số kết quả, sắp xếp, nút lọc | `listing.css` |
| `pagination` | Phân trang | `pager.css` |
| `fridge-dialog` | Hộp thoại chọn nguyên liệu ở trang chủ | `fridge-filter.css/js` |
| `skeleton` | Khung xương khi đang tải | `listing.css` |

Quy tắc dùng component:

- Component viết theo BEM, không phụ thuộc vào trang chứa nó; trang nào cần khác đi thì thêm modifier (`--`) thay vì sửa CSS của component.
- Thành phần chỉ có ở một trang thì để trong `css/pages/` và `js/pages/` của trang đó (ví dụ `ingredient-picker` của trang đăng tải).
- Mã JS của component chỉ thao tác trong phạm vi block của nó, không tự tìm phần tử của trang khác.

### Quy tắc CSS cho dự án

- **Tránh xung đột CSS:** class của trang đặt tên theo trang (`recipe-card-full`, `fridge-...`), class dùng chung đặt theo BEM; không viết selector trần như `div`, `a` hay `p` trong file của trang.
- **Phần dùng chung** (header, footer, đăng nhập, bộ lọc, phân trang) chỉ viết trong `css/components/`. Sửa component thì sửa tại đây, không ghi đè ở file của trang.
- **Mỗi trang có file CSS riêng** trong `css/pages/`, chỉ áp dụng cho trang đó và không ảnh hưởng trang khác. Trang nạp CSS component cần dùng rồi mới nạp CSS của trang, như `category.html` nạp `header`, `footer`, `filter`, `pager` rồi `category`, `listing`.
- **Không viết `style="..."`** trong HTML; mọi kiểu dáng nằm trong file CSS.
- **Hạn chế `!important`:** chỉ dùng khi buộc phải ghi đè (hiện còn 18 chỗ trong `css/`).
- **Co giãn:** dùng `@media (max-width: ...)`; kiểm tra tối thiểu ở 1440px và 390px.
