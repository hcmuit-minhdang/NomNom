const DEFAULT_RECIPE_ID = "com-tam-long-xuyen";
const ASSET_PATH = "./assets/";

// Mục lục sẽ coi một section là "đang xem" khi đỉnh của nó đã chạm tới vạch này (px tính từ đỉnh màn hình)
const SCROLLSPY_OFFSET = 140;

/* ------------------------------------------------------------------ */
/* Lấy dữ liệu theo ?id=...                                            */
/* ------------------------------------------------------------------ */

const recipeId = new URLSearchParams(window.location.search).get("id") || DEFAULT_RECIPE_ID;
const rawRecipe = recipes[recipeId];

if (!rawRecipe) {
    document.querySelector(".recipe-layout").innerHTML = `
        <article class="recipe-article">
            <h1 id="recipe-title">KHÔNG TÌM THẤY CÔNG THỨC</h1>
            <p class="recipe-description">Công thức bạn tìm không tồn tại hoặc đã bị xóa.</p>
            <a href="./index.html" class="view-more-button">VỀ TRANG CHỦ</a>
        </article>`;
} else {
    // Giá trị tính ra từ dữ liệu gốc, không lưu tay trong recipes.js
    const recipe = { ...rawRecipe, totalTime: rawRecipe.prepTime + rawRecipe.cookTime };

    document.title = `${recipe.title} | freeCodeCamp`;
    renderBindings(recipe);
    renderGallery(recipe);
    renderIngredients(recipe);
    renderQuickSteps(recipe);
    renderDetailedSteps(recipe);
    renderTocSteps(recipe);
    renderSimilar(recipe);
    initScrollSpy();
}

/* ------------------------------------------------------------------ */
/* data-bind                                                           */
/*   data-bind="title"              -> textContent                     */
/*   data-bind="nutrition.calories" -> hỗ trợ key lồng nhau            */
/*   data-bind-src="mainImage"      -> src (tự thêm ./assets/)         */
/*   data-bind-value="servings"     -> value (cho <input>)             */
/*   data-stars="ratingScore"       -> chuỗi sao ★ theo điểm           */
/* ------------------------------------------------------------------ */

function getValue(obj, path) {
    return path.split(".").reduce((o, key) => (o == null ? o : o[key]), obj);
}

function starsHtml(score) {
    const filled = Math.max(0, Math.min(5, Math.round(score)));
    return `<span class="star-on">${"★".repeat(filled)}</span><span class="star-off">${"★".repeat(5 - filled)}</span>`;
}

function renderBindings(recipe) {
    document.querySelectorAll("[data-bind]").forEach(el => {
        const value = getValue(recipe, el.dataset.bind);
        if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll("[data-bind-src]").forEach(el => {
        const value = getValue(recipe, el.dataset.bindSrc);
        if (value !== undefined) el.src = ASSET_PATH + value;
        if (!el.alt) el.alt = recipe.title;
    });

    document.querySelectorAll("[data-bind-value]").forEach(el => {
        const value = getValue(recipe, el.dataset.bindValue);
        if (value !== undefined) el.value = value;
    });

    document.querySelectorAll("[data-stars]").forEach(el => {
        const value = getValue(recipe, el.dataset.stars);
        if (value !== undefined) el.innerHTML = starsHtml(value);
    });
}

/* ------------------------------------------------------------------ */
/* Các danh sách                                                       */
/* ------------------------------------------------------------------ */

function renderGallery(recipe) {
    document.getElementById("gallery-thumbs").innerHTML = recipe.gallery
        .map((img, i) => `<img src="${ASSET_PATH}${img}" alt="Ảnh ${i + 1}" class="gallery-thumb" />`)
        .join("");
}

function renderIngredients(recipe) {
    document.getElementById("ingredient-list").innerHTML = recipe.ingredients
        .map(item => `<li><label><input type="checkbox" /><span>${item}</span></label></li>`)
        .join("");
}

function renderQuickSteps(recipe) {
    document.getElementById("quick-step-list").innerHTML = recipe.quickSteps
        .map((text, i) => `
            <li>
                <span class="quick-step-number">${i + 1}</span>
                <p>${text}</p>
            </li>`)
        .join("");
}

function renderDetailedSteps(recipe) {
    document.getElementById("steps-container").innerHTML = recipe.steps
        .map((step, i) => `
            <div class="step" id="buoc-${i + 1}">
                <span class="step-label">BƯỚC ${i + 1}</span>
                ${step.text.map(paragraph => `<p>${paragraph}</p>`).join("")}
                <div class="step-images">
                    ${step.images.map(img => {
                        const src = typeof img === "string" ? img : img.src;
                        const tall = typeof img === "object" && img.tall ? ' class="tall"' : "";
                        return `<img src="${ASSET_PATH}${src}" alt="Bước ${i + 1}"${tall} />`;
                    }).join("")}
                </div>
            </div>`)
        .join("");
}

function renderTocSteps(recipe) {
    document.getElementById("toc-steps").innerHTML = recipe.steps
        .map((_, i) => `<li><a href="#buoc-${i + 1}">Bước ${i + 1}</a></li>`)
        .join("");
}

function renderSimilar(recipe) {
    document.getElementById("similar-recipes-container").innerHTML = recipe.similar
        .map(item => `
            <a href="${item.id ? `recipe.html?id=${item.id}` : ""}" class="similar-card">
                <img src="${ASSET_PATH}${item.image}" alt="${item.name}" class="similar-image" />
                <span class="recipe-name">${item.name}</span>
                <span class="recipe-price">${item.price}</span>
                <span class="recipe-time">Cook Time: ${item.time}</span>
            </a>`)
        .join("");
}

/* ------------------------------------------------------------------ */
/* Scrollspy cho mục lục                                               */
/*   Mỗi lần cuộn: section nào có đỉnh gần vạch SCROLLSPY_OFFSET nhất  */
/*   (mà đã đi qua vạch) sẽ là section đang xem.                       */
/* ------------------------------------------------------------------ */

function initScrollSpy() {
    const items = [...document.querySelectorAll('.toc a[href^="#"]')]
        .map(link => ({
            link,
            section: document.getElementById(link.getAttribute("href").slice(1))
        }))
        .filter(item => item.section);

    if (items.length === 0) return;

    let activeLink = null;
    let ticking = false;

    function setActive(link) {
        if (link === activeLink) return;
        activeLink = link;

        document.querySelectorAll(".toc .toc-current").forEach(el => el.classList.remove("toc-current"));
        document.querySelectorAll(".toc .toc-active").forEach(el => el.classList.remove("toc-active"));
        document.querySelectorAll(".toc a[aria-current]").forEach(el => el.removeAttribute("aria-current"));

        // Link trong danh sách con -> đánh dấu <li>; link đơn (Bình luận) -> đánh dấu chính nó
        const marker = link.closest("li") || link;
        marker.classList.add("toc-current");
        link.setAttribute("aria-current", "location");

        const group = link.closest(".toc-group");
        if (group) group.classList.add("toc-active");
    }

    function update() {
        ticking = false;

        let current = items[0];
        let bestTop = -Infinity;
        items.forEach(item => {
            const top = item.section.getBoundingClientRect().top;
            if (top <= SCROLLSPY_OFFSET && top > bestTop) {
                bestTop = top;
                current = item;
            }
        });

        // Cuộn tới cuối trang thì section cuối luôn sáng, kể cả khi nó ngắn
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        if (atBottom) current = items[items.length - 1];

        setActive(current.link);
    }

    function requestUpdate() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("load", requestUpdate); // ảnh tải xong làm layout dịch chuyển
    update();
}