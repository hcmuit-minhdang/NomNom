/* Overlay "TỦ LẠNH" ở trang chủ (Figma: FILTER 1).
   Mở khi bấm "BỘ LỌC NGUYÊN LIỆU"; đóng khi bấm ra ngoài / nút X / phím Esc.
   Bấm TÌM KIẾM -> /pages/fridge-results.html?ingredients=nhom:id,... (cùng định dạng với fridge.js). */
(function () {
  "use strict";
  var dialog = document.getElementById("fridge-dialog");
  var openLink = document.querySelector(".fridge-filter-link");
  if (!dialog || !openLink) return;

  var form = document.getElementById("fridge-form");
  var error = document.getElementById("fridge-error");
  var selects = dialog.querySelectorAll(".fridge-select");

  // Mở overlay thay vì sang trang /pages/fridge.html (link vẫn giữ khi không có JS).
  openLink.addEventListener("click", function (e) {
    e.preventDefault();
    error.hidden = true;
    dialog.showModal();
  });

  document.getElementById("fridge-close").addEventListener("click", function () {
    dialog.close();
  });

  // Bấm vào vùng tối bên ngoài khung trắng thì đóng.
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) dialog.close();
  });

  // Mỗi lúc chỉ mở 1 ô thả xuống.
  selects.forEach(function (select) {
    select.addEventListener("toggle", function () {
      if (!select.open) return;
      selects.forEach(function (other) {
        if (other !== select) other.open = false;
      });
    });
  });

  // Hiện số ô đã chọn cạnh tên nhóm.
  form.addEventListener("change", function () {
    error.hidden = true;
    selects.forEach(function (select) {
      var count = select.querySelectorAll("input:checked").length;
      select.querySelector(".fridge-count").textContent = count > 0 ? count : "";
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var tokens = [];
    form.querySelectorAll("input[type=checkbox]:checked").forEach(function (box) {
      tokens.push(box.name + ":" + box.value);
    });
    if (tokens.length === 0) {
      error.hidden = false;
      return;
    }
    window.location.href = "/pages/fridge-results.html?ingredients=" +
      encodeURIComponent(tokens.join(",")).replace(/%3A/gi, ":").replace(/%2C/gi, ",");
  });
})();
