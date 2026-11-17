# Nhật ký AI thao tác

[Tổng quan](../README.md) · [Header](header.md) · [Footer](footer.md) · [Login](login.md) · [Signup](signup.md) · [Quy ước chung](class-id.md) · [Nhật ký AI](lich-su-ai.md)

**Đánh dấu: AI thao tác.** Các đợt dưới đây do Codex thực hiện theo yêu cầu đã duyệt. Đây là nhật ký thay đổi và kết quả kiểm tra tại thời điểm thực hiện; hướng dẫn hiện tại nằm ở các tài liệu liên kết phía trên.

## Header responsive và tự ẩn

**Ngày:** 15/11/2026.

**Mục tiêu:** header theo màn hình, tự ẩn sau 4 giây không tương tác và có hướng dẫn cho người mới học.

### File và thay đổi

| File | Thay đổi |
| --- | --- |
| [style.css](../header/style.css) | Chiều cao theo màn hình; nút Menu; panel trên màn hình nhỏ; hiệu ứng trượt và giảm chuyển động. |
| [header.js](../header/header.js) | Mở / đóng Menu; bộ đếm 4 giây; gọi header hiện lại; giữ hiện khi đang dùng. |
| [index.html](../header/index.html) | Thêm nút Menu, id vùng điều khiển và nhãn tìm kiếm cho bản khách. |
| [ed - index.html](<../header/ed - index.html>) | Cập nhật tương tự cho bản thành viên. |
| [Trang chủ](../../Thach/Home-page/index.html) | Đồng bộ đúng khối header đã ghép để dùng được chức năng mới. |
| [README.md](header.md) | Bổ sung cách dùng responsive và liên kết tài liệu này. |
| [Bảng class / id](class-id.md) | Ghi lại tên mới theo quy ước một dấu `_`. |

Phần main và footer không thuộc thay đổi header lần này.

### Kết quả kiểm tra đã ghi nhận

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
chưa thay thế việc thử trên điện thoại thật. Ở thời điểm kiểm tra Header này, popup tài khoản chưa được ghép; xem đợt Login/Signup bên dưới.

## Login và Signup

**Ngày:** 15/11/2026.

**Mục tiêu:** hai popup theo Figma, kiểm tra form và kết nối với header trên trang chủ; demo và xác thực thật làm sau.

### File và thay đổi

| File | Vai trò |
| --- | --- |
| [auth.js](../auth.js) | Mở/đóng/chuyển popup, focus, khóa cuộn nền, nút mắt và hàm kiểm tra UI chung. |
| [login/index.html](../login/index.html) | Trang xem thử mở sẵn Login, chứa cả hai popup. |
| [login/login.css](../login/login.css) | Font, kiểu chung `.site-auth`, kiểu Login và nền của trang xem thử. |
| [login/login.js](../login/login.js) | Chặn submit mặc định, kiểm tra Login và thông báo khi hợp lệ. |
| [signup/index.html](../signup/index.html) | Trang xem thử mở sẵn Signup, chứa cùng hai popup. |
| [signup/signup.css](../signup/signup.css) | Kích thước Signup, khoảng cách giữa trường và phần điều khoản. |
| [signup/signup.js](../signup/signup.js) | Kiểm tra Signup, xác nhận mật khẩu và thông báo khi hợp lệ. |
| [Trang chủ](../../Thach/Home-page/index.html) | Nạp CSS/JS và ghép hai dialog sau footer; giữ nguyên các khối header/main/footer. |
| [Hướng dẫn Header](header.md) | Bổ sung cách kết nối với popup; sửa liên kết tài liệu header về HISTORY.md. |
| [Tra cứu class/id](class-id.md) | Sửa liên kết tài liệu header về HISTORY.md. |
| [README.md](../README.md) | Cập nhật trạng thái hai popup, cây thư mục và cách ghép đang dùng. |

### Kết quả kiểm tra đã ghi nhận

- [x] Ba file JS qua `node --check`; phần thay đổi qua `git diff --check`.
- [x] Ba bản HTML có cùng hai dialog sau khi chuẩn hóa đường dẫn ảnh; id không trùng,
  các tham chiếu label/ARIA và tài nguyên nội bộ hợp lệ.
