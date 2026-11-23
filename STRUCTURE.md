# NomNom: cấu trúc thư mục

Website tĩnh gồm HTML, CSS và JavaScript thuần, không có máy chủ. Mỗi trang là một file `.html`, nạp CSS riêng của trang, phần dùng chung (header, footer, đăng nhập) và JS riêng của trang. Dữ liệu lấy từ `data/db.json`, người dùng thay đổi lưu trong `localStorage` của trình duyệt.

Quy ước: đường dẫn trong HTML, CSS, JS dùng **đường dẫn tuyệt đối từ gốc site** (`/css/...`, `/js/...`, `/images/...`, `/pages/...`), nên phải mở qua web server với thư mục chứa `index.html` làm thư mục gốc, không mở bằng `file://`.

## Cây thư mục

```text
NomNom/
├─ index.html, about.html, 404.html
├─ README.md, STRUCTURE.md, .gitignore
├─ pages/            # các trang còn lại
│  └─ account/       # Góc của tôi
├─ css/
│  ├─ components/    # CSS dùng chung nhiều trang
│  └─ pages/         # mỗi trang một file CSS
├─ js/
│  ├─ components/    # JS dùng chung nhiều trang
│  └─ pages/         # mỗi trang một file JS
├─ data/             # dữ liệu JSON
├─ images/           # hình ảnh
├─ fonts/            # font chữ
└─ docs/             # tài liệu phụ
```

## Các file ở thư mục gốc

| File | Chức năng |
|---|---|
| `index.html` | Trang chủ: banner, ô tìm kiếm, danh mục phổ biến, công thức nổi bật, công thức mới của cộng đồng, bảng vinh danh, lối vào lọc theo nguyên liệu tủ lạnh và so sánh giá. |
| `about.html` | Trang Về chúng tôi: giới thiệu, hướng dẫn sử dụng (`#huong-dan`), câu hỏi thường gặp (`#faq`), gửi góp ý (`#gop-y`) và thông tin liên hệ (`#lien-he`). Không có `contact.html` riêng. |
| `404.html` | Trang báo lỗi khi vào địa chỉ không tồn tại (Vercel tự dùng file này). |
| `README.md` | Giới thiệu dự án, thành viên nhóm và các liên kết liên quan. |
| `STRUCTURE.md` | File này: mô tả cấu trúc thư mục. |
| `.gitignore` | Danh sách file không đưa lên git (`node_modules/`, `.vercel/`, file hệ thống). |

## `pages/`: các trang còn lại

| File | Chức năng |
|---|---|
| `category.html` | Chọn danh mục món ăn, và danh sách món theo danh mục (lọc, sắp xếp, phân trang). |
| `search.html` | Kết quả tìm kiếm theo từ khóa, lọc theo thời gian nấu và giá. |
| `recipe.html` | Chi tiết một công thức: ảnh, nguyên liệu, các bước, đánh giá, bình luận, lưu món, in công thức, món tương tự. |
| `upload.html` | Đăng tải công thức mới kèm ảnh món và ảnh từng bước. |
| `ingredients.html` | So sánh giá nguyên liệu giữa các cửa hàng. |
| `fridge.html` | Chọn nguyên liệu đang có trong tủ lạnh. |
| `fridge-results.html` | Danh sách công thức phù hợp với nguyên liệu đã chọn (Đủ hoặc Chưa đủ nguyên liệu), có phân trang. |
| `policy.html` | Chính sách bảo mật, điều khoản sử dụng, cam kết tiếp cận. |

### `pages/account/`: Góc của tôi (cần đăng nhập)

| File | Chức năng |
|---|---|
| `index.html` | Chỉ chuyển hướng tới `overview.html#thong-tin-tai-khoan`. |
| `overview.html` | Tổng quan: món đã lưu, đã đăng, đánh giá, lịch sử gần đây, thông tin tài khoản, đổi ảnh đại diện và ảnh bìa. |
| `saved.html` | Danh sách công thức đã lưu. |
| `uploaded.html` | Danh sách công thức đã đăng tải, có nút sửa và xóa. |
| `reviewed.html` | Các đánh giá của tôi. |
| `history.html` | Lịch sử xem, có nút xóa toàn bộ. |

