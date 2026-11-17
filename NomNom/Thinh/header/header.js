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
        search: "Phat/search-results/index.html",
        categories: "Phat/category-page-1/index.html",
        about: "Minh/aboutus/index.html",
        overview: "Minh/user/overview.html",
        uploaded: "Minh/user/uploaded.html",
        saved: "Minh/user/saved.html",
        history: "Minh/user/history.html",
        account: "Minh/user/index.html",
        ...window.NomNomHeaderConfig?.routes
    };

    const panels = [...header.querySelectorAll("details")];
    const search = header.querySelector(".site-header_search");
    const form = search.querySelector("form");
    const input = form.elements.q;
    const status = header.querySelector(".site-header_status");
    const menuButton = header.querySelector("[data-header-menu-toggle]");
    const controls = header.querySelector(".site-header_controls");
    // Giữ mốc này giống @media (max-width: 1000px) trong style.css.
    const mobileScreen = window.matchMedia("(max-width: 1000px)");
    const IDLE_DELAY = 4000; // Mili giây: 4000 ms = 4 giây.
    const REVEAL_EDGE = 24; // Rê chuột vào 24px trên cùng để gọi header lại.
    let idleTimer;

    header.querySelectorAll("[data-header-route]").forEach(link => {
        link.href = new URL(routes[link.dataset.headerRoute], siteRoot).href;
    });
    form.action = new URL(routes.search, siteRoot).href;

    function closePanels(except) {
        panels.forEach(panel => {
            if (panel !== except) panel.open = false;
        });
    }

    function isMobileMenuOpen() {
        return header.classList.contains("site-header_menu-open");
    }

    function isUsingHeader() {
        const focused = document.activeElement;
        const usingKeyboard = header.contains(focused) && focused.matches(":focus-visible");
        const editing = header.contains(focused) && focused.matches("input, textarea, select, [contenteditable]");
        return isMobileMenuOpen() || panels.some(panel => panel.open) || usingKeyboard || editing;
    }

    function isAtPageTop() {
        // scrollY <= 0 gồm cả trường hợp kéo quá đầu trang trên điện thoại.
        return window.scrollY <= 0;
    }

    function restartIdleTimer() {
        // Hủy lịch cũ để không có nhiều bộ đếm chạy cùng lúc.
        window.clearTimeout(idleTimer);
        if (isAtPageTop()) {
            header.classList.remove("site-header_hidden");
            return;
        }
        if (document.hidden || isUsingHeader()) return;
        idleTimer = window.setTimeout(() => {
            if (!isAtPageTop() && !isUsingHeader()) header.classList.add("site-header_hidden");
        }, IDLE_DELAY);
    }

    function showHeader() {
        header.classList.remove("site-header_hidden");
        restartIdleTimer();
    }

    function setMobileMenu(open, restoreFocus = false) {
        if (!menuButton) return;
        const expanded = mobileScreen.matches && open;
        if (expanded) status.hidden = true;
        header.classList.toggle("site-header_menu-open", expanded);
        menuButton.setAttribute("aria-expanded", String(expanded));
        menuButton.setAttribute("aria-label", expanded ? "Đóng menu" : "Mở menu");
        // Menu đã đóng không được nhận Tab hoặc click trong lúc đang chuyển động.
        controls.inert = mobileScreen.matches && !expanded;
        if (!expanded) closePanels();
        if (restoreFocus) menuButton.focus({ preventScroll: true });
        showHeader();
    }

    function initResponsiveMenu() {
        if (!menuButton) return;
        menuButton.addEventListener("click", () => {
            setMobileMenu(!isMobileMenuOpen());
        });

        mobileScreen.addEventListener("change", () => {
            const focused = document.activeElement;
            const focusInControls = controls.contains(focused);
            setMobileMenu(false, mobileScreen.matches && focusInControls);
            if (!mobileScreen.matches && focused === menuButton) {
                header.querySelector(".site-header_logo-box a").focus({ preventScroll: true });
            }
        });
        setMobileMenu(false);
    }

    function initHeaderAutoHide() {
        // Chỉ tương tác với header mới tính lại thời gian, không theo mọi click trên trang.
        header.addEventListener("pointermove", showHeader);
        header.addEventListener("pointerdown", showHeader);
        header.addEventListener("click", showHeader);
        header.addEventListener("input", showHeader);
        header.addEventListener("focusin", showHeader);
        header.addEventListener("focusout", () => {
            // Đợi focus chuyển xong rồi mới kiểm tra người dùng còn ở header không.
            window.setTimeout(restartIdleTimer, 0);
        });

        document.addEventListener("pointermove", event => {
            if (event.pointerType === "mouse" && event.clientY <= REVEAL_EDGE) showHeader();
        }, { passive: true });
        document.addEventListener("keydown", event => {
            if (event.key === "Tab") showHeader();
        });

        let lastScrollY = Math.max(0, window.scrollY);
        window.addEventListener("scroll", () => {
            const currentScrollY = Math.max(0, window.scrollY);
            if (currentScrollY === 0 || currentScrollY < lastScrollY) showHeader();
            // Ở đầu trang không có lịch ẩn; bắt đầu đếm khi vừa cuộn xuống.
            else if (lastScrollY === 0) restartIdleTimer();
            lastScrollY = currentScrollY;
        }, { passive: true });
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) window.clearTimeout(idleTimer);
            else showHeader();
        });
        restartIdleTimer();
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
                showHeader();
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
            if (control?.closest(".site-header_navigation")) {
                const owner = control.closest("details");
                if (isMobileMenuOpen()) {
                    setMobileMenu(false, true);
                } else {
                    closePanels();
                    // Trả focus trước khi phần phụ trách mở popup.
                    if (owner) owner.querySelector("summary").focus();
                }
            }
        });

        document.addEventListener("click", event => {
            if (header.contains(event.target)) return;
            const wasOpen = isMobileMenuOpen() || panels.some(panel => panel.open);
            closePanels();
            if (isMobileMenuOpen()) setMobileMenu(false);
            status.hidden = true;
            if (wasOpen) restartIdleTimer();
        });

        document.addEventListener("keydown", event => {
            if (event.key !== "Escape") return;
            const opened = panels.find(panel => panel.open);
            if (!opened) {
                if (isMobileMenuOpen()) {
                    event.preventDefault();
                    setMobileMenu(false, true);
                }
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
            const target = mobileScreen.matches && !isMobileMenuOpen() && menuButton
                ? menuButton
                : isMember
                ? header.querySelector("[data-header-member] summary")
                : header.querySelector('[data-auth-action="login"]');
            target.focus();
        }
        showHeader();
    }

    // Gắn xử lý đóng menu trước listener chuyển giao cho phần tài khoản.
    initResponsiveMenu();
    initHeaderDropdowns();
    initHeaderSearch();
    initHeaderAutoHide();

    header.addEventListener("click", event => {
        const control = event.target.closest("[data-auth-action], [data-header-action]");
        if (!control) return;
        if (isMobileMenuOpen()) setMobileMenu(false, true);
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

    window.NomNomHeader = { updateHeaderAuth };

    // Không có dữ liệu tài khoản thì giữ trạng thái xem thử của từng bản HTML.
    if (Object.hasOwn(window.NomNomHeaderConfig || {}, "user")) {
        updateHeaderAuth(window.NomNomHeaderConfig.user);
    }
})();
