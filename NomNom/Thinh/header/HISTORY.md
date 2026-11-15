# AI thao tác — Header responsive và tự ẩn

**Đánh dấu: AI thao tác.**

- Ngày: 15/11/2026.
- Thực hiện bởi: AI (Codex), theo phương án người dùng đã duyệt.
- Mục tiêu: header theo kích thước màn hình, tự ẩn sau 4 giây không tương tác;
  có hướng dẫn để người mới học tự chỉnh tiếp.

## 1. Những file AI chỉnh

| File | Thay đổi |
| --- | --- |
| [style.css](style.css) | Chiều cao theo màn hình; nút Menu; panel trên màn hình nhỏ; hiệu ứng trượt và giảm chuyển động. |
| [header.js](header.js) | Mở / đóng Menu; bộ đếm 4 giây; gọi header hiện lại; giữ hiện khi đang dùng. |
| [index.html](index.html) | Thêm nút Menu, id vùng điều khiển và nhãn tìm kiếm cho bản khách. |
| [ed - index.html](<ed - index.html>) | Cập nhật tương tự cho bản thành viên. |
| [Trang chủ](../../Thach/Home-page/index.html) | Đồng bộ đúng khối header đã ghép để dùng được chức năng mới. |
| [README.md](README.md) | Bổ sung cách dùng responsive và liên kết tài liệu này. |
| [Bảng class / id](../class-id-header-footer.md) | Ghi lại tên mới theo quy ước một dấu `_`. |

Phần main và footer không thuộc thay đổi header lần này.

## 2. Hành vi sau khi sửa

| Trạng thái | Header làm gì? |
| --- | --- |
| Màn hình rộng hơn 1000px | Logo và menu nằm ngang. |
| Màn hình từ 1000px trở xuống | Một hàng logo + nút Menu; bấm để mở các mục bên dưới. |
| Không tương tác với header 4 giây | Header trượt lên và ẩn, kể cả trang đứng yên. |
| Rê chuột trong 24px sát mép trên màn hình | Header hiện lại và tính lại thời gian chờ. |
| Cuộn ngược lên | Header hiện lại; dùng được trên điện thoại. |
| Nhấn Tab | Header hiện lại để điều hướng bằng bàn phím. |
| Menu hoặc thanh tìm kiếm đang mở | Giữ header hiện. |
| Đang nhập hoặc focus bằng bàn phím trong header | Giữ header hiện. |
| Bấm Menu lần nữa, bấm ngoài hoặc chọn mục | Đóng Menu. |
| Nhấn Escape khi menu con đang mở | Đóng menu con trước và trả focus về nút mở nó. |
| Nhấn Escape khi không còn menu con | Đóng Menu và trả focus về nút Menu. |

Di chuyển chuột ở phần main không tính là đang dùng header. Cuộn xuống không
phải điều kiện ẩn: bộ đếm không tương tác mới quyết định lúc nào ẩn.

## 3. HTML: thêm nút điều khiển

Nút Menu nằm ngay sau khối logo và trước `.site-header_controls`:

```html
<button class="site-header_menu-toggle" type="button" data-header-menu-toggle
    aria-controls="site-header_controls" aria-expanded="false" aria-label="Mở menu">
    <span class="site-header_menu-icon" aria-hidden="true">
        <span></span><span></span><span></span>
    </span>
    <span>Menu</span>
</button>
<div class="site-header_controls" id="site-header_controls">
    <!-- Các mục điều hướng, tài khoản và tìm kiếm đang có -->
</div>
```

- `type="button"`: nút thao tác, không gửi form.
- `data-header-menu-toggle`: thuộc tính tự đặt để JS tìm nút.
- `aria-controls`: tên id của vùng mà nút điều khiển. Hai giá trị phải giống nhau.
- `aria-expanded="false"`: trạng thái đang đóng; JS đổi thành `true` khi mở.
- Ba `span` rỗng được CSS vẽ thành ba nét; lúc mở chúng chuyển thành dấu X.
- `aria-hidden="true"` trên hình trang trí giúp trình đọc màn hình chỉ đọc tên nút.

Khi ghép tay vào trang khác, copy cả nút này và vùng điều khiển. Các đường dẫn ảnh
vẫn cần tính từ trang HTML đích, như cách đã ghép trang chủ.

## 4. CSS: vì sao dùng sticky?

