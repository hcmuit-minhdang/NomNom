// Overlay "TỦ LẠNH": mở khi bấm "BỘ LỌC NGUYÊN LIỆU", đóng khi bấm ra ngoài / nút X / phím Esc.
// Bấm TÌM KIẾM thì form GET gửi các ô đã chọn sang trang "Công thức phù hợp" của Thư.
const fridgeDialog = document.getElementById("fridge-dialog");
const fridgeOpenLink = document.querySelector(".fridge-filter-link");
const fridgeForm = document.getElementById("fridge-form");
const fridgeError = document.getElementById("fridge-error");

// Mở overlay thay vì đi theo link (link vẫn giữ để trang chạy được khi không có JS).
fridgeOpenLink.addEventListener("click", function (e) {
    e.preventDefault();
    fridgeError.hidden = true;
    fridgeDialog.showModal();
});

document.getElementById("fridge-close").addEventListener("click", function () {
    fridgeDialog.close();
});

// Bấm vào vùng tối bên ngoài khung trắng thì đóng (Figma: "close on click outside").
fridgeDialog.addEventListener("click", function (e) {
    if (e.target === fridgeDialog) fridgeDialog.close();
});

// Mỗi lúc chỉ mở 1 ô thả xuống cho gọn.
const fridgeSelects = fridgeDialog.querySelectorAll(".fridge-select");
fridgeSelects.forEach(function (select) {
    select.addEventListener("toggle", function () {
        if (!select.open) return;
        fridgeSelects.forEach(function (other) {
            if (other !== select) other.open = false;
        });
    });
});

// Hiện số ô đã chọn cạnh tên nhóm.
fridgeForm.addEventListener("change", function () {
    fridgeError.hidden = true;
    fridgeSelects.forEach(function (select) {
        const count = select.querySelectorAll("input:checked").length;
        select.querySelector(".fridge-count").textContent = count > 0 ? count : "";
    });
});

// Chưa chọn ô nào thì không gửi, báo ngay trong overlay.
fridgeForm.addEventListener("submit", function (e) {
    if (fridgeForm.querySelectorAll("input:checked").length === 0) {
        e.preventDefault();
        fridgeError.hidden = false;
    }
});
