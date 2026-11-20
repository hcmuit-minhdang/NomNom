/* Giữ tên công thức đọc được đầy đủ: thu nhỏ chữ cho vừa một dòng (tối thiểu 11px); quá dài thì cho xuống 2 dòng.
   Tự chạy lại mỗi khi trang thêm thẻ món mới (danh sách được nạp từ kho dữ liệu) hoặc khi đổi kích thước cửa sổ. */
(function () {
  "use strict";
  const SELECTOR = ".recipe-name, .food-name, #recipe-title, .card__title-tag:not(.similar-title-tag)";
  const MIN_SIZE = 11;

  const RESET = ["font-size", "white-space", "overflow", "text-overflow", "display", "line-height", "-webkit-line-clamp", "-webkit-box-orient"];

  function fit(element) {
    RESET.forEach(function (propertyName) { element.style.removeProperty(propertyName); });
    const orig = parseFloat(getComputedStyle(element).fontSize);
    let size = orig;
    let guard = 0;
    // 1) Thu nhỏ chữ cho vừa MỘT dòng, nhưng không nhỏ quá 70% cỡ gốc (tối thiểu 11px) để tên không bị bé hơn chữ thân bài
    const floor1 = Math.max(MIN_SIZE, orig * 0.7);
    while (element.scrollWidth > element.clientWidth && size - 0.5 >= floor1 && guard++ < 60) {
      size -= 0.5;
      element.style.setProperty("font-size", size + "px");
    }
    if (element.scrollWidth <= element.clientWidth + 1) return;
    // 2) Vẫn dài: cho xuống tối đa 2 dòng ở cỡ chữ lớn hơn, chỉ thu nhỏ thêm nếu 2 dòng vẫn chưa đủ (tối thiểu 11px)
    element.style.setProperty("white-space", "normal");
    element.style.setProperty("display", "-webkit-box");
    element.style.setProperty("-webkit-box-orient", "vertical");
    element.style.setProperty("-webkit-line-clamp", "2");
    element.style.setProperty("line-height", "1.2");
    element.style.setProperty("overflow", "hidden");
    size = Math.max(MIN_SIZE, orig * 0.85);
    element.style.setProperty("font-size", size + "px");
    guard = 0;
    while (element.scrollHeight > element.clientHeight + 1 && size - 0.5 >= MIN_SIZE && guard++ < 60) {
      size -= 0.5;
      element.style.setProperty("font-size", size + "px");
    }
    if (!element.title) element.title = element.textContent.trim();
  }

  function fitAll() {
    document.querySelectorAll(SELECTOR).forEach(fit);
  }

  let timer = 0;
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
