# NomNom — Lộ trình tự code Header, Footer, Login và Signup

Cập nhật theo file trên máy ngày 27/10/2026. Công nghệ: **HTML, CSS và JavaScript thuần; không framework**.

**Mục tiêu:** tự gõ lại bốn phần được giao, hiểu vai trò từng đoạn và giải thích hoặc dựng lại được khi báo cáo. Mã có sẵn là tài liệu tham khảo, chưa được tính là bài bạn đã tự làm.

## Mục lục

- [Mục tiêu và cách học](#cach-hoc)
- [Trạng thái file và nơi viết code](#trang-thai)
- [Thiết kế Figma và phạm vi được giao](#thiet-ke)
- [Chặng 0 — Chuẩn bị](#chang-0)
- [Chặng 1 — Header](#chang-1)
- [Chặng 2 — Footer](#chang-2)
- [Chặng 3 — Login](#chang-3)
- [Chặng 4 — Signup](#chang-4)
- [Chặng 5 — Ghép bài, kiểm tra và luyện báo cáo](#chang-5)
- [Tiến độ và cách nhờ review](#tien-do)

<a id="cach-hoc"></a>
## Mục tiêu và cách học

Mỗi chặng đi theo vòng: **quan sát thiết kế → tự phác cấu trúc → tự viết một phần nhỏ → mở xem và kiểm tra → giải thích lựa chọn → sửa tiếp**.

- Viết HTML trước để có cấu trúc và nội dung. CSS tạo hình thức và bố cục. JavaScript thêm hành vi sau khi phần tĩnh đã rõ.
- Chỉ xem đoạn mẫu khi cần đối chiếu; không chép cả trang rồi coi như đã hiểu. Thử tự viết trước, xem lại mẫu sau.
- Chia việc thành các lần nhỏ: một nhóm menu, một cột Footer, một trường nhập hoặc một hành vi.
- Chỉ đánh dấu checkbox sau khi **tự viết, kiểm tra và giải thích được**. File tồn tại hoặc giao diện mẫu chạy được chưa đủ.
- Khi nhờ hỗ trợ, ưu tiên câu hỏi định hướng và gợi ý nhỏ. Chỉ cần ví dụ ngắn khi đã thử mà vẫn chưa tìm ra.
- Tài liệu này là kế hoạch cho bài NomNom. Kiến thức web tổng quát để ôn tập nằm trong ghi chú học riêng.

Thứ tự thực hiện: **Chuẩn bị → Header khách → Header thành viên → Footer → Login → Signup → Ghép và kiểm tra**. Không đặt hạn thời gian cứng; kết thúc một bước khi đạt điều kiện của bước đó.

<a id="trang-thai"></a>
## Trạng thái file và nơi viết code

### Đã kiểm tra được gì?

Trạng thái trên đĩa có thay đổi so với bản kế hoạch ban đầu: **`header/index.html` hiện đã có nhưng rỗng; các file Header còn lại chưa có và `footer/` vẫn là thư mục trống.** Mã mẫu nằm trong `P-header/` và `P-footer/`.

| Khu vực trong `NomNom/Thinh/` | Trạng thái lúc cập nhật | Cách dùng |
| --- | --- | --- |
| `header/` | `index.html` hiện 0 byte; các file còn lại chưa có | Nơi bạn tự viết Header |
| `footer/` | Chưa có file | Nơi bạn sẽ tự tạo và viết Footer |
| `P-header/` | Có HTML khách/thành viên, CSS và JS mẫu | Tham khảo; giữ nguyên khi làm bài riêng |
| `P-footer/` | Có HTML và CSS mẫu | Tham khảo; chưa được tính là Footer bạn tự viết |
| `login/` | Ba file HTML/CSS/JS đều 0 byte | Tự viết popup Login từ đầu |
| `signup/` | Ba file HTML/CSS/JS đều 0 byte | Tự viết popup Signup từ đầu |
| `common.css` | Đã có font, màu, khung nội dung, nút, logo, dialog và style xem thử | Đọc để biết phần nào đang được cung cấp sẵn |
| `common.js` | Chỉ mở thông báo tạm cho `data-pending` | Chưa phải JS xác thực hoặc JS của hai popup tài khoản |
| `assets/` | Logo, icon tìm kiếm/mạng xã hội, font Inter và giấy phép | Tái sử dụng tài nguyên, không cần vẽ lại |
| `index.html`, `README.md` | Còn dẫn tới các phần tự viết chưa hoàn thiện; mẫu đã nằm trong P- | Chưa dựa vào chúng để kết luận bài đã chạy; rà lại khi ghép |

Mã mẫu có responsive ở các ngưỡng 1250, 900 và 600px; đó là cách làm cũ để tham khảo, không phải bắt buộc chép nguyên breakpoint. Responsive nghĩa là bố cục thích ứng với kích thước màn hình.

### Cây hiện có và file sẽ tự tạo

Cây dưới đây phóng to `NomNom/Thinh/`. Những dòng ghi **sẽ tạo** chưa tồn tại; lần cập nhật này chỉ sửa tài liệu.

```text
Thinh/
├── index.html
├── README.md
├── common.css
├── common.js
├── assets/
│   ├── images/logo.png
│   ├── icons/
│   └── fonts/
├── P-header/                 # Mẫu có sẵn để đối chiếu
│   ├── index.html
│   ├── member.html
│   ├── header.css
│   └── header.js
├── P-footer/                 # Mẫu có sẵn để đối chiếu
│   ├── index.html
│   └── footer.css
├── header/                   # Nơi tự viết
│   ├── index.html            # Đã có, đang rỗng: Header khách
│   ├── member.html           # Sẽ tạo: Header thành viên
│   ├── header.css            # Sẽ tạo: CSS của hai Header
│   └── header.js             # Sẽ tạo: menu và dropdown
├── footer/                   # Nơi tự viết; đang trống
│   ├── index.html            # Sẽ tạo
│   └── footer.css            # Sẽ tạo
├── login/                    # Đã có ba file rỗng
│   ├── index.html
│   ├── login.css
│   └── login.js
└── signup/                   # Đã có ba file rỗng
    ├── index.html
    ├── signup.css
    └── signup.js
```

Không cần `footer.js` khi Footer chỉ có liên kết. Các thư mục bên ngoài Thinh không thuộc phạm vi tự viết của bạn.

**Chú ý CSS/JS mẫu:** `common.css` đã tạo kiểu cho một số class như `.site-logo`, `.button`, `.container`. Nếu dùng lại chúng, cần biết đó là kiểu dáng có sẵn, không phải kết quả CSS vừa viết. Không nối CSS/JS trong `P-header/`, `P-footer/` vào bài tự viết để làm thay phần mình đang học.

<a id="thiet-ke"></a>
## Thiết kế Figma và phạm vi được giao

Nguồn: [Figma IE104](https://www.figma.com/design/1XVDA0jnedoKuCL9rYodr7/IE104?node-id=0-1). Thông tin dưới đây giữ từ lần khảo sát Figma bằng browser trước đó; lượt chỉnh tài liệu này không đọc lại file Figma.

### Thành phần đã nhìn thấy trong thiết kế

| Phần | Nội dung cần dựng | Link tham chiếu |
| --- | --- | --- |
| Header khách | Logo; Công thức; Về chúng tôi; Danh mục; Đăng ký; Đăng nhập; icon tìm kiếm | [Header khách](https://www.figma.com/design/1XVDA0jnedoKuCL9rYodr7/IE104?node-id=343-1673) |
| Header thành viên | Giữ phần điều hướng chung, thay nhóm Đăng ký/Đăng nhập bằng Góc của tôi | [Header thành viên](https://www.figma.com/design/1XVDA0jnedoKuCL9rYodr7/IE104?node-id=108-840) |
| Footer | Logo/giới thiệu; Công thức; Giới thiệu; Liên hệ; dòng bản quyền và chính sách | [Footer](https://www.figma.com/design/1XVDA0jnedoKuCL9rYodr7/IE104?node-id=307-2373) |
| Login | Logo; nút X; email; mật khẩu và icon ẩn/hiện; Ghi nhớ tôi; Quên mật khẩu; nút Đăng nhập; link Đăng ký ngay | [Login](https://www.figma.com/design/1XVDA0jnedoKuCL9rYodr7/IE104?node-id=226-2711) |
| Signup | Logo; nút X; tên tài khoản; email; mật khẩu; xác nhận mật khẩu; icon ẩn/hiện; đồng ý điều khoản/chính sách; nút Đăng ký | [Signup](https://www.figma.com/design/1XVDA0jnedoKuCL9rYodr7/IE104?node-id=229-2837) |

Nội dung các dropdown đã khảo sát:

- **Công thức:** Tìm công thức; Danh mục nguyên liệu; Gợi ý bất ngờ; Tuyển tập công thức.
- **Về chúng tôi:** Về NomNom; Hướng dẫn; Câu hỏi thường gặp; Liên hệ.
- **Góc của tôi:** Tổng quan; Công thức đã đăng tải; Công thức đã lưu; Lịch sử; Tài khoản của tôi; Đăng xuất.

Menu mở trong thiết kế có nền vàng; mẫu cũ còn nền trắng và nội dung khác một số mục. Không mặc định rằng mọi chi tiết trong mẫu đã đúng Figma.

Footer có bốn cột:

1. Logo, câu “Ăn ngon trọn vị, chi tiêu hợp lý.” và đoạn giới thiệu.
2. Công thức: Tất cả công thức, Danh mục, So sánh nguyên liệu, So sánh giá, Đánh giá của tôi.
3. Giới thiệu: Về NomNom, Hướng dẫn sử dụng, Câu hỏi thường gặp, Liên hệ.
4. Liên hệ: Facebook, Instagram, YouTube, TikTok và icon.

Dòng cuối gồm © 2026 NomNom, Chính sách bảo mật, Điều khoản sử dụng, Hỗ trợ tiếp cận. Giữ nội dung theo thiết kế; URL xã hội cần nhóm cung cấp.

### Hành vi đề xuất và giới hạn

Đóng popup bằng Escape, quản lý focus, thông báo lỗi form và bố cục mobile là các việc triển khai đề xuất để dùng được; chưa phải mọi hành vi đã được kiểm chứng qua prototype Figma.

Phạm vi trước mắt là **giao diện và tương tác frontend**. Không tự thêm backend, OTP, đăng nhập mạng xã hội hoặc lưu mật khẩu trong trình duyệt. Form hợp lệ không đồng nghĩa đã xác thực tài khoản.

Ghi nhớ tôi, Quên mật khẩu, Đăng xuất, quy tắc độ dài mật khẩu và chức năng tìm kiếm cần chốt theo yêu cầu nhóm/giảng viên. Chưa có chức năng thì cho phản hồi rõ ràng, không giả thành công. Dựng link trên Footer không đồng nghĩa nhận làm toàn bộ trang được liên kết.

<a id="chang-0"></a>
## Chặng 0 — Chuẩn bị

**Mục tiêu:** phân biệt mã mẫu, nơi tự viết và tài nguyên dùng lại.

**Việc tự làm**

- [ ] Xem cây trên và xác định đúng bốn thư mục làm bài; giữ `P-header/`, `P-footer/` làm tham khảo.
- [ ] Trước khi thay mã có sẵn, lưu bản tham khảo; hiện hai thư mục P- đã có mã cũ, không cần xóa chúng để bắt đầu.
- [ ] Mở trực tiếp một file mẫu bằng Live Server để biết kết quả cần hướng tới; chưa dựa vào link trang chọn phần đang chờ dựng.
- [ ] Tìm logo, icon và font; đọc `common.css` để biết style nào được dùng lại.
- [ ] Chọn một mốc nhỏ để làm trước: Header tối thiểu ở chặng 1.1.

**Cách kiểm tra:** nói được file nào do mình viết, file nào là tham khảo; xác định được đường dẫn từ một HTML trong thư mục con tới ảnh/CSS chung.

**Câu hỏi cần giải thích được:** HTML, CSS và JS phụ trách gì? Tại sao chưa nối JS mẫu khi HTML mình viết còn chưa có các phần tử tương ứng?

**Hoàn thành khi:** mở đúng file, không sửa nhầm mẫu và biết sẽ tự viết phần nào trước. Chưa cần giao diện đẹp.

<a id="chang-1"></a>
## Chặng 1 — Tự viết Header

**Mục tiêu:** tự dựng hai Header cùng phong cách, có điều hướng rõ và dùng được trên màn hình nhỏ.

### 1.1. Bước bắt đầu ngay: HTML tối thiểu

- [ ] Mở `header/index.html` đang rỗng, tự viết cấu trúc tài liệu: doctype, ngôn ngữ, head, charset, viewport, title và body.
- [ ] Thêm một `header` chứa logo và một liên kết điều hướng có chữ dễ nhận biết. Ảnh có mô tả `alt` phù hợp.
- [ ] Mở bằng Live Server, kiểm tra tiêu đề tab, tiếng Việt, ảnh và thứ tự nội dung.
- [ ] Giải thích từng thẻ vừa viết trước khi thêm các mục còn lại.

Ở bước này **chưa cần toàn bộ menu, CSS bố cục hay JavaScript**. Đây là đầu việc đầu tiên sau khi đọc lộ trình.

### 1.2. Hoàn thiện HTML Header khách

- [ ] Phác thứ tự các nhóm: logo → điều hướng → tài khoản → tìm kiếm.
- [ ] Thêm đủ mục theo bảng Figma; dùng danh sách khi các mục có quan hệ nhóm, dùng `nav` cho vùng điều hướng.
- [ ] Phân biệt liên kết chuyển nơi với nút thực hiện hành động. Nút mở popup hoặc menu là hành động, không tự coi là link tới trang khác.
- [ ] Viết cấu trúc dropdown Công thức/Về chúng tôi; có thể dùng `details/summary`, rồi giải thích được hành vi HTML cung cấp sẵn.
- [ ] Thêm vùng `main` xem thử để kiểm tra Header trong một trang đầy đủ.

### 1.3. Tự viết CSS

- [ ] Tạo `header/header.css`; nối sau `../common.css` khi đã hiểu phần dùng chung.
- [ ] Làm bố cục logo và menu trước; thử Flexbox và giải thích phần tử cha đang điều khiển con.
- [ ] Chỉnh chữ, màu, khoảng cách, kích thước ảnh, nút và bóng đổ theo Figma.
- [ ] Dựng panel dropdown; hiểu vị trí của nó so với phần tử cha trước khi dùng định vị CSS.
- [ ] Co cửa sổ để tìm lúc menu chật; tự chọn cách xếp lại và thêm media query, không chép breakpoint chỉ vì mẫu có.

### 1.4. Header thành viên và JavaScript

- [ ] Sau khi Header khách ổn, tự tạo `header/member.html`; giữ phần chung, thay nhóm tài khoản bằng Góc của tôi.
- [ ] Dùng chung CSS và hành vi cho hai biến thể; nội dung menu đúng thiết kế.
- [ ] Tạo `header/header.js`, nối bằng `defer` khi HTML đã sẵn sàng.
- [ ] Làm từng hành vi: menu mobile → nhãn/trạng thái mở → đóng/mở dropdown → click ngoài và Escape.
- [ ] Nếu thu gọn menu bằng JS, chỉ ẩn khi JS đã sẵn sàng; không để menu mất hoàn toàn khi JS chưa chạy.
- [ ] Nút Login/Signup mới ghi nhận điểm mở popup; nối thật ở chặng 5.

**Cách kiểm tra**

- Mở riêng cả hai Header. Thử chuột, Tab, Enter và Escape; kiểm tra `aria-expanded` nếu dùng nút menu.
- Mở hai dropdown liên tiếp; kiểm tra cách đóng menu cũ, click ngoài và trạng thái sau khi đóng menu mobile.
- Thử desktop và màn hình hẹp: logo không méo, chữ/nút không đè nhau, không tràn ngang, console không báo lỗi.

**Câu hỏi cần giải thích được:** vì sao dùng `nav`, link hoặc button? Flexbox đặt ở cha nào? Dropdown HTML đã làm gì và JS bổ sung gì? Class CSS, trạng thái JS và thuộc tính hỗ trợ truy cập liên quan thế nào?

**Hoàn thành khi:** tự viết được Header khách/thành viên, giải thích được bố cục và các hành vi; làm lại được khối logo + điều hướng tối thiểu mà không chép mẫu.

<a id="chang-2"></a>
## Chặng 2 — Tự viết Footer

**Mục tiêu:** biến các nhóm nội dung Figma thành Footer rõ ràng trên desktop và mobile.

**Việc tự làm**

- [ ] Tự tạo `footer/index.html`; chia Footer thành thương hiệu, ba nhóm liên kết và dòng bản quyền.
- [ ] Viết đủ nội dung, heading, danh sách và liên kết trước khi trang trí; dùng icon có sẵn.
- [ ] Tạo `footer/footer.css`; chọn Grid hoặc Flexbox cho các cột và nói được lý do.
- [ ] Chỉnh độ rộng, khoảng cách, chữ, đường phân cách và màu theo thiết kế.
- [ ] Khi màn hình hẹp, cho các cột xếp lại; cho dòng pháp lý xuống dòng hợp lý.
- [ ] Dùng phản hồi tạm rõ ràng cho link chưa tích hợp; không tự đoán URL xã hội.

**Cách kiểm tra:** đọc thứ tự nội dung khi chưa nối CSS; sau đó thử nhiều chiều rộng, nội dung dài và Tab qua các link. Kiểm tra ảnh/icon, không tràn ngang.

**Câu hỏi cần giải thích được:** vì sao nhóm link là danh sách? Grid/Flexbox xử lý cột thế nào? Vì sao Footer hiện chưa cần JS riêng?

**Hoàn thành khi:** Footer tự viết có đủ nội dung, bố cục thích ứng và dễ đọc; giải thích được HTML và cách các cột thay đổi. Không đánh dấu xong vì bản trong `P-footer/` đã chạy.

<a id="chang-3"></a>
## Chặng 3 — Tự viết popup Login

**Mục tiêu:** dựng form Đăng nhập theo Figma, kiểm tra dữ liệu và thao tác popup bằng frontend.

**Việc tự làm**

- [ ] Trong `login/index.html`, viết khung tài liệu và một nút mở thử popup; đây là trang để thử, không phải yêu cầu chuyển sản phẩm sang trang Login riêng.
- [ ] Dựng popup bằng `dialog`: logo, tiêu đề, nút X, form email/mật khẩu, Ghi nhớ tôi, Quên mật khẩu, nút gửi và link Đăng ký ngay.
- [ ] Nối `label` với input; chọn type phù hợp, đặt tên trường và xác định nút nào gửi form/nút nào chỉ thao tác.
- [ ] Viết `login.css`: bố cục, trường nhập, nút, khoảng cách; popup nhỏ hơn màn hình và cuộn được khi cần.
- [ ] Viết `login.js` theo từng hành vi: mở/đóng → ẩn/hiện mật khẩu → kiểm tra form → hiển thị lỗi.
- [ ] Dùng kiểm tra HTML sẵn có cho trường bắt buộc/email; thêm JS khi cần phản hồi riêng, không làm mất dữ liệu sau lỗi.
- [ ] Phân biệt kiểm tra form với xác thực: form hợp lệ chỉ báo đã kiểm tra frontend/chưa nối API.
- [ ] Sau khi mở, đưa focus vào popup; khi đóng trả về nút mở. Focus là vị trí phần tử đang nhận thao tác bàn phím.

**Cách kiểm tra**

- Thử form rỗng, email sai định dạng, thiếu mật khẩu và dữ liệu hợp lệ; không ghi mật khẩu ra console.
- Thử nút ẩn/hiện: giá trị không mất và không vô tình gửi form.
- Thử X, Escape, Tab và Enter; kiểm tra focus lúc mở/đóng.
- Mở ở màn hình nhỏ hoặc thấp: vẫn chạm tới các nút, nội dung không bị cắt mất.

**Câu hỏi cần giải thích được:** `label` khác placeholder thế nào? Vì sao nút ẩn/hiện cần type riêng? Tại sao form hợp lệ chưa chứng minh tài khoản đúng? Vì sao dùng dialog phù hợp với thiết kế popup?

**Hoàn thành khi:** popup Login tự viết mở/đóng được, có giao diện phù hợp, kiểm tra nhập liệu và thao tác bàn phím; chưa cần đăng nhập thật.

<a id="chang-4"></a>
## Chặng 4 — Tự viết popup Signup

**Mục tiêu:** dựng Đăng ký theo Figma, kiểm tra xác nhận mật khẩu và đồng ý điều khoản.

**Việc tự làm**

- [ ] Trong `signup/index.html`, dựng trang mở thử popup với tên tài khoản, email, mật khẩu, xác nhận và checkbox điều khoản/chính sách.
- [ ] Tự viết HTML, đối chiếu Figma rồi dùng lại nguyên tắc đã hiểu từ Login; không chép nguyên trang mà bỏ qua điểm khác nhau.
- [ ] Viết `signup.css`; căn chỉnh nhất quán với Login, kiểm tra popup cao hơn màn hình.
- [ ] Viết `signup.js`: mở/đóng, ẩn/hiện từng ô mật khẩu, kiểm tra trường bắt buộc/email và hai mật khẩu khớp.
- [ ] Kiểm tra checkbox đồng ý trước khi gửi; hai liên kết điều khoản/chính sách không làm form bị gửi ngoài ý muốn.
- [ ] Báo lỗi gần trường liên quan, giữ dữ liệu để sửa; chỉ áp quy tắc độ dài/ký tự mật khẩu khi nhóm đã chốt.
- [ ] Khi form hợp lệ, phản hồi đúng trạng thái frontend; không giả đã tạo tài khoản, không lưu mật khẩu.
- [ ] Sau khi hai popup hoạt động riêng, chuẩn bị việc chuyển từ Login sang Signup ở chặng 5.

**Cách kiểm tra**

- Bỏ trống lần lượt từng trường, nhập email sai, nhập hai mật khẩu khác nhau và bỏ chọn checkbox.
- Sửa dữ liệu sau lỗi: thông báo cập nhật đúng, không còn lỗi cũ gây hiểu nhầm.
- Thử từng nút ẩn/hiện, X, Escape, Tab và Enter; thử màn hình nhỏ.
- Thử dữ liệu hợp lệ: không báo đã có tài khoản thật hoặc tự đăng nhập.

**Câu hỏi cần giải thích được:** kiểm tra HTML và JS khác nhau ở đâu? So sánh hai trường như thế nào? Vì sao lỗi cần đặt gần trường nhập? Vì sao mỗi ô mật khẩu có trạng thái ẩn/hiện riêng?

**Hoàn thành khi:** popup Signup tự viết hoạt động độc lập, báo đúng các lỗi đã liệt kê, thống nhất hình thức với Login và giải thích được logic.

<a id="chang-5"></a>
## Chặng 5 — Ghép bài, kiểm tra và luyện báo cáo

**Mục tiêu:** đưa bốn phần tự viết vào cùng luồng, kiểm tra ảnh hưởng qua lại và chuẩn bị giải thích bài.

**Việc tự làm**

- [ ] Dùng một trang xem thử chung; nối Header, Footer và HTML hai popup trong một tài liệu hợp lệ.
- [ ] Cập nhật link của trang chọn phần/README sang bài tự viết sau khi các file đích đã có nội dung.
- [ ] Nạp CSS chung trước, CSS từng phần sau; dùng class đủ riêng để tránh CSS Login ảnh hưởng Signup hoặc nội dung trang khác.
- [ ] Nối nút Đăng nhập/Đăng ký trên Header và link Đăng ký ngay; mỗi lúc chỉ mở một popup. Chuyển popup không để lại nền che hoặc focus ở phần đã đóng.
- [ ] Nối JS của các phần; kiểm tra khi một thành phần không có trên trang thì script không báo lỗi.
- [ ] Bỏ `data-pending` ở nút/link đã có chức năng thật. Không để `common.js` vừa mở thông báo tạm vừa tranh xử lý nút tài khoản.
- [ ] Khi ghép vào phần Minh/Thach, chỉ lấy khối cần dùng, không chép toàn bộ `html/head/body` vào trong một trang khác.
- [ ] Sửa đường dẫn CSS/JS/ảnh theo vị trí trang đích; HTML cần id không trùng. URL ảnh/font trong CSS tính từ file CSS.
- [ ] Giữ rõ trạng thái Header khách/thành viên là hai bản giao diện; chưa tự đổi trạng thái vì form vừa hợp lệ.

**Cách kiểm tra**

- Desktop và các cỡ tham khảo 1024, 768, 390px; thu/phóng thêm quanh điểm bố cục bắt đầu chật. Đây là cỡ kiểm tra, không phải bằng chứng Figma có đủ frame tương ứng.
- Header không che dropdown; Footer không đổi kiểu form; popup không vượt màn hình; không tràn ngang.
- Logo, icon và font tải được; menu, đóng popup, chuyển Login → Signup và thông báo lỗi đều dùng được.
- Kiểm tra console và đường dẫn tài nguyên trong DevTools; không chỉ nhìn một ảnh desktop để kết luận xong.
- Chọn một khối nhỏ đã làm, giải thích bằng lời rồi tự viết lại HTML trước, CSS/JS sau, không mở mẫu.

**Câu hỏi cần giải thích được:** CSS nào là chung, CSS nào của từng phần? Vì sao cùng một ảnh nhưng đường dẫn HTML thay đổi khi ghép? Hai popup phối hợp thế nào? Nếu script chạy ở trang thiếu nút thì chuyện gì xảy ra?

**Hoàn thành khi:** bốn phần phối hợp đúng phạm vi frontend, tự kiểm tra được lỗi đường dẫn/giao diện và tự dựng lại được một khối nhỏ. Sau đó mới commit/push phần đã kiểm tra và gửi PR theo quy ước nhóm; kế hoạch này không yêu cầu tự merge hoặc sửa bài người khác.

<a id="tien-do"></a>
## Tiến độ và cách nhờ review

Các ô dưới đây khởi đầu đều chưa hoàn thành vì chưa xác nhận việc tự viết, không dựa vào mã mẫu hiện có.

- [ ] Chặng 0: phân biệt mẫu/thực hành và mở đúng file.
- [ ] Chặng 1: tự viết Header khách, thành viên và hành vi menu.
- [ ] Chặng 2: tự viết Footer và responsive.
- [ ] Chặng 3: tự viết popup Login và kiểm tra form.
- [ ] Chặng 4: tự viết popup Signup và kiểm tra form.
- [ ] Chặng 5: ghép, kiểm tra và luyện báo cáo.

Khi nhờ review, gửi **bước đang làm + đoạn tự viết + điều mong đợi + điều thực tế đang xảy ra**. Có thể dùng các câu sau:

- “Mình xong bước 1.1, xem cấu trúc HTML giúp mình.”
- “Mình đang căn logo và menu; đây là CSS mình thử và chỗ bị lệch.”
- “Mình muốn được gợi ý, chưa cần đưa code hoàn chỉnh.”
- “Luyện báo cáo phần này: hỏi mình lý do chọn HTML/CSS/JS.”

**Việc bắt đầu tiếp theo:** mở `header/index.html` đang rỗng và làm đúng bước 1.1; chưa cần giải quyết cả bốn phần cùng lúc.