- [x] Link Markdown nội bộ trong tài liệu đã cập nhật trỏ đến file có thật.
- [x] Hai trang xem thử mở đúng popup mặc định, focus vào trường đầu tiên.
- [x] Với viewport 320 × 220px, input đầu tiên nhận focus và được cuộn vào vùng nhìn.
- [x] Bố cục ở 320, 375, 768, 1440px không tràn ngang.
- [x] Ở 320 × 320px, kể cả đang hiện lỗi, popup nằm trong lề 16px và cuộn bên trong.
- [x] Các trường trống, tên chỉ có khoảng trắng, email sai, xác nhận mật khẩu sai và
  chưa đồng ý điều khoản đều báo lỗi ngay dưới ô.
- [x] Nút mắt đổi type/nhãn đúng; tên/email được trim, mật khẩu giữ nguyên khoảng trắng.
- [x] Sửa mật khẩu gốc cập nhật lại lỗi xác nhận đang hiện.
- [x] Form hợp lệ hiện thông báo, không điều hướng, không ghi localStorage/sessionStorage,
  không phát `nomnom:auth-change` hoặc đổi header thành thành viên.
- [x] Enter gửi qua cùng xử lý kiểm tra form và không tải lại trang.
- [x] Chuyển Login → Signup giữ đúng một popup mở, không mở cuộn nền giữa chừng.
- [x] Đóng/chuyển popup xóa cả mật khẩu đang hiện dưới dạng text và lỗi đã báo.
- [x] Tab / Shift+Tab đi vòng trong popup; Escape ưu tiên popup trước menu header.
- [x] Dấu X và nền bên ngoài đóng được; focus và kiểu cuộn/padding nền được khôi phục.
- [x] Header trên desktop mở đúng popup và không hiện thông báo chờ tích hợp.
- [x] Từ menu nhỏ, popup vẫn dùng được sau hơn 4 giây khi header tự ẩn;
  đóng popup trả về nút Menu và header hiện lại.
- [x] Khóa cuộn nền không làm thay đổi bề ngang main.
- [x] Quên mật khẩu / Điều khoản hiện thông báo chờ tích hợp; giảm chuyển động tắt animation.
- [x] Không có lỗi JavaScript runtime trong các luồng form đã kiểm tra.

Kiểm tra bằng Microsoft Edge với viewport giả lập; chưa thử trên điện thoại thật.
Các file không được tự commit hoặc push.

## Tổ chức lại tài liệu

**Ngày:** 15/11/2026. **Thực hiện:** AI (Codex).

- Giữ README làm điểm bắt đầu; gom hướng dẫn, tra cứu và nhật ký vào `docs/`.
- Giữ ví dụ học HTML/CSS/JS và các kết quả kiểm tra cũ; bỏ nội dung lặp giữa README và nhật ký.
- Sửa mô tả responsive footer theo CSS thực tế: hiện chỉ có breakpoint 600px.
- Cập nhật mô tả thư mục của roadmap Minh; giữ các bước học và bài tự làm.
- Đợt này chỉ thay Markdown; không chạy lại UI hoặc thay code HTML/CSS/JS.
- Kiểm tra sau khi gom: 6 file Markdown, 97 liên kết/anchor nội bộ hợp lệ;
  tên class trong bảng tra cứu khớp các component HTML hiện có.

| Vị trí cũ | Nơi tra cứu hiện tại |
| --- | --- |
| `header/README.md` và phần hướng dẫn của `header/HISTORY.md` | [Header](header.md) |
| Phần hướng dẫn của `AUTH-HISTORY.md` | [Login](login.md) / [Signup](signup.md) |
| `class-id-header-footer.md` và bảng class/id Auth | [Tra cứu class/id](class-id.md) |
| Nhật ký và kiểm tra từ hai file HISTORY cũ | [Tài liệu này](lich-su-ai.md) |

## Tài liệu review theo thư mục

**Ngày:** 15/11/2026. **Thực hiện:** AI (Codex).

