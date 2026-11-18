# NomNom — cấu trúc thư mục

```text
final/
├─ README.md                 # giới thiệu, cách chạy, thành viên
├─ STRUCTURE.md              # file này
├─ package.json              # chỉ có script start (npx serve public), không có dependency
├─ vercel.json               # triển khai tĩnh: outputDirectory = public
└─ public/                   # toàn bộ website (thư mục gốc khi triển khai)
   ├─ index.html             # Trang chủ (/)
   ├─ pages/
   │  ├─ category.html       # Danh mục món ăn (lọc, phân trang)
   │  ├─ search.html         # Kết quả tìm kiếm (?q=)
   │  ├─ recipe.html         # Chi tiết công thức (?id=slug)
   │  ├─ upload.html         # Đăng tải công thức
   │  ├─ ingredients.html    # So sánh giá nguyên liệu
   │  ├─ fridge.html         # Chọn nguyên liệu trong tủ lạnh
   │  ├─ fridge-results.html # Công thức phù hợp
   │  ├─ about.html          # Về chúng tôi + liên hệ
   │  ├─ policy.html         # Bảo mật, điều khoản, tiếp cận
   │  └─ account/            # Góc của tôi: overview, saved, uploaded, reviewed, history
   ├─ css/
   │  ├─ base.css            # biến, reset dùng chung
   │  ├─ components/         # header, footer, login, signup
   │  └─ pages/              # mỗi trang một file CSS
   ├─ js/
   │  ├─ store.js            # kho dữ liệu chạy trong trình duyệt (đọc data/db.json + localStorage)
   │  ├─ data.js             # lớp truy cập dữ liệu dùng chung (NomNom.data) và tiện ích hiển thị
   │  ├─ components/         # header, auth, login, signup, ...
   │  └─ pages/              # mỗi trang một file JS
   ├─ data/db.json           # dữ liệu gốc: công thức, nguyên liệu, tài khoản demo
   └─ assets/                # images, icons, fonts
```

Quy ước: đường dẫn trong HTML/CSS/JS dùng **đường dẫn tuyệt đối từ gốc site** (`/css/...`, `/js/...`, `/assets/...`, `/pages/...`), nên phải mở qua web server với `public/` làm thư mục gốc (không mở bằng `file://`).
