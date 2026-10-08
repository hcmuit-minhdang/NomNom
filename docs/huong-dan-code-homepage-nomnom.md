# Hướng dẫn code tay homepage NomNom

**Chỉ làm frontend: HTML + CSS + JavaScript thuần.** Không có server, database hoặc xử lý đăng nhập thật.

## Cách dùng tài liệu

Làm lần lượt từ trên xuống. Mỗi bước: gõ code → lưu → xem trình duyệt → kiểm tra rồi mới tiếp tục.

- **HTML:** chèn đúng vị trí được ghi. Không xóa các phần đã làm.
- **CSS:** thêm cuối `css/styles.css` theo thứ tự trong tài liệu.
- **JS:** phần giao diện làm xong mới bắt đầu; thêm code vào `js/script.js` theo thứ tự.
- Các đoạn có ghi “tự thêm” là bài tập lặp lại mẫu ngay phía trên.
- Các đường dẫn tới trang khác là phần giao diện sẽ làm sau, chưa có trong homepage này.

## Lộ trình

| Giai đoạn | Nội dung | Khi nào xong? |
|---|---|---|
| A | Chuẩn bị file, khung HTML và CSS chung | Mở được trang, CSS đã liên kết |
| B | Header → hero → tìm kiếm → danh mục | Hoàn chỉnh phần đầu trang |
| C | Công thức → sidebar → banner → footer | Hoàn chỉnh giao diện desktop |
| D | Responsive | Trang không tràn ngang ở điện thoại |
| E | Dữ liệu mẫu và JavaScript | Tìm kiếm, slider và menu hoạt động |

## Mục lục các bước

