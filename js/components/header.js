/* Chỉ xử lý header. Trang tìm kiếm và phần tài khoản tiếp nhận qua URL/sự kiện. */
(function () {
    "use strict";

    const header = document.querySelector("[data-nomnom-header]");
    if (!header || header.dataset.initialized) return;
    header.dataset.initialized = "true";

    // Bảng đường dẫn của header (tuyệt đối từ gốc site); trang nào cần có thể ghi đè bằng window.NomNomHeaderConfig.routes.
    const routes = {
        home: "/",
        search: "/pages/search.html",
        categories: "/pages/category.html",
        about: "/about.html",
        overview: "/pages/account/overview.html",
        uploaded: "/pages/account/uploaded.html",
        saved: "/pages/account/saved.html",
        history: "/pages/account/history.html",
        reviewed: "/pages/account/reviewed.html",
        ingredients: "/pages/fridge.html",
        compare: "/pages/ingredients.html",
        upload: "/pages/upload.html",
        account: "/pages/account/overview.html#thong-tin-tai-khoan",
        ...window.NomNomHeaderConfig?.routes
    };

    const panels = [...header.querySelectorAll("details")];
    const search = header.querySelector(".site-header__search");
    const form = search.querySelector("form");
    const input = form.elements.q;
    const status = header.querySelector(".site-header__status");
    const menuButton = header.querySelector("[data-header-menu-toggle]");
    const controls = header.querySelector(".site-header__controls");
    // Giữ mốc này giống @media (max-width: 1120px) trong header.css.
    const mobileScreen = window.matchMedia("(max-width: 1120px)");

    header.querySelectorAll("[data-header-route]").forEach(link => {
        link.href = routes[link.dataset.headerRoute];
    });
    form.action = routes.search;

    function closePanels(except) {
        panels.forEach(panel => {
            if (panel !== except) panel.open = false;
        });
    }

    function isMobileMenuOpen() {
        return header.classList.contains("is-open");
    }

    function setMobileMenu(open, restoreFocus = false) {
        if (!menuButton) return;
        const expanded = mobileScreen.matches && open;
        if (expanded) status.hidden = true;
        header.classList.toggle("is-open", expanded);
        menuButton.setAttribute("aria-expanded", String(expanded));
        menuButton.setAttribute("aria-label", expanded ? "Đóng menu" : "Mở menu");
        // Menu đã đóng không được nhận Tab hoặc click trong lúc đang chuyển động.
        controls.inert = mobileScreen.matches && !expanded;
        if (!expanded) closePanels();
        if (restoreFocus) menuButton.focus({ preventScroll: true });
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
                header.querySelector(".site-header__logo-box a").focus({ preventScroll: true });
            }
        });
        setMobileMenu(false);
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
            if (control?.closest(".site-header__navigation")) {
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
            closePanels();
            if (isMobileMenuOpen()) setMobileMenu(false);
            status.hidden = true;
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
    }

    // Gắn xử lý đóng menu trước listener chuyển giao cho phần tài khoản.
    initResponsiveMenu();
    initHeaderDropdowns();
    initHeaderSearch();

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


    /* ---- Điều hướng cho các nút còn lại của menu + liên kết chân trang (chạy trên mọi trang) ---- */
    const navTargets = {
        guide: "/about.html#huong-dan",
        faq: "/about.html#faq",
        contact: "/about.html#gop-y"
    };
    document.addEventListener("nomnom:navigation-request", event => {
        const target = event.detail && event.detail.target;
        if (navTargets[target]) {
            event.preventDefault();
            location.href = navTargets[target];
        } else if (target === "random") {
            event.preventDefault();
            window.NomNomStore.run("GET", "/recipes?limit=50")
                .then(res => {
                    const data = res.data;
                    const items = (data && data.items) || [];
                    if (!items.length) throw new Error("empty");
                    const pick = items[Math.floor(Math.random() * items.length)];
                    location.href = "/pages/recipe.html?id=" + encodeURIComponent(pick.id);
                })
                .catch(() => showStatus("Chưa lấy được gợi ý, bạn thử lại sau nhé."));
        }
    });
    const footerLinks = {
        "tất cả công thức": "/pages/category.html",
        "danh mục": "/pages/category.html",
        "so sánh giá": "/pages/ingredients.html",
        "đánh giá của tôi": "/pages/account/reviewed.html",
        "về nomnom": "/about.html",
        "hướng dẫn sử dụng": "/about.html#huong-dan",
        "câu hỏi thường gặp": "/about.html#faq",
        "liên hệ": "/about.html#gop-y"
    };
    const socials = { facebook: "https://www.facebook.com/", instagram: "https://www.instagram.com/",
        youtube: "https://www.youtube.com/", tiktok: "https://www.tiktok.com/" };
    document.querySelectorAll('.site-footer a[href="#"]').forEach(a => {
        const text = a.textContent.trim().toLowerCase();
        if (footerLinks[text]) a.href = footerLinks[text];
        else if (socials[text]) {
            a.href = socials[text];
            a.target = "_blank";
            a.rel = "noopener noreferrer";
        }
    });

    window.NomNomHeader = { updateHeaderAuth };

    // Không có dữ liệu tài khoản thì giữ trạng thái xem thử của từng bản HTML.
    if (Object.hasOwn(window.NomNomHeaderConfig || {}, "user")) {
        updateHeaderAuth(window.NomNomHeaderConfig.user);
    }
})();
