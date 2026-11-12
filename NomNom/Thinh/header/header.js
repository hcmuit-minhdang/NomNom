/* Chỉ xử lý header. Trang tìm kiếm và phần tài khoản tiếp nhận qua URL/sự kiện. */
(function () {
    "use strict";

    const header = document.querySelector("[data-nomnom-header]");
    if (!header || header.dataset.initialized) return;
    header.dataset.initialized = "true";

    // Tính từ file JS để giữ đường dẫn đúng khi ghép header vào trang khác.
    const siteRoot = new URL("../../", document.currentScript.src);
    const routes = {
        home: "Thach/Home-page/index.html",
        search: "Phat/index.html",
        categories: "Phat/index.html",
        about: "Minh/aboutus/index.html",
        overview: "Minh/user/overview.html",
        uploaded: "Minh/user/uploaded.html",
        saved: "Minh/user/saved.html",
        history: "Minh/user/history.html",
        account: "Minh/user/index.html",
        ...window.NomNomHeaderConfig?.routes
    };

    const panels = [...header.querySelectorAll("details")];
    const search = header.querySelector(".search-bar-butt");
    const form = search.querySelector("form");
    const input = form.elements.q;
    const status = header.querySelector(".header-status");

    header.querySelectorAll("[data-header-route]").forEach(link => {
        link.href = new URL(routes[link.dataset.headerRoute], siteRoot).href;
    });
    form.action = new URL(routes.search, siteRoot).href;

    function closePanels(except) {
        panels.forEach(panel => {
            if (panel !== except) panel.open = false;
        });
    }

    function showStatus(message) {
        status.textContent = message;
        status.hidden = false;
    }

    function syncPanel(panel) {
        const summary = panel.querySelector("summary");
        summary.setAttribute("aria-expanded", String(panel.open));
        if (panel === search) {
            summary.setAttribute("aria-label", panel.open ? "Đóng tìm kiếm" : "Mở tìm kiếm");
        }
    }

    function initHeaderDropdowns() {
        panels.forEach(panel => {
            syncPanel(panel);
            panel.addEventListener("toggle", () => {
                syncPanel(panel);
                if (!panel.open) return;
                closePanels(panel);
                status.hidden = true;
                if (panel === search) input.focus();
            });
        });

        header.addEventListener("click", event => {
            const summary = event.target.closest("summary");
            if (summary && !summary.parentElement.open) {
                closePanels(summary.parentElement);
            }
            const control = event.target.closest("a, button");
            if (control?.closest(".three-button")) {
                const owner = control.closest("details");
                closePanels();
                // Nút trong menu sắp ẩn cần trả focus trước khi phần khác mở popup.
                if (owner) owner.querySelector("summary").focus();
            }
        });

        document.addEventListener("click", event => {
            if (header.contains(event.target)) return;
            closePanels();
            status.hidden = true;
        });

        document.addEventListener("keydown", event => {
            if (event.key !== "Escape") return;
            const opened = panels.find(panel => panel.open);
            if (!opened) {
                status.hidden = true;
                return;
            }
            event.preventDefault();
            closePanels();
            opened.querySelector("summary").focus();
        });
    }

    function initHeaderSearch() {
        input.addEventListener("input", () => input.setCustomValidity(""));
        form.addEventListener("submit", event => {
            input.value = input.value.trim();
            if (!input.value) {
                event.preventDefault();
                input.setCustomValidity("Bạn hãy nhập từ khóa tìm kiếm.");
                input.reportValidity();
            }
            // Form GET tự mã hóa tiếng Việt và ký tự đặc biệt vào tham số q.
        });
    }

    function updateHeaderAuth(user) {
        const isMember = Boolean(user);
        const focused = document.activeElement;
        closePanels();
        header.querySelector("[data-header-member]").hidden = !isMember;
        header.querySelector("[data-header-guest]").hidden = isMember;
        status.hidden = true;

        if (header.contains(focused) && focused.closest("[hidden]")) {
            const target = isMember
                ? header.querySelector("[data-header-member] summary")
                : header.querySelector('[data-auth-action="login"]');
            target.focus();
        }
    }

    header.addEventListener("click", event => {
        const control = event.target.closest("[data-auth-action], [data-header-action]");
        if (!control) return;
        const authAction = control.dataset.authAction;
        const request = new CustomEvent(authAction ? "nomnom:auth-request" : "nomnom:navigation-request", {
            cancelable: true,
            detail: authAction ? { action: authAction } : { target: control.dataset.headerAction }
        });
        status.hidden = true;
        // preventDefault() trong listener nghĩa là phần phụ trách đã nhận xử lý.
        if (document.dispatchEvent(request)) {
            showStatus(`Chức năng “${control.textContent.trim()}” đang chờ tích hợp.`);
        }
    });

    document.addEventListener("nomnom:auth-change", event => {
        if (event.detail && Object.hasOwn(event.detail, "user")) {
            updateHeaderAuth(event.detail.user);
        }
    });

    initHeaderDropdowns();
    initHeaderSearch();
    window.NomNomHeader = { updateHeaderAuth };

    // Không có dữ liệu tài khoản thì giữ trạng thái xem thử của từng bản HTML.
    if (Object.hasOwn(window.NomNomHeaderConfig || {}, "user")) {
        updateHeaderAuth(window.NomNomHeaderConfig.user);
    }
})();