- Tách hướng dẫn hai popup thành [login.md](login.md) và [signup.md](signup.md).
- Tạo [footer.md](footer.md); đưa bảng class và hướng dẫn footer vào cùng một tài liệu.
- Bổ sung cấu trúc/class/id của header vào [header.md](header.md).
- [class-id.md](class-id.md) giữ quy ước và phần dùng chung; các file review có checklist tự kiểm tra.
- Nội dung chung của hai popup được giải thích tại Login và liên kết từ Signup.
- Cập nhật điều hướng và README; bỏ file `auth.md` sau khi chuyển nội dung.
- Lượt này chỉ chỉnh Markdown, không thay code giao diện hoặc chạy lại kiểm tra UI.
- Đã đối chiếu class/id của cả bốn thư mục và kiểm tra 137 liên kết/anchor nội bộ trong 8 file Markdown.

## Giữ header hiện ở đầu trang

**Ngày:** 16/11/2026. **Thực hiện:** AI (Codex).

- Sửa [header.js](../header/header.js): kiểm tra `window.scrollY <= 0` trước khi đặt lịch và khi bộ đếm đến hạn; đầu trang luôn hiện header.
- Hủy bộ đếm khi quay về đầu trang; khởi động lại khi vừa cuộn xuống để tính năng tự ẩn sau 4 giây tiếp tục hoạt động.
- Giữ cách gọi header hiện lại khi cuộn lên và điều kiện giữ hiện lúc đang dùng Menu, tìm kiếm hoặc bàn phím.
- Cập nhật [tài liệu review Header](header.md): bảng hành vi, ví dụ bộ đếm và checklist kiểm tra.

### Kết quả kiểm tra

- `node --check` xác nhận cú pháp `header.js` hợp lệ.
- Kiểm tra bằng Playwright trên trang chủ đã ghép header, Microsoft Edge với viewport 1440 × 900px và 375 × 812px.
- Chờ hơn 4 giây ở đầu trang: header vẫn hiện; cuộn xuống 500px rồi chờ: header ẩn.
- Cuộn về đầu trang: header hiện lại và giữ hiện sau hơn 4 giây, kể cả trước đó đang có lịch ẩn.
- Cuộn lên khi chưa về đầu trang: header hiện lại; Menu nhỏ đang mở giữ header hiện sau hơn 4 giây.
- Đóng Menu, quay về đầu rồi cuộn xuống 1px: bộ đếm hoạt động trở lại; về vị trí 0 thì header hiện.
- Không ghi nhận lỗi JavaScript runtime trong các luồng đã kiểm tra; có yêu cầu `favicon.ico` trả về 404, không liên quan đến header.

## Responsive footer khi thu hẹp

**Ngày:** 16/11/2026. **Thực hiện:** AI (Codex).

- Sửa [footer/style.css](../footer/style.css): bổ sung media 1000px để thương hiệu ở hàng đầu, ba nhóm link ở hàng dưới; media 600px chuyển thành một cột.
- Bỏ margin âm của thương hiệu ở màn hẹp; thu khung logo còn 80px, chỉnh margin tiêu đề và khoảng cách link để bố cục gọn hơn.
- Ở màn nhỏ, lề ngang còn 16px; đường phân cách đi theo lề. Icon mạng xã hội giữ cạnh chữ, link cao tối thiểu 32px.
- Tách hàng bản quyền và chính sách rõ ràng theo mốc màn hình; tăng độ rõ của chữ legal từ `gray` lên `#767676`.
- Cho chuỗi dài được xuống dòng; cập nhật bảng class, giải thích Grid/media và checklist trong [footer.md](footer.md).
- Phần mã nguồn chỉ thay CSS của footer; không đổi HTML, JavaScript hoặc các component khác.

### Kết quả kiểm tra

- Playwright / Microsoft Edge: kiểm tra bản footer riêng ở 13 chiều rộng từ 320px đến 1920px; trang chủ đã ghép ở 12 chiều rộng từ 320px đến 1440px.
- Các khối nằm trong footer; hàng legal nằm sau nội dung, không chồng lấn; trang không tràn ngang ở các chiều rộng đã kiểm tra.
- Kiểm tra sát hai mốc 1000px và 600px; nhóm link đổi số cột đúng và vẫn đọc được.
- Thử tiêu đề và link dài 200 ký tự trên trang chủ ở 375px: xuống dòng trong khung; dữ liệu thử được khôi phục sau kiểm tra.
- Chạy `ui-ux/scripts/probe.mjs` với `--sweep`: sau tinh chỉnh, báo cáo không còn mục Hỏng; quét 55 chiều rộng từ 1440px xuống 375px, bước 20px, không phát hiện vỡ bố cục.
- Đã xem ảnh desktop, tablet, điện thoại và bản ghép; console trang chủ không ghi nhận lỗi khi kiểm tra.

