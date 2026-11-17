let ALL_RECIPES_POOL = [];

/**
 * 1. Nạp Footer; Header được header.js dùng chung tự tải
 */
async function loadThinhFooter() {
    try {
        const footerRes = await fetch("../../Thinh/footer/index.html");
        const parser = new DOMParser();

        if (footerRes.ok) {
            let footerHTML = await footerRes.text();
            footerHTML = footerHTML.replace(/(\.\.\/assets\/)/g, "../../Thinh/assets/");

            const footerDoc = parser.parseFromString(footerHTML, "text/html");
            const siteFooter = footerDoc.querySelector("footer.site-footer, footer");
            const footerPlaceholder = document.getElementById("footer-placeholder");

            if (siteFooter && footerPlaceholder) {
                footerPlaceholder.replaceWith(siteFooter);
            }
        }
    } catch (error) {
        console.error("Không thể tải Footer từ folder Thinh:", error);
    }
}

/**
 * Nhãn trạng thái nguyên liệu trên thẻ món (theo Figma).
 * Dữ liệu có thể ghi enoughIngredients: false để hiện "Thiếu nguyên liệu"; mặc định là đủ.
 */
function buildStatusTag(item) {
    const enough = item.enoughIngredients !== false;
    return enough
        ? `<span class="recipe-status">Đủ nguyên liệu</span>`
        : `<span class="recipe-status is-missing">Thiếu nguyên liệu</span>`;
}

/**
 * 2. Tạo HTML cho thẻ món ăn
 */
function buildRecipeCard(item) {
    return `
        <a href="${item.link || '#'}" class="similar-card">
            <img src="${item.image}" alt="${item.name}" class="similar-image" loading="lazy">
            <span class="recipe-name">${item.name}</span>
            <span class="recipe-price">${item.price}</span>
            ${buildStatusTag(item)}
            <span class="recipe-time">${item.time}</span>
        </a>
    `;
}

/**
 * 3. Gộp toàn bộ món ăn từ recipes.json
 */
function buildAllRecipesPool(data) {
    const rawList = [
        ...(data.featuredTall ? [data.featuredTall] : []),
        ...(data.favoriteRecipes || []),
        ...(data.beefRecipes || []),
        ...(data.chickenRecipes || []),
        ...(data.lightRecipes || []),
        ...(data.allRecipes || data.searchResults || [])
    ];

    const seenIds = new Set();
    const uniqueList = [];

    rawList.forEach((item) => {
        const key = item.id || item.name;
        if (!seenIds.has(key)) {
            seenIds.add(key);
            const tags = Array.isArray(item.tags) ? [...item.tags] : [];

            if (item.name.includes("Bơ") && !tags.includes("Trái cây nhiệt đới")) {
                tags.push("Trái cây nhiệt đới");
            }
            if ((item.name.includes("Súp") || item.name.includes("Đậu Hũ")) && !tags.includes("Tráng miệng")) {
                tags.push("Tráng miệng");
            }
            if (item.name.includes("Lúc Lắc") && !tags.includes("Trên 100k")) {
                tags.push("Trên 100k");
            }

            uniqueList.push({ ...item, tags });
        }
    });

    return uniqueList;
}

/**
 * 4. Đọc dữ liệu từ ../recipes.json và hiển thị lên Trang 2
 */
async function initPage2Grids() {
    try {
        const res = await fetch("../recipes.json");
        if (!res.ok) throw new Error("Không tìm thấy ../recipes.json");
        const data = await res.json();

        ALL_RECIPES_POOL = buildAllRecipesPool(data);

        const chickenRecipesGrid = document.getElementById("chickenRecipesGrid") || document.getElementById("chickenGrid");
        if (chickenRecipesGrid && Array.isArray(data.chickenRecipes)) {
            chickenRecipesGrid.innerHTML = data.chickenRecipes.map(buildRecipeCard).join("");
        }

        const lightRecipesGrid = document.getElementById("lightRecipesGrid") || document.getElementById("lightDishGrid");
        if (lightRecipesGrid && Array.isArray(data.lightRecipes)) {
            lightRecipesGrid.innerHTML = data.lightRecipes.map(buildRecipeCard).join("");
        }
    } catch (error) {
        console.error("Lỗi khi đọc recipes.json:", error);
    }
}

/**
 * 5. Đóng/mở danh sách checkbox của Bộ lọc & lắng nghe sự kiện tích chọn
 */