## `css/`

### `css/components/`: dùng chung nhiều trang

| File | Chức năng |
|---|---|
| `header.css` | Thanh đầu trang cố định, menu, ô tìm kiếm; khai báo font Inter dùng cho cả site và cho nút, ô nhập kế thừa font. |
| `footer.css` | Chân trang: liên kết, mạng xã hội, chính sách. |
| `login.css`, `signup.css` | Hai cửa sổ popup đăng nhập và đăng ký. |
| `filter.css` | Thanh bộ lọc bên trái (nhóm lọc xổ xuống, ô "Khác", nút Áp dụng và Đặt lại) dùng ở danh mục và tủ lạnh. |
| `pager.css` | Phân trang (số trang, dấu ba chấm). |
| `fridge-filter.css` | Hộp thoại chọn nguyên liệu "TỦ LẠNH" ở trang chủ. |

### `css/pages/`: mỗi trang một file

| File | Dùng cho |
|---|---|
| `home.css` | Trang chủ (`index.html`). |
| `about.css` | `about.html`. |
| `category.css` | `pages/category.html`. |
| `listing.css` | Phần dùng chung của trang danh sách (category, search): thanh kết quả, khung xương khi tải, thẻ món. |
| `search.css` | `pages/search.html`. |
| `recipe.css` | `pages/recipe.html`, gồm cả kiểu in công thức. |
| `upload.css` | `pages/upload.html`. |
| `ingredient-picker.css` | Bộ chọn nguyên liệu trong form đăng tải. |
| `ingredients.css` | `pages/ingredients.html` (so sánh giá). |
| `fridge.css` | `pages/fridge.html` và `fridge-results.html`. |
| `account.css` | Năm trang trong `pages/account/`. |
| `policy.css` | `pages/policy.html`. |
| `not-found.css` | `404.html`. |

## `js/`

| File | Chức năng |
|---|---|
| `store.js` | Kho dữ liệu chạy ngay trong trình duyệt: đọc `data/db.json` bằng `fetch`, xử lý các thao tác (tìm công thức, lưu, đánh giá, đăng tải, tài khoản, lịch sử) và lưu phần người dùng thay đổi vào `localStorage`. Nạp trước `data.js`. |
| `data.js` | Lớp truy cập dữ liệu mà các trang gọi (`NomNom.data.get/post/put/patch/del`), cùng tiện ích dùng chung như `NomNom.esc` (escape HTML). |

### `js/components/`: dùng chung nhiều trang

| File | Chức năng |
|---|---|
| `header.js` | Header: mở thanh tìm kiếm, menu, hiện tên người dùng khi đã đăng nhập, sửa liên kết footer. |
| `auth.js` | Điều phối popup, đăng ký, đăng nhập, phiên đăng nhập. |
| `login.js`, `signup.js` | Kiểm tra form đăng nhập và đăng ký phía trình duyệt rồi gọi `auth.js`. |
| `filter.js` | Bộ lọc dùng chung của danh mục và tủ lạnh (mở nhóm lọc, gửi lọc khi bấm Áp dụng). |
| `fridge-filter.js` | Hộp thoại chọn nguyên liệu "TỦ LẠNH" ở trang chủ. |
| `fit-names.js` | Thu nhỏ chữ tên món cho vừa một dòng, quá dài thì xuống hai dòng. |
| `back-to-top.js` | Nút tròn về đầu trang, hiện khi cuộn xuống quá 400 px. Kiểu nút nằm trong `css/components/header.css`. |

### `js/pages/`: mỗi trang một file

