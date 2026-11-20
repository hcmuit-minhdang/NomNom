/* Form Login: kiểm tra phía client rồi đăng nhập qua NomNom.data (email hoặc tên đăng nhập). */
(function () {
    "use strict";
    const form = document.querySelector(".site-login__form");
    if (!form || !window.NomNomAuth || form.dataset.initialized) return;
    form.dataset.initialized = "true";
    const auth = window.NomNomAuth;
    const idInput = form.elements.email;
    const submit = form.querySelector(".site-auth__submit");

    // Ô định danh nhận cả email lẫn tên đăng nhập.
    idInput.type = "text";
    idInput.setAttribute("autocomplete", "username");
    idInput.dataset.requiredMessage = "Bạn hãy nhập email hoặc tên đăng nhập.";
    const label = form.querySelector('label[for="' + idInput.id + '"]');
    if (label) label.textContent = "Email hoặc tên đăng nhập";

    form.addEventListener("submit", event => {
        event.preventDefault(); // Không gửi mật khẩu lên URL hoặc tải lại trang.
        if (submit.disabled || !auth.validateForm(form)) return;
        const label0 = submit.textContent;
        submit.disabled = true;
        submit.textContent = "Đang đăng nhập...";
        auth.http("POST", "/auth/login", { identifier: idInput.value.trim(), password: form.elements.password.value })
            .then(data => {
                auth.submitted(data.user);
            })
            .catch(err => {
                const name = err.field === "identifier" ? "email" : err.field;
                const input = name && form.elements[name];
                if (input && input.matches && input.matches("input")) {
                    auth.setFieldError(input, err.message);
                    input.focus();
                } else {
                    auth.showMessage(form, err.message);
                }
            })
            .then(() => {
                submit.disabled = false;
                submit.textContent = label0;
            });
    });
})();
