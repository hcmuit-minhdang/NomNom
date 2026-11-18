/* Bộ lọc dùng chung (Danh mục món ăn + Công thức theo nguyên liệu tủ lạnh):
   bấm tên nhóm để mở/đóng danh sách ô chọn. Việc gửi bộ lọc do script của từng trang xử lý. */
(function () {
  "use strict";
  document.querySelectorAll(".filter-trigger-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var group = btn.parentElement;
      var open = !group.classList.contains("is-open");
      group.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
})();
