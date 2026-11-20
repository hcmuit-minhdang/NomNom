/* NomNom: đăng tải công thức: kiểm tra dữ liệu, tải ảnh (NomNom.data "/uploads"), lưu công thức ("/recipes"). */
import { createIngredientPicker } from "/js/pages/ingredient-picker.js";

const SCROLLSPY_OFFSET = 140;
const MAX_IMAGE_SIDE = 1600;
const MAX_UPLOAD_BYTES = 2.8 * 1024 * 1024; // giới hạn 3MB (tính trên dữ liệu gốc)
const MAX_GALLERY = 5;
const DRAFT_KEY = "nomnom:upload-draft:v1";
const api = window.NomNom.data;
const esc = window.NomNom.esc;

/* ------------------------------------------------------------------ */
/* Phần tử                                                             */
/* ------------------------------------------------------------------ */

const form = document.getElementById("upload-form");
const nameInput = document.getElementById("name-input");
const categoryInput = document.getElementById("category-input");
const priceInput = document.getElementById("price-input");
const servingsInput = document.getElementById("servings-input");
const prepTimeInput = document.getElementById("prep-time-input");
const cookTimeInput = document.getElementById("cook-time-input");
const descriptionInput = document.getElementById("description-input");
const galleryInput = document.getElementById("gallery-images");
const galleryPreviews = document.getElementById("gallery-previews");
const quickContainer = document.getElementById("quick-step-list");
const addQuickBtn = document.getElementById("add-step-btn");
const stepsContainer = document.getElementById("detailed-steps-container");
const addStepBtn = document.getElementById("add-detailed-btn");
const statusBox = document.getElementById("upload-status");
const statusText = document.getElementById("upload-status-text");
const progressWrap = document.getElementById("upload-progress-wrap");
const progressBar = document.getElementById("upload-progress");
const submitBtn = document.getElementById("upload-submit");
const draftBtn = document.getElementById("draft-save");
const draftClearBtn = document.getElementById("draft-clear");
const NUTRIENTS = ["calories", "carbs", "protein", "fat", "sodium", "fiber"];

/* ------------------------------------------------------------------ */
/* Trạng thái                                                          */
/* ------------------------------------------------------------------ */

const gallery = [];       // [{ file, url }]
let quickSteps = [];    // [string]
let steps = [];         // [{ text, file, preview }]
let picker = null;
let pickerItems = [];
let submitting = false;
let draftIngredients = [];

/* ------------------------------------------------------------------ */
/* Tiện ích                                                            */
/* ------------------------------------------------------------------ */

function setStatus(text, kind, progress) {
    statusBox.hidden = !text;
    statusBox.dataset.kind = kind || "info";
    statusText.textContent = text || "";
    progressWrap.hidden = progress == null;
    if (progress != null) progressBar.style.width = Math.round(progress * 100) + "%";
}

function clearErrors() {
    form.querySelectorAll(".field-error").forEach(element => element.remove());
    form.querySelectorAll(".has-error").forEach(element => element.classList.remove("has-error"));
}

function showError(target, message) {
    if (!target) return null;
    target.classList.add("has-error");
    const paragraph = document.createElement("p");
    paragraph.className = "field-error";
    paragraph.setAttribute("role", "alert");
    paragraph.textContent = message;
    const anchor = target.closest(".input-field") || target;
    anchor.insertAdjacentElement(target.closest(".input-field") ? "beforeend" : "afterend", paragraph);
    return target;
}

function toInt(value) {
    const parsed = parseInt(String(value).replace(/\D/g, ""), 10);
    return Number.isFinite(parsed) ? parsed : 0;
}

/* ------------------------------------------------------------------ */
/* Ô số, giá                                                           */
/* ------------------------------------------------------------------ */

priceInput.addEventListener("input", event => {
    const digits = event.target.value.replace(/\D/g, "");
    event.target.value = digits ? new Intl.NumberFormat("vi-VN").format(digits) : "";
});