- [Bước 1: Khung HTML ban đầu](#buoc-1)
- [Bước 2: CSS nền tảng](#buoc-2)
- [Bước 3: Header](#buoc-3)
- [Bước 4: Hero: tiêu đề và slider](#buoc-4)
- [Bước 5: Thanh tìm kiếm](#buoc-5)
- [Bước 6: Danh mục phổ biến](#buoc-6)
- [Bước 7: Công thức thịnh hành và sidebar](#buoc-7)
- [Bước 8: Banner so sánh giá](#buoc-8)
- [Bước 9: Công thức cộng đồng](#buoc-9)
- [Bước 10: About banner và footer](#buoc-10)
- [Bước 11: Responsive](#buoc-11)
- [Bước 12: Đưa dữ liệu vào `data.js`](#buoc-12)
- [Bước 13: Tìm kiếm bằng JavaScript](#buoc-13)
- [Bước 14: Slider bằng JavaScript](#buoc-14)

> **Cách đọc:** làm một mục nhỏ mỗi lần. Khối nền code là phần cần gõ; đoạn bên dưới giải thích code đó. Trong VS Code, nhấn **Ctrl + Shift + V** để xem Markdown đã định dạng.

## Chuẩn bị thư mục

```text
nomnom/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── data.js
│   └── script.js
└── assets/
    └── images/
        ├── logo.png
        ├── chili.jpg
        ├── category.jpg
        ├── avatar.jpg
        └── supermarket.jpg
```

Tạo các file trên, để hai file JS trống trước. Chuẩn bị ảnh đúng tên hoặc sửa đường dẫn theo ảnh của bạn. Mở `index.html` bằng Live Server nếu đang dùng VS Code.

Bộ màu chính theo bạn đã chọn: vàng `#FBC41C`, đen `#000000`, trắng `#FFFFFF`, màu bóng `#292929`. Font chữ dùng Inter. Màu xanh slider và màu chữ phụ là giá trị bổ sung ước lượng từ ảnh; kích thước cũng là điểm bắt đầu để bạn tự chỉnh.

---

# Giai đoạn A–C: Dựng giao diện HTML/CSS

---

<a id="buoc-1"></a>

## Bước 1 — Khung HTML ban đầu

### 1.1. Viết vào `index.html`

**File cần sửa:** `index.html`


```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NomNom — Trang chủ</title>
  <link rel="stylesheet" href="./css/styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
  <script src="./js/data.js" defer></script>
  <script src="./js/script.js" defer></script>
</head>
<body>
  <header class="site-header"></header>
  <main></main>
  <footer class="site-footer"></footer>
</body>
</html>
```

**Giải thích:**

- `lang="vi"`: ngôn ngữ chính là tiếng Việt.
- `viewport`: giúp giao diện hiển thị đúng trên điện thoại.
- `link`: nối file CSS với HTML.
- `defer`: đợi trình duyệt đọc xong HTML rồi mới chạy script.
- Đặt `data.js` trước `script.js` vì main cần đọc dữ liệu đã khai báo.
- Tạm để hai file JS trống; chúng ta làm giao diện trước.

Từ đây, các đoạn HTML sẽ được thêm vào `header`, `main` hoặc `footer` theo chỉ dẫn. CSS được thêm cuối `styles.css`, JavaScript được thêm cuối `script.js` trừ khi có yêu cầu thay thế.

---

<a id="buoc-2"></a>

## Bước 2 — CSS nền tảng

### 2.1. Reset và màu sắc

**📁 File: `css/styles.css`**

**Thao tác:** thêm đoạn sau vào file:

```css
:root  {
    --yellow: #FBC41C;
    --black: #000000;
    --white: #FFFFFF;
    --shadow: #292929;
    --green: #2c633e;
    --muted: #707070;
}

*  {
    box-sizing: border-box;
}

body  {
    margin: 0;
    color: var(--black);
    background: var(--white);
    font-family: "Inter", sans-serif;
    line-height: 1.5;
}

img  {
    display: block;
    max-width: 100%;
}

a  {
    color: inherit;
}

button, input  {
    font: inherit;
}

button  {
    cursor: pointer;
}

:focus-visible  {
    outline: 3px solid var(--green);
    outline-offset: 4px;
}
```

**Giải thích:**

`border-box` giúp width bao gồm padding và border. Biến màu giúp đổi màu cả trang tại một chỗ. `--shadow` chứa màu bóng; trong `box-shadow: 5px 5px 0 var(--shadow)`, ba số lần lượt là độ lệch ngang, độ lệch dọc và độ mờ. `focus-visible` cho biết bạn đang chọn phần tử nào khi dùng bàn phím.

### 2.2. Container căn giữa

**File cần sửa:** `css/styles.css`


```css
.container  {
    width: min(1200px, calc(100% - 40px));
    margin-inline: auto;
}
```

**Giải thích:**

Container tối đa 1200px; khi màn hình nhỏ hơn, nó chừa 20px mỗi bên. `margin-inline: auto` căn giữa theo chiều ngang.

### 2.3. Nút dùng chung

**File cần sửa:** `css/styles.css`


```css
.button  {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 10px 22px;
    border: 2px solid var(--black);
    font-weight: 800;
    text-decoration: none;
    color: var(--black);
}

.button-primary  {
    background: var(--yellow);
}

.button-outline  {
    background: var(--white);
}

.button-offset  {
    box-shadow: 5px 5px 0 var(--shadow);
}
```

**Giải thích:**

Một nút có thể mang nhiều class: `button button-primary button-offset`. Class đầu tạo hình dáng chung; các class sau thêm nền và bóng.

---

<a id="buoc-3"></a>

## Bước 3 — Header

### 3.1. Thêm HTML vào trong `header`

**File cần sửa:** `index.html`


```html
<div class="container header-inner">
  <a href="./index.html" class="logo">
    <img src="./assets/images/logo.png" alt="NomNom">
  </a>

  <button class="menu-toggle" type="button"
          aria-controls="main-nav" aria-expanded="false">
    Menu ☰
  </button>

  <nav id="main-nav" class="main-nav" aria-label="Điều hướng chính">
    <a href="#trending">Công thức</a>
    <a href="#about">Về chúng tôi</a>
    <a href="#categories">Danh mục</a>
  </nav>

  <div class="header-actions">
    <a href="./register.html" class="button button-primary">Đăng ký</a>
    <a href="./login.html" class="button button-outline">Đăng nhập</a>
    <button id="focus-search" type="button" aria-label="Đến ô tìm kiếm">⌕</button>
  </div>
</div>
```

**Giải thích:**

Link bắt đầu bằng `#` chuyển đến khu vực có id tương ứng trên trang. Đăng ký và đăng nhập là đường dẫn tới trang sẽ xây sau. Ký tự kính lúp là mẫu tạm, bạn có thể thay bằng SVG.

### 3.2. CSS header

**File cần sửa:** `css/styles.css`


```css
.header-inner  {
    display: flex;
    align-items: center;
    gap: 24px;
    min-height: 96px;
}

.logo img  {
    width: 170px;
}

.main-nav  {
    display: flex;
    gap: 24px;
    margin-left: auto;
}

.main-nav a  {
    text-decoration: none;
    font-weight: 700;
}

.header-actions  {
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-actions .button  {
    padding: 6px 12px;
}

#focus-search  {
    border: 0;
    background: transparent;
    font-size: 32px;
}

.menu-toggle  {
    display: none;
}
```

**Giải thích:**

`display: flex` xếp các nhóm nằm ngang. `margin-left: auto` đẩy menu và nhóm phía sau sang phải. Nút menu chỉ hiện ở mobile khi thêm responsive.

**Kiểm tra:** logo không méo, các nhóm thẳng hàng, nút có thể bấm/tab tới.

---

<a id="buoc-4"></a>

## Bước 4 — Hero: tiêu đề và slider

### 4.1. Thêm vào đầu `main`

**File cần sửa:** `index.html`


```html
<section class="hero container" aria-labelledby="hero-title">
  <div class="hero-content">
    <h1 id="hero-title">Công thức theo nguyên liệu từ tủ lạnh của bạn</h1>
    <a href="./ingredients.html" class="button button-primary button-offset hero-cta">
      <span>Bộ lọc<br>nguyên liệu</span>
      <span aria-hidden="true">→</span>
    </a>
  </div>

  <div class="hero-slider" aria-label="Nội dung nổi bật">
    <button id="slide-prev" class="slide-arrow" type="button"
            aria-label="Slide trước">⌃</button>
    <div class="slide-content">
      <h2 id="slide-title">Nấu ngon mỗi ngày</h2>
      <p id="slide-description">Khám phá công thức từ nguyên liệu bạn có.</p>
      <a id="slide-link" class="button" href="#trending">Khám phá</a>
    </div>
    <div class="slide-dots" aria-label="Chọn slide">
      <button type="button" aria-label="Slide 1" aria-current="true"></button>
      <button type="button" aria-label="Slide 2"></button>
      <button type="button" aria-label="Slide 3"></button>
    </div>
    <button id="slide-next" class="slide-arrow" type="button"
            aria-label="Slide tiếp theo">⌄</button>
  </div>
</section>
```

**Giải thích:**

Hero có hai khối con. Các id trong slider dùng để JavaScript tìm đúng phần tử và đổi nội dung sau này.

### 4.2. CSS hero

**File cần sửa:** `css/styles.css`


```css
.hero  {
    display: grid;
    grid-template-columns: 0.85fr 1.15fr;
    align-items: center;
    gap: 48px;
    padding-block: 48px 64px;
}

.hero h1  {
    margin: 0 0 28px;
    font-size: clamp(28px, 3.2vw, 44px);
    line-height: 1.3;
    text-transform: uppercase;
}

.hero-cta  {
    font-size: 28px;
    text-transform: uppercase;
}

.hero-cta > span:last-child  {
    font-size: 44px;
}
```

**Giải thích:**

`fr` chia phần chiều rộng còn lại theo tỷ lệ. `clamp()` giữ cỡ chữ trong khoảng 28–44px, thay đổi theo màn hình.

### 4.3. CSS slider

**File cần sửa:** `css/styles.css`


```css
.hero-slider  {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    min-height: 360px;
    padding: 16px 42px;
    color: var(--white);
    background: var(--green);
    text-align: center;
}

.slide-content h2  {
    margin: 0 0 10px;
}

.slide-content .button  {
    background: #b2d98c;
    border: 0;
}

.slide-arrow  {
    border: 0;
    background: transparent;
    color: var(--white);
    font-size: 30px;
}

.slide-dots  {
    position: absolute;
    right: 16px;
    top: 45%;
    display: grid;
    gap: 10px;
}

.slide-dots button  {
    width: 10px;
    height: 10px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: #ffffff66;
}

.slide-dots button[aria-current="true"]  {
    background: var(--white);
}
```

**Giải thích:**

`relative` làm mốc cho các chấm `absolute`. Phần còn lại vẫn dùng flex; không định vị tuyệt đối cả bố cục.

---

<a id="buoc-5"></a>

## Bước 5 — Thanh tìm kiếm

### 5.1. HTML sau hero

**File cần sửa:** `index.html`


```html
<section class="search-section" aria-label="Tìm công thức">
  <form id="search-form" class="container search-form" role="search">
    <label for="recipe-search">Tìm kiếm</label>
    <div class="search-field">
      <input id="recipe-search" type="search" placeholder="Tìm kiếm công thức...">
      <button type="submit" aria-label="Tìm công thức">⌕</button>
    </div>
  </form>
</section>
```

**Giải thích:**

`label for` khớp với id của input. Dùng form để người dùng nhấn Enter cũng tìm kiếm được.

### 5.2. CSS

**File cần sửa:** `css/styles.css`


```css
.search-section  {
    padding-block: 24px;
    background: var(--black);
}

.search-form  {
    display: flex;
    align-items: center;
    gap: 24px;
}

.search-form label  {
    padding: 8px 32px;
    background: var(--yellow);
    font-size: 24px;
    font-weight: 800;
    text-transform: uppercase;
}

.search-field  {
    display: flex;
    flex: 1;
    min-width: 0;
}

.search-field input  {
    width: 100%;
    min-width: 0;
    padding: 12px 20px;
    border: 0;
}

.search-field button  {
    width: 48px;
    flex-shrink: 0;
    border: 0;
    background: var(--yellow);
    font-size: 28px;
}
```

**Giải thích:**

Nền đen nằm trên section nên phủ toàn chiều ngang. Container chỉ giới hạn nội dung bên trong. `min-width: 0` giúp ô nhập co lại thay vì tràn flex.

---

<a id="buoc-6"></a>

## Bước 6 — Danh mục phổ biến

### 6.1. HTML sau thanh tìm kiếm

**File cần sửa:** `index.html`


```html
<section id="categories" class="categories container">
  <h2 class="section-badge">Phân loại phổ biến</h2>
  <div class="category-list">
    <a class="category-item" href="./recipes.html?category=quick">
      <img src="./assets/images/category.jpg" alt="">
      <span>Nấu nhanh</span>
    </a>
    <!-- Tự thêm sáu mục theo mẫu trên, đặt trước nút Xem thêm -->
    <a class="category-item" href="./recipes.html">
      <span class="category-more" aria-hidden="true">→</span>
      <span>Xem thêm</span>
    </a>
  </div>
</section>
```

**Giải thích:**

Sáu mục còn lại: Món gà, Món xào, Món nước, Desserts, Tiết kiệm, Món chay. Bạn tự gõ lại mẫu link, đổi tên, ảnh và giá trị category. Đây là phần luyện HTML lặp lại trước khi dùng JS.

### 6.2. CSS

**File cần sửa:** `css/styles.css`


```css
.categories  {
    padding-block: 40px 64px;
}

.section-badge  {
    width: fit-content;
    margin: 0 auto 40px;
    padding: 12px 32px;
    background: var(--yellow);
    border: 2px solid;
    box-shadow: 5px 5px 0 var(--shadow);
    text-align: center;
    text-transform: uppercase;
}

.category-list  {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 20px;
}

.category-item  {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
    text-decoration: none;
    font-weight: 700;
}

.category-item img, .category-more  {
    width: 80px;
    height: 80px;
}

.category-item img  {
    object-fit: cover;
    border-radius: 10px;
}

.category-more  {
    display: grid;
    place-items: center;
    background: var(--yellow);
    border: 2px solid;
    font-size: 44px;
}
```

**Giải thích:**

`repeat(8, ...)` tạo tám cột. Khi mới có hai mục, hàng còn chỗ trống; thêm đủ danh mục để xem bố cục đúng.

---

<a id="buoc-7"></a>

## Bước 7 — Công thức thịnh hành và sidebar

### 7.1. Thêm khung sau danh mục

**File cần sửa:** `index.html`


```html
<div class="featured-layout container">
  <section id="trending">
    <h2 class="section-title">Công thức thịnh hành</h2>
    <div id="trending-list" class="recipe-grid trending-grid">
      <!-- Đặt card ở phần “Viết một card HTML mẫu” vào đây -->
    </div>
    <a class="button button-outline" href="./recipes.html">Xem thêm</a>
  </section>
  <aside class="sidebar" aria-label="Cộng đồng">
    <!-- Đặt nội dung phần “HTML sidebar” vào đây -->
  </aside>
</div>
```

**Giải thích:**

### 7.2. Viết một card HTML mẫu

**File cần sửa:** `index.html`


```html
<article class="recipe-card">
  <a class="recipe-card-link" href="./recipe.html?id=chili">
    <img src="./assets/images/chili.jpg" alt="Black Bean Chili">
    <div class="recipe-info">
      <h3>Black Bean Chili</h3>
      <p>25.000đ / phần</p>
      <p>Thời gian nấu: 30 phút</p>
    </div>
  </a>
</article>
```

**Giải thích:**

Đặt card vào `trending-list`. Nhân thành bốn card để học bố cục. Ở phần “Đưa dữ liệu vào data.js”, JavaScript sẽ thay những card mẫu này bằng dữ liệu.

### 7.3. CSS khung và card

**File cần sửa:** `css/styles.css`


```css
.featured-layout  {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
    gap: 40px;
    margin-bottom: 90px;
}

.section-title  {
    display: flex;
    align-items: center;
    gap: 20px;
    margin: 0 0 28px;
    font-size: 28px;
    text-transform: uppercase;
}

.section-title::after  {
    content: "";
    flex: 1;
    height: 3px;
    background: var(--yellow);
}

.recipe-grid  {
    display: grid;
    gap: 24px;
    margin-bottom: 28px;
}

.trending-grid  {
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.recipe-card  {
    min-width: 0;
}

.recipe-card-link  {
    display: block;
    text-decoration: none;
}

.recipe-card img  {
    width: 100%;
    aspect-ratio: 6 / 5;
    object-fit: cover;
}

.recipe-info h3  {
    margin: 8px 0 4px;
    font-size: 18px;
}

.recipe-info p  {
    margin: 3px 0;
    font-size: 12px;
}

.trending-grid .recipe-card-link  {
    position: relative;
}

.trending-grid .recipe-info  {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
}

.trending-grid .recipe-info > *  {
    display: table;
    max-width: 100%;
    background: var(--white);
    padding: 1px 5px;
}

.sidebar  {
    padding-left: 28px;
    border-left: 1px solid #aaa;
}
```

**Giải thích:**

Pseudo-element `::after` tạo đường vàng bên cạnh tiêu đề. Card thường đặt thông tin dưới ảnh; riêng card trong `.trending-grid` đè thông tin lên ảnh. Một mẫu HTML phục vụ hai cách trình bày.

### 7.4. HTML sidebar

**File cần sửa:** `index.html`


```html
<section class="leaderboard">
  <h2>Bảng vinh danh</h2>
  <div class="leaderboard-list">
    <article class="member">
      <img src="./assets/images/avatar.jpg" alt="">
      <div><h3>Thanh Thư</h3><p>Đóng góp nhiều công thức</p></div>
    </article>
    <!-- Tự thêm hai thành viên, đổi tên và thành tích -->
  </div>
  <a href="./community.html" class="button button-outline">Xem thêm</a>
</section>
<section class="signup-card">
  <h2>Bạn muốn đăng tải công thức?</h2>
  <a href="./register.html" class="button button-primary">Đăng ký ngay!</a>
  <p>Đã có tài khoản? <a href="./login.html">Đăng nhập ngay</a></p>
</section>
```

**Giải thích:**

### 7.5. CSS sidebar

**File cần sửa:** `css/styles.css`


```css
.leaderboard  {
    padding: 20px;
    border: 2px solid;
    text-align: center;
}

.leaderboard h2  {
    margin: 0 0 20px;
    font-size: 24px;
    text-transform: uppercase;
}

.leaderboard-list  {
    display: grid;
    gap: 20px;
    margin-bottom: 24px;
}

.member  {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border: 2px solid;
    background: var(--yellow);
    box-shadow: 4px 4px 0 var(--shadow);
    text-align: left;
}

.member img  {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
}

.member h3  {
    margin: 0;
    font-size: 16px;
}

.member p  {
    margin: 4px 0 0;
    padding: 4px;
    background: var(--white);
    font-size: 11px;
}

.signup-card  {
    margin-top: 20px;
    padding: 20px;
    background: var(--black);
    color: var(--white);
    text-align: center;
}

.signup-card h2  {
    margin-top: 0;
    font-size: 20px;
    text-transform: uppercase;
}

.signup-card p  {
    font-size: 12px;
}
```

**Giải thích:**

**Kiểm tra:** tên dài không tràn, sidebar không ép chiều cao bằng cột trái.

---

<a id="buoc-8"></a>

## Bước 8 — Banner so sánh giá

### 8.1. HTML sau featured-layout

**File cần sửa:** `index.html`


```html
<section class="price-banner" aria-labelledby="price-title">
  <h2 id="price-title" class="price-label button button-primary button-offset">So sánh giá cả</h2>
  <div class="price-photo">
    <h3>Thiếu nguyên liệu?</h3>
    <p>So sánh giá cả ngay giữa các cửa hàng quen thuộc tại đây.</p>
  </div>
  <div class="price-content">
    <h3>Tiết kiệm hơn ngay với từng nguyên liệu</h3>
    <p>Đối tác uy tín, siêu thị thân quen</p>
    <a class="button button-outline" href="./compare.html">Tiết kiệm ngay</a>
  </div>
</section>
```

**Giải thích:**

### 8.2. CSS

**File cần sửa:** `css/styles.css`


```css
.price-banner  {
    position: relative;
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
}

.price-label  {
    position: absolute;
    z-index: 1;
    top: -40px;
    left: 6%;
    margin: 0;
    text-transform: uppercase;
}

.price-photo  {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 320px;
    padding: 40px;
    color: var(--white);
    background: linear-gradient(transparent, #000b), url('../assets/images/supermarket.jpg') center / cover;
}

.price-photo h3  {
    margin: 0;
    font-size: 28px;
    text-transform: uppercase;
}

.price-photo p  {
    max-width: 480px;
}

.price-content  {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: var(--yellow);
    text-align: center;
}

.price-content h3  {
    margin: 0;
    font-size: 30px;
    text-transform: uppercase;
}

.price-content p  {
    padding-bottom: 16px;
    border-bottom: 3px solid;
}
```

**Giải thích:**

Đường dẫn ảnh trong CSS tính từ thư mục chứa CSS: cần `../assets/...`. Gradient là lớp phủ tối để đọc chữ trên ảnh rõ hơn. Nhãn nhô lên 40px nên phần trước đã chừa khoảng cách đủ lớn.

---

<a id="buoc-9"></a>

## Bước 9 — Công thức cộng đồng

### 9.1. HTML sau banner giá

**File cần sửa:** `index.html`


```html
<section class="community container" aria-labelledby="community-title">
  <h2 id="community-title" class="section-title">Công thức mới từ cộng đồng!</h2>
  <p id="search-status" role="status"></p>
  <div id="community-list" class="recipe-grid community-grid">
    <!-- Tạm đặt bốn card giống phần “Viết một card HTML mẫu” -->
  </div>
  <a class="button button-outline" href="./recipes.html">Xem thêm</a>
</section>
```

**Giải thích:**

`role="status"` giúp thông báo số kết quả khi tìm kiếm. Card ở đây tự có thông tin dưới ảnh vì không nằm trong `.trending-grid`.

### 9.2. CSS

**File cần sửa:** `css/styles.css`


```css
.community  {
    padding-block: 64px 80px;
}

.community-grid  {
    grid-template-columns: repeat(4, minmax(0, 1fr));
}

#search-status:empty  {
    display: none;
}
```

**Giải thích:**

---

<a id="buoc-10"></a>

## Bước 10 — About banner và footer

### 10.1. HTML cuối `main`

**File cần sửa:** `index.html`


```html
<section id="about" class="about-banner">
  <div class="container about-inner">
    <h2>Bạn mới đến? Tìm hiểu về bọn mình tại đây!</h2>
    <a class="button button-primary button-offset" href="./about.html">ABOUT US</a>
  </div>
</section>
```

**Giải thích:**

### 10.2. HTML bên trong `footer`

**File cần sửa:** `index.html`


```html
<div class="container footer-grid">
  <div class="footer-brand">
    <img src="./assets/images/logo.png" alt="NomNom">
    <h3>Ăn ngon trọn vị, chi tiêu hợp lý.</h3>
    <p>Khám phá công thức từ những nguyên liệu bạn có.</p>
  </div>
  <div><h3>RECIPES</h3><a href="./recipes.html">All recipes</a><a href="#categories">Categories</a></div>
  <div><h3>ABOUT</h3><a href="./about.html">About NomNom</a><a href="./faq.html">FAQ</a></div>
  <div><h3>CONTACT</h3><a href="./contact.html">Contact us</a></div>
</div>
<p class="copyright">© 2026 NomNom. All rights reserved.</p>
```

**Giải thích:**

Đây là số liên kết tối thiểu để dựng khung. Bổ sung những liên kết còn lại trong ảnh khi bạn có trang đích hoặc URL mạng xã hội chính xác.

### 10.3. CSS

**File cần sửa:** `css/styles.css`


```css
.about-banner  {
    padding-block: 24px;
    background: var(--black);
    color: var(--white);
}

.about-inner  {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
}

.about-inner h2  {
    margin: 0;
    font-size: 26px;
    text-transform: uppercase;
}

.site-footer  {
    padding-block: 24px;
}

.footer-grid  {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    padding-top: 28px;
    border-top: 1px solid #ddd;
}

.footer-brand img  {
    width: 170px;
}

.footer-grid h3  {
    font-size: 16px;
}

.footer-grid p, .footer-grid a  {
    font-size: 14px;
}

.footer-grid a  {
    display: block;
    margin-bottom: 10px;
    text-decoration: none;
}

.copyright  {
    margin: 48px 20px 0;
    text-align: center;
    font-size: 12px;
    color: var(--muted);
}
```

**Giải thích:**


---

# Giai đoạn D: Responsive

---

<a id="buoc-11"></a>

## Bước 11 — Responsive

### 11.1. Tablet — thêm cuối CSS

**File cần sửa:** `css/styles.css`


```css
@media (max-width: 1024px)  {
    .header-inner  {
        flex-wrap: wrap;
        padding-block: 16px;
    }

    .main-nav  {
        gap: 16px;
    }

    .hero  {
        gap: 28px;
    }

    .featured-layout  {
        grid-template-columns: 1fr;
    }

    .sidebar  {
        padding-left: 0;
        border-left: 0;
    }

    .community-grid  {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .footer-grid  {
        gap: 24px;
    }

}
```

**Giải thích:**

Sidebar xuống dưới vì màn hình không đủ chỗ cho hai cột lớn/nhỏ.

### 11.2. Mobile — thêm tiếp CSS

**File cần sửa:** `css/styles.css`


```css
@media (max-width: 640px)  {
    .container  {
        width: calc(100% - 32px);
    }

    .logo img  {
        width: 130px;
    }

    .header-inner  {
        gap: 12px;
    }

    .menu-toggle  {
        display: block;
        margin-left: auto;
    }

    .main-nav  {
        display: none;
        width: 100%;
        order: 3;
        margin-left: 0;
    }

    .main-nav.is-open  {
        display: flex;
        flex-direction: column;
    }

    .header-actions  {
        width: 100%;
        flex-wrap: wrap;
    }

    .hero  {
        grid-template-columns: 1fr;
        padding-block: 28px 40px;
    }

    .hero-slider  {
        min-height: 280px;
    }

    .hero-cta  {
        font-size: 24px;
    }

    .search-form  {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
    }

    .search-form label  {
        text-align: center;
    }

    .category-list  {
        display: flex;
        overflow-x: auto;
        padding-bottom: 12px;
    }

    .category-item  {
        flex: 0 0 88px;
    }

    .section-badge  {
        padding: 10px 20px;
        font-size: 20px;
    }

    .section-title  {
        font-size: 22px;
        gap: 12px;
    }

    .recipe-grid  {
        gap: 16px;
    }

    .recipe-info h3  {
        font-size: 15px;
    }

    .trending-grid .recipe-info  {
        position: static;
    }

    .price-banner  {
        grid-template-columns: 1fr;
    }

    .price-photo, .price-content  {
        padding: 28px;
    }

    .price-label  {
        font-size: 20px;
    }

    .about-inner  {
        flex-direction: column;
        align-items: flex-start;
    }

    .footer-grid  {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .footer-brand  {
        grid-column: 1 / -1;
    }

}

@media (max-width: 360px)  {
    .trending-grid, .community-grid  {
        grid-template-columns: 1fr;
    }

}
```

**Giải thích:**

Trên mobile, đưa thông tin card xuống dưới ảnh để tránh chữ phủ kín món ăn. Danh mục có cuộn ngang riêng, toàn trang vẫn phải nằm gọn trong màn hình.


---

# Giai đoạn E: JavaScript

## Hiểu `data.js` trước khi viết JS

`data.js` chỉ là file chứa **dữ liệu mẫu ở frontend**. Ví dụ: tên món, ảnh, giá, thời gian nấu. Nó không phải database, không gọi API và không cần backend.

- `index.html`: tạo các khu vực trên trang.
- `styles.css`: định dạng giao diện.
- `data.js`: chứa danh sách món mẫu.
- `script.js`: lấy danh sách đó để tạo card, tìm kiếm và điều khiển giao diện.

Ở phần trước bạn đã viết card bằng HTML để học bố cục. Phần sau tạo cùng kiểu card bằng JS để tìm kiếm dễ hơn. Khi JS render, các card mẫu trong container sẽ được thay thế, không cộng thêm vào danh sách.

---

<a id="buoc-12"></a>

## Bước 12 — Đưa dữ liệu vào `data.js`

### 12.1. Tạo mảng công thức

**📁 File: `js/data.js`**

**Thao tác:** thêm đoạn sau vào file:

```js
const recipes = [
  { id: 'chili', name: 'Black Bean Chili', image: './assets/images/chili.jpg', price: 25000, cookTime: 30, category: 'mon-chay', trending: true },
  { id: 'ga', name: 'Gà áp chảo', image: './assets/images/chili.jpg', price: 35000, cookTime: 25, category: 'mon-ga', trending: true },
  { id: 'rau', name: 'Rau củ xào', image: './assets/images/chili.jpg', price: 18000, cookTime: 15, category: 'mon-xao', trending: true },
  { id: 'canh', name: 'Canh nấm', image: './assets/images/chili.jpg', price: 20000, cookTime: 20, category: 'mon-nuoc', trending: true }
];
```

**Giải thích:**

- `[]`: mảng chứa nhiều công thức.
- `{}`: object chứa thông tin một công thức.
- `id`: mã riêng, dùng cho đường dẫn chi tiết.
- `price`, `cookTime`: số để dễ tính toán và định dạng.
- `trending`: boolean cho biết món có thuộc nhóm thịnh hành không.
- Ảnh đang dùng chung để demo. Thay bằng ảnh đúng từng món sau.

Không lưu mật khẩu hoặc thông tin bí mật trong file này: người mở trang có thể đọc mã JavaScript.

### 12.2. Hàm tạo một card

**📁 File: `js/script.js`**

**Thao tác:** thêm đoạn sau vào file:

```js
const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND'
});

function createRecipeCard(recipe) {
  const card = document.createElement('article');
  card.className = 'recipe-card';

  const link = document.createElement('a');
  link.className = 'recipe-card-link';
  link.href = `./recipe.html?id=${encodeURIComponent(recipe.id)}`;

  const image = document.createElement('img');
  image.src = recipe.image;
  image.alt = recipe.name;
  image.loading = 'lazy';

  const info = document.createElement('div');
  info.className = 'recipe-info';

  const title = document.createElement('h3');
  title.textContent = recipe.name;
  const price = document.createElement('p');
  price.textContent = `${money.format(recipe.price)} / phần`;
  const time = document.createElement('p');
  time.textContent = `Thời gian nấu: ${recipe.cookTime} phút`;

  info.append(title, price, time);
  link.append(image, info);
  card.append(link);
  return card;
}
```

**Giải thích:**

Hàm nhận một object rồi tạo đúng cấu trúc card đã viết tay ở phần “Viết một card HTML mẫu”. `textContent` điền chữ; `append` ghép phần tử con; `return` trả về card để đặt vào trang. `Intl.NumberFormat` định dạng tiền theo Việt Nam.

### 12.3. Render cả danh sách

**📁 File: `js/script.js` — thêm cuối file.**

```js
const trendingList =document.querySelector('#trending-list');
const communityList =document.querySelector('#community-list');

function renderRecipes(container, items) {
  const cards = items.map(createRecipeCard);
  container.replaceChildren(...cards);
}

renderRecipes(trendingList, recipes.filter(recipe => recipe.trending).slice(0, 4));
renderRecipes(communityList, recipes.slice(0, 4));
```

**Giải thích:**

`querySelector` tìm phần tử HTML. `map` biến từng object thành card. `replaceChildren` thay nội dung container, vì vậy không bị trùng với card HTML mẫu. `filter` chọn món thịnh hành; `slice(0, 4)` lấy tối đa bốn món.

**Tự thử:** đổi tên món trong data.js rồi tải lại trang. Nếu chữ trên card đổi, bạn đã hiểu kết nối giữa dữ liệu và giao diện.

---

<a id="buoc-13"></a>

## Bước 13 — Tìm kiếm bằng JavaScript

### 13.1. Chuẩn hóa chữ

**📁 File: `js/script.js` — thêm cuối file.**

```js
function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim();
}
```

**Giải thích:**

Hàm bỏ dấu, chuyển chữ thường và xóa khoảng trắng đầu/cuối. Nhờ đó, nhập `ga` có thể khớp `Gà`.

### 13.2. Xử lý submit

**File cần sửa:** `js/script.js`


```js
const searchInput =document.querySelector('#recipe-search');
const searchStatus =document.querySelector('#search-status');

document.querySelector('#search-form').addEventListener('submit', event => {
  event.preventDefault();
  const keyword = normalizeText(searchInput.value);
  const results = recipes.filter(recipe => normalizeText(recipe.name).includes(keyword));

  renderRecipes(communityList, keyword ? results : recipes.slice(0, 4));
  searchStatus.textContent = keyword
    ? (results.length ? `Tìm thấy ${results.length} công thức.` : 'Không tìm thấy công thức phù hợp.')
    : '';
 document.querySelector('#community-title').textContent = keyword
    ? 'Kết quả tìm kiếm'
    : 'Công thức mới từ cộng đồng!';
  communityList.scrollIntoView({ block: 'start' });
});
```

**Giải thích:**

`preventDefault` ngăn form tải lại trang. `includes` kiểm tra tên món có chứa từ khóa không. Kết quả xuất hiện trong khu vực cộng đồng; tìm kiếm trống khôi phục bốn món ban đầu.

### 13.3. Nút kính lúp trên header

**File cần sửa:** `js/script.js`


```js
document.querySelector('#focus-search').addEventListener('click', () => {
  searchInput.focus();
});
```

**Giải thích:**

`focus()` đưa con trỏ vào ô tìm kiếm, để nút header có chức năng cụ thể.

---

<a id="buoc-14"></a>

## Bước 14 — Slider bằng JavaScript

### 14.1. Dữ liệu và trạng thái

**📁 File: `js/script.js` — thêm cuối file.**

```js
const slides = [
  { title: 'Nấu ngon mỗi ngày', description: 'Khám phá các công thức nổi bật.', cta: 'Khám phá', href: '#trending' },
  { title: 'Tận dụng tủ lạnh', description: 'Bắt đầu từ nguyên liệu bạn đang có.', cta: 'Chọn nguyên liệu', href: './ingredients.html' },
  { title: 'Cùng nhau vào bếp', description: 'Tìm cảm hứng từ cộng đồng NomNom.', cta: 'Xem công thức', href: '#community-title' }
];
let currentSlide = 0;
const dots =document.querySelectorAll('.slide-dots button');
```

**Giải thích:**

Mảng chứa nội dung; biến `currentSlide` lưu slide hiện tại, bắt đầu từ chỉ số 0.

### 14.2. Hàm cập nhật nội dung

**File cần sửa:** `js/script.js`


```js
function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  const slide = slides[currentSlide];
 document.querySelector('#slide-title').textContent = slide.title;
 document.querySelector('#slide-description').textContent = slide.description;
  const link =document.querySelector('#slide-link');
  link.textContent = slide.cta;
  link.href = slide.href;

  dots.forEach((dot, i) => {
    if (i === currentSlide) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
}
```

**Giải thích:**

Phép `%` giúp quay vòng: sau slide cuối trở về đầu, trước slide đầu trở về cuối. Chấm hiện tại mang `aria-current="true"`, CSS sẽ tô trắng.

### 14.3. Gắn sự kiện nút

**File cần sửa:** `js/script.js`


```js
document.querySelector('#slide-prev').addEventListener('click', () => showSlide(currentSlide - 1));
document.querySelector('#slide-next').addEventListener('click', () => showSlide(currentSlide + 1));
dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));
showSlide(0);
```

**Giải thích:**

Bản này chuyển bằng nút, chưa tự chạy. Kiểm tra đủ ba chấm và thử bấm qua đầu/cuối.

### 14.4. JS mở menu mobile

**📁 File: `js/script.js` — thêm cuối file.**

```js
const menuToggle =document.querySelector('.menu-toggle');
const mainNav =document.querySelector('#main-nav');

function setMenuOpen(open) {
  mainNav.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
}

menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

mainNav.addEventListener('click', event => {
  if (event.target.closest('a')) setMenuOpen(false);
});
```

**Giải thích:**

`classList.toggle` bật/tắt class hiển thị. `aria-expanded` thông báo menu đang mở hay đóng. Escape đóng menu và trả focus về nút mở.


---

# Kiểm tra cuối cùng

## Giao diện

- [ ] Đủ header, hero, tìm kiếm, danh mục, công thức, sidebar, banner và footer.
- [ ] Thêm đủ bảy danh mục và ba thành viên theo mẫu.
- [ ] Ảnh hiển thị, không méo, không lỗi đường dẫn.
- [ ] Kiểm tra ở 375px, 768px, 1024px và 1440px.
- [ ] Trang không tràn ngang; hàng danh mục được phép cuộn riêng.

## Tương tác

- [ ] Tìm `ga` ra Gà áp chảo.
- [ ] Từ không tồn tại hiện thông báo không có kết quả.
- [ ] Tìm kiếm trống khôi phục danh sách.
- [ ] Slider chuyển được bằng mũi tên và ba chấm.
- [ ] Menu mobile mở/đóng được; Escape đóng menu.
- [ ] Console không có lỗi.

## Chỉnh cho giống ảnh hơn

Sau khi khung chạy ổn, chỉnh lần lượt: **bố cục → kích thước → khoảng cách → font → màu → viền và bóng**.

Bổ sung icon SVG, dropdown header, texture vàng và các liên kết footer khi cần. Đăng ký, đăng nhập, chi tiết món và so sánh giá hiện chỉ là đường dẫn tới các trang chưa xây; homepage này không xử lý tài khoản hay giá thực tế.
