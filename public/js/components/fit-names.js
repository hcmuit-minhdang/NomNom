/* Giữ tên công thức trên MỘT dòng: tên dài thì thu nhỏ chữ dần cho vừa khung (tối thiểu 11px).
   Tự chạy lại mỗi khi trang thêm thẻ món mới (danh sách tải từ API) hoặc khi đổi kích thước cửa sổ. */
(function () {
  "use strict";
  var SELECTOR = ".recipe-name, .food-name, #recipe-title, .card-title-tag:not(.similar-title-tag)";
  var MIN_SIZE = 11;

  function fit(el) {
    el.style.removeProperty("font-size");
    var size = parseFloat(getComputedStyle(el).fontSize);
    var guard = 0;
    while (el.scrollWidth > el.clientWidth + 1 && size > MIN_SIZE && guard++ < 60) {
      size -= 0.5;
      el.style.setProperty("font-size", size + "px");
    }
  }

  function fitAll() {
    document.querySelectorAll(SELECTOR).forEach(fit);
  }

  var timer = 0;
  function schedule() {
    window.clearTimeout(timer);
    timer = window.setTimeout(fitAll, 60);
  }

  // Theo dõi thẻ món được thêm vào trang (chỉ childList, nên việc đổi cỡ chữ không kích hoạt lại)
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("load", schedule);
  schedule();
})();