| File | Dùng cho |
|---|---|
| `home.js` | Trang chủ: banner, danh mục, công thức nổi bật, bảng vinh danh. |
| `category.js` | Danh mục: lọc, sắp xếp, phân trang, trạng thái lưu trên URL. |
| `listing.js` | Hàm dùng chung cho trang danh sách: vẽ thẻ món, phân trang, khung xương khi tải. |
| `search.js` | Trang kết quả tìm kiếm. |
| `recipe.js` | Chi tiết công thức: nguyên liệu, tăng giảm khẩu phần, đánh giá, bình luận, lưu, mục lục. |
| `upload.js` | Đăng tải công thức: kiểm tra dữ liệu, tải ảnh, lưu công thức. |
| `ingredient-picker.js` | Bộ chọn nguyên liệu có gợi ý trong form đăng tải. |
| `ingredients.js` | So sánh giá nguyên liệu giữa các cửa hàng. |
| `fridge.js` | Luồng chọn nguyên liệu tủ lạnh và kết quả công thức phù hợp. |
| `account.js` | Năm trang Góc của tôi: danh sách, sửa, xóa, đổi ảnh, thông tin tài khoản. |

## `data/`

| File | Chức năng |
|---|---|
| `db.json` | Dữ liệu gốc: 131 công thức, tài khoản demo, lượt lưu, đánh giá, lịch sử mẫu. Tải một lần bằng `fetch`; phần người dùng thay đổi không ghi vào file này mà lưu ở `localStorage`. |

## `images/`

| Thư mục hoặc file | Chức năng |
|---|---|
| `logo.png`, `favicon.png` | Logo NomNom và biểu tượng tab trình duyệt. |
| `banner-image.jpg`, `banner1.avif`, `banner2.jpg`, `banner3.jpg` | Ảnh banner ở trang chủ. |
| `icons/` | Biểu tượng SVG nhỏ: mũi tên, tìm kiếm, đóng, mạng xã hội ở footer. |
| `backgrounds/` | Họa tiết nền trắng và vàng (`pattern-white.webp`, `pattern-yellow.webp`). |
| `about/` | Ảnh và hình minh họa của trang Về chúng tôi. |
| `account/` | Ảnh của trang Góc của tôi: ảnh bìa mặc định, biểu tượng sửa, nút chuyển trang. |
| `dishes/` | Ảnh món ăn dùng cho các công thức trong `data/db.json`. |
| `recipes/` | Ảnh theo từng công thức: mỗi thư mục là một món có ảnh các bước (`step*.png`), riêng `community/` là ảnh các công thức của cộng đồng. |
| `ingredients/` | 154 ảnh nguyên liệu cho trang so sánh giá, kèm `CREDITS.md` ghi nguồn và giấy phép từng ảnh. |
| Các file còn lại ở gốc | Ảnh trang trí dùng ở trang chủ, tài khoản (`avatar.jpg`, `food.png`, `market.webp`, `clock.png`, `cookbook.png`, `star-white.png`, `heart-yellowbg.png`...). |

## `fonts/`

| File | Chức năng |
|---|---|
| `inter-variable.woff2` | Font Inter biến thể đã cắt gọn (độ đậm 100 đến 900), nạp bằng `@font-face` trong `css/components/header.css`. |
| `OFL.txt` | Giấy phép SIL Open Font License của font Inter. |

## `docs/`

| File | Chức năng |
|---|---|
| `doi-chieu-bao-cao.md` | Đối chiếu phương pháp và cấu trúc của nhóm với hai báo cáo tham khảo (MyTicket, Game Store) và danh sách việc còn lại cho báo cáo. |

## Quy tắc đặt tên và làm việc nhóm

Tóm tắt:

- **CSS:** BEM kebab-case (`block__element--modifier`, trạng thái `is-*`); phần tử con của một khối luôn nối bằng `__`; tên khối viết phẳng theo từng trang là khối độc lập.
- **ID:** kebab-case. **JavaScript:** camelCase, hằng `UPPER_SNAKE`, chỉ `const`/`let`, tên biến và hàm từ 3 ký tự trở lên.
- **Tệp và thư mục:** chữ thường, nối bằng `-`; CSS và JS riêng của trang trùng tên với trang.
- **Git:** commit dạng `loại: nội dung`; nhánh theo thành viên gộp vào `main` bằng Pull Request.
