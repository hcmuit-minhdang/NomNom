# Review thư mục header

[Tổng quan](../README.md) · [Header](header.md) · [Footer](footer.md) · [Login](login.md) · [Signup](signup.md) · [Quy ước chung](class-id.md) · [Nhật ký AI](lich-su-ai.md)

Nguồn: [HTML khách](../header/index.html), [HTML thành viên](<../header/ed - index.html>), [CSS](../header/style.css), [JavaScript](../header/header.js).

Khi ghép, ưu tiên [placeholder và header.js](../README.md#ghép-header-bằng-placeholder-khuyên-dùng).
File JS tự tải khối header khách trong `header/index.html`, CSS và khởi tạo hành vi.
Hai bản HTML khách/thành viên vẫn là bản xem thử; header đã chép tay vẫn được hỗ trợ.
Mỗi trang chỉ có một header, tránh trùng id.

Class/id riêng nằm ngay trong tài liệu này; [quy ước đặt tên chung](class-id.md) được giữ riêng; kết quả kiểm tra các lần AI sửa được lưu tại [Nhật ký AI](lich-su-ai.md#header-responsive-và-tự-ẩn).

## 1. Cấu trúc và class/id

Trên trang ghép, `#header-placeholder` là vùng tạm trước main; loader thay cả vùng
này bằng khối `header` bên dưới. Thuộc tính tùy chọn `data-header-active="categories"`
giúp đánh dấu nhóm Danh mục đang xem, không đổi URL hay chặn thao tác mở link.

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
| `.site-header_hidden` | `header`, JS thêm / xóa | Trạng thái tự ẩn sau 4 giây không tương tác khi đã cuộn khỏi đầu trang. |

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
[Hướng dẫn Header](header.md).

## 2. Hành vi hiện tại

| Trạng thái | Header làm gì? |
| --- | --- |
| Màn hình rộng hơn 1000px | Logo và menu nằm ngang. |
| Màn hình từ 1000px trở xuống | Một hàng logo + nút Menu; bấm để mở các mục bên dưới. |
| Đang ở đầu trang (`window.scrollY <= 0`) | Header luôn hiện, không đặt bộ đếm ẩn. |
| Đã cuộn xuống và không tương tác với header 4 giây | Header trượt lên và ẩn, kể cả trang đứng yên. |
| Rê chuột trong 24px sát mép trên màn hình | Header hiện lại và tính lại thời gian chờ. |
| Cuộn ngược lên | Header hiện lại; dùng được trên điện thoại. |
| Nhấn Tab | Header hiện lại để điều hướng bằng bàn phím. |
| Menu hoặc thanh tìm kiếm đang mở | Giữ header hiện. |
| Đang nhập hoặc focus bằng bàn phím trong header | Giữ header hiện. |
| Bấm Menu lần nữa, bấm ngoài hoặc chọn mục | Đóng Menu. |
| Nhấn Escape khi menu con đang mở | Đóng menu con trước và trả focus về nút mở nó. |
| Nhấn Escape khi không còn menu con | Đóng Menu và trả focus về nút Menu. |

Di chuyển chuột ở phần main không tính là đang dùng header. Cuộn xuống không
ẩn header ngay: khi rời đầu trang, bộ đếm không tương tác mới bắt đầu chạy.
Cuộn về đầu trang sẽ hiện header và hủy lịch ẩn.

## 3. Menu, tìm kiếm và đường dẫn

- Menu tự đóng khi mở menu khác, chọn mục, bấm bên ngoài hoặc nhấn Escape.
- Thanh tìm kiếm tự focus; Enter và nút tìm kiếm cùng gửi form GET với `q` đã trim.
- “Tìm công thức” và form tìm kiếm mặc định đến [trang kết quả của Phát](../../Phat/search-results/index.html).
  Form dùng GET với tham số `q`; trang nhận đã đọc `new URLSearchParams(location.search).get("q")`.
- “Danh mục” mặc định đến [trang danh mục 1](../../Phat/category-page-1/index.html).
  Từ đó dùng phân trang có sẵn để sang [trang danh mục 2](../../Phat/category-page-2/index.html).
- Logo, danh mục, giới thiệu và hồ sơ đã trỏ đến các file hiện có trong nhóm.
  Một số file đích còn rỗng; header không thêm nội dung cho các trang đó.

Nếu nhóm đổi trang đích, khai báo **trước** khi nạp `header.js`:

```js
window.NomNomHeaderConfig = {
    // Đường dẫn tương đối tính từ thư mục NomNom/ chứa Thach, Phat, Minh, Thinh.
    routes: { search: "Phat/search-results/index.html" },
    user: null // null: khách; object người dùng: thành viên
};
```

Các khóa route: `home`, `search`, `categories`, `about`, `overview`, `uploaded`,
`saved`, `history`, `account`. Có thể dùng URL tuyệt đối cùng website.

Hai bản HTML header khách/thành viên có `href` / `action` tương ứng để vẫn dùng
được khi JS không chạy. Trang chủ và ba trang Phát dùng placeholder nên cần JS / HTTP
để tải header. Bản chép tay tính đường dẫn HTML từ trang đích; loader tự chuyển URL
trong mẫu thành URL tuyệt đối. Bảng `routes` luôn tính từ gốc `NomNom/`.

### Giới hạn của các trang đích

- Trang kết quả hiện chỉ đưa món có tên khớp từ khóa lên trước, chưa loại món không khớp;
  các thẻ món trong dữ liệu Phát vẫn trỏ `#`.
- Các trang Phát hiện dùng chung loader và mặc định là khách. Những trang này chưa
  tích hợp các popup tài khoản dùng chung; các nút tài khoản sẽ báo chờ tích hợp.
- Đợt nối đường dẫn chỉ cập nhật header; các chức năng trang đích, mục đang chờ tích hợp
  và trang còn rỗng được giữ nguyên để phần phụ trách tiếp tục hoàn thiện.

## 4. Sự kiện và trạng thái tài khoản

### Đợi header tải xong

`header.js` tự chạy khi DOM sẵn sàng, tự nạp CSS nếu chưa có, rồi fetch mẫu khi có
placeholder. Script không gọi lại `DOMContentLoaded`; các grid/bộ lọc của trang
đích tiếp tục khởi tạo độc lập như trước.

```js
// Đặt trong file JS riêng chạy sau thẻ script header.js (cùng dùng defer).
window.NomNomHeader.ready.then(header => {
    if (!header) return; // Trang không có header / placeholder.
    // header đã có HTML, đường dẫn và các listener tương tác.
}).catch(error => {
    // Placeholder đã hiển thị thông báo; xử lý bổ sung nếu trang cần.
    console.error(error);
});
```

| API / sự kiện | Vai trò |
| --- | --- |
| `NomNomHeader.ready` | Promise trả về phần tử header sau khi tải và khởi tạo; reject nếu tải lỗi. |
| `NomNomHeader.init()` | Tải / khởi tạo khi cần; dùng chung Promise nếu đang tải, không khởi tạo lặp khi đã xong. Có thể gọi lại sau lỗi để thử tải lại. |
| `nomnom:header-ready` | Phát một lần trên document sau khi khởi tạo thành công; `event.detail.header` là phần tử header. Dùng ready nếu code đăng ký sau thời điểm sự kiện đã phát. |
| `NomNomHeader.updateHeaderAuth(user)` | Cập nhật nhóm khách / thành viên; nếu header chưa tải xong thì giữ giá trị chờ áp dụng. |

Loader chỉ lấy `header[data-nomnom-header]` từ bản mẫu; không chèn head/body hay
nạp lại script nằm trong head của mẫu. CSS, ảnh và route được tính từ vị trí file JS,
nên dùng được ở các thư mục nông/sâu khác nhau. Khi tải lỗi, placeholder giữ chỗ,
hiện lời nhắc và nút Thử lại; lỗi chi tiết dành cho người phát triển nằm ở console.

Trang chủ hiện đã nạp `auth.js` để nhận yêu cầu mở Login/Signup; xem [Login](login.md) và [Signup](signup.md). Các ví dụ sự kiện dưới đây dùng khi kết nối chức năng tài khoản ở giai đoạn sau. Form hợp lệ hiện chưa phát trạng thái thành viên.

Header không tạo tài khoản hay tự lưu/xóa phiên. Phần tài khoản nghe sự kiện trên
`document` và gọi `preventDefault()` để báo đã nhận xử lý:

```js
document.addEventListener("nomnom:auth-request", event => {
    event.preventDefault();
    const action = event.detail.action; // login | signup | logout
    // Mở popup tương ứng hoặc xử lý đăng xuất trong module tài khoản.
});
```

Sau khi đăng nhập hoặc đăng xuất thành công, cập nhật header:

```js
document.dispatchEvent(new CustomEvent("nomnom:auth-change", {
    detail: { user: { id: "user-1" } } // Đăng xuất thành công: user: null
}));
// Hoặc sau khi header.js đã nạp:
window.NomNomHeader.updateHeaderAuth(null);
```

Đăng xuất thất bại thì không phát trạng thái khách. Không có `user` trong config
thì giữ trạng thái khách/thành viên của bản HTML đang xem thử; đây không phải xác thực.

### Các mục chờ trang đích

`nomnom:navigation-request` có `event.detail.target` là `ingredients`, `random`,
`collections`, `guide`, `faq` hoặc `contact`. Module phụ trách nghe sự kiện,
gọi `preventDefault()` và mở phần tương ứng. Khi có URL chính thức, có thể thay
nút bằng thẻ `<a href="...">` ngay trong header.

Nếu chưa có module nhận sự kiện, header hiển thị thông báo chờ tích hợp;
không điều hướng đến trang giả hoặc giả lập đăng xuất thành công.

## 5. HTML: nút Menu

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

Khi ghép tay vào trang khác, copy cả nút này và vùng điều khiển, rồi tính lại đường
dẫn ảnh từ trang HTML đích. Nếu dùng placeholder, loader tự xử lý phần đường dẫn đó.

## 6. CSS: sticky, media và hiệu ứng

```css
.site-header {
    position: sticky;
    top: 0;
}
```

`sticky` giữ chỗ của header trong bố cục và bám ở mép trên khi cuộn. Vì vậy main
bắt đầu sau header. `top: 0` là mốc bám, không phải khoảng cách giữa header và main.

Khi ẩn bằng `transform`, header vẫn giữ chỗ ban đầu trong bố cục để nội dung không
nhảy. JavaScript giữ header luôn hiện ở đầu trang để tránh lộ vùng trống đó.
Khi đã cuộn xuống, chỗ ban đầu nằm ngoài vùng nhìn. Khi ghép vào trang khác,
ancestor có `overflow` hoặc vùng bao header quá ngắn có thể thay đổi cách `sticky` hoạt động.

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

## 7. JavaScript: bộ đếm và mở Menu

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
    if (window.scrollY <= 0) {
        header.classList.remove("site-header_hidden");
        return;
    }
    idleTimer = setTimeout(() => {
        if (window.scrollY > 0) header.classList.add("site-header_hidden");
    }, 4000);
}
```

Đọc theo thứ tự:

1. `function` gom các lệnh thành một công việc có tên.
2. `clearTimeout(idleTimer)` hủy lịch trước đó.
3. `window.scrollY <= 0` kiểm tra đang ở đầu trang; `return` kết thúc hàm để không đặt lịch ẩn.
4. `setTimeout(...)` đặt lịch chạy hàm sau số mili giây đã cho; không làm trang đứng chờ.
5. `() => { ... }` là hàm mũi tên: phần trong ngoặc nhọn chạy khi đến giờ.
6. Kiểm tra lại `window.scrollY > 0` khi đến giờ để tránh ẩn nếu trang đã về đầu.
7. `classList.add(...)` thêm class; CSS thấy class đó và trượt header lên.

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

`isAtPageTop()` kiểm tra vị trí cuộn của trang bằng `window.scrollY`, khác với
`top: 0` trong CSS là mốc bám của header. Khi vừa rời đầu trang, sự kiện `scroll`
khởi động lại bộ đếm; khi quay về đầu, header hiện và bộ đếm được hủy.

### Mở / đóng Menu

```js
header.classList.toggle("site-header_menu-open", expanded);
menuButton.setAttribute("aria-expanded", String(expanded));
```

- `expanded` là giá trị boolean: `true` hoặc `false`.
- `toggle(class, true)` thêm class; `toggle(class, false)` xóa class.
- `String(expanded)` đổi boolean thành chuỗi để ghi vào thuộc tính HTML.
- CSS quyết định panel trông ra sao khi có class; JS quyết định lúc nào thêm / xóa nó.

## 8. Tự kiểm tra bằng Live Server

1. Mở trang chủ ở đầu trang, để chuột ở phần main và chờ hơn 4 giây: header vẫn hiện.
2. Cuộn xuống, chờ hơn 4 giây: header ẩn; rê chuột sát mép trên để gọi lại.
3. Cuộn ngược lên để gọi header; quay về đầu trang và chờ hơn 4 giây: header luôn hiện.
4. Thu cửa sổ xuống 1000px hoặc nhỏ hơn: logo và nút Menu nằm cùng hàng.
5. Mở Menu, mở tìm kiếm rồi nhập: header phải giữ hiện dù chờ hơn 4 giây.
6. Thử Escape, bấm ngoài và bấm lại Menu.
7. Thử Tab; khi Menu đóng, Tab không đi vào các mục đang ẩn.
8. Thử cả bản khách và thành viên, rồi kéo cửa sổ qua lại mốc 1000px.
9. Từ trang chủ, mở Danh mục rồi chuyển trang 1 → 2 → 1 bằng phân trang có sẵn.
10. Mở Tìm công thức và thử gửi tìm kiếm bằng Enter / nút kính lúp; kiểm tra từ khóa
    tiếng Việt và ký tự `&`, `+`, `?` được giữ đúng trong tham số `q`. Bỏ trống hoặc
    chỉ nhập khoảng trắng thì không điều hướng khi JS đang chạy.
11. Thử nạp header.js / gọi `NomNomHeader.init()` hai lần: trang vẫn chỉ có một header,
    một lần xử lý tìm kiếm / menu. Làm chậm mạng rồi đổi cỡ màn hình khi đang tải.
12. Thử URL / CSS header bị lỗi: placeholder có thông báo và Thử lại; khi tài nguyên
    dùng được trở lại, nút này nạp đúng một header.
13. Tắt JavaScript: hai bản xem thử / bản chép tay vẫn có header; trang dùng placeholder
    cần bật lại JS để tải header. Đây là giới hạn của cách ghép bằng fetch.

### Tự giải thích khi review

- Vì sao dùng `sticky` và `top: 0`? Khi header bị ẩn bằng transform, main có nhảy không?
- `IDLE_DELAY` khác thời gian `transition` như thế nào?
- Vì sao phải sửa cả CSS `@media` và JS `matchMedia` khi đổi breakpoint?
- `preventDefault()` trong sự kiện yêu cầu tài khoản khác với đăng nhập thành công thế nào?