## Nối đường dẫn tìm kiếm và danh mục của header

**Ngày:** 16/11/2026. **Thực hiện:** AI (Codex).

- Sau khi đối chiếu Figma và các trang hiện có, đổi route `search` sang `Phat/search-results/index.html`, `categories` sang `Phat/category-page-1/index.html` trong [header.js](../header/header.js).
- Đồng bộ link Tìm công thức, link Danh mục và `action` của form GET trong hai bản HTML header khách/thành viên và khối header trên trang chủ.
- Cập nhật [header.md](header.md) với đường dẫn thực tế, cách kiểm tra và giới hạn của các trang đích.
- Giữ khả năng ghi đè qua `NomNomHeaderConfig.routes`. Không đổi chức năng trang Phát, dữ liệu công thức, các mục menu khác hoặc tạo trang mới; giữ nguyên CSS footer đang được sửa riêng.

### Kết quả kiểm tra

- Kiểm tra tĩnh xác nhận ba bản HTML chỉ thay ba URL dự kiến; đích liên kết tồn tại, form vẫn dùng GET và input vẫn có tên `q`.
- `header.js` chỉ đổi hai giá trị route mặc định; qua `node --check`. `git diff --check` đạt đối với các file thuộc đợt chỉnh sửa này.
- Playwright / Microsoft Edge: xác nhận route lúc chạy trên trang chủ và hai bản header; kiểm tra desktop 1440 × 900px và màn nhỏ 375 × 812px.
- Đi từ trang chủ đến Danh mục, chuyển trang 1 → 2 → 1 và mở Tìm công thức thành công.
- Từ khóa `bò & đậu + chanh?` được trim và giữ đúng trong `q`; từ khóa rỗng hoặc chỉ có khoảng trắng bị chặn khi JS đang chạy. Enter và nút tìm kiếm trên mobile đều hoạt động.
- Kiểm tra cấu hình route tùy chỉnh: link và form tiếp tục dùng giá trị ghi đè.
- Khi tắt JavaScript, ba bản HTML vẫn có link/form đúng; thử điều hướng Danh mục và gửi form tìm kiếm thành công.
- Không ghi nhận lỗi JavaScript runtime trong các luồng kiểm tra. Đối chiếu SHA-256 xác nhận CSS footer không thay đổi so với đầu lượt.

## Nạp header dùng chung bằng placeholder

**Ngày:** 17/11/2026. **Thực hiện:** AI (Codex).

