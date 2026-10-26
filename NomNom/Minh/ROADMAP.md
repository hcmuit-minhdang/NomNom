# NomNom Frontend — Roadmap học và làm

## Mục tiêu

Tự dựng hai phần được giao — **About Us** và **User** — bằng HTML, CSS và JavaScript thuần. Mục tiêu không chỉ là trang chạy được: m cần giải thích được vì sao mình chọn cấu trúc đó, tự tìm lỗi, và dựng lại phần chính nếu lúc báo cáo bị yêu cầu xoá một đoạn.

## Cách làm mentor

- M **tự gõ code**. T sẽ không đưa nguyên trang hoàn chỉnh ngay từ đầu.
- Mỗi phần đi theo vòng: **mô tả ý định → tự phác cấu trúc → viết một phần nhỏ → tự kiểm tra → t review và hỏi vì sao**.
- Khi bí, t sẽ gợi ý theo từng nấc: câu hỏi định hướng trước, gợi ý cụ thể sau, đoạn mẫu ngắn cuối cùng nếu cần.
- Khi review, t giải thích lỗi và cho m cơ hội tự sửa trước khi đưa cách sửa.
- Chỉ dùng HTML, CSS, JavaScript thuần; chưa dựng header/footer dùng chung. Sau khi nhóm merge mới nối trang và giải quyết phần giao diện chung.

## Trạng thái thư mục hiện tại

Trong `NomNom` hiện chỉ có file `ROADMAP.md` này. Các thư mục và file được nhắc ở những phần dưới **chưa tồn tại**; đó là cấu trúc dự kiến để mình tạo dần từ đầu. Không có code, assets hay file cũ nào được giữ lại bên trong `NomNom`.

## Lộ trình

### 0. Dựng lại cấu trúc thư mục

**Mục tiêu:** biết mỗi trang, kiểu dáng, hành vi và tài nguyên nằm ở đâu.

Khi đến bước này, m sẽ **tạo mới** cấu trúc sau trong `NomNom/`; hiện giờ các mục dưới đây chưa có:

```text
NomNom/
├── aboutus/
│   ├── index.html
│   └── aboutus.css
├── user/
│   ├── index.html
│   ├── account.html
│   ├── saved.html
│   ├── uploaded.html
│   ├── reviewed.html
│   ├── user.css
│   └── user.js
└── assets/
    ├── images/
    └── icons/
```

Tên trang User có thể chỉnh sau khi đối chiếu chính xác với Figma và cách nhóm chia việc. Không tạo file chỉ để lấp chỗ trống.

**M tự làm:** tạo các thư mục trước, rồi các file cần dùng. Kiểm tra Explorer để chắc file nằm trong `NomNom`, không nằm nhầm ở thư mục repo cha.

**T sẽ hỏi:** Đường dẫn ảnh từ `aboutus/index.html` khác đường dẫn ảnh từ `user/index.html` thế nào? Vì sao mỗi trang có thể có CSS riêng?

**Hoàn thành khi:** cấu trúc rõ ràng và m tự lần được đường dẫn tương đối giữa trang với CSS/ảnh.

### 1. Khung HTML cho About Us

**Mục tiêu:** tạo một tài liệu HTML hợp lệ và liên kết đúng stylesheet.

**M tự làm:** viết doctype, `html`, `head`, metadata, tiêu đề trang, liên kết CSS, rồi `body`. Chưa thêm toàn bộ nội dung.

**Tự kiểm tra:** ngôn ngữ trang là tiếng Việt; charset và viewport đúng; đường dẫn CSS tính từ vị trí của `index.html`; các thẻ đóng/mở khớp.

**T sẽ hỏi:** Trình duyệt cần metadata nào để hiển thị tiếng Việt và co giãn đúng trên điện thoại? CSS path được tính từ file HTML hay từ repo?

**Hoàn thành khi:** trang mở được, tiêu đề tab đúng, không có lỗi đường dẫn trong DevTools.

### 2. Phân tích thiết kế About Us thành các vùng

**Mục tiêu:** chuyển Figma thành các khối nội dung trước khi nghĩ đến màu sắc.

**M tự làm:** nhìn Figma và ghi ra thứ tự section; với mỗi section, ghi nội dung chính, phần nào là ảnh, phần nào là hành động. Vẽ sơ đồ thô bằng giấy hoặc ghi chú.

**T sẽ hỏi:** Section này trả lời câu hỏi gì cho người xem? Thành phần nào lặp lại? Phần nào nên là heading, danh sách, nút hoặc liên kết?

**Hoàn thành khi:** m giải thích được cấu trúc trang bằng lời mà chưa cần mở CSS.

### 3. Viết nội dung và HTML ngữ nghĩa cho About Us

**Mục tiêu:** dựng các section bằng HTML dễ đọc, dễ sửa.

**M tự làm:** thêm từng section một theo thứ tự thiết kế; dùng heading theo cấp bậc; dùng `section`, `article`, `figure`, `a` hoặc `button` theo đúng vai trò.

**Quy tắc:** viết nội dung mẫu trước; chưa thêm hiệu ứng. Ảnh cần có `alt` phù hợp; nếu ảnh chỉ trang trí thì ghi nhận điều đó.

**T sẽ hỏi:** Vì sao phần này là link hay button? Heading cấp này có hợp lý nếu đọc riêng cây heading không?

**Hoàn thành khi:** tắt CSS mà thứ tự và ý nghĩa nội dung vẫn rõ.

### 4. Tạo kiểu cho About Us

**Mục tiêu:** biến bố cục HTML thành giao diện gần Figma, rồi làm nó co giãn hợp lý.

**M tự làm theo thứ tự:** màu/chữ/khoảng cách cơ bản → bố cục từng section → hình ảnh và chi tiết → responsive cho màn hình hẹp.

**Tự kiểm tra:** so từng vùng với Figma; xem ở chiều rộng desktop và mobile; kiểm tra chữ không tràn, ảnh không méo, nút còn bấm được.

**T sẽ hỏi:** Phần tử cha nào nên điều khiển căn chỉnh? Khi màn hình hẹp, điều gì cần xếp lại và điều gì chỉ cần co giãn?

**Hoàn thành khi:** bố cục có chủ đích ở hai cỡ màn hình, CSS dễ lần theo và không phụ thuộc vào các khoảng đẩy ngẫu nhiên.

### 5. Khảo sát các màn hình User

**Mục tiêu:** hiểu luồng và những gì giống/khác nhau giữa các trang trước khi code.

**M tự làm:** liệt kê từng màn hình User mà nhóm giao; ghi vùng điều hướng, nội dung thay đổi, trạng thái rỗng/có dữ liệu và hành động người dùng có thể làm. Đối chiếu Figma thay vì đoán tên trang.

**T sẽ hỏi:** Trang nào là trang tổng quan? Mục nào là điều hướng? Khi dữ liệu trống thì người dùng nhìn thấy gì? Nút này chuyển trang hay thay đổi trạng thái?

**Hoàn thành khi:** m có bảng ngắn mô tả mục đích và khác biệt của từng màn hình.

### 6. Dựng HTML cho User

**Mục tiêu:** tạo các trang có cấu trúc nhất quán và nội dung dễ hiểu.

**M tự làm:** dựng khung một trang User trước; xác định phần điều hướng và vùng nội dung; sau đó mới chuyển cấu trúc phù hợp sang các trang còn lại. Không copy mù: giải thích được phần nào dùng chung trong phạm vi User và phần nào thay đổi.

**T sẽ hỏi:** Nếu đánh dấu mục menu đang chọn, dữ liệu đó đến từ đâu? Có nên đặt cả nội dung của mọi trang trong một HTML không, với yêu cầu bài này?

**Hoàn thành khi:** mỗi trang mở độc lập, nội dung đúng trang, liên kết nội bộ hoạt động.

### 7. CSS và JavaScript cho User

**Mục tiêu:** hoàn thiện giao diện và chỉ thêm hành vi cần thiết.

**M tự làm:** dùng `user.css` cho phần User; thêm JavaScript sau khi liệt kê hành động cần hoạt động. Không viết JS chỉ vì trang có file `user.js`.

**Tự kiểm tra:** menu/link đúng; trạng thái trang hiện tại dễ nhận ra; nút có phản hồi; không có lỗi console. Nếu cần mô phỏng lưu dữ liệu, xác nhận trước yêu cầu bài và cách dữ liệu cần tồn tại.

**T sẽ hỏi:** Hành vi nào thật sự cần JavaScript? Có thể làm bằng link hoặc HTML thuần không? Trạng thái nào cần cập nhật sau khi bấm?

**Hoàn thành khi:** m giải thích được từng đoạn JavaScript bằng hành động mà nó phục vụ.

### 8. Tự review, tích hợp sau khi merge, và luyện báo cáo

**Mục tiêu:** biết tự sửa và kết nối công việc với nhóm.

**M tự làm:** rà đường dẫn tương đối, liên kết giữa các trang, tên class, CSS có ảnh hưởng ngoài ý muốn, ảnh và font; sau khi merge thì nối navigation/footer theo thống nhất của nhóm.

**Luyện tình huống thầy xoá code:** mỗi lần chọn một section nhỏ, giải thích cấu trúc trước, viết lại HTML trước, CSS sau, rồi tự so với giao diện. Không học thuộc từng dòng; tập nhớ vai trò và thứ tự dựng.

**Hoàn thành khi:** m tự mở đúng trang từ repo, lần được lỗi đường dẫn, giải thích luồng trang và dựng lại một section cơ bản trong thời gian giới hạn.

## Checklist hoàn thành đồ án

- [ ] Cấu trúc thư mục đúng và m tự giải thích được.
- [ ] About Us có HTML ngữ nghĩa, CSS responsive, nội dung khớp thiết kế.
- [ ] Các màn hình User đã được đối chiếu Figma và hoạt động độc lập.
- [ ] Link, nút và trạng thái có hành vi đúng với phạm vi bài.
- [ ] Tài nguyên dùng đường dẫn tương đối đúng.
- [ ] Sau merge, liên kết giữa các trang hoạt động và CSS không đè nhau.
- [ ] M có thể giải thích và dựng lại một section khi bị hỏi.

## Cách báo tiến độ để t mentor

M gửi một trong các dạng sau:

- **“Xong cấu trúc”** — t kiểm tra cách đặt file và hỏi m vài câu về đường dẫn.
- **“T đang viết phần …”** kèm đoạn m tự viết — t review, chỉ ra điểm cần suy nghĩ và cho m tự sửa.
- **“T bị kẹt ở …”** kèm điều m dự định làm và điều đang xảy ra — t gợi ý từng nấc.
- **“Luyện báo cáo”** — t đóng vai giảng viên, hỏi về đoạn code m đã viết.

## Tiến độ hiện tại

- [x] Xoá các mục cũ bên trong `NomNom`; hiện chỉ còn `ROADMAP.md` này.
- [ ] Tạo mới cấu trúc thư mục và các file cần thiết theo Bước 0.
- [ ] Viết khung HTML About Us.



