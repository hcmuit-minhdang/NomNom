/* Điều phối popup + xác thực (đăng ký, đăng nhập, phiên) qua NomNom.data. Xuất window.NomNomAuth. */
(function () {
    "use strict";
    if (window.NomNomAuth) return;

    const dialogs = {
        login: document.querySelector("[data-nomnom-login]"),
        signup: document.querySelector("[data-nomnom-signup]")
    };
    const availableDialogs = Object.values(dialogs).filter(Boolean);

    let activeDialog = null;
    let returnFocus = null;
    let savedBodyStyle = null;

    function lockBackground() {
        const body = document.body;
        savedBodyStyle = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
            body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbarWidth}px`;
        }
        body.style.overflow = "hidden";
    }

    function unlockBackground() {
        if (!savedBodyStyle) return;
        document.body.style.overflow = savedBodyStyle.overflow;
        document.body.style.paddingRight = savedBodyStyle.paddingRight;
        savedBodyStyle = null;
    }

    function showMessage(form, message) {
        const status = form.querySelector(".site-auth__status");
        status.textContent = message;
        status.hidden = false;
    }

    function setFieldError(input, message) {
        const error = document.getElementById(input.getAttribute("aria-describedby"));
        if (message) input.setAttribute("aria-invalid", "true");
        else input.removeAttribute("aria-invalid");
        if (error) {
            error.textContent = message;
            error.hidden = !message;
        }
    }

    function getFieldError(input) {
        if (input.validity.valueMissing) return input.dataset.requiredMessage;
        if (input.validity.typeMismatch) return "Bạn hãy nhập địa chỉ email hợp lệ.";
        if (input.validity.customError) return input.validationMessage;
        return input.validity.valid ? "" : "Bạn hãy kiểm tra lại thông tin này.";
    }

    function validateForm(form) {
        form.querySelector(".site-auth__status").hidden = true;
        let firstInvalid = null;
        form.querySelectorAll("input[required]").forEach(input => {
            // Tên/email có thể trim; tuyệt đối không thay đổi giá trị mật khẩu.
            if ((input.type === "text" && !input.hasAttribute("data-auth-password")) || input.type === "email") {
                input.value = input.value.trim();
            }
            const message = getFieldError(input);
            setFieldError(input, message);
            if (message && !firstInvalid) firstInvalid = input;
        });
        if (firstInvalid) firstInvalid.focus();
        return !firstInvalid;
    }

    function resetDialog(dialog) {
        dialog.querySelectorAll("input").forEach(input => {
            if (input.hasAttribute("data-auth-password")) {
                input.value = "";
                input.type = "password";
            }
            if (input.type === "checkbox") input.checked = false;
            input.setCustomValidity("");
            setFieldError(input, "");
        });
        dialog.querySelectorAll("[data-auth-password-toggle]").forEach(button => {
            button.setAttribute("aria-pressed", "false");
            button.setAttribute("aria-label", button.dataset.showLabel);
        });
        dialog.querySelector(".site-auth__status").hidden = true;
    }

    function openPopup(action, trigger = document.activeElement) {
        const nextDialog = dialogs[action];
        if (!nextDialog) return false;
        if (activeDialog === nextDialog && nextDialog.open) return true;

        if (activeDialog) {
            const previousDialog = activeDialog;
            previousDialog.close();
            resetDialog(previousDialog);
        } else {
            returnFocus = trigger;
            lockBackground();
        }
        activeDialog = nextDialog;
        nextDialog.showModal();
        nextDialog.scrollTop = 0;
        // Cho trình duyệt cuộn bên trong dialog nếu màn hình/bàn phím làm vùng nhìn thấp.
        nextDialog.querySelector("input").focus();
        return true;
    }

    function closePopup(dialog) {
        if (dialog.open) dialog.close();
    }

    availableDialogs.forEach(dialog => {
        let backdropPressed = false;
        function outsideDialog(event) {
            const rect = dialog.getBoundingClientRect();
            return event.clientX < rect.left || event.clientX > rect.right ||
                event.clientY < rect.top || event.clientY > rect.bottom;
        }
        dialog.addEventListener("pointerdown", event => {
            backdropPressed = event.target === dialog && outsideDialog(event);
        });
        dialog.addEventListener("click", event => {
            if (backdropPressed && event.target === dialog && outsideDialog(event)) closePopup(dialog);
            backdropPressed = false;

            const button = event.target.closest("button");
            if (!button) return;
            if (button.hasAttribute("data-auth-close")) closePopup(dialog);
            if (button.hasAttribute("data-auth-password-toggle")) {
                const input = document.getElementById(button.getAttribute("aria-controls"));
                const visible = input.type === "password";
                input.type = visible ? "text" : "password";
                button.setAttribute("aria-pressed", String(visible));
                button.setAttribute("aria-label", visible ? button.dataset.hideLabel : button.dataset.showLabel);
            }
            if (button.hasAttribute("data-auth-pending")) {
                showMessage(button.closest("form"), button.dataset.authPending);
            }
        });
        dialog.addEventListener("cancel", event => {
            event.preventDefault();
            closePopup(dialog);
        });
        dialog.addEventListener("keydown", event => {
            // Escape thuộc popup đang mở, không chuyển cho menu header phía sau.
            if (event.key === "Escape") {
                event.stopPropagation();
                return;
            }
            if (event.key !== "Tab") return;
            const focusable = [...dialog.querySelectorAll("a[href], button, input, select, textarea, [tabindex]")]
                .filter(element => !element.disabled && element.tabIndex >= 0 &&
                    element.getClientRects().length && getComputedStyle(element).visibility !== "hidden");
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            // Nối cuối về đầu (và ngược lại), tránh Tab đi ra thanh địa chỉ trình duyệt.
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
        dialog.addEventListener("close", () => {
            // Khi chuyển Login → Signup, không trả focus hay mở cuộn nền giữa chừng.
            if (activeDialog !== dialog || dialog.open) return;
            resetDialog(dialog);
            activeDialog = null;
            unlockBackground();
            settlePending();
            const visible = element => element?.isConnected && element.getClientRects().length &&
                !element.closest("[inert]") && getComputedStyle(element).visibility !== "hidden";
            const fallback = [...document.querySelectorAll("[data-header-menu-toggle], [data-auth-action], [data-auth-open]")]
                .find(visible);
            const target = visible(returnFocus) ? returnFocus : fallback;
            target?.focus({ preventScroll: true });
            returnFocus = null;
        });

        const form = dialog.querySelector("form");
        if (!form) return;
        // Dù thiếu file xử lý form riêng khi ghép, không để trình duyệt gửi GET mặc định.
        form.addEventListener("submit", event => event.preventDefault());
        function onEdit(event) {
            form.querySelector(".site-auth__status").hidden = true;
            const input = event.target;
            if (input.matches("input") && input.hasAttribute("aria-invalid")) {
                setFieldError(input, getFieldError(input));
            }
        }
        form.addEventListener("input", onEdit);
        form.addEventListener("change", onEdit);
    });

    document.addEventListener("nomnom:auth-request", event => {
        const action = event.detail?.action;
        if (action === "logout") { event.preventDefault(); confirmLogout(); return; }
        if (!Object.hasOwn(dialogs, action)) return;
        // Nhận sự kiện đồng bộ để header không hiển thị thông báo chờ tích hợp.
        if (openPopup(action)) event.preventDefault();
    });
    document.addEventListener("click", event => {
        const button = event.target.closest("[data-auth-open], [data-auth-switch]");
        if (!button) return;
        openPopup(button.dataset.authOpen || button.dataset.authSwitch, button);
    });

    /* ---------- Trạng thái đăng nhập thật ---------- */
    let currentUser = null;
    const listeners = [];
    let pending = [];

    function http(method, path, body) {
        return window.NomNomStore.run(method, path, body).then(res => {
            const data = res.data;
            if (res.status >= 400) {
                const err = new Error((data && data.error) || "Có lỗi xảy ra (" + res.status + ")");
                err.status = res.status;
                err.field = data && data.field || null;
                throw err;
            }
            return data;
        });
    }

    function settlePending() {
        const list = pending;
        pending = [];
        list.forEach(pendingRequest => (currentUser ? pendingRequest.resolve(currentUser) : pendingRequest.reject(new Error("Đã đóng cửa sổ đăng nhập."))));
    }

    function addUserLine(user) {
        const list = document.querySelector("[data-header-member] ul");
        if (!list) return;
        // Không hiện dòng "Xin chào" nữa: chỉ dọn dòng cũ nếu còn
        const listItem = list.querySelector(".site-header__user");
        if (listItem) listItem.remove();
    }

    function setUser(user) {
        const changed = (currentUser && currentUser.id) !== (user && user.id) ||
            (currentUser && user && (currentUser.username !== user.username || currentUser.email !== user.email));
        currentUser = user || null;
        api.user = currentUser;
        addUserLine(currentUser);
        if (changed || !setUser.once) {
            setUser.once = true;
            document.dispatchEvent(new CustomEvent("nomnom:auth-change", { detail: { user: currentUser } }));
            listeners.slice().forEach(callback => { try { callback(currentUser); } catch (e) { console.error(e); } });
        }
        if (currentUser) settlePending();
    }

    function afterLogin() {
        const dlg = activeDialog;
        if (dlg && dlg.open) closePopup(dlg);
        const next = new URLSearchParams(location.search).get("next");
        if (next) {
            try {
                const nextUrl = new URL(next, location.origin);
                if (nextUrl.origin === location.origin) location.href = nextUrl.pathname + nextUrl.search + nextUrl.hash;
            } catch (e) { /* next không hợp lệ -> bỏ qua */ }
        }
    }

    function open(mode) {
        return openPopup(mode === "signup" ? "signup" : "login");
    }

    function requireLogin() {
        if (currentUser) return Promise.resolve(currentUser);
        return new Promise((resolve, reject) => {
            pending.push({ resolve, reject });
            if (!open("login")) reject(new Error("Không mở được cửa sổ đăng nhập."));
        });
    }

    /* Popup hỏi lại trước khi đăng xuất; tạo khi cần, dùng lại các lần sau. */
    let logoutDialog = null;
    function confirmLogout() {
        if (!currentUser) return;
        const trigger = document.activeElement;
        if (!logoutDialog) {
            logoutDialog = document.createElement("dialog");
            logoutDialog.className = "site-auth site-auth--confirm";
            logoutDialog.setAttribute("aria-labelledby", "logoutConfirmTitle");
            logoutDialog.innerHTML =
                '<div class="site-auth__content">' +
                '<h2 class="site-auth__title" id="logoutConfirmTitle">Đăng xuất?</h2>' +
                '<p class="site-auth__confirm-text">Bạn có chắc muốn đăng xuất khỏi NomNom không?</p>' +
                '<div class="site-auth__confirm-actions">' +
                '<button type="button" class="site-auth__cancel" data-logout-cancel>Ở lại</button>' +
                '<button type="button" class="site-auth__submit" data-logout-confirm>Đăng xuất</button>' +
                '</div></div>';
            document.body.appendChild(logoutDialog);
            logoutDialog.addEventListener("click", event => {
                const button = event.target.closest("button");
                if (event.target === logoutDialog || (button && button.hasAttribute("data-logout-cancel"))) {
                    logoutDialog.close();
                } else if (button && button.hasAttribute("data-logout-confirm")) {
                    logoutDialog.close();
                    logout();
                }
            });
            logoutDialog.addEventListener("close", () => {
                unlockBackground();
                const target = trigger && trigger.isConnected ? trigger : null;
                if (target) target.focus({ preventScroll: true });
            });
        }
        lockBackground();
        logoutDialog.showModal();
        logoutDialog.querySelector("[data-logout-cancel]").focus();
    }

    function logout() {
        return http("POST", "/auth/logout", {}).catch(() => null).then(() => {
            setUser(null);
            if (/^\/pages\/account\//.test(location.pathname)) location.href = "/";
        });
    }

    function onChange(callback) {
        if (typeof callback === "function") listeners.push(callback);
        return () => { const i = listeners.indexOf(callback); if (i >= 0) listeners.splice(i, 1); };
    }

    const ready = http("GET", "/me").then(data => data && data.user || null, () => null).then(user => {
        setUser(user);
        const queryParams = new URLSearchParams(location.search);
        if (!user && (queryParams.get("login") === "1" || queryParams.get("signup") === "1")) {
            open(queryParams.get("signup") === "1" ? "signup" : "login");
        }
        return user;
    });

    const api = {
        ready, user: null, refresh(updatedUser) { setUser(updatedUser); }, open, requireLogin, logout, onChange,
        // dùng nội bộ bởi login.js / signup.js
        validateForm, showMessage, setFieldError, http,
        submitted(user) { setUser(user); afterLogin(); }
    };
    window.NomNomAuth = api;
})();
