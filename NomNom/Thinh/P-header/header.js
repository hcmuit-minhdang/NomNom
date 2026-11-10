/* Menu mobile và dropdown của Header. */
document.documentElement.classList.add("js-ready");

const menuButton = document.querySelector(".site-menu-toggle");
const navigation = document.querySelector(".site-nav");
const dropdowns = document.querySelectorAll(".site-dropdown");

function closeDropdowns() {
    dropdowns.forEach(function (dropdown) {
        dropdown.open = false;
    });
}

if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
        const isOpen = navigation.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.textContent = isOpen ? "Đóng menu" : "Menu";
        if (!isOpen) closeDropdowns();
    });
}

/* details/summary có hành vi mở bằng chuột và bàn phím sẵn trong HTML. */
dropdowns.forEach(function (dropdown) {
    dropdown.addEventListener("toggle", function () {
        if (!dropdown.open) return;
        dropdowns.forEach(function (other) {
            if (other !== dropdown) other.open = false;
        });
    });
});

document.addEventListener("click", function (event) {
    if (!event.target.closest(".site-dropdown")) closeDropdowns();
});

document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    const openDropdown = document.querySelector(".site-dropdown[open]");
    if (openDropdown) {
        openDropdown.querySelector("summary").focus();
        closeDropdowns();
    } else if (navigation && navigation.classList.contains("is-open")) {
        navigation.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "Menu";
        menuButton.focus();
    }
});