- Đưa phần nạp header vào [header.js](../header/header.js): tự tải khối header khách từ `header/index.html`, nạp CSS nếu chưa có và chuyển đường dẫn ảnh/link/form theo vị trí file dùng chung.
- Giữ các hành vi menu, tìm kiếm, chuyển giao sự kiện tài khoản và tự ẩn; hỗ trợ cả header chép tay. Thêm `NomNomHeader.ready`, `init()` và sự kiện `nomnom:header-ready` để JS riêng của trang đợi header sẵn sàng.
- Chặn nạp/gắn listener trùng; giữ trạng thái tài khoản gửi đến trước khi tải xong. Khi tải HTML/CSS lỗi, placeholder hiện thông báo và nút Thử lại.
- Thêm CSS giữ chỗ trong lúc tải, theo hai chiều cao desktop/mobile; không đổi thiết kế header.
- Chuyển trang chủ và ba trang Phát sang placeholder. Bỏ phần tải header lặp trong JS Phát, các listener ghi đè tìm kiếm/danh mục và đoạn phát giả `DOMContentLoaded`; giữ riêng phần nạp footer.
- Cập nhật [README](../README.md#ghép-header-bằng-placeholder-khuyên-dùng) và [review Header](header.md) với cách ghép, API và giới hạn. Không tạo `layout.js` hoặc trang mới.

### Kết quả kiểm tra

- `node --check` xác nhận cú pháp header.js và ba file JS Phát hợp lệ; `git diff --check` đạt.
- Playwright / Microsoft Edge: trang chủ, ba trang Phát và hai bản xem thử đều có đúng một header; CSS không nạp trùng, URL đúng và trạng thái khách/thành viên phù hợp. Dữ liệu công thức mỗi trang Phát chỉ được yêu cầu một lần.
- Trang chủ không tràn ngang ở 320, 375, 600, 768, 1000, 1001 và 1440px. Menu nhỏ, popup Login có sẵn, tìm kiếm GET với tiếng Việt/ký tự đặc biệt và chặn từ khóa trắng hoạt động.
- Thử trang giả lập ở thư mục sâu, nạp script/gọi init nhiều lần, cấu hình route riêng, trạng thái tài khoản gửi sớm và thêm placeholder sau khi trang đã sẵn sàng: chỉ tạo một header và một lần phát sự kiện sẵn sàng.
- Giả lập lỗi HTTP khi tải HTML hoặc CSS: hiển thị thông báo; Thử lại nạp thành công. Khi làm chậm tải rồi đổi từ desktop sang mobile, vùng giữ chỗ đổi từ 106px xuống 72px; ảnh header tải được.
- Đầu trang vẫn hiện sau hơn 4 giây; cuộn xuống thì tự ẩn; quay về đầu trang thì hiện và giữ hiện. Không ghi nhận lỗi JavaScript runtime trong các luồng kiểm tra bình thường.
- Đối chiếu với Git xác nhận main/footer/dialog trên trang chủ, code công thức/bộ lọc ngoài loader ở Phát và mã nguồn footer/auth/login/signup không thay đổi.

Cách ghép bằng placeholder cần Live Server/HTTP và JavaScript. Loader chỉ phụ trách
header; footer và popup Login/Signup vẫn ghép riêng. Các trang Phát chưa có popup
tài khoản nên nút tài khoản vẫn báo chờ tích hợp. Kiểm tra bằng viewport giả lập,
chưa thử trên điện thoại thật. Không tự commit hoặc push.

## Nối các trang hiện có vào footer

**Ngày:** 17/11/2026. **Thực hiện:** AI (Codex).

- Nối Tất cả công thức đến `Phat/search-results/index.html`, Danh mục đến `Phat/category-page-1/index.html`; hai mục So sánh nguyên liệu / So sánh giá cùng đến trang `Thach/Ingredients-Comparison/ingredients-comparison.html` hiện có.
- Đồng bộ bốn `href` trong [footer mẫu](../footer/index.html) và footer chép tay trên [trang chủ](../../Thach/Home-page/index.html). Ba trang Phát tiếp tục tải footer mẫu nên tự nhận các URL mới.
- Giữ các mục còn thiếu nội dung ở trạng thái chờ: Về NomNom / Đánh giá của tôi còn file rỗng; hướng dẫn, FAQ, liên hệ, chính sách và tài khoản mạng xã hội chưa có trang hoặc URL chính thức. Không tạo trang mới hay thêm JavaScript/CSS.
- Cập nhật bảng URL, giới hạn trang đích và lưu ý đường dẫn khi ghép trong [review Footer](footer.md#các-trang-đã-nối).

### Kết quả kiểm tra

- Kiểm tra tĩnh footer mẫu, trang chủ và đường dẫn khi footer được chèn vào ba trang Phát: logo và bốn mục đã nối đều trỏ đến file có nội dung; 12 link còn lại vẫn chờ URL.
- Playwright / Microsoft Edge: bấm footer từ trang chủ sang danh sách công thức, tiếp tục sang Danh mục, rồi mở trang So sánh giá nguyên liệu thành công. Footer tải động ở Phát hiển thị URL mới.
- Đối chiếu Git: footer mẫu chỉ thay bốn `href`; main/dialog trên trang chủ và phần header đã sửa trước đó được giữ nguyên. Liên kết file trong tài liệu footer hợp lệ; `git diff --check` đạt.
- Có lỗi 404 sẵn ở `favicon.ico` và ảnh nền `assets/bg-pattern-transparent.png` của trang Phát trong lúc kiểm tra; không thay các tài nguyên đó trong đợt nối link footer.

Mục Tất cả công thức hiện dùng danh sách tối đa 15 món của trang kết quả tìm kiếm;
chưa thay chức năng tìm kiếm hoặc phân trang của Phát. Không tự commit hoặc push.
