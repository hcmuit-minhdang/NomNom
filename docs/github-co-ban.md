# Các kiến thức cơ bản về GitHub

**GitHub là nền tảng lưu trữ mã nguồn, theo dõi thay đổi và cộng tác làm phần mềm.** Bạn cũng có thể dùng nó để quản lý tài liệu, bài tập hoặc dự án cá nhân.

## 1. Phân biệt Git và GitHub

- **Git:** công cụ quản lý phiên bản, chạy trên máy tính. Giúp lưu lịch sử thay đổi và quay lại phiên bản cũ.
- **GitHub:** dịch vụ trực tuyến lưu trữ dự án dùng Git, hỗ trợ chia sẻ và làm việc nhóm.

Ví dụ: bạn dùng **Git** để lưu các phiên bản của bài tập, rồi đưa lên **GitHub** để giảng viên hoặc đồng đội xem.

## 2. Các khái niệm quan trọng

| Khái niệm | Ý nghĩa đơn giản |
|---|---|
| **Repository — repo** | Kho dự án, chứa tệp và lịch sử thay đổi |
| **Commit** | Một lần ghi lại thay đổi, kèm lời mô tả |
| **Branch** | Nhánh làm việc để phát triển tính năng riêng |
| **main** | Tên thường dùng cho nhánh chính của dự án |
| **Merge** | Gộp thay đổi từ một nhánh vào nhánh khác |
| **Clone** | Sao chép repo về máy, gồm cả lịch sử Git |
| **Push** | Đưa các commit từ máy lên GitHub |
| **Pull** | Lấy và tích hợp thay đổi mới từ kho từ xa |
| **Pull Request — PR** | Đề nghị xem xét và gộp thay đổi |
| **Fork** | Tạo bản sao repo trên tài khoản GitHub của bạn |
| **Issue** | Mục theo dõi lỗi, yêu cầu hoặc công việc |

**Commit chỉ lưu vào Git trên máy; cần push để đưa commit lên GitHub.**

## 3. Quy trình làm việc thường gặp

Giả sử bạn muốn thêm chức năng đăng nhập:

1. Lấy dự án về máy bằng **clone**.
2. Tạo nhánh riêng, chẳng hạn `feature/login`.
3. Sửa mã nguồn và kiểm tra.
4. Tạo **commit** mô tả thay đổi.
5. **Push** nhánh lên GitHub.
6. Mở **Pull Request** để mọi người xem xét.
7. Khi được chấp nhận, **merge** vào nhánh chính.

Dự án cá nhân nhỏ có thể làm đơn giản hơn, nhưng quy trình này giúp bạn quen với cách làm việc nhóm.

## 4. Những lệnh Git cơ bản

Chạy trong thư mục dự án:

```bash
# Sao chép dự án về máy
git clone https://github.com/username/project.git

# Xem các tệp đang thay đổi
git status

# Tạo và chuyển sang nhánh mới
git switch -c feature/login

# Chọn tệp để đưa vào commit
git add ten-tep

# Ghi lại thay đổi
git commit -m "Thêm chức năng đăng nhập"

# Đưa nhánh lên GitHub và thiết lập nhánh theo dõi
git push -u origin feature/login

# Lấy và tích hợp thay đổi mới của nhánh đang theo dõi
git pull
```

Trong đó, **`origin`** là tên thường được Git đặt cho kho từ xa khi bạn clone.

## 5. Hiểu kết quả `git status`, nhánh và GitHub web

### `nothing to commit, working tree clean` nghĩa là gì?

Thông báo này chỉ có nghĩa là **trong thư mục trên máy không còn tệp nào đang chờ commit**. Các tệp hiện tại đã giống với commit mới nhất của nhánh local.

Nó **không có nghĩa chắc chắn** GitHub web và máy bạn đang hiển thị cùng một nội dung. GitHub vẫn có thể khác nếu:

- Bạn đang xem một nhánh khác trên GitHub, ví dụ web đang ở `main` còn máy đang ở `NomNom-QT`.
- Bạn đang mở nhầm repo hoặc fork khác trên GitHub.
- Có commit mới trên GitHub nhưng nhánh local chưa được cập nhật.

### Đọc `git status -sb`

Lệnh ngắn gọn này cho biết nhánh hiện tại và trạng thái so với GitHub:

```bash
git status -sb
```

Ví dụ:

```text
## NomNom-QT
```

Bạn đang ở nhánh local `NomNom-QT`. Dòng này không có `...origin/NomNom-QT`, nên nhánh hiện chưa theo dõi một nhánh tương ứng trên GitHub.

```text
## NomNom-QT...origin/NomNom-QT [behind 2]
```

Bạn đang ở nhánh `NomNom-QT`, nhánh này theo dõi `origin/NomNom-QT` và đang thiếu 2 commit từ GitHub.

```text
## NomNom-QT...origin/NomNom-QT [ahead 1]
```

Máy bạn có 1 commit chưa được push lên GitHub.

### Vì sao `git fetch` không hiện gì?

`git fetch` tải thông tin commit mới từ GitHub về máy nhưng **không tự gộp vào mã nguồn đang mở**. Lệnh này thường không in gì khi không có thông tin đáng chú ý; đó không phải lỗi.

Sau khi fetch, dùng các lệnh sau để xác định bạn đang so sánh đúng repo và nhánh:

```bash
# Xem nhánh hiện tại trên máy
git branch --show-current

# Xem URL repo GitHub đang kết nối
git remote -v

# Xem các nhánh có trên remote (GitHub)
git branch -r

# Xem trạng thái nhánh local so với remote
git status -sb
```

Lưu ý: `git remote` không nhận URL trang web làm đối số. Hãy dùng `git remote -v`; URL remote thường có dạng `https://github.com/ten-tai-khoan/ten-repo.git`, không phải đường dẫn như `.../tree/main/thu-muc`.

Nếu GitHub đang xem `main` còn máy bạn đang ở `NomNom-QT`, hãy xem các commit có ở `main` nhưng chưa có ở nhánh hiện tại bằng:

```bash
git fetch
git log --oneline NomNom-QT..origin/main
```

## 6. Các tệp nên biết

- **`README.md`:** giới thiệu dự án, cách cài đặt và sử dụng.
- **`.gitignore`:** chỉ định các tệp chưa được theo dõi mà Git nên bỏ qua, như tệp tạm hoặc thư mục thư viện.
- **`LICENSE`:** quy định quyền sử dụng, sửa đổi và phân phối dự án.

Lưu ý: thêm một tệp vào `.gitignore` **không xóa tệp đó khỏi lịch sử Git nếu đã commit trước đó**.

## 7. Những điều người mới dễ nhầm

- **Public repo:** người khác có thể xem; **private repo:** chỉ những người có quyền mới truy cập được.
- **Repo công khai không đồng nghĩa được phép sử dụng mã nguồn tùy ý** — cần xem giấy phép.
- **Pull Request khác `git pull`:** PR là đề nghị gộp thay đổi; `git pull` là lệnh cập nhật kho trên máy.
- **Merge conflict:** xảy ra khi Git không thể tự gộp thay đổi; bạn cần chọn hoặc chỉnh lại nội dung phù hợp.
- Không đưa mật khẩu, khóa API hoặc tệp chứa bí mật lên repo.

Bạn nên bắt đầu bằng một repo bài tập nhỏ: tạo `README.md`, sửa nội dung, commit, push, rồi thử tạo nhánh và mở Pull Request.
