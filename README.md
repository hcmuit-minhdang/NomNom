# 🍜 NomNom — Website công thức nấu ăn

> Đồ án môn **IE104 – Internet và Công nghệ Web** (GV: ThS. Võ Tấn Khoa)
> Tìm công thức, nấu theo nguyên liệu đang có trong tủ lạnh, so sánh giá nguyên liệu, lưu món yêu thích và chia sẻ công thức của chính bạn.

- 🌐 **Demo trực tuyến:** https://nomnom-taupe.vercel.app
- 💻 **Mã nguồn:** https://github.com/hcmuit-minhdang/ie104
- 🎨 **Thiết kế Figma:** https://www.figma.com/design/1XVDA0jnedoKuCL9rYodr7/IE104
- 🗂️ **Quản lý công việc:** https://app.notion.com/p/IE104-NomNom-41c2218b6ea98086b85be6ce87b3a267?source=copy_link
- 🎬 **Video báo cáo và demo (YouTube, unlisted):** _(điền link)_

---

## 👥 Thành viên nhóm

Nhóm: 11

| STT | Họ tên | MSSV | Phần phụ trách | Đóng góp |
|---|---|---|---|---|
| 1 | Minh | 24521051| Trang chủ, Về chúng tôi, 5 trang Góc của tôi (tổng quan, đã lưu, đã đăng, đã đánh giá, lịch sử), tích hợp | _(%)_ |
| 2 | Tấn Phát | 24521322| Trang danh mục và tìm kiếm | _(%)_ |
| 3 | Thạch | 24521590 | Trang chi tiết công thức, so sánh giá nguyên liệu | _(%)_ |
| 4 | Thư | 23521547 | Trang tìm công thức theo nguyên liệu trong tủ lạnh | _(%)_ |
| 5 | Thịnh | 24521695_ | Trang đăng tải công thức | _(%)_ |
| | **Tổng** | | | **100%** |

---

## ✨ Tính năng

**Người dùng chưa đăng nhập**
- Trang chủ: banner, danh mục, món phổ biến, bảng xếp hạng đầu bếp, tìm kiếm nhanh.
- **Danh mục món ăn:** lọc theo nhóm món, thời gian nấu, mức giá, sắp xếp (điểm, thời gian, giá, mới nhất), phân trang.
- **Tìm kiếm** không phân biệt dấu tiếng Việt (tên món, nguyên liệu, danh mục).
- **Chi tiết công thức:** nguyên liệu, các bước kèm ảnh, đánh giá sao, bình luận, thích bình luận.
- **Tủ lạnh của tôi:** chọn nguyên liệu đang có, hệ thống gợi ý món phù hợp kèm nhãn *Đủ / Chưa đủ nguyên liệu* và phần trăm khớp.
- **So sánh giá nguyên liệu** giữa các cửa hàng.
- Trang Về chúng tôi, chính sách (bảo mật, điều khoản, tiếp cận), biểu mẫu liên hệ.

**Người dùng đã đăng nhập**
- Đăng ký, đăng nhập, đăng xuất, sửa thông tin, đổi mật khẩu, xóa tài khoản.
- **Lưu / bỏ lưu** công thức, **đánh giá** (1–5 sao), thích bình luận.
- **Đăng tải công thức** cùng ảnh (tải ảnh lên, kiểm tra định dạng và dung lượng), xóa công thức của mình.
- **Góc của tôi:** tổng quan, đã lưu, đã đăng, đã đánh giá, lịch sử xem.

**Giao diện và trải nghiệm**
- Bố cục theo thiết kế Figma, dùng Flexbox, CSS Grid và container query (`cqw`) nên co giãn đúng ở màn hình laptop 15.6", desktop 23.8", tablet và điện thoại.
- Header gọn cố định, menu dạng ngăn kéo trên điện thoại, popup đăng nhập/đăng ký có hiệu ứng.
- Phân trang, bộ lọc dùng chung, trạng thái đang tải và thông báo lỗi tiếng Việt.

---

## 🧰 Công nghệ

| Mục | Nội dung |
|---|---|
| Ngôn ngữ | **HTML5, CSS3, JavaScript thuần (ES6+)** |
| Bố cục | Flexbox, CSS Grid, container query, media query |
| Dữ liệu | **Fetch API** tải file JSON tĩnh (`public/data/db.json`), xử lý trong `public/js/store.js` |
| Lưu trên trình duyệt | `localStorage` (tài khoản, phiên đăng nhập, công thức đã lưu/đăng, đánh giá, lịch sử, bản nháp form đăng tải) |
| Triển khai | Bất kỳ hosting tĩnh nào (Vercel, Netlify, ...) |

**Không có máy chủ.** Toàn bộ website là file tĩnh trong `public/`. Không dùng Bootstrap, jQuery, Tailwind hay thư viện nào khác, không dùng template có sẵn, không có dependency npm. Tài nguyên ngoài duy nhất là Google Fonts và liên kết mạng xã hội.

