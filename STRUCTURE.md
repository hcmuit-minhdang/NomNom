# NomNom: cấu trúc thư mục

```text
NomNom/
├─ index.html                # Trang chủ
├─ about.html                # Về chúng tôi (có mục Góp ý #gop-y)
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
│  ├─ policy.html            # chính sách bảo mật, điều khoản, hỗ trợ tiếp cận
│  └─ account/               # Góc của tôi
│     ├─ index.html          # chuyển hướng tới overview.html#thong-tin-tai-khoan
│     ├─ overview.html       # tổng quan + thông tin tài khoản
│     ├─ saved.html          # công thức đã lưu
│     ├─ uploaded.html       # công thức đã đăng tải
│     ├─ reviewed.html       # đánh giá của tôi
│     └─ history.html        # lịch sử xem
├─ css/                      # components/ (header, footer, login, signup, filter, pager, ...), pages/ (mỗi trang một file)
├─ js/                       # data.js, store.js, components/ (header, auth, ...), pages/
├─ data/db.json              # dữ liệu gốc (công thức, tài khoản demo, lượt lưu/đánh giá/lịch sử mẫu)
├─ images/                   # hình ảnh (icons/ là các biểu tượng)
└─ fonts/                    # font chữ
```

Quy ước: đường dẫn trong HTML/CSS/JS dùng **đường dẫn tuyệt đối từ gốc site** (`/css/...`, `/js/...`, `/images/...`, `/pages/...`), nên phải mở qua web server với thư mục chứa `index.html` làm thư mục gốc (không mở bằng `file://`).

## Quy tắc đặt tên và làm việc nhóm

Chi tiết nằm trong [README.md](README.md#-quy-tắc-đặt-tên-và-làm-việc-nhóm). Tóm tắt:

- **CSS:** BEM kebab-case (`block__element--modifier`, trạng thái `is-*`); phần tử con của một khối luôn nối bằng `__`; tên khối viết phẳng theo từng trang là khối độc lập.
- **ID:** kebab-case. **JavaScript:** camelCase, hằng `UPPER_SNAKE`, chỉ `const`/`let`, tên biến và hàm từ 3 ký tự trở lên.
- **Tệp và thư mục:** chữ thường, nối bằng `-`; CSS và JS riêng của trang trùng tên với trang.
- **Git:** commit dạng `loại: nội dung`; nhánh theo thành viên gộp vào `main` bằng Pull Request.