function initFilterAccordions() {
    const accordions = document.querySelectorAll(".filter-accordion, .filter-item");

    accordions.forEach((acc) => {
        if (acc.dataset.filterBound === "true") return;
        acc.dataset.filterBound = "true";

        const trigger = acc.querySelector(".filter-trigger-btn, .filter-btn");
        const panel = acc.querySelector(".filter-panel, .filter-dropdown");
        if (!trigger) return;

        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            const isOpening = !acc.classList.contains("is-open") && !acc.classList.contains("open");
            acc.classList.toggle("is-open", isOpening);
            acc.classList.toggle("open", isOpening);

            if (panel) {
                panel.style.display = isOpening ? "flex" : "none";
                panel.style.flexDirection = "column";
            }
        });
    });

    const checkboxes = document.querySelectorAll(".filter-sidebar input[type='checkbox'], .sidebar input[type='checkbox']");
    checkboxes.forEach((cb) => {
        cb.addEventListener("change", applySidebarFilters);
    });
}

/**
 * 6. Hàm lọc món ăn theo các checkbox đang được tích chọn
 */
function applySidebarFilters() {
    const contentArea = document.querySelector(".category-content, .content-area");
    if (!contentArea) return;

    const accordions = document.querySelectorAll(".filter-accordion, .filter-item");
    const activeGroups = [];
    const selectedLabels = [];

    accordions.forEach((acc) => {
        const checkedBoxes = Array.from(acc.querySelectorAll("input[type='checkbox']:checked"));
        if (checkedBoxes.length > 0) {
            const values = checkedBoxes.map((cb) => cb.value.trim());
            activeGroups.push(values);
            selectedLabels.push(...values);
        }
    });

    const defaultSections = contentArea.querySelectorAll(":scope > section:not(#filteredResultsSection)");
    const paginationNav = contentArea.querySelector(".pagination-nav, .pagination");
    let filterSection = document.getElementById("filteredResultsSection");

    if (activeGroups.length === 0) {
        defaultSections.forEach((sec) => (sec.style.display = ""));
        if (paginationNav) paginationNav.style.display = "";
        if (filterSection) filterSection.style.display = "none";
        return;
    }

    defaultSections.forEach((sec) => (sec.style.display = "none"));
    if (paginationNav) paginationNav.style.display = "none";

    const matchedRecipes = ALL_RECIPES_POOL.filter((recipe) => {
        const recipeTags = Array.isArray(recipe.tags) ? recipe.tags : [];
        return activeGroups.every((groupValues) =>
            groupValues.some((val) => recipeTags.includes(val))
        );
    });

    if (!filterSection) {
        filterSection = document.createElement("section");
        filterSection.id = "filteredResultsSection";
        contentArea.prepend(filterSection);
    }

    filterSection.style.display = "block";
    filterSection.innerHTML = `
        <div class="title">
            <h2>KẾT QUẢ LỌC (${matchedRecipes.length} MÓN)</h2>
            <span class="line"></span>
        </div>

        <div class="active-filter-bar" style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 24px;">
            <span style="font-weight: 700; font-size: 0.9rem;">Đang lọc:</span>
            ${selectedLabels.map((lbl) => `
                <span style="background: #FBC41B; border: 1.5px solid #1a1a1a; padding: 4px 10px; font-size: 0.85rem; font-weight: 700;">
                    ${lbl}
                </span>
            `).join("")}
            <button type="button" id="clearAllFiltersBtn" class="view-more-button" style="margin-top: 0; margin-left: auto; padding: 0.4em 1em; font-size: 0.8rem;">
                XÓA BỘ LỌC ✕
            </button>
        </div>

        ${matchedRecipes.length > 0
            ? `<div class="recipes-grid-3">${matchedRecipes.map(buildRecipeCard).join("")}</div>`
            : `<p style="padding: 32px; border: 2px dashed #292929; text-align: center; font-weight: 700;">
                   Không tìm thấy món ăn nào khớp với tất cả bộ lọc bạn chọn. Hãy thử bỏ bớt 1 tiêu chí nhé!
               </p>`
        }
    `;

    const clearBtn = document.getElementById("clearAllFiltersBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            document.querySelectorAll(".filter-sidebar input[type='checkbox']:checked, .sidebar input[type='checkbox']:checked")
                .forEach((cb) => (cb.checked = false));
            applySidebarFilters();
        });
    }
}

/**
 * 7. Xử lý ô tìm kiếm ở Sidebar bên trái
 */
function initSearchRedirect() {
    const searchForm = document.getElementById("sidebarSearchForm") || document.getElementById("searchForm");
    const searchInput = document.getElementById("sidebarSearchInput") || document.getElementById("searchInput");

    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const keyword = searchInput.value.trim();
            window.location.href = keyword
                ? `../search-results/index.html?q=${encodeURIComponent(keyword)}`
                : "../search-results/index.html";
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadThinhFooter();
    initPage2Grids();
    initFilterAccordions();
    initSearchRedirect();
});