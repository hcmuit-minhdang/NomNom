# Đối chiếu thanh tìm kiếm với Figma

Nguồn: [Thanh tìm kiếm — node 933:3219](https://www.figma.com/design/1XVDA0jnedoKuCL9rYodr7/IE104?node-id=933-3219).

Đã đọc kích thước từ metadata và kiểm tra hình, viền, font, màu, bóng trực tiếp trong ứng dụng Figma. Công cụ get_design_context bị giới hạn lượt đọc; các thông số dưới đây được đối chiếu bằng giao diện Figma. Đã áp dụng phần ô nhập và đổi icon bằng HTML/CSS vào `NomNom/Thinh/header/index.html` và `style.css` theo yêu cầu sửa trực tiếp; chưa thêm JavaScript.

## 1. Thông số đã kiểm tra

| Phần | Thông số trong Figma |
| --- | --- |
| Nền trắng phía dưới Header | 1600 × 113px |
| Khung ô nhập — SearhBar_Com, node 933:3221 | 995 × 71px; x = 303 trong khung rộng 1600px |
| Khoảng cách ô nhập tới mép trên nền trắng | 21px: nền bắt đầu ở y = 84, ô nhập ở y = 105 |
| Nền ô nhập | Trắng #FFFFFF; góc vuông |
| Viền ô nhập | 3px, màu #373636, Stroke align Inside |
| Bóng vàng của khung ô nhập | X = 6px, Y = 4px, Blur = 4px, Spread = 0; #FBC41C, độ đục 100% |
| Placeholder | “Tìm kiếm ...”; Inter Medium Italic, 32px; line-height Auto, Figma đo khoảng 39px |
| Màu placeholder | Đen #000000, độ đục 35% |
| Vị trí placeholder trong khung | x = 19px, y = 15px |
| Icon tìm bên phải ô nhập | 40 × 40px; x = 933px, y = 15px trong ô nhập; cách mép phải 22px |
| Icon X — node 933:3227 | 52 × 52px; nằm trong vùng trắng 95 × 79px phía trên nền tìm kiếm |

Frame tổng “Thanh tìm kiếm” cao 197px gồm cả vùng nút X phía trên và nền 113px bên dưới. Không lấy 197px làm chiều cao của riêng phần nền dưới Header.

## 2. Phần đã áp dụng

- Đã có details.search-bar-butt và summary chứa kính lúp: đây là cơ chế mở/đóng sẵn của HTML.
- Header đã position relative; #search-bar đã absolute, top 100%, căn giữa theo Header, cao 113px. Giữ cách định vị đó.
- Đã thêm `.search-field`, input có nhãn “Từ khóa tìm kiếm”, placeholder và nút kính lúp ở cuối ô. Nút dùng `type="button"`; chưa xử lý kết quả tìm kiếm.
- Đã xuất trực tiếp instance Search 933:3224 thành `assets/SVG/Search_input.svg` (40 × 40px) và X 933:3227 thành `assets/SVG/X.svg` (52 × 52px), giữ nguyên dữ liệu SVG xuất từ Figma.
- Summary chứa hai ảnh; selector `[open]` quyết định ảnh nào được hiện. Nhấn X đóng lại chính details đó.
- Vùng summary cố định 52 × 52px ở cả hai trạng thái để tránh nhích các nút. Đây là điều chỉnh phù hợp Header hiện tại, khác vùng bao 95 × 79px trong Figma. Nhóm `.two-three-button` đổi sang `width: auto` để đủ chỗ cho icon X.

## 3. Cách đọc phần ô nhập đã thêm

Khung chung bên trong #search-bar dùng viền và bóng để bao cả ô nhập lẫn icon ở cuối. Input có nhãn qua aria-label. Đoạn dưới rút gọn để đọc cấu trúc; mã đã áp dụng có nút kính lúp ở vị trí comment.

```html
<div id="search-bar">
    <div class="search-field" role="search" aria-label="Tìm công thức">
        <input type="search" name="q"
               placeholder="Tìm kiếm ..."
               aria-label="Từ khóa tìm kiếm">
        <!-- Đặt icon/nút tìm kiếm ở cuối khung này. -->
    </div>
</div>
```

Các thuộc tính đã bổ sung vào #search-bar đặt ô nhập ở giữa nền trắng:

```css
display: flex;
align-items: center;
justify-content: center;
padding: 0 20px;
```

CSS phần ô nhập dùng số đo đã kiểm tra. Padding trái 16px cộng viền 3px đặt chữ cách mép ngoài 19px; padding phải 19px cộng viền 3px đặt icon cách mép phải 22px. Mã thực tế có thêm gap 16px để chữ không sát icon khi nhập dài.

```css
.search-field {
    display: flex;
    align-items: center;
    width: 995px;
    max-width: 100%;
    height: 71px;
    box-sizing: border-box;
    padding: 0 19px 0 16px;
    border: 3px solid #373636;
    background-color: white;
    box-shadow: 6px 4px 4px 0 #fbc41c;
}

.search-field input {
    flex: 1;
    min-width: 0;
    padding: 0;
    border: 0;
    background: transparent;
    font: inherit;
    font-size: 32px;
    font-weight: 500;
    line-height: 39px;
    color: black;
}

.search-field input::placeholder {
    color: rgba(0, 0, 0, 0.35);
    font-style: italic;
    opacity: 1;
}
```

Giữ dấu focus bàn phím; không thêm outline none nếu chưa có cách thay thế đủ rõ. Mẫu font là Medium Italic; nếu dự án chưa tải font italic tương ứng, trình duyệt có thể tạo chữ nghiêng tổng hợp, cần kiểm tra lại trước khi kết luận khớp font.

Nút tìm cuối ô dùng button type button, aria-label “Tìm kiếm” và không cho nút co. Ảnh Search_input.svg bên trong giữ kích thước gốc 40 × 40px và dùng alt rỗng vì nút đã có nhãn. Chưa nối xử lý tìm kết quả.

## 4. Cách đổi kính lúp thành X bằng trạng thái open

Hai ảnh được đặt trong cùng summary; X.svg đã tồn tại trong thư mục assets/SVG:

```html
<summary>
    <img class="Search-icon search-open-icon"
         src="../assets/SVG/Search_Com.svg"
         alt="Mở thanh tìm kiếm">
    <img class="search-close-icon"
         src="../assets/SVG/X.svg"
         alt="Đóng thanh tìm kiếm">
</summary>
```

Summary giữ kích thước 52 × 52px ở cả hai trạng thái; X giữ nguyên kích thước SVG, kính lúp trên Header vẫn dùng kích thước 30px bạn đã đặt trước đó. Không cần đổi kích thước summary khi mở.

```css
.search-bar-butt > summary > .search-close-icon {
    display: none;
}

.search-bar-butt[open] > summary > .search-open-icon {
    display: none;
}

.search-bar-butt[open] > summary > .search-close-icon {
    display: block;
}
```

Khi đóng, kính lúp hiện. Khi mở, kính lúp ẩn và X hiện. Nhấn X vẫn là nhấn summary nên details tự đóng; không cần JavaScript cho thao tác này. Hai ảnh có alt khác nhau để tên điều khiển theo đúng trạng thái, không dùng aria-label cố định “Mở” trên summary khi đang hiện X.

## 5. Kiểm tra và giới hạn

- Đã thử trực tiếp trên Brave: nhấn kính lúp để mở, nhấn X để đóng, mở lại bằng Enter, Tab tới input và đóng bằng Shift+Tab rồi Space.
- Đã nhập thử “Bánh mì”: chữ hiển thị, placeholder biến mất; đóng rồi mở lại vẫn giữ nội dung. Đã xóa từ khóa thử sau kiểm tra.
- Kiểm tra icon X trên Header khác với dấu xóa nội dung có thể xuất hiện trong input type search của trình duyệt.
- Kiểm tra ở khung rộng 1600px để đối chiếu số đo, rồi thu cửa sổ để xem ô nhập có bị tràn không. Bố cục Header hiện còn gap/width cố định; đây là vấn đề khác với khung nhập.
- Chưa làm JavaScript, lấy kết quả tìm kiếm, tự focus khi mở, đóng bằng Escape hoặc click ngoài.

Các đoạn trên giải thích mã đã áp dụng. Font hiện có chỉ gồm Inter Variable không kèm file italic riêng; chữ nghiêng của placeholder do trình duyệt tạo. Header vẫn còn gap/width cố định từ trước, nên chưa coi toàn bộ Header là đã hoàn thiện cho mobile.
