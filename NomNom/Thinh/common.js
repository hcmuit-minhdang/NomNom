/* Điểm nối tạm: bỏ data-pending và thay href khi nhóm có trang thật.
   Không mô phỏng đăng nhập thành công hoặc kết quả tìm kiếm giả. */
const pendingDialog = document.querySelector("#pending-dialog");
if (pendingDialog) {
    document.querySelectorAll("[data-pending]").forEach(function (control) {
        control.addEventListener("click", function (event) {
            event.preventDefault();
            pendingDialog.querySelector("[data-pending-title]").textContent = control.dataset.pending;
            pendingDialog.showModal();
        });
    });
}
