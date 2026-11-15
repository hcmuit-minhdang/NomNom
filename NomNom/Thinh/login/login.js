/* Chỉ kiểm tra form Login. Xác thực tài khoản sẽ được bổ sung ở bước sau. */
(function () {
    "use strict";
    const form = document.querySelector(".site-login_form");
    if (!form || !window.NomNomAuth || form.dataset.initialized) return;
    form.dataset.initialized = "true";

    form.addEventListener("submit", event => {
        event.preventDefault(); // Không gửi mật khẩu lên URL hoặc tải lại trang.
        if (!window.NomNomAuth.validateForm(form)) return;
        window.NomNomAuth.showMessage(form,
            "Thông tin hợp lệ; chức năng đăng nhập sẽ được bổ sung ở bước sau.");
    });
})();
