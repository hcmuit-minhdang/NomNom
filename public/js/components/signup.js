/* Form Signup: kiểm tra phía client rồi gọi POST /api/auth/register. */
(function () {
    "use strict";
    const form = document.querySelector(".site-signup_form");
    if (!form || !window.NomNomAuth || form.dataset.initialized) return;
    form.dataset.initialized = "true";
    const A = window.NomNomAuth;
    const password = form.elements.password;
    const confirmation = form.elements.confirmPassword;
    const username = form.elements.username;
    const submit = form.querySelector(".site-auth_submit");

    function checkConfirmation() {
        const mismatch = confirmation.value && confirmation.value !== password.value;
        confirmation.setCustomValidity(mismatch ? "Mật khẩu xác nhận chưa trùng khớp." : "");
        // Khi sửa mật khẩu gốc, lỗi xác nhận đang hiện cũng được kiểm tra lại.
        if (confirmation.hasAttribute("aria-invalid")) {
            confirmation.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }
    function checkRules() {
        const u = username.value.trim().toLowerCase();
        username.setCustomValidity(u && !/^[a-z0-9_.]{3,24}$/.test(u)
            ? "Tên tài khoản gồm 3–24 ký tự: chữ thường không dấu, số, dấu _ hoặc ." : "");
        password.setCustomValidity(password.value && password.value.length < 6
            ? "Mật khẩu cần ít nhất 6 ký tự." : "");
    }
    username.addEventListener("input", () => username.setCustomValidity(""));
    password.addEventListener("input", () => password.setCustomValidity(""));
    password.addEventListener("input", checkConfirmation);
    confirmation.addEventListener("input", checkConfirmation);

    form.addEventListener("submit", event => {
        event.preventDefault();
        if (submit.disabled) return;
        checkRules();
        checkConfirmation(); // Kiểm tra lại cả trường hợp trình duyệt tự điền.
        if (!A.validateForm(form)) return;
        const label0 = submit.textContent;
        submit.disabled = true;
        submit.textContent = "Đang đăng ký...";
        A.http("POST", "/auth/register", {
            username: username.value.trim().toLowerCase(),
            email: form.elements.email.value.trim(),
            password: password.value
        }).then(data => {
            A.submitted(data.user);
        }).catch(err => {
            const input = err.field && form.elements[err.field];
            if (input && input.matches && input.matches("input")) {
                A.setFieldError(input, err.message);
                input.focus();
            } else {
                A.showMessage(form, err.message);
            }
        }).then(() => {
            submit.disabled = false;
            submit.textContent = label0;
        });
    });
})();
