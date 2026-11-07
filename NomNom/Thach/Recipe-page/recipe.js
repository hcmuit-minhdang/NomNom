const DEFAULT_RECIPE_ID = "com-tam-long-xuyen";
const DATA_PATH = "../data/";
const RECIPE_BASE = `${DATA_PATH}recipes/`;

// Mục lục sẽ coi một section là "đang xem" khi đỉnh của nó đã chạm tới vạch này (px tính từ đỉnh màn hình)
const SCROLLSPY_OFFSET = 140;

const NUTRITION_LABELS = {
    servings: "Khẩu phần",
    calories: "Calories",
    carbs: "Carbohydrates",
    protein: "Protein",
    fat: "Fat",
    sodium: "Sodium",
    fiber: "Fiber"
};

/* ------------------------------------------------------------------ */
/* Tiện ích                                                            */
/* ------------------------------------------------------------------ */

// Nội dung công thức sau này do người dùng nhập, nên mọi chuỗi phải escape
// trước khi ghép vào innerHTML. Đây là hàng rào chống XSS (stored XSS).
function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

function getValue(obj, path) {
    let current = obj;
    const keys = path.split(".");
    for (let i = 0; i < keys.length; i++) {
        if (current == null) return undefined;
        current = current[keys[i]];
    }
    return current;
}

// Tên trong catalog viết hoa để dễ tra cứu; trong câu nguyên liệu giữ chữ thường.
function lowercaseFirst(text) {
    return text.charAt(0).toLowerCase() + text.slice(1);
}

function imageUrl(recipeId, path) {
    return `${RECIPE_BASE}${recipeId}/${path}`;
}

async function loadJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
    return response.json();
}

/* ------------------------------------------------------------------ */
/* Số lượng + đơn vị                                                   */
/*   Đơn vị lấy từ data/units.json: dimension quyết định cách quy đổi,  */
/*   compact quyết định có dấu cách giữa số và đơn vị (500g vs 5 quả).  */
/* ------------------------------------------------------------------ */

function roundQty(qty, unit, units) {
    if (units[unit]?.dimension === "count") return Math.max(1, Math.round(qty));
    if (qty >= 10) return Math.round(qty);
    return Math.round(qty * 10) / 10;
}

function formatAmount(qty, unit, units) {
    const value = roundQty(qty, unit, units);
    return units[unit]?.compact ? `${value}${unit}` : `${value} ${unit}`;
}

/* ------------------------------------------------------------------ */
/* Trạng thái lỗi                                                      */
/* ------------------------------------------------------------------ */

function showRecipeError(title, message) {
    document.querySelector(".recipe-layout").innerHTML = `
        <article class="recipe-article">
            <h1 id="recipe-title">${title}</h1>
            <p class="recipe-description">${message}</p>
            <a href="../Home-page/index.html" class="view-more-button">VỀ TRANG CHỦ</a>
        </article>`;
}

/* ------------------------------------------------------------------ */
/* data-bind                                                           */
/*   data-bind="title"              -> textContent                     */
/*   data-bind="nutrition.calories" -> hỗ trợ key lồng nhau            */
/*   data-bind-src="mainImage"      -> src, đường dẫn tính từ thư mục  */
/*                                     của công thức                    */
/*   data-bind-value="baseServings" -> value (cho <input>)             */
/*   data-stars="ratingScore"       -> chuỗi sao ★ theo điểm           */
/* ------------------------------------------------------------------ */

function starsHtml(score) {
    const filled = Math.max(0, Math.min(5, Math.round(score)));
    return `<span class="star-on">${"★".repeat(filled)}</span><span class="star-off">${"★".repeat(5 - filled)}</span>`;
}