function bindStepper(inputField) {
    const wrapper = inputField.closest(".small-input__wrapper");
    if (!wrapper) return;
    const min = Number(inputField.min) || 0;
    wrapper.querySelector(".stepper-button--up")?.addEventListener("click", () => {
        inputField.value = Number(inputField.value) + 1;
        scheduleDraft();
    });
    wrapper.querySelector(".stepper-button--down")?.addEventListener("click", () => {
        inputField.value = Math.max(min, Number(inputField.value) - 1);
        scheduleDraft();
    });
}

/* ------------------------------------------------------------------ */
/* Ảnh: chọn, xem trước, thu nhỏ                                       */
/* ------------------------------------------------------------------ */

function renderGallery() {
    galleryPreviews.innerHTML = gallery.map((image, i) => `
        <li class="preview-item${i === 0 ? " is-cover" : ""}">
            <img src="${esc(image.url)}" alt="Ảnh ${i + 1}">
            ${i === 0 ? '<span class="preview-badge">Ảnh bìa</span>' : ""}
            <button type="button" class="preview-remove" data-index="${i}" aria-label="Xóa ảnh ${i + 1}">×</button>
        </li>`).join("");
}

function validImageFile(file) {
    return /^image\/(png|jpe?g|webp)$/i.test(file.type);
}

galleryInput.addEventListener("change", () => {
    const errors = [];
    [...galleryInput.files].forEach(file => {
        if (!validImageFile(file)) { errors.push(`"${file.name}" không phải ảnh PNG/JPG/WebP.`); return; }
        if (gallery.length >= MAX_GALLERY) { errors.push(`Chỉ được thêm tối đa ${MAX_GALLERY} ảnh.`); return; }
        gallery.push({ file, url: URL.createObjectURL(file) });
    });
    galleryInput.value = "";
    form.querySelectorAll('.field-error[data-for="gallery"]').forEach(e => e.remove());
    if (errors.length) {
        const paragraph = document.createElement("p");
        paragraph.className = "field-error";
        paragraph.dataset.for = "gallery";
        paragraph.textContent = [...new Set(errors)].join(" ");
        galleryPreviews.insertAdjacentElement("beforebegin", paragraph);
    }
    renderGallery();
});

galleryPreviews.addEventListener("click", event => {
    const btn = event.target.closest(".preview-remove");
    if (!btn) return;
    const [removed] = gallery.splice(Number(btn.dataset.index), 1);
    if (removed) URL.revokeObjectURL(removed.url);
    renderGallery();
});

