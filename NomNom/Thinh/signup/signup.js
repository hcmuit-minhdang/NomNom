/* Chỉ kiểm tra form Signup. Chưa tạo hoặc lưu tài khoản. */
(function () {
    "use strict";
    const form = document.querySelector(".site-signup_form");
    if (!form || !window.NomNomAuth || form.dataset.initialized) return;
    form.dataset.initialized = "true";
    const password = form.elements.password;
    const confirmation = form.elements.confirmPassword;

    function checkConfirmation() {
        const mismatch = confirmation.value && confirmation.value !== password.value;
        confirmation.setCustomValidity(mismatch ? "Mật khẩu xác nhận chưa trùng khớp." : "");
        // Khi sửa mật khẩu gốc, lỗi xác nhận đang hiện cũng được kiểm tra lại.
        if (confirmation.hasAttribute("aria-invalid")) {
            confirmation.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }
    password.addEventListener("input", checkConfirmation);
    confirmation.addEventListener("input", checkConfirmation);

    form.addEventListener("submit", event => {
        event.preventDefault();
        checkConfirmation(); // Kiểm tra lại cả trường hợp trình duyệt tự điền.
        if (!window.NomNomAuth.validateForm(form)) return;
        window.NomNomAuth.showMessage(form,
            "Thông tin hợp lệ; chức năng đăng ký sẽ được bổ sung ở bước sau.");
    });
})();