function renderBindings(recipe, recipeId) {
    document.querySelectorAll("[data-bind]").forEach(el => {
        const value = getValue(recipe, el.dataset.bind);
        if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll("[data-bind-src]").forEach(el => {
        const value = getValue(recipe, el.dataset.bindSrc);
        if (value !== undefined) el.src = imageUrl(recipeId, value);
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

function renderGallery(recipe, recipeId) {
    const container = document.getElementById("gallery-thumbs");
    if (!container) return;

    container.innerHTML = recipe.gallery
        .map((image, i) => `<img src="${imageUrl(recipeId, image)}" alt="Ảnh ${i + 1}" class="gallery-thumb" />`)
        .join("");
}

// Một dòng nguyên liệu có thể có: số lượng (qty), khoảng (qtyMax),
// ghi chú (note), hoặc không có số lượng (qty: null).
function ingredientSpan(item, name, units) {
    const displayName = item.note ? `${name} (${item.note})` : name;
    const ingredientAttr = ` data-ingredient-id="${escapeHtml(item.ingredientId)}"`;

    if (item.qty == null) {
        return `<span${ingredientAttr}>${escapeHtml(displayName)}</span>`;
    }

    const unit = item.unit;
    if (item.qtyMax != null) {
        return `<span${ingredientAttr} data-min="${item.qty}" data-max="${item.qtyMax}" data-unit="${escapeHtml(unit)}" data-name="${escapeHtml(displayName)}">${escapeHtml(`${item.qty} - ${item.qtyMax} ${unit} ${displayName}`)}</span>`;
    }

    return `<span${ingredientAttr} data-qty="${item.qty}" data-unit="${escapeHtml(unit)}" data-name="${escapeHtml(displayName)}">${escapeHtml(`${formatAmount(item.qty, unit, units)} ${displayName}`)}</span>`;
}

function renderIngredients(recipe, catalog, units) {
    const list = document.getElementById("ingredient-list");
    if (!list) return;

    const byId = new Map(catalog.map(ingredient => [ingredient.id, ingredient]));
    const rows = [];
    let group = null;

    recipe.ingredients.forEach(item => {
        const ingredient = byId.get(item.ingredientId);

        const name = lowercaseFirst(ingredient ? ingredient.name : item.ingredientId);

        if (item.group) {
            if (!group) {
                group = { label: item.group, names: [] };
                rows.push(group);
            }
            group.names.push(name);
            return;
        }

        group = null;
        rows.push({ item, name });
    });

    list.innerHTML = rows.map(row => {
        if (row.label) {
            return `<li><label><input type="checkbox" /><span>${escapeHtml(row.label)}: ${escapeHtml(row.names.join(", "))}</span></label></li>`;
        }
        return `<li><label><input type="checkbox" />${ingredientSpan(row.item, row.name, units)}</label></li>`;
    }).join("");
}

function renderQuickSteps(recipe) {
    const container = document.getElementById("quick-step-list");
    if (!container) return;

    container.innerHTML = recipe.quickSteps
        .map((text, i) => `
            <li>
                <span class="quick-step-number">${i + 1}</span>
                <p>${escapeHtml(text)}</p>
            </li>`)
        .join("");
}

function stepImageHtml(image, index, recipeId) {
    const src = typeof image === "string" ? image : image.src;
    const tall = typeof image === "object" && image.tall ? ' class="tall"' : "";
    return `<img src="${imageUrl(recipeId, src)}" alt="Bước ${index + 1}"${tall} />`;
}

function renderDetailedSteps(recipe, recipeId) {
    const container = document.getElementById("steps-container");
    if (!container) return;

    container.innerHTML = recipe.steps
        .map((step, i) => `
            <div class="step" id="buoc-${i + 1}">
                <span class="step-label">BƯỚC ${i + 1}</span>
                ${step.text.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}
                <div class="step-images">
                    ${step.images.map(image => stepImageHtml(image, i, recipeId)).join("")}
                </div>
            </div>`)
        .join("");
}

function renderTocSteps(recipe) {
    const container = document.getElementById("toc-steps");
    if (!container) return;

    container.innerHTML = recipe.steps
        .map((_, i) => `<li><a href="#buoc-${i + 1}">Bước ${i + 1}</a></li>`)
        .join("");
}

function renderSimilar(recipe, recipeId) {
    const container = document.getElementById("similar-recipes-container");
    if (!container) return;

    container.innerHTML = recipe.similar
        .map(item => {
            const href = item.id ? `recipe.html?id=${encodeURIComponent(item.id)}` : "";
            const src = item.id ? imageUrl(item.id, item.image) : imageUrl(recipeId, item.image);
            return `
            <a href="${href}" class="similar-card">
                <img src="${src}" alt="${escapeHtml(item.name)}" class="similar-image" />
                <span class="recipe-name">${escapeHtml(item.name)}</span>
                <span class="recipe-price">${escapeHtml(item.price)}</span>
                <span class="recipe-time">Cook Time: ${escapeHtml(item.time)}</span>
            </a>`;
        })
        .join("");
}

function renderNutrition(recipe) {
    const container = document.getElementById("nutrition-container");
    if (!container) return;

    const entries = Object.entries(recipe.nutrition)
        .map(([key, value]) => [NUTRITION_LABELS[key] || key, value]);
    const half = Math.ceil(entries.length / 2);

    container.innerHTML = [entries.slice(0, half), entries.slice(half)]
        .map(column => `
            <ul class="nutrition-column">
                ${column.map(([label, value]) => `<li><strong>${escapeHtml(label)}</strong>: ${escapeHtml(value)}</li>`).join("")}
            </ul>`)
        .join("");
}

/* ------------------------------------------------------------------ */
/* Khẩu phần                                                           */
/*   Công thức gốc ứng với recipe.baseServings. Số hiển thị luôn được  */
/*   tính lại từ data-qty/data-min (không parse chữ "500g gạo tấm").    */
/* ------------------------------------------------------------------ */

function initServingsScaler(recipe, units) {
    const servingsInput = document.getElementById("servings-input");
    const metaServings = document.getElementById("meta-servings");
    const upButton = document.querySelector(".servings-up");
    const downButton = document.querySelector(".servings-down");
    if (!servingsInput) return;

    const defaultServings = recipe.baseServings;
    const scalableItems = document.querySelectorAll("#ingredient-list span[data-qty], #ingredient-list span[data-min]");

    function update() {
        const servings = Math.max(1, parseInt(servingsInput.value, 10) || defaultServings);
        const factor = servings / defaultServings;

        servingsInput.value = servings;
        if (metaServings) metaServings.textContent = servings;

        scalableItems.forEach(span => {
            const unit = span.dataset.unit;
            const name = span.dataset.name;
            if (span.dataset.min) {
                const min = roundQty(parseFloat(span.dataset.min) * factor, unit, units);
                const max = roundQty(parseFloat(span.dataset.max) * factor, unit, units);
                span.textContent = `${min} - ${max} ${unit} ${name}`;
            } else {
                span.textContent = `${formatAmount(parseFloat(span.dataset.qty) * factor, unit, units)} ${name}`;
            }
        });
    }

    servingsInput.value = defaultServings;

    upButton?.addEventListener("click", () => {
        servingsInput.value = (parseInt(servingsInput.value, 10) || defaultServings) + 1;
        update();
    });

    downButton?.addEventListener("click", () => {
        servingsInput.value = Math.max(1, (parseInt(servingsInput.value, 10) || defaultServings) - 1);
        update();
    });

    servingsInput.addEventListener("input", update);
    update();
}

/* ------------------------------------------------------------------ */
/* Scrollspy cho mục lục                                               */
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

/* ------------------------------------------------------------------ */
/* Khởi động                                                           */
/* ------------------------------------------------------------------ */

async function init() {
    const recipeId = new URLSearchParams(window.location.search).get("id") || DEFAULT_RECIPE_ID;

    // id được dùng làm một phần đường dẫn file, nên chỉ chấp nhận slug an toàn.
    if (!/^[a-z0-9-]+$/i.test(recipeId)) {
        showRecipeError("KHÔNG TÌM THẤY CÔNG THỨC", "Công thức bạn tìm không tồn tại hoặc đã bị xóa.");
        return;
    }

    let rawRecipe;
    let catalog;
    let units;

    try {
        [rawRecipe, catalog, units] = await Promise.all([
            loadJson(`${RECIPE_BASE}${recipeId}/recipe.json`),
            loadJson(`${DATA_PATH}ingredients.json`),
            loadJson(`${DATA_PATH}units.json`)
        ]);
    } catch (error) {
        console.error(error);
        showRecipeError(
            "KHÔNG TẢI ĐƯỢC CÔNG THỨC",
            "Dữ liệu công thức chưa tải được. Nếu bạn mở file trực tiếp bằng file://, hãy chạy local server (ví dụ: npx serve .)."
        );
        return;
    }

    // Giá trị hiển thị được tính từ dữ liệu gốc, không lưu tay trong JSON.
    const recipe = {
        ...rawRecipe,
        baseServings: rawRecipe.baseServings || 1,
        totalTime: rawRecipe.prepTime + rawRecipe.cookTime,
        ratingText: `${rawRecipe.ratingScore} | ${rawRecipe.reviewCount} Reviews`,
        costText: [rawRecipe.costTotal, rawRecipe.costPerServing && `${rawRecipe.costPerServing} / phần`]
            .filter(Boolean)
            .join(" | ")
    };

    document.title = `${recipe.title} | NomNom`;
    renderBindings(recipe, recipeId);
    renderGallery(recipe, recipeId);
    renderIngredients(recipe, catalog, units);
    renderQuickSteps(recipe);
    renderDetailedSteps(recipe, recipeId);
    renderTocSteps(recipe);
    renderNutrition(recipe);
    renderSimilar(recipe, recipeId);
    initServingsScaler(recipe, units);
    initScrollSpy();
}

init();
