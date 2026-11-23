/* Nút quay về đầu trang: hiện khi cuộn xuống quá một màn hình, bấm để cuộn mượt lên đầu. */
(function () {
    "use strict";

    const SHOW_AFTER = 400; // px cuộn xuống thì mới hiện nút

    const button = document.createElement("button");
    button.type = "button";
    button.className = "back-to-top";
    button.setAttribute("aria-label", "Về đầu trang");
    button.hidden = true;
    button.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path d="M5 15l7-7 7 7" stroke="#292929" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.body.appendChild(button);

    function update() {
        button.hidden = window.scrollY < SHOW_AFTER;
    }

    button.addEventListener("click", function () {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });

    window.addEventListener("scroll", update, { passive: true });
    update();
})();
