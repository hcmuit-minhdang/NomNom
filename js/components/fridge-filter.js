/* Overlay "TỦ LẠNH" ở trang chủ (Figma: FILTER 1).
   Mở khi bấm "BỘ LỌC NGUYÊN LIỆU"; đóng khi bấm ra ngoài / nút X / phím Esc.
   Bấm TÌM KIẾM -> /pages/fridge-results.html?ingredients=nhom:id,... (cùng định dạng với fridge.js). */
(function () {
  "use strict";
  const dialog = document.getElementById("fridge-dialog");
  const openLink = document.querySelector(".fridge-filter-link");
  if (!dialog || !openLink) return;

  const form = document.getElementById("fridge-form");
  const error = document.getElementById("fridge-error");
  const selects = dialog.querySelectorAll(".fridge-dialog__select");

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
      const count = select.querySelectorAll("input:checked").length;
      select.querySelector(".fridge-dialog__count").textContent = count > 0 ? count : "";
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const tokens = [], tags = {};
    form.querySelectorAll("input[type=checkbox]:checked").forEach(function (box) {
      // Chế độ ăn / Vùng miền / Ngân sách là bộ lọc nhãn: gửi riêng mỗi nhóm một tham số (như fridge.js)
      if (box.hasAttribute("data-tag-filter")) (tags[box.name] = tags[box.name] || []).push(box.value);
      else tokens.push(box.name + ":" + box.value);
    });
    const tagNames = Object.keys(tags);
    if (tokens.length === 0 && tagNames.length === 0) {
      error.hidden = false;
      return;
    }
    const parts = [];
    if (tokens.length) parts.push("ingredients=" + encodeURIComponent(tokens.join(",")).replace(/%3A/gi, ":").replace(/%2C/gi, ","));
    tagNames.forEach(function (tagName) { parts.push(tagName + "=" + encodeURIComponent(tags[tagName].join(","))); });
    window.location.href = "/pages/fridge-results.html?" + parts.join("&");
  });
})();