function loadImage(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Không đọc được ảnh "${file.name}".`)); };
        img.src = url;
    });
}

// Thu nhỏ về tối đa 1600px, xuất JPEG 0.85; nếu vẫn quá lớn thì giảm tiếp.
async function fileToDataUrl(file) {
    const img = await loadImage(file);
    let scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    let quality = 0.85;
    for (let attempt = 0; attempt < 5; attempt++) {
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff"; // PNG trong suốt -> nền trắng
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const approxBytes = (dataUrl.length - dataUrl.indexOf(",") - 1) * 0.75;
        if (approxBytes <= MAX_UPLOAD_BYTES) return dataUrl;
        scale *= 0.8;
        quality = Math.max(0.6, quality - 0.08);
    }
    throw new Error(`Ảnh "${file.name}" quá lớn, hãy chọn ảnh nhỏ hơn.`);
}

async function uploadFile(file) {
    const dataUrl = await fileToDataUrl(file);
    const res = await api.post("/uploads", { dataUrl });
    if (!res || !res.url) throw new Error("Không xử lý được ảnh này. Hãy thử ảnh khác.");
    return res.url;
}

/* ------------------------------------------------------------------ */
/* Hướng dẫn ngắn gọn                                                  */
/* ------------------------------------------------------------------ */

function renderQuickSteps() {
    quickContainer.innerHTML = quickSteps.map((text, index) => `
        <li>
            <span class="quick-step-number">${index + 1}</span>
            <textarea class="textarea-input" data-quick="${index}" placeholder="Thêm bước ${index + 1}" aria-label="Hướng dẫn ngắn gọn bước ${index + 1}">${esc(text)}</textarea>
            <button type="button" class="remove-step-btn" data-quick-remove="${index}">XÓA</button>
        </li>`).join("");
}

addQuickBtn.addEventListener("click", () => {
    quickSteps.push("");
    renderQuickSteps();
    quickContainer.querySelector(`[data-quick="${quickSteps.length - 1}"]`)?.focus();
    scheduleDraft();
});

quickContainer.addEventListener("input", event => {
    const textarea = event.target.closest("textarea");
    if (!textarea) return;
    quickSteps[Number(textarea.dataset.quick)] = textarea.value;
    scheduleDraft();
});

quickContainer.addEventListener("click", event => {
    const btn = event.target.closest("[data-quick-remove]");
    if (!btn) return;
    quickSteps.splice(Number(btn.dataset.quickRemove), 1);
    renderQuickSteps();
    scheduleDraft();
});

/* ------------------------------------------------------------------ */
/* Hướng dẫn cụ thể (mỗi bước: chữ + 1 ảnh)                           */
/* ------------------------------------------------------------------ */

function renderSteps() {
    stepsContainer.innerHTML = steps.map((step, index) => `
        <li data-step-row="${index}">
            <span class="step__label">BƯỚC ${index + 1}</span>
            <textarea class="textarea-input" data-step-text="${index}" placeholder="Thêm bước ${index + 1}" aria-label="Hướng dẫn cụ thể bước ${index + 1}">${esc(step.text)}</textarea>
            ${step.preview ? `<div class="step__preview"><img src="${esc(step.preview)}" alt="Ảnh bước ${index + 1}"><button type="button" class="preview-remove" data-step-image-remove="${index}" aria-label="Xóa ảnh bước ${index + 1}">×</button></div>` : ""}
            <label for="step-image-${index}" class="image-upload step__image-upload">
                <img src="/images/icons/image-file.svg" alt="" class="image-upload__icon">
                <span class="image-upload__text">${step.preview ? "Đổi hình ảnh" : "Nhấn vào đây để đăng tải hình ảnh"}</span>
            </label>
            <input type="file" id="step-image-${index}" data-step-image="${index}" accept="image/png,image/jpeg,image/webp">
            <button type="button" class="remove-step-btn remove-step-btn--detailed" data-step-remove="${index}">XÓA</button>
        </li>`).join("");
}

addStepBtn.addEventListener("click", () => {
    steps.push({ text: "", file: null, preview: "" });
    renderSteps();
    stepsContainer.querySelector(`[data-step-text="${steps.length - 1}"]`)?.focus();
    scheduleDraft();
});

stepsContainer.addEventListener("input", event => {
    const textarea = event.target.closest("textarea");
    if (!textarea) return;
    steps[Number(textarea.dataset.stepText)].text = textarea.value;
    scheduleDraft();
});

stepsContainer.addEventListener("change", event => {
    const input = event.target.closest("[data-step-image]");
    if (!input || !input.files[0]) return;
    const step = steps[Number(input.dataset.stepImage)];
    const file = input.files[0];
    if (!validImageFile(file)) { setStatus(`"${file.name}" không phải ảnh PNG/JPG/WebP.`, "error"); return; }
    if (step.preview) URL.revokeObjectURL(step.preview);
    step.file = file;
    step.preview = URL.createObjectURL(file);
    renderSteps();
});

stepsContainer.addEventListener("click", event => {
    const removeButton = event.target.closest("[data-step-remove]");
    if (removeButton) {
        const [removed] = steps.splice(Number(removeButton.dataset.stepRemove), 1);
        if (removed && removed.preview) URL.revokeObjectURL(removed.preview);
        renderSteps();
        scheduleDraft();
        return;
    }
    const rmImg = event.target.closest("[data-step-image-remove]");
    if (rmImg) {
        const step = steps[Number(rmImg.dataset.stepImageRemove)];
        if (step.preview) URL.revokeObjectURL(step.preview);
        step.file = null;
        step.preview = "";
        renderSteps();
    }
});

/* ------------------------------------------------------------------ */
/* Bản nháp (localStorage, không lưu ảnh)                              */
/* ------------------------------------------------------------------ */

function collectDraft() {
    const nutrition = {};
    NUTRIENTS.forEach(nutrientId => { nutrition[nutrientId] = document.getElementById(nutrientId)?.value || ""; });
    return {
        title: nameInput.value, category: (categoryInput.selectedOptions && categoryInput.selectedOptions[0] && categoryInput.value ? categoryInput.selectedOptions[0].textContent.trim() : categoryInput.value), cost: priceInput.value,
        servings: servingsInput.value, prep: prepTimeInput.value, cook: cookTimeInput.value,
        description: descriptionInput.value, quickSteps: quickSteps.slice(),
        steps: steps.map(step => step.text), nutrition, ingredients: pickerItems, savedAt: Date.now()
    };
}

function isDraftEmpty(draft) {
    return !draft.title && !draft.description && !draft.prep && !draft.cook && !draft.cost
        && !draft.quickSteps.some(Boolean) && !draft.steps.some(Boolean) && !(draft.ingredients || []).length;
}

function saveDraft(manual) {
    try {
        const draft = collectDraft();
        if (isDraftEmpty(draft)) { localStorage.removeItem(DRAFT_KEY); draftClearBtn.hidden = true; }
        else { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); draftClearBtn.hidden = false; }
        if (manual) setStatus("Đã lưu bản nháp trên trình duyệt này (ảnh cần chọn lại khi quay lại).", "ok");
    } catch (e) {
        if (manual) setStatus("Không thể lưu bản nháp trên trình duyệt này.", "error");
    }
}

let draftTimer = null;
function scheduleDraft() {
    if (submitting) return;
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => saveDraft(false), 600);
}

function loadDraft() {
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function clearDraft() {
    clearTimeout(draftTimer);
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* bỏ qua */ }
    draftClearBtn.hidden = true;
}

function applyDraft(draft) {
    if (!draft) return;
    nameInput.value = draft.title || "";
    if (draft.category) {
        // Bản nháp lưu tên hiển thị của danh mục, còn value của <option> là id: khớp theo cả hai
        const opt = Array.from(categoryInput.options).find(option => option.value === draft.category || option.textContent.trim() === draft.category);
        if (opt) categoryInput.value = opt.value;
    }
    priceInput.value = draft.cost || "";
    if (draft.servings) servingsInput.value = draft.servings;
    prepTimeInput.value = draft.prep || "";
    cookTimeInput.value = draft.cook || "";
    descriptionInput.value = draft.description || "";
    quickSteps = (draft.quickSteps || []).slice();
    steps = (draft.steps || []).map(text => ({ text, file: null, preview: "" }));
    NUTRIENTS.forEach(nutrientId => { const element = document.getElementById(nutrientId); if (element && draft.nutrition) element.value = draft.nutrition[nutrientId] || ""; });
    renderQuickSteps();
    renderSteps();
    draftIngredients = draft.ingredients || [];
}

form.addEventListener("input", scheduleDraft);
draftBtn.addEventListener("click", () => saveDraft(true));
draftClearBtn.addEventListener("click", () => {
    if (!window.confirm("Xóa bản nháp và làm mới biểu mẫu?")) return;
    clearDraft();
    window.location.reload();
});

/* ------------------------------------------------------------------ */
/* Kiểm tra dữ liệu                                                    */
/* ------------------------------------------------------------------ */

function validate() {
    clearErrors();
    const errors = [];
    const add = (element, msg) => errors.push(showError(element, msg));

    if (nameInput.value.trim().length < 3) add(nameInput, "Vui lòng nhập tên công thức (ít nhất 3 ký tự).");
    if (!categoryInput.value) add(categoryInput, "Vui lòng chọn danh mục.");
    if (!(toInt(servingsInput.value) >= 1)) add(servingsInput.closest(".input-field"), "Khẩu phần phải từ 1 trở lên.");
    if (toInt(prepTimeInput.value) + toInt(cookTimeInput.value) < 1) add(prepTimeInput.closest(".input-field"), "Nhập thời gian chuẩn bị hoặc thời gian nấu (phút).");
    if (descriptionInput.value.trim().length < 10) add(descriptionInput, "Vui lòng mô tả món ăn (ít nhất 10 ký tự).");
    if (!gallery.length) add(galleryPreviews, "Vui lòng thêm ít nhất 1 hình ảnh món ăn.");

    const ingredients = pickerItems;
    if (!ingredients.length) add(document.getElementById("ingredient-picker"), "Vui lòng thêm ít nhất 1 nguyên liệu.");
    else if (ingredients.some(i => !(Number(i.qty) > 0))) add(document.getElementById("ingredient-picker"), "Nhập số lượng (lớn hơn 0) cho tất cả nguyên liệu.");

    const filled = steps.filter(step => step.text.trim());
    if (!filled.length) add(addStepBtn, "Vui lòng thêm ít nhất 1 bước trong hướng dẫn cụ thể.");
    else steps.forEach((step, i) => {
        if (!step.text.trim()) add(stepsContainer.querySelector(`[data-step-text="${i}"]`), `Bước ${i + 1} đang để trống: hãy nhập nội dung hoặc xóa bước.`);
    });

    NUTRIENTS.forEach(nutrientId => {
        const element = document.getElementById(nutrientId);
        if (element && element.value !== "" && !(Number(element.value) >= 0)) add(element, "Giá trị dinh dưỡng phải là số không âm.");
    });

    const first = errors.find(Boolean);
    if (first) {
        first.scrollIntoView({ behavior: "smooth", block: "center" });
        if (typeof first.focus === "function") first.focus({ preventScroll: true });
    }
    return errors.length === 0;
}

/* ------------------------------------------------------------------ */
/* Gửi                                                                 */
/* ------------------------------------------------------------------ */

function nutritionPayload() {
    const get = elementId => document.getElementById(elementId)?.value.trim() || "";
    const unitOf = { calories: " kcal", carbs: "g", protein: "g", fat: "g", sodium: " mg", fiber: "g" };
    const out = { servings: toInt(servingsInput.value) || 1 };
    NUTRIENTS.forEach(nutrientId => { out[nutrientId] = get(nutrientId) ? get(nutrientId) + unitOf[nutrientId] : ""; });
    return out;
}

function setBusy(busy) {
    submitting = busy;
    submitBtn.disabled = busy;
    draftBtn.disabled = busy;
    submitBtn.value = busy ? "ĐANG ĐĂNG..." : "ĐĂNG TẢI CÔNG THỨC";
}

async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    // 1) Đăng nhập (hiện popup nếu chưa có)
    try {
        if (!window.NomNomAuth || typeof window.NomNomAuth.requireLogin !== "function") {
            throw new Error("Chức năng đăng nhập chưa sẵn sàng, vui lòng tải lại trang.");
        }
        await window.NomNomAuth.requireLogin();
    } catch (error) {
        if (error && error.message) setStatus(error.message, "error");
        else setStatus("Bạn cần đăng nhập để đăng tải công thức.", "error");
        return;
    }

    // 2) Kiểm tra dữ liệu
    if (!validate()) { setStatus("Vui lòng kiểm tra lại các mục được đánh dấu đỏ.", "error"); return; }

    setBusy(true);
    try {
        // 3) Tải ảnh
        const stepFiles = steps.filter(step => step.text.trim());
        const totalImages = gallery.length + stepFiles.filter(step => step.file).length;
        let done = 0;
        const bump = () => { done++; setStatus(`Đang tải ảnh ${done}/${totalImages}...`, "info", totalImages ? done / (totalImages + 1) : 0); };
        setStatus(totalImages ? `Đang tải ảnh 0/${totalImages}...` : "Đang đăng công thức...", "info", 0);

        const galleryUrls = [];
        for (const image of gallery) { galleryUrls.push(await uploadFile(image.file)); bump(); }
        const stepPayload = [];
        for (const step of stepFiles) {
            let image = "";
            if (step.file) { image = await uploadFile(step.file); bump(); }
            stepPayload.push({ text: step.text.trim(), image });
        }

        // 4) Gửi công thức
        setStatus("Đang đăng công thức...", "info", totalImages / (totalImages + 1));
        const prepTime = toInt(prepTimeInput.value);
        const cookTime = toInt(cookTimeInput.value);
        const servings = toInt(servingsInput.value) || 1;
        const description = descriptionInput.value.trim();
        const payload = {
            name: nameInput.value.trim(),
            title: nameInput.value.trim(),
            description,
            summary: description,
            image: galleryUrls[0],
            gallery: galleryUrls,
            category: (categoryInput.selectedOptions && categoryInput.selectedOptions[0] && categoryInput.value ? categoryInput.selectedOptions[0].textContent.trim() : categoryInput.value),
            time: prepTime + cookTime,
            prepTime,
            cookTime,
            servings,
            baseServings: servings,
            costTotal: toInt(priceInput.value),
            ingredients: pickerItems.map(i => ({
                ingredientId: i.ingredientId, name: i.name, quantity: Number(i.qty), qty: Number(i.qty), unit: i.unit
            })),
            quickSteps: quickSteps.map(line => line.trim()).filter(Boolean),
            steps: stepPayload,
            nutrition: nutritionPayload(),
            tags: []
        };
        const res = await api.post("/recipes", payload);
        if (!res || !res.id) throw new Error("Không lưu được công thức. Hãy thử lại.");

        clearDraft();
        setStatus("Đăng tải thành công! Đang chuyển tới công thức của bạn...", "ok", 1);
        window.location.href = window.NomNom.recipeUrl(res.id);
    } catch (error) {
        setBusy(false);
        const fieldMap = { name: nameInput, title: nameInput, category: categoryInput, description: descriptionInput };
        if (error && error.field && fieldMap[error.field]) showError(fieldMap[error.field], error.message);
        setStatus((error && error.message) || "Đăng tải thất bại, vui lòng thử lại.", "error");
        if (error && error.status === 401) window.NomNomAuth?.open?.("login");
    }
}

form.addEventListener("submit", handleSubmit);

/* ------------------------------------------------------------------ */
/* Scrollspy                                                           */
/* ------------------------------------------------------------------ */

function initScrollSpy() {
    const items = [...document.querySelectorAll('.toc a[href^="#"]')]
        .map(link => ({ link, section: document.getElementById(link.getAttribute("href").slice(1)) }))
        .filter(item => item.section);
    if (items.length === 0) return;

    let activeLink = null;
    let ticking = false;

    function setActive(link) {
        if (link === activeLink) return;
        activeLink = link;
        document.querySelectorAll(".toc .is-current").forEach(element => element.classList.remove("is-current"));
        document.querySelectorAll(".toc .is-active").forEach(element => element.classList.remove("is-active"));
        (link.closest("li") || link).classList.add("is-current");
        link.closest(".toc__group")?.classList.add("is-active");
    }

    function update() {
        ticking = false;
        let current = items[0];
        let bestTop = -Infinity;
        items.forEach(item => {
            const top = item.section.getBoundingClientRect().top;
            if (top <= SCROLLSPY_OFFSET && top > bestTop) { bestTop = top; current = item; }
        });
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = items[items.length - 1];
        setActive(current.link);
    }

    function requestUpdate() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("load", requestUpdate);
    update();
}

/* ------------------------------------------------------------------ */
/* Khởi động                                                           */
/* ------------------------------------------------------------------ */

async function loadCategories() {
    try {
        const data = await api.get("/categories");
        (data.items || []).forEach(category => {
            const opt = document.createElement("option");
            opt.value = category.id;
            opt.textContent = category.name;
            categoryInput.appendChild(opt);
        });
    } catch (e) {
        setStatus("Không tải được danh mục: " + (e.message || ""), "error");
    }
}

async function init() {
    [servingsInput, prepTimeInput, cookTimeInput].forEach(bindStepper);
    await loadCategories();

    const draft = loadDraft();
    applyDraft(draft);
    if (draft && !isDraftEmpty(draft)) {
        draftClearBtn.hidden = false;
        setStatus("Đã khôi phục bản nháp gần nhất. Hãy chọn lại ảnh trước khi đăng.", "info");
    }

    try {
        picker = await createIngredientPicker(document.getElementById("ingredient-picker"), {
            onChange(items) {
                pickerItems = items;
                scheduleDraft();
            }
        });
        if (draftIngredients.length) picker.setItems(draftIngredients);
    } catch (error) {
        console.error(error);
    }

    initScrollSpy();
}

init().catch(error => console.error(error));
