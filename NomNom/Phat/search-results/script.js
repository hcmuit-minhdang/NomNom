function buildRecipeCard(item) {
    return `
        <a href="${item.link || '#'}" class="similar-card">
            <img src="${item.image}" alt="${item.name}" class="similar-image" loading="lazy">
            <span class="recipe-name">${item.name}</span>
            <span class="recipe-price">${item.price}</span>
            <span class="recipe-time">${item.time}</span>
        </a>
    `;
}

/**
 * Đọc danh sách 15 món ăn từ ../recipes.json và hiển thị lên Trang 3
 */
async function initSearchResultsPage() {
    try {
        const res = await fetch("../recipes.json");
        if (!res.ok) throw new Error("Không tải được recipes.json");
        const data = await res.json();

        const searchResultsGrid = document.getElementById("searchResultsGrid");
        const keywordSpan = document.getElementById("search-keyword-text");

        const params = new URLSearchParams(window.location.search);
        const query = params.get("q");

        let displayList = Array.isArray(data.searchResults) ? [...data.searchResults] : [];

        if (query && query.trim() !== "") {
            const cleanQuery = query.trim();
            if (keywordSpan) {
                keywordSpan.textContent = `<${cleanQuery}>`;
            }

            const lowerQ = cleanQuery.toLowerCase();
            displayList.sort((a, b) => {
                const aMatch = a.name.toLowerCase().includes(lowerQ) ? 0 : 1;
                const bMatch = b.name.toLowerCase().includes(lowerQ) ? 0 : 1;
                return aMatch - bMatch;
            });
        }

        if (searchResultsGrid) {
        // Lấy 15 món đầu tiên (3 cột x 5 hàng)
        searchResultsGrid.innerHTML = displayList.slice(0, 15).map(buildRecipeCard).join("");
}
    } catch (error) {
        console.error("Lỗi khi đọc file recipes.json:", error);
    }
}

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

document.addEventListener("DOMContentLoaded", () => {
    loadThinhFooter();
    initSearchResultsPage();
});