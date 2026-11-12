# Ghép header NomNom

Hai file HTML là bản xem thử khách và thành viên. Cả hai dùng `style.css` và
`header.js`. Chỉ ghép khối `<header data-nomnom-header>`, nối CSS và JS với `defer`;
không cần tạo thêm trang. Các đường dẫn JS được tính từ vị trí `header.js`.

## Menu và tìm kiếm

- Menu tự đóng khi mở menu khác, chọn mục, bấm bên ngoài hoặc nhấn Escape.
- Thanh tìm kiếm tự focus; Enter và nút tìm kiếm cùng gửi form GET với `q` đã trim.
- Trang nhận mặc định là `NomNom/Phat/index.html`. Người phụ trách trang này cần
  đọc `new URLSearchParams(location.search).get("q")` để lọc dữ liệu.
- Logo, danh mục, giới thiệu và hồ sơ đã trỏ đến các file hiện có trong nhóm.
  Một số file đích còn rỗng; header không thêm nội dung cho các trang đó.

Nếu nhóm đổi trang đích, khai báo **trước** khi nạp `header.js`:

```js
window.NomNomHeaderConfig = {
    // Đường dẫn tương đối tính từ thư mục NomNom/ chứa Thach, Phat, Minh, Thinh.
    routes: { search: "Phat/index.html" },
    user: null // null: khách; object người dùng: thành viên
};
```

Các khóa route: `home`, `search`, `categories`, `about`, `overview`, `uploaded`,
`saved`, `history`, `account`. Có thể dùng URL tuyệt đối cùng website.

## Kết nối phần tài khoản

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

## Các mục chờ trang đích

`nomnom:navigation-request` có `event.detail.target` là `ingredients`, `random`,
`collections`, `guide`, `faq` hoặc `contact`. Module phụ trách nghe sự kiện,
gọi `preventDefault()` và mở phần tương ứng. Khi có URL chính thức, có thể thay
nút bằng thẻ `<a href="...">` ngay trong header.

Nếu chưa có module nhận sự kiện, header hiển thị thông báo chờ tích hợp;
không điều hướng đến trang giả hoặc giả lập đăng xuất thành công.