```css
.site-header {
    position: sticky;
    top: 0;
}
```

`sticky` giữ chỗ của header trong bố cục và bám ở mép trên khi cuộn. Vì vậy main
bắt đầu sau header. `top: 0` là mốc bám, không phải khoảng cách giữa header và main.

Khi ẩn bằng `transform`, header vẫn giữ chỗ ban đầu trong bố cục để nội dung không
nhảy. Nếu đang ở đúng đầu trang, chỗ ban đầu đó vẫn còn; khi đã cuộn xuống thì nó
nằm ngoài vùng nhìn. Khi ghép vào trang khác, ancestor có `overflow` hoặc vùng bao
header quá ngắn có thể thay đổi cách `sticky` hoạt động.

### Cách chỉnh theo màn hình

```css
@media (max-width: 1000px) {
    .site-header {
        --site-header-height: 72px;
        font-size: 16px;
    }
}
```

- `max-width: 1000px`: các quy tắc bên trong áp dụng khi màn hình rộng tối đa 1000px.
- `--site-header-height`: biến CSS, được đọc bằng `var(--site-header-height)`.
- Header desktop dùng 106px; màn hình nhỏ dùng 72px.
- Trên màn hình nhỏ, panel nằm ngay dưới thanh logo bằng `position: absolute; top: 100%`.
- `max-height` và `overflow-y: auto` giúp cuộn bên trong panel khi màn hình thấp.
  Công thức trừ thêm 16px để chừa chỗ phía dưới, kể cả bản HTML xem thử còn lề body.
- Menu đóng dùng `visibility`, `opacity` và `pointer-events`; JS bổ sung `inert`
  để các mục đang ẩn không nhận focus bàn phím.
- Nếu JS không chạy, các mục vẫn hiện để có thể điều hướng.

Nếu đổi mốc 1000px, phải sửa **cả CSS và chuỗi `matchMedia` trong JS**.

### Cách tạo hiệu ứng trượt

```css
.site-header {
    transform: translateY(0);
    transition: transform 0.25s ease;
}

.site-header.site-header_hidden {
    transform: translateY(calc(-100% - 8px));
}
```

- `translateY(0)`: ở vị trí bình thường.
- `-100%`: đẩy lên một khoảng bằng chính chiều cao header; thêm 8px để giấu bóng đổ.
- `0.25s`: chuyển động kéo dài một phần tư giây, khác với thời gian chờ 4 giây.
- Hai selector ghép liền nghĩa là **cùng một phần tử có cả hai class**.
- `prefers-reduced-motion: reduce` tắt hiệu ứng khi hệ điều hành yêu cầu giảm chuyển động.

## 5. JavaScript: hẹn ẩn rồi hủy lịch cũ

Trong `header.js`, tìm các tên sau:

| Muốn chỉnh | Tìm trong code | Giá trị hiện tại |
| --- | --- | --- |
| Thời gian chờ trước khi ẩn | `IDLE_DELAY` | `4000` ms = 4 giây |
| Vùng rê chuột để gọi header hiện lại | `REVEAL_EDGE` | `24` px |
| Mốc chuyển sang nút Menu | `mobileScreen` | `(max-width: 1000px)` |
| Tốc độ trượt header | CSS `transition` trên `.site-header` | `0.25s` |

Ví dụ đổi thời gian chờ thành 6 giây:

```js
const IDLE_DELAY = 6000;
```

`const` khai báo giá trị không gán lại trong lúc chương trình chạy. `let idleTimer`
lưu mã bộ đếm; mã này thay đổi mỗi lần hẹn lại nên dùng `let`.

Đây là ý chính, đã rút gọn để học; bản đang chạy còn kiểm tra menu và bàn phím:

```js
let idleTimer;

function restartIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        header.classList.add("site-header_hidden");
    }, 4000);
}
```

Đọc theo thứ tự:

1. `function` gom các lệnh thành một công việc có tên.
2. `clearTimeout(idleTimer)` hủy lịch trước đó.
3. `setTimeout(...)` đặt lịch chạy hàm sau số mili giây đã cho; không làm trang đứng chờ.
4. `() => { ... }` là hàm mũi tên: phần trong ngoặc nhọn chạy khi đến giờ.
5. `classList.add(...)` thêm class; CSS thấy class đó và trượt header lên.

Khi cần hiện lại:

```js
function showHeader() {
    header.classList.remove("site-header_hidden");
    restartIdleTimer();
}

header.addEventListener("pointermove", showHeader);
```

`classList.remove` bỏ class ẩn. `addEventListener` đăng ký công việc sẽ chạy khi
có sự kiện. Ở dòng trên, truyền tên hàm `showHeader` để trình duyệt gọi sau này;
không viết `showHeader()` vì cách đó gọi hàm ngay lúc đăng ký.

Trong bản thực tế, `isUsingHeader()` kiểm tra menu mở, tìm kiếm mở hoặc đang nhập /
dùng bàn phím. Nếu đang dùng thì hủy lịch ẩn và chờ đến khi kết thúc thao tác.

### Mở / đóng Menu

```js
header.classList.toggle("site-header_menu-open", expanded);
menuButton.setAttribute("aria-expanded", String(expanded));
```

- `expanded` là giá trị boolean: `true` hoặc `false`.
- `toggle(class, true)` thêm class; `toggle(class, false)` xóa class.
- `String(expanded)` đổi boolean thành chuỗi để ghi vào thuộc tính HTML.
- CSS quyết định panel trông ra sao khi có class; JS quyết định lúc nào thêm / xóa nó.

## 6. Tự kiểm tra bằng Live Server

1. Mở trang chủ, để chuột ở phần main và không thao tác header khoảng 4 giây.
2. Rê chuột sát mép trên: header phải hiện lại.
3. Cuộn xuống, chờ header ẩn; cuộn ngược lên để gọi lại.
4. Thu cửa sổ xuống 1000px hoặc nhỏ hơn: logo và nút Menu nằm cùng hàng.
5. Mở Menu, mở tìm kiếm rồi nhập: header phải giữ hiện dù chờ hơn 4 giây.
6. Thử Escape, bấm ngoài và bấm lại Menu.
7. Thử Tab; khi Menu đóng, Tab không đi vào các mục đang ẩn.
8. Thử cả bản khách và thành viên, rồi kéo cửa sổ qua lại mốc 1000px.

## 7. Kết quả kiểm tra của AI

- [x] `node --check header.js`: không có lỗi cú pháp.
- [x] `git diff --check`: không có lỗi khoảng trắng trong phần thay đổi.
- [x] Ba khối header: mỗi bản có 20 class trong HTML và 5 id duy nhất;
  các đích `aria-controls` và đường dẫn ảnh hợp lệ.
- [x] Bản khách và thành viên: kiểm tra các chiều rộng 320, 375, 768, 1000,
  1001, 1024, 1280, 1440 và 1920px; header không tràn ngang.
- [x] Ở 320 × 320px: panel nằm trong màn hình và có thể cuộn bên trong.
- [x] Trang chủ: header hiện kết thúc tại y = 106px và main bắt đầu tại y = 106px.
- [x] Không tương tác: header ẩn sau 4 giây, vị trí main không nhảy.
- [x] Tương tác lại với header hủy lịch cũ và đặt lại thời gian chờ.
- [x] Mép trên, cuộn ngược lên và Tab đều gọi header hiện lại.
- [x] Menu, tìm kiếm và focus bàn phím giữ header hiện sau hơn 4 giây.
- [x] Bấm ngoài và Escape đóng đúng menu, trả focus về nút phù hợp.
- [x] Khi Menu nhỏ đóng, Tab không đi vào vùng điều khiển đang ẩn.
- [x] Đổi qua lại mốc 1000px cập nhật Menu và `inert` đúng.
- [x] API tài khoản và sự kiện yêu cầu đăng nhập vẫn hoạt động.
- [x] Tìm kiếm gửi GET với từ khóa tiếng Việt / ký tự `&` đã trim và mã hóa đúng.
- [x] Thông báo chờ tích hợp được ẩn cùng header và được đóng khi mở Menu.
- [x] Tắt JavaScript trên trình duyệt: các mục điều hướng vẫn hiện để sử dụng.
- [x] Bật giảm chuyển động: header, panel và icon đều có thời gian chuyển động 0 giây.
- [x] Kiểm tra trang chủ sau tải và thao tác: không có lỗi JavaScript runtime.

Các kiểm tra responsive chạy trong Microsoft Edge bằng kích thước viewport;
chưa thay thế việc thử trên điện thoại thật. Trang đăng nhập và trang nhận kết
quả tìm kiếm vẫn do phần phụ trách tương ứng hoàn thiện.
