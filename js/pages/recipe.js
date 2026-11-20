/* NomNom: trang chi tiết công thức. Dữ liệu từ NomNom.data.get("/recipes/:id") */
const SCROLLSPY_OFFSET = 140;
const FALLBACK_AVATAR = "/images/avatar.jpg";

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

const escapeHtml = value => window.NomNom.esc(value);

function getValue(obj, path) {
    let current = obj;
    const keys = path.split(".");
    for (let i = 0; i < keys.length; i++) {
        if (current == null) return undefined;
        current = current[keys[i]];
    }
    return current;
}

function lowercaseFirst(text) {
    return text.charAt(0).toLowerCase() + text.slice(1);
}

// Ảnh: kho dữ liệu trả đường dẫn tuyệt đối (/images/...), data URL của ảnh tự tải lên, hoặc URL ngoài.
// Đường dẫn tương đối kiểu cũ ("images/x.jpg") được quy về thư mục ảnh của công thức.
function imageUrl(recipeId, path) {
    if (!path) return "";
    path = String(path);
    if (/^(https?:|data:|\/)/i.test(path)) return path;
    return `/images/recipes/${encodeURIComponent(recipeId)}/${path.replace(/^images\//, "")}`;
}

function toast(message) {
    let toastElement = document.getElementById("recipe-toast");
    if (!toastElement) {
        toastElement = document.createElement("div");
        toastElement.id = "recipe-toast";
        toastElement.className = "recipe-toast";
        toastElement.setAttribute("role", "status");
        document.body.appendChild(toastElement);
    }
    toastElement.textContent = message;
    toastElement.classList.add("is-visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => toastElement.classList.remove("is-visible"), 2600);
}

function currentUser() {
    return (window.NomNomAuth && window.NomNomAuth.user) || null;
}

function requireLogin() {
    if (window.NomNomAuth && typeof window.NomNomAuth.requireLogin === "function") {
        return window.NomNomAuth.requireLogin();
    }
    return Promise.reject(new Error("Chức năng đăng nhập chưa sẵn sàng."));
}

/* ------------------------------------------------------------------ */
/* Số lượng + đơn vị                                                   */
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

function formatPrice(value) {
    return `${new Intl.NumberFormat("vi-VN").format(Math.round(value))}đ`;
}

/* ------------------------------------------------------------------ */
/* Trạng thái lỗi                                                      */
/* ------------------------------------------------------------------ */

function showRecipeError(title, message) {
    document.querySelector(".recipe-layout").innerHTML = `
        <article class="recipe-article recipe-state">
            <h1 id="recipe-title">${escapeHtml(title)}</h1>
            <p class="recipe-description">${escapeHtml(message)}</p>
            <p class="recipe-state__links">
                <a href="/pages/category.html" class="view-more-button">XEM DANH MỤC</a>
                <a href="/" class="view-more-button">VỀ TRANG CHỦ</a>
            </p>
        </article>`;
}

/* ------------------------------------------------------------------ */
/* Chuẩn hoá dữ liệu từ kho dữ liệu (hỗ trợ cả dạng recipe.json và dạng upload) */
/* ------------------------------------------------------------------ */

function asArray(value) {
    if (Array.isArray(value)) return value;
    if (value == null || value === "") return [];
    return [value];
}

function formatDate(iso) {
    const date = new Date(iso);
    if (isNaN(date)) return "";
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

function costTextOf(total, perServing) {
    return `${formatPrice(total)} | ${formatPrice(perServing)} / phần`;
}

function normalizeRecipe(raw, recipeId) {
    const num = rawValue => { const parsed = Number(rawValue); return Number.isFinite(parsed) ? parsed : 0; };
    const title = raw.title || raw.name || "Công thức";
    const baseServings = Math.max(1, num(raw.baseServings || raw.servings) || 1);
    const prepTime = num(raw.prepTime);
    let cookTime = num(raw.cookTime);
    if (!prepTime && !cookTime && raw.time) cookTime = num(raw.time);
    // Giá theo phần (price) là số gốc, giống thẻ món; tổng chi phí = price * khẩu phần (chỉ dùng costTotal khi không có price)
    const pricePerServing = num(raw.price) || (num(raw.costTotal) ? num(raw.costTotal) / baseServings : 0);
    const costTotal = pricePerServing * baseServings;

    let gallery = asArray(raw.gallery).filter(Boolean);
    if (!gallery.length) gallery = asArray(raw.image || raw.mainImage).filter(Boolean);
    gallery = gallery.map(img => imageUrl(recipeId, typeof img === "object" ? img.src : img));

    const ingredients = asArray(raw.ingredients).map(item => {
        if (typeof item === "string") return { name: item, qty: null, unit: "" };
        const qtyRaw = item.qty ?? item.quantity;
        const qty = qtyRaw === "" || qtyRaw == null ? null : Number(qtyRaw);
        return { ...item, qty: Number.isFinite(qty) ? qty : null, unit: item.unit || "" };
    });

    const steps = asArray(raw.steps).map(step => {
        if (typeof step === "string") return { text: [step], images: [] };
        const text = asArray(step.text).map(String).filter(line => line.trim());
        const images = asArray(step.images ?? step.image).filter(Boolean);
        return { text, images };
    });

    let quickSteps = asArray(raw.quickSteps).map(String).filter(line => line.trim());
    if (!quickSteps.length) quickSteps = steps.map(step => step.text[0]).filter(Boolean);

    const author = raw.author;
    const authorName = author && typeof author === "object" ? author.username : (author || "");

    const rating = num(raw.rating ?? raw.ratingScore);
    const ratingCount = num(raw.ratingCount ?? raw.reviewCount);

    return {
        ...raw,
        id: raw.id || recipeId,
        title,
        category: raw.category || "",
        subcategory: raw.subcategory || "",
        author: authorName || "NomNom",
        uploaded: raw.createdAt ? formatDate(raw.createdAt) : (raw.uploaded || ""),
        description: raw.description || raw.summary || "",
        prepTime,
        cookTime,
        totalTime: prepTime + cookTime,
        baseServings,
        costTotal,
        pricePerServing,
        costText: costTotal ? costTextOf(costTotal, pricePerServing) : "",
        gallery,
        ingredients,
        steps,
        quickSteps,
        nutrition: raw.nutrition && typeof raw.nutrition === "object" ? raw.nutrition : {},
        ratingScore: rating,
        reviewCount: ratingCount,
        ratingText: `${rating.toFixed(1)} | ${ratingCount} Reviews`,
        featuredReview: raw.featuredReview || { rating: 0, text: "", author: "" },
        saved: !!raw.saved
    };
}

/* ------------------------------------------------------------------ */
/* data-bind                                                           */
/* ------------------------------------------------------------------ */

function starsHtml(score) {
    const filled = Math.max(0, Math.min(5, Math.round(score)));
    return `<span class="star-on">${"★".repeat(filled)}</span><span class="star-off">${"★".repeat(5 - filled)}</span>`;
}

function renderBindings(recipe) {
    document.querySelectorAll("[data-bind]").forEach(element => {
        const value = getValue(recipe, element.dataset.bind);
        if (value !== undefined) element.textContent = value;
    });

    document.querySelectorAll("[data-bind-value]").forEach(element => {
        const value = getValue(recipe, element.dataset.bindValue);
        if (value !== undefined) element.value = value;
    });

    document.querySelectorAll("[data-stars]").forEach(element => {
        const value = getValue(recipe, element.dataset.stars);
        if (value !== undefined) element.innerHTML = starsHtml(value);
    });

    // Ẩn phần trống
    const sub = document.querySelector('.breadcrumb [data-bind="subcategory"]');
    if (sub && !recipe.subcategory) {
        sub.previousElementSibling?.remove();
        sub.remove();
    }
    if (!recipe.costText) document.querySelectorAll(".recipe-meta .meta-line:nth-child(2), .card__cost").forEach(element => { element.hidden = true; });
    if (!recipe.featuredReview.text) document.querySelector(".featured-review")?.setAttribute("hidden", "");
    if (!recipe.uploaded) document.querySelector(".upload-date")?.setAttribute("hidden", "");
}

// Cập nhật điểm trung bình / số đánh giá khi người dùng đăng hoặc xoá đánh giá.
function updateRatingDisplay(recipe, average, count) {
    recipe.ratingScore = average;
    recipe.reviewCount = count;
    recipe.ratingText = `${Number(average).toFixed(1)} | ${count} Reviews`;
    document.querySelectorAll("[data-stars='ratingScore']").forEach(element => { element.innerHTML = starsHtml(average); });
    document.querySelectorAll("[data-bind='ratingText']").forEach(element => { element.textContent = recipe.ratingText; });
    // Số "BÌNH LUẬN" (#review-count) do render() đặt theo số bình luận thật, không phải lượt đánh giá gộp
}

/* ------------------------------------------------------------------ */
/* Các danh sách                                                       */
/* ------------------------------------------------------------------ */

function renderGallery(recipe) {
    const container = document.getElementById("gallery-thumbs");
    const mainImage = document.querySelector(".gallery-main");
    const cardImage = document.querySelector(".card__image");
    if (!container || !mainImage || !cardImage) return;

    if (!recipe.gallery.length) {
        document.querySelector(".recipe-gallery")?.setAttribute("hidden", "");
        cardImage.hidden = true;
        return;
    }

    container.innerHTML = recipe.gallery
        .map((image, i) => `<img loading="lazy" decoding="async" src="${escapeHtml(image)}" alt="Ảnh ${i + 1}" class="gallery-thumb" />`)
        .join("");
    if (recipe.gallery.length < 2) container.hidden = true;

    const showImage = thumb => {
        mainImage.src = thumb.src;
        mainImage.alt = `${recipe.title} - ${thumb.alt}`;
    };

    container.addEventListener("click", event => {
        const thumb = event.target.closest(".gallery-thumb");
        if (thumb) showImage(thumb);
    });

    const firstThumb = container.querySelector(".gallery-thumb");
    if (firstThumb) {
        showImage(firstThumb);
        cardImage.src = firstThumb.src;
        cardImage.alt = recipe.title;
    }
}

function ingredientSpan(item, name, units) {
    const displayName = item.note ? `${name} (${item.note})` : name;
    const ingredientAttr = ` data-ingredient-id="${escapeHtml(item.ingredientId || name)}"`;

    if (item.qty == null) {
        return `<span${ingredientAttr}>${escapeHtml(displayName)}</span>`;
    }

    const unit = item.unit;
    if (item.qtyMax != null) {
        return `<span${ingredientAttr}
            data-min="${item.qty}"
            data-max="${item.qtyMax}"
            data-unit="${escapeHtml(unit)}"
            data-name="${escapeHtml(displayName)}">${escapeHtml(`${item.qty} - ${item.qtyMax} ${unit} ${displayName}`)}
        </span>`;
    }

    return `<span${ingredientAttr}
        data-qty="${item.qty}"
        data-unit="${escapeHtml(unit)}"
        data-name="${escapeHtml(displayName)}">${escapeHtml(`${formatAmount(item.qty, unit, units)} ${displayName}`)}
    </span>`;
}

function renderIngredients(recipe, catalog, units) {
    const list = document.getElementById("ingredient-list");
    if (!list) return;

    const byId = new Map(catalog.map(ingredient => [ingredient.id, ingredient]));
    const rows = [];
    let group = null;

    recipe.ingredients.forEach(item => {
        const ingredient = item.ingredientId ? byId.get(item.ingredientId) : null;
        const name = lowercaseFirst(String(item.name || (ingredient ? ingredient.name : item.ingredientId) || ""));

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
    if (!recipe.quickSteps.length) { document.getElementById("huong-dan-ngan-gon")?.setAttribute("hidden", ""); return; }

    container.innerHTML = recipe.quickSteps
        .map((text, i) => `
            <li>
                <span class="quick-step-number">${i + 1}</span>
                <p>${escapeHtml(text)}</p>
            </li>`)
        .join("");
}

function renderDetailedSteps(recipe) {
    const container = document.getElementById("steps-container");
    if (!container) return;
    if (!recipe.steps.length) { document.getElementById("huong-dan-cu-the")?.setAttribute("hidden", ""); return; }

    container.innerHTML = recipe.steps
        .map((step, i) => `
            <div class="step" id="buoc-${i + 1}">
                <span class="step__label">BƯỚC ${i + 1}</span>
                ${step.text.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}
                ${realImages(step.images).length ? `<div class="step__images">
                    ${realImages(step.images).map(image => {
                        const src = typeof image === "string" ? image : image.src;
                        const tall = typeof image === "object" && image.tall ? ' class="tall"' : "";
                        return `<img loading="lazy" decoding="async" src="${escapeHtml(imageUrl(recipe.id, src))}" alt="Bước ${i + 1}"${tall} />`;
                    }).join("")}
                </div>` : ""}
            </div>`)
        .join("");
}

// Bỏ ảnh giữ chỗ (placeholder.svg) để người xem không thấy khung "thay bằng ảnh thật"
function realImages(images) {
    return (images || []).filter(image => !String(typeof image === "string" ? image : image.src).includes("placeholder"));
}

function renderTocSteps(recipe) {
    const container = document.getElementById("toc-steps");
    if (!container) return;
    if (!recipe.steps.length) { container.closest(".toc__group")?.setAttribute("hidden", ""); return; }

    container.innerHTML = recipe.steps
        .map((item, i) => `<li><a href="#buoc-${i + 1}">Bước ${i + 1}</a></li>`)
        .join("");
}

async function renderSimilar(recipe) {
    const container = document.getElementById("similar-recipes-container");
    const section = container && container.closest(".similar-recipes");
    if (!container) return;

    let items = [];
    try {
        const categoryParam = recipe.categoryId || recipe.category;
        const data = await NomNom.data.get("/recipes", { category: categoryParam || undefined, limit: 5 });
        items = (data.items || []).filter(candidate => candidate.id !== recipe.id);
        if (!items.length) {
            const any = await NomNom.data.get("/recipes", { limit: 5, sort: "rating" });
            items = (any.items || []).filter(candidate => candidate.id !== recipe.id);
        }
    } catch (e) {
        console.warn("Không tải được công thức tương tự", e);
    }
    items = items.slice(0, 4);
    if (!items.length) { section?.setAttribute("hidden", ""); return; }

    container.innerHTML = items.map(item => `
        <a href="${escapeHtml(NomNom.recipeUrl(item.id))}" class="similar-card">
            <img loading="lazy" decoding="async" src="${escapeHtml(imageUrl(item.id, item.image))}" alt="${escapeHtml(item.name)}" class="similar-image" />
            <span class="recipe-name">${escapeHtml(item.name)}</span>
            ${item.price ? `<span class="recipe-price">${escapeHtml(NomNom.money(item.price))} / phần</span>` : ""}
            <span class="recipe-time">Thời gian: ${escapeHtml(NomNom.minutes(item.time))}</span>
        </a>`).join("");
}

function renderNutrition(recipe) {
    const container = document.getElementById("nutrition-container");
    if (!container) return;

    const entries = Object.entries(recipe.nutrition)
        .filter(([key, value]) => value !== "" && value != null)
        .map(([key, value]) => [NUTRITION_LABELS[key] || key, value]);
    if (entries.length <= 1) {
        document.getElementById("dinh-duong")?.setAttribute("hidden", "");
        return;
    }
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

        // Chi phí: tổng tính theo số phần đang chọn, giá mỗi phần giữ nguyên
        if (recipe.costTotal) {
            recipe.costText = costTextOf(recipe.pricePerServing * servings, recipe.pricePerServing);
            document.querySelectorAll("[data-bind='costText']").forEach(element => { element.textContent = recipe.costText; });
        }

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

        document.querySelectorAll(".toc .is-current").forEach(element => element.classList.remove("is-current"));
        document.querySelectorAll(".toc .is-active").forEach(element => element.classList.remove("is-active"));
        document.querySelectorAll(".toc a[aria-current]").forEach(element => element.removeAttribute("aria-current"));

        // Link trong danh sách con -> đánh dấu <li>; link đơn (Bình luận) -> đánh dấu chính nó
        const marker = link.closest("li") || link;
        marker.classList.add("is-current");
        link.setAttribute("aria-current", "location");

        const group = link.closest(".toc__group");
        if (group) group.classList.add("is-active");
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
/* Lưu công thức (trái tim)                                            */
/* ------------------------------------------------------------------ */

function initSave(recipe) {
    const buttons = [...document.querySelectorAll(".save-button, .save-recipe-button")];
    if (!buttons.length) return;
    let saved = recipe.saved;
    let busy = false;

    function paint() {
        buttons.forEach(btn => {
            btn.classList.toggle("is-saved", saved);
            btn.setAttribute("aria-pressed", String(saved));
            if (btn.classList.contains("save-recipe-button")) btn.textContent = saved ? "ĐÃ LƯU CÔNG THỨC" : "LƯU CÔNG THỨC";
            else btn.textContent = saved ? "ĐÃ LƯU" : "LƯU";
        });
    }

    async function toggle() {
        if (busy) return;
        try {
            await requireLogin();
        } catch (e) {
            return; // người dùng đóng popup đăng nhập
        }
        busy = true;
        const previous = saved;
        saved = !saved;           // lạc quan
        paint();
        try {
            const res = saved
                ? await NomNom.data.put(`/recipes/${encodeURIComponent(recipe.id)}/save`)
                : await NomNom.data.del(`/recipes/${encodeURIComponent(recipe.id)}/save`);
            if (res && typeof res.saved === "boolean") saved = res.saved;
            paint();
            toast(saved ? "Đã lưu công thức vào Góc của tôi." : "Đã bỏ lưu công thức.");
        } catch (error) {
            saved = previous;     // hoàn tác
            paint();
            toast(error.message || "Không thể lưu công thức.");
        } finally {
            busy = false;
        }
    }

    buttons.forEach(btn => btn.addEventListener("click", toggle));
    paint();

    // Đăng nhập/đăng xuất ở nơi khác -> lấy lại trạng thái "saved" của tài khoản hiện tại.
    document.addEventListener("nomnom:auth-change", async () => {
        try {
            const fresh = await NomNom.data.get(`/recipes/${encodeURIComponent(recipe.id)}`);
            saved = !!fresh.saved;
        } catch (e) {
            saved = false;
        }
        paint();
    });
}

/* ------------------------------------------------------------------ */
/* In + chia sẻ                                                        */
/* ------------------------------------------------------------------ */

function initPrintShare(recipe) {
    document.querySelector(".print-recipe-button")?.addEventListener("click", () => window.print());

    const url = window.location.href;
    const facebookLink = document.getElementById("share-facebook");
    if (facebookLink) facebookLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

    const copy = document.getElementById("share-copy");
    copy?.addEventListener("click", async event => {
        event.preventDefault();
        try {
            if (navigator.share) {
                await navigator.share({ title: recipe.title, url });
                return;
            }
            await navigator.clipboard.writeText(url);
            toast("Đã sao chép liên kết công thức.");
        } catch (e) {
            if (e && e.name === "AbortError") return;
            window.prompt("Sao chép liên kết:", url);
        }
    });
}

/* ------------------------------------------------------------------ */
/* Bình luận / đánh giá                                                */
/* ------------------------------------------------------------------ */

function formatDateTime(iso) {
    const date = new Date(iso);
    if (isNaN(date)) return "";
    const pad = number => String(number).padStart(2, "0");
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${String(date.getFullYear()).slice(2)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function initReviews(recipe) {
    const form = document.getElementById("review-form");
    const list = document.getElementById("comment-list");
    const empty = document.getElementById("comment-empty");
    const sortSel = document.getElementById("comment-sort");
    const textarea = document.getElementById("review-text");
    const message = document.getElementById("review-message");
    const picker = document.getElementById("star-picker");
    const submit = document.getElementById("review-submit");
    const formAvatar = document.getElementById("review-avatar");
    if (!form || !list) return;

    const base = `/recipes/${encodeURIComponent(recipe.id)}/reviews`;
    let reviews = [];
    let rating = 0;

    function showMessage(text, isError) {
        message.textContent = text || "";
        message.hidden = !text;
        message.classList.toggle("is-error", !!isError);
    }

    function paintPicker(hover) {
        const shown = hover || rating;
        picker.querySelectorAll(".star-pick").forEach(btn => {
            const selectedRating = Number(btn.dataset.value);
            btn.classList.toggle("is-on", selectedRating <= shown);
            btn.setAttribute("aria-checked", String(selectedRating === rating));
        });
    }

    picker.addEventListener("click", event => {
        const btn = event.target.closest(".star-pick");
        if (!btn) return;
        rating = Number(btn.dataset.value);
        paintPicker();
        showMessage("");
    });
    picker.addEventListener("mouseover", event => {
        const btn = event.target.closest(".star-pick");
        if (btn) paintPicker(Number(btn.dataset.value));
    });
    picker.addEventListener("mouseleave", () => paintPicker());

    function ownReview() {
        const viewer = currentUser();
        return viewer ? reviews.find(review => review.user && review.user.id === viewer.id) : null;
    }

    function syncForm() {
        const viewer = currentUser();
        const own = ownReview();
        if (formAvatar) formAvatar.src = (viewer && viewer.avatar) || FALLBACK_AVATAR;
        if (own) {
            if (!textarea.dataset.touched) textarea.value = own.text || "";
            if (!rating) rating = own.rating;
            submit.textContent = "CẬP NHẬT ĐÁNH GIÁ";
        } else {
            submit.textContent = "ĐĂNG BÌNH LUẬN";
        }
        paintPicker();
    }
    textarea.addEventListener("input", () => { textarea.dataset.touched = "1"; });

    function sorted() {
        const copy = reviews.slice();
        const mode = sortSel ? sortSel.value : "new";
        if (mode === "old") copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        else if (mode === "likes") copy.sort((a, b) => (b.likes || 0) - (a.likes || 0) || new Date(b.createdAt) - new Date(a.createdAt));
        else copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return copy;
    }

    function render() {
        const viewer = currentUser();
        document.getElementById("review-count").textContent = reviews.length;
        empty.hidden = reviews.length > 0;
        list.innerHTML = sorted().map(review => {
            const user = review.user || {};
            const mine = viewer && user.id === viewer.id;
            return `
            <li class="comment" data-review-id="${escapeHtml(review.id)}">
                <div class="comment__avatar-column">
                    <img loading="lazy" decoding="async" src="${escapeHtml(user.avatar || FALLBACK_AVATAR)}" alt="${escapeHtml(user.username || "Người dùng")}" class="comment__avatar" />
                </div>
                <div class="comment__body">
                    <div class="comment__top">
                        <span class="comment__author">${escapeHtml(user.username || "Người dùng ẩn danh")}</span>
                        <span class="comment__time">${escapeHtml(formatDateTime(review.createdAt))}</span>
                    </div>
                    <div class="comment__stars" aria-label="${Number(review.rating) || 0} trên 5 sao"><span class="stars">${starsHtml(review.rating)}</span></div>
                    <p class="comment__text">${escapeHtml(review.text)}</p>
                    <div class="comment__actions">
                        <button type="button" class="like-button${review.liked ? " is-liked" : ""}" data-action="like" aria-pressed="${review.liked ? "true" : "false"}">${Number(review.likes) || 0}</button>
                        ${mine ? '<button type="button" class="reply__button delete-review-button" data-action="delete">Xóa</button>' : ""}
                    </div>
                </div>
            </li>`;
        }).join("");
    }

    async function load() {
        try {
            const data = await NomNom.data.get(base);
            reviews = data.items || [];
            updateRatingDisplay(recipe, Number(data.average) || 0, Number(data.count ?? reviews.length) || 0);
        } catch (error) {
            list.innerHTML = "";
            empty.hidden = false;
            empty.textContent = error.message || "Không tải được bình luận.";
            return;
        }
        syncForm();
        render();
    }

    sortSel?.addEventListener("change", render);

    form.addEventListener("submit", async event => {
        event.preventDefault();
        showMessage("");
        try {
            await requireLogin();
        } catch (e) {
            return;
        }
        const text = textarea.value.trim();
        if (!rating) { showMessage("Vui lòng chọn số sao đánh giá.", true); return; }
        if (!text) { showMessage("Vui lòng viết vài dòng nhận xét.", true); textarea.focus(); return; }

        submit.disabled = true;
        try {
            await NomNom.data.post(base, { rating, text });
            textarea.dataset.touched = "";
            await load();
            showMessage("Cảm ơn bạn! Đánh giá đã được lưu.");
        } catch (error) {
            showMessage(error.message || "Không gửi được đánh giá.", true);
        } finally {
            submit.disabled = false;
        }
    });

    list.addEventListener("click", async event => {
        const btn = event.target.closest("[data-action]");
        if (!btn) return;
        const listItem = btn.closest("[data-review-id]");
        const reviewId = listItem.dataset.reviewId;
        const review = reviews.find(item => String(item.id) === reviewId);
        if (!review) return;

        if (btn.dataset.action === "like") {
            try {
                await requireLogin();
            } catch (e) {
                return;
            }
            const before = { liked: review.liked, likes: review.likes };
            review.liked = !review.liked;
            review.likes = (Number(review.likes) || 0) + (review.liked ? 1 : -1);
            render();
            try {
                const res = await NomNom.data.post(`/reviews/${encodeURIComponent(reviewId)}/like`);
                if (res) { review.liked = !!res.liked; review.likes = Number(res.likes) || 0; }
            } catch (error) {
                review.liked = before.liked;
                review.likes = before.likes;
                toast(error.message || "Không thể thích bình luận.");
            }
            render();
        } else if (btn.dataset.action === "delete") {
            if (!window.confirm("Xóa đánh giá của bạn?")) return;
            try {
                await NomNom.data.del(`/reviews/${encodeURIComponent(reviewId)}`);
                rating = 0;
                textarea.value = "";
                textarea.dataset.touched = "";
                await load();
                toast("Đã xóa đánh giá.");
            } catch (error) {
                toast(error.message || "Không thể xóa đánh giá.");
            }
        }
    });

    document.addEventListener("nomnom:auth-change", () => {
        rating = 0;
        textarea.value = "";
        textarea.dataset.touched = "";
        load();
    });

    return load();
}

/* ------------------------------------------------------------------ */
/* Khởi động                                                           */
/* ------------------------------------------------------------------ */

function normalizeUnits(units) {
    if (Array.isArray(units)) {
        const map = {};
        units.forEach(unit => { map[unit.id || unit.label] = unit; });
        return map;
    }
    return units || {};
}

async function init() {
    const recipeId = new URLSearchParams(window.location.search).get("id");
    if (!recipeId) {
        window.location.replace("/pages/category.html");
        return;
    }

    let raw;
    try {
        raw = await NomNom.data.get(`/recipes/${encodeURIComponent(recipeId)}`);
    } catch (error) {
        if (error.status === 404) {
            document.title = "Không tìm thấy công thức | NomNom";
            showRecipeError("KHÔNG TÌM THẤY CÔNG THỨC", "Công thức bạn tìm không tồn tại hoặc đã bị xóa.");
        } else {
            showRecipeError("KHÔNG TẢI ĐƯỢC CÔNG THỨC", error.message || "Đã có lỗi xảy ra, vui lòng thử lại sau.");
        }
        return;
    }

    let catalog = [];
    let units = {};
    try {
        const data = await NomNom.data.get("/ingredients");
        catalog = data.items || [];
        units = normalizeUnits(data.units);
    } catch (e) {
        console.warn("Không tải được danh mục nguyên liệu", e);
    }

    const recipe = normalizeRecipe(raw, recipeId);
    try {
        // category có thể là id (danh mục chọn khi upload) -> hiện tên, giữ id để lọc công thức tương tự
        const cats = await NomNom.data.get("/categories");
        const hit = (cats.items || []).find(category => category.id === recipe.category || category.name === recipe.category);
        if (hit) { recipe.categoryId = hit.id; recipe.category = hit.name; }
    } catch (e) { /* giữ nguyên */ }

    document.title = `${recipe.title} | NomNom`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = (recipe.description || recipe.title).slice(0, 160);

    renderBindings(recipe);
    // Phân loại trên breadcrumb và nút "Xem thêm" của món tương tự dẫn về đúng danh mục của công thức này
    const catHref = recipe.categoryId ? "/pages/category.html?category=" + encodeURIComponent(recipe.categoryId) : "/pages/category.html";
    document.querySelector('.breadcrumb [data-bind="category"]')?.setAttribute("href", catHref);
    document.querySelector('.breadcrumb [data-bind="subcategory"]')?.setAttribute("href", catHref);
    document.querySelector(".similar-more-button")?.setAttribute("href", catHref);
    const authorAvatar = document.getElementById("author-avatar");
    if (authorAvatar && raw.author && raw.author.avatar) authorAvatar.src = raw.author.avatar;
    renderGallery(recipe);
    renderIngredients(recipe, catalog, units);
    renderQuickSteps(recipe);
    renderDetailedSteps(recipe);
    renderTocSteps(recipe);
    renderNutrition(recipe);
    initServingsScaler(recipe, units);
    initScrollSpy();
    initSave(recipe);
    initPrintShare(recipe);
    renderSimilar(recipe);
    initReviews(recipe);
}

init();