### Dữ liệu hoạt động thế nào

Các trang lấy dữ liệu qua lớp [`public/js/data.js`](public/js/data.js) (`NomNom.data.get('/recipes', {...})`), lớp này gọi tiếp vào [`public/js/store.js`](public/js/store.js). Toàn bộ chạy trong trình duyệt, không có lời gọi mạng nào tới máy chủ:

- Dữ liệu gốc (khoảng 130 công thức, nguyên liệu, tài khoản demo) tải một lần từ `public/data/db.json` bằng **Fetch API** (`fetch('/data/db.json')` trong `store.js`). Đây là file tĩnh nằm cùng website, không phải lời gọi tới máy chủ.
- Lọc, tìm kiếm, phân trang, đánh giá, gợi ý theo nguyên liệu... đều do JavaScript trong `store.js` tính.
- Phần người dùng thay đổi (đăng ký, đăng nhập, lưu, đánh giá, đăng công thức, lịch sử) lưu trong `localStorage` của **chính trình duyệt đó**, nên mỗi máy có dữ liệu riêng.
- Mật khẩu được băm bằng PBKDF2-SHA256 (Web Crypto) kèm salt ngẫu nhiên, không lưu mật khẩu thô.
- Muốn đặt lại dữ liệu: xóa dữ liệu trang web trong trình duyệt, hoặc gõ `NomNomLocal.reset()` trong Console.

---

## 🚀 Chạy trên máy

Chỉ cần một web server tĩnh, mở thư mục `public/` bằng một trong các cách:

```bash
# Cách 1: VS Code → cài tiện ích "Live Server" → chuột phải public/index.html → Open with Live Server
# Cách 2: Python
python -m http.server 3000 --directory public
# Cách 3: Node.js
npx serve public -l 3000
```

Rồi mở http://localhost:3000.

> Phải mở qua web server (không mở trực tiếp bằng `file://`) và để `public/` làm thư mục gốc, vì trang dùng đường dẫn tuyệt đối `/css/...`, `/js/...`, `/assets/...`.

### Tài khoản dùng thử

| Trường | Giá trị |
|---|---|
| Tên đăng nhập | `demo` (hoặc email `demo@nomnom.vn`) |
| Mật khẩu | `demo123` |

Tài khoản này có sẵn công thức đã lưu, 2 công thức đã đăng, 4 đánh giá và lịch sử xem. Bạn cũng có thể tự đăng ký tài khoản mới.

---

## ☁️ Triển khai

Đưa thư mục `public/` lên hosting tĩnh. Với Vercel: import repo, giữ nguyên `vercel.json` (`outputDirectory: public`, không cần build). Mỗi lần push lên `main` Vercel tự cập nhật.

---

## 📁 Cấu trúc thư mục

```text
final/
├─ README.md, STRUCTURE.md   # tài liệu
├─ package.json              # chỉ có script start, không có dependency
├─ vercel.json               # cấu hình triển khai tĩnh
└─ public/                   # TOÀN BỘ WEBSITE (thư mục gốc khi triển khai)
   ├─ index.html             # Trang chủ
   ├─ pages/                 # category, search, recipe, upload, ingredients, fridge,
   │                         # fridge-results, about, policy, account/*
   ├─ css/                   # base.css, components/ (header, footer, login, signup), pages/
   ├─ js/                    # data.js, store.js, components/ (header, auth, ...), pages/
   ├─ data/db.json           # dữ liệu gốc (công thức, nguyên liệu, tài khoản demo)
   └─ assets/                # images, icons, fonts
```

So với gợi ý của giảng viên (`css/ js/ images/ index.html about.html contact.html`), nhóm đặt toàn bộ vào `public/` và chia thêm `pages/`. Phần **liên hệ** nằm trong trang `about.html`.

Quy ước: đường dẫn trong HTML/CSS/JS luôn là đường dẫn tuyệt đối từ gốc site.

---

## ⚠️ Giới hạn đã biết

- Dữ liệu người dùng lưu theo từng trình duyệt (`localStorage`, khoảng 5 MB): tài khoản tạo ở máy này không đăng nhập được ở máy khác. Ảnh tải lên được thu nhỏ tối đa 900px để tiết kiệm chỗ.
- Chi tiết (nguyên liệu, các bước) của một số công thức dạng thẻ được sinh theo tên món từ dữ liệu mẫu, không phải công thức thật.
- Giá nguyên liệu ở các cửa hàng là dữ liệu mô phỏng.

---

## 📄 Giấy phép và ghi nhận

Sản phẩm học tập của nhóm cho môn IE104, không dùng cho mục đích thương mại. Ảnh minh họa món ăn thuộc về chủ sở hữu tương ứng và chỉ dùng để trình bày đồ án.
