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
const stepCountInputs = document.querySelectorAll(".step-count__input");
const templateSelect = document.getElementById("template-select");
const templateApplyBtn = document.getElementById("template-apply-btn");
const startFromCurrent = document.getElementById("start-from-current");
const nameSuggestions = document.getElementById("name-suggestions");
const regionInput = document.getElementById("region-input");
const regionHint = document.getElementById("region-hint");
const regionApplyBtn = document.getElementById("region-apply-btn");
const nutritionAutoBtn = document.getElementById("nutrition-auto-btn");
const nutritionAutoNote = document.getElementById("nutrition-auto-note");
const testedInput = document.getElementById("tested-input");

const MAX_STEPS = 30;

// Công thức mẫu: id lấy từ data/db.json. Muốn thêm mẫu thì thêm 1 dòng vào đây.
const TEMPLATES = [
    { id: "pho-bo-tai-lan-truyen-thong", label: "Phở bò tái lăn (Hà Nội)" },
    { id: "bun-bo-gio-heo-cay-nong", label: "Bún bò giò heo (Huế)" },
    { id: "banh-mi-thit-nuong", label: "Bánh mì thịt nướng" },
    { id: "com-tam-suon-bi-cha-trung", label: "Cơm tấm sườn bì chả" }
];

// Gợi ý chỉnh nguyên liệu theo vùng miền: hệ số nhân vào số lượng (1.3 = tăng 30%)
const REGION_RULES = {
    "Miền Bắc": {
        hint: "Món miền Bắc thường nêm vị thanh, ít ngọt. Gợi ý: giảm đường 30%.",
        change: { "duong-cat": 0.7 }
    },
    "Miền Trung": {
        hint: "Món miền Trung thường cay và đậm vị. Gợi ý: tăng ớt 50%, tăng nước mắm 20%.",
        change: { "ot": 1.5, "nuoc-mam": 1.2 }
    },
    "Miền Nam": {
        hint: "Món miền Nam thường nêm ngọt hơn. Gợi ý: tăng đường 30%, tăng nước dừa 20%.",
        change: { "duong-cat": 1.3, "nuoc-dua": 1.2 }
    }
};

/* ------------------------------------------------------------------ */
/* Trạng thái                                                          */
/* ------------------------------------------------------------------ */

const gallery = [];       // [{ file, url }]
// Mỗi bước có cả phần ngắn gọn (quick) và phần cụ thể (text, ảnh).
// Hai danh sách trên trang cùng vẽ từ mảng này nên số bước luôn bằng nhau.
let steps = [];         // [{ quick, text, file, preview }]
let picker = null;
let pickerItems = [];
let submitting = false;
let draftIngredients = [];
let baseRecipe = null;  // công thức gốc khi dùng mẫu / cải tiến: { mode, id, name, ingredientKey, stepTexts }
let catalogUnits = {};  // đơn vị từ kho nguyên liệu (để đổi ra gram)
let nutritionData = null; // dữ liệu dinh dưỡng từ /data/nutrition.json
let regionApplied = "";

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

// Đưa chữ về dạng so sánh được: bỏ dấu, chữ thường, gộp khoảng trắng
function normalizeText(text) {
    return String(text ?? "")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

// "1,200 - 1,600 mg" -> 1200, "520 kcal" -> 520
function firstNumber(value) {
    const parsed = parseFloat(String(value ?? "").replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : "";
}

function categoryName() {
    return categoryInput.selectedOptions && categoryInput.selectedOptions[0] && categoryInput.value
        ? categoryInput.selectedOptions[0].textContent.trim()
        : categoryInput.value;
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
/* Các bước (đồng bộ Hướng dẫn ngắn gọn và Hướng dẫn cụ thể)           */
/*   - Thêm/xóa bước ở phần nào thì phần kia cũng thêm/xóa theo.       */
/*   - Ô "Số bước" ở 2 phần cũng là một: nhập ở đâu thì 2 phần cùng đổi. */
/* ------------------------------------------------------------------ */

function newStep() {
    return { quick: "", text: "", file: null, preview: "" };
}

function stepHasContent(step) {
    return !!(step.quick.trim() || step.text.trim() || step.file);
}

function renderQuickSteps() {
    quickContainer.innerHTML = steps.map((step, index) => `
        <li>
            <span class="quick-step-number">${index + 1}</span>
            <textarea class="textarea-input" data-quick="${index}" placeholder="Thêm bước ${index + 1}" aria-label="Hướng dẫn ngắn gọn bước ${index + 1}">${esc(step.quick)}</textarea>
            <button type="button" class="remove-step-btn" data-quick-remove="${index}">XÓA</button>
        </li>`).join("");
}

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

// Vẽ lại cả 2 danh sách và cập nhật 2 ô "Số bước"
function renderAllSteps() {
    renderQuickSteps();
    renderSteps();
    stepCountInputs.forEach(input => { input.value = steps.length; });
}

// Đặt số bước = count cho cả 2 phần
function setStepCount(count) {
    count = Math.max(0, Math.min(MAX_STEPS, toInt(count)));
    if (count === steps.length) { renderAllSteps(); return; }

    if (count > steps.length) {
        while (steps.length < count) steps.push(newStep());
    } else {
        // Bớt bước: nếu các bước bị bỏ đã có nội dung thì hỏi lại trước
        const removed = steps.slice(count);
        if (removed.some(stepHasContent)) {
            const ok = window.confirm(`Các bước từ ${count + 1} đến ${steps.length} đã có nội dung. Xóa các bước này ở cả hai phần hướng dẫn?`);
            if (!ok) { renderAllSteps(); return; }
        }
        removed.forEach(step => { if (step.preview) URL.revokeObjectURL(step.preview); });
        steps = steps.slice(0, count);
    }
    renderAllSteps();
    scheduleDraft();
}

function addStep(focusSelector) {
    if (steps.length >= MAX_STEPS) { setStatus(`Tối đa ${MAX_STEPS} bước.`, "error"); return; }
    steps.push(newStep());
    renderAllSteps();
    document.querySelector(`[${focusSelector}="${steps.length - 1}"]`)?.focus();
    scheduleDraft();
}

function removeStep(index) {
    const step = steps[index];
    if (!step) return;
    if (stepHasContent(step) && !window.confirm(`Xóa bước ${index + 1} ở cả Hướng dẫn ngắn gọn và Hướng dẫn cụ thể?`)) return;
    if (step.preview) URL.revokeObjectURL(step.preview);
    steps.splice(index, 1);
    renderAllSteps();
    scheduleDraft();
}

// Ô "Số bước": gõ số rồi bấm ra ngoài / Enter, hoặc bấm nút tăng giảm
stepCountInputs.forEach(input => {
    input.addEventListener("change", () => setStepCount(input.value));
    input.addEventListener("keydown", event => {
        if (event.key === "Enter") { event.preventDefault(); setStepCount(input.value); }
    });
    const wrapper = input.closest(".small-input__wrapper");
    wrapper.querySelector(".step-count__up").addEventListener("click", () => setStepCount(steps.length + 1));
    wrapper.querySelector(".step-count__down").addEventListener("click", () => setStepCount(steps.length - 1));
});

addQuickBtn.addEventListener("click", () => addStep("data-quick"));
addStepBtn.addEventListener("click", () => addStep("data-step-text"));

quickContainer.addEventListener("input", event => {
    const textarea = event.target.closest("textarea");
    if (!textarea) return;
    steps[Number(textarea.dataset.quick)].quick = textarea.value;
    scheduleDraft();
});

quickContainer.addEventListener("click", event => {
    const btn = event.target.closest("[data-quick-remove]");
    if (btn) removeStep(Number(btn.dataset.quickRemove));
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
        removeStep(Number(removeButton.dataset.stepRemove));
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
        title: nameInput.value, category: categoryName(), cost: priceInput.value,
        servings: servingsInput.value, prep: prepTimeInput.value, cook: cookTimeInput.value,
        region: regionInput.value, tested: testedInput.checked,
        description: descriptionInput.value, quickSteps: steps.map(step => step.quick),
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
    regionInput.value = draft.region || "";
    testedInput.checked = !!draft.tested;
    // Bản nháp lưu 2 mảng chữ riêng: ghép lại theo số thứ tự, mảng nào ngắn hơn thì bù chuỗi rỗng
    const quickList = draft.quickSteps || [];
    const textList = draft.steps || [];
    const count = Math.min(MAX_STEPS, Math.max(quickList.length, textList.length));
    steps = [];
    for (let i = 0; i < count; i++) {
        steps.push({ quick: quickList[i] || "", text: textList[i] || "", file: null, preview: "" });
    }
    NUTRIENTS.forEach(nutrientId => {
        const element = document.getElementById(nutrientId);
        if (!element || !draft.nutrition) return;
        element.value = draft.nutrition[nutrientId] || "";
        element.dataset.manual = element.value !== "" ? "1" : ""; // giữ số đã có, bấm TÍNH TỰ ĐỘNG để tính lại
    });
    renderAllSteps();
    showRegionHint();
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
/* Điền form từ công thức có sẵn (dùng chung cho Mẫu, Cải tiến,        */
/* và gợi ý khi gõ tên món)                                            */
/* ------------------------------------------------------------------ */

// Chuỗi đại diện cho danh sách nguyên liệu, để so sánh xem người dùng có đổi gì không
function ingredientKey(list) {
    return (list || [])
        .map(item => item.ingredientId + "|" + Number(item.qty) + "|" + item.unit)
        .sort()
        .join(",");
}

function formHasContent() {
    return !isDraftEmpty(collectDraft());
}

// mode: "template" (dùng mẫu) hoặc "fork" (cải tiến công thức người khác)
function fillFormFromRecipe(recipe, mode) {
    nameInput.value = recipe.name || recipe.title || "";

    const opt = Array.from(categoryInput.options).find(option => option.value === recipe.category || option.textContent.trim() === recipe.category);
    categoryInput.value = opt ? opt.value : "";

    priceInput.value = recipe.costTotal ? new Intl.NumberFormat("vi-VN").format(recipe.costTotal) : "";
    servingsInput.value = recipe.baseServings || 1;
    prepTimeInput.value = recipe.prepTime || "";
    cookTimeInput.value = recipe.cookTime || "";
    descriptionInput.value = recipe.description || "";

    // Vùng miền: lấy từ tag của công thức (nếu có)
    const regionTag = (recipe.tags || []).find(tag => REGION_RULES[tag]);
    regionInput.value = regionTag || "";
    regionApplied = "";
    showRegionHint();

    // Các bước: ghép phần ngắn gọn và phần cụ thể theo số thứ tự. Ảnh của bước KHÔNG chép (người dùng tự thêm ảnh của mình).
    const quickList = recipe.quickSteps || [];
    const detailList = recipe.steps || [];
    const count = Math.min(MAX_STEPS, Math.max(quickList.length, detailList.length));
    steps.forEach(step => { if (step.preview) URL.revokeObjectURL(step.preview); });
    steps = [];
    for (let i = 0; i < count; i++) {
        const detail = detailList[i];
        let text = detail ? (Array.isArray(detail.text) ? detail.text.join("\n") : (detail.text || "")) : "";
        // Công thức gốc thiếu bước cụ thể thì tạm lấy chữ của bước ngắn gọn để 2 phần khớp nhau
        if (!text.trim()) text = quickList[i] || "";
        steps.push({ quick: quickList[i] || "", text, file: null, preview: "" });
    }
    renderAllSteps();

    // Dinh dưỡng: "520 kcal" -> 520
    const nutrition = recipe.nutrition || {};
    NUTRIENTS.forEach(nutrientId => {
        const element = document.getElementById(nutrientId);
        if (!element) return;
        element.value = firstNumber(nutrition[nutrientId]);
        element.dataset.manual = element.value !== "" ? "1" : "";
    });

    // Nguyên liệu
    const items = (recipe.ingredients || []).map(item => ({ ingredientId: item.ingredientId, qty: item.qty, unit: item.unit }));
    if (picker) picker.setItems(items);
    else draftIngredients = items;

    // Ghi nhớ công thức gốc để kiểm tra lúc đăng
    baseRecipe = {
        mode,
        id: recipe.id,
        name: recipe.name || recipe.title || "",
        ingredientKey: ingredientKey(items),
        stepTexts: steps.map(step => normalizeText(step.text)) // nội dung bước đúng như lúc vừa điền
    };

    startFromCurrent.hidden = false;
    if (mode === "fork") {
        startFromCurrent.innerHTML = `Đang <b>cải tiến</b> từ: <a href="${esc(window.NomNom.recipeUrl(recipe.id))}">${esc(baseRecipe.name)}</a>. Bạn cần <b>đổi tên</b>, <b>đổi nguyên liệu</b> và <b>sửa ít nhất 1 bước</b> mới đăng được.`;
    } else {
        startFromCurrent.innerHTML = `Đang dùng mẫu: <b>${esc(baseRecipe.name)}</b>. Hãy đặt tên mới và sửa lại cho đúng cách nấu của bạn.`;
    }
    setStatus("Đã điền sẵn nội dung. Hình ảnh món và ảnh từng bước bạn cần tự thêm.", "info");
    scheduleDraft();
}

async function useRecipe(recipeId, mode) {
    if (formHasContent() && !window.confirm("Thay nội dung đang nhập bằng công thức này?")) return;
    try {
        const recipe = await api.get("/recipes/" + encodeURIComponent(recipeId), { history: 0 });
        fillFormFromRecipe(recipe, mode);
        nameSuggestions.hidden = true;
        nameInput.focus();
    } catch (error) {
        setStatus("Không tải được công thức: " + (error.message || ""), "error");
    }
}

// Danh sách mẫu
function renderTemplates() {
    TEMPLATES.forEach(template => {
        const opt = document.createElement("option");
        opt.value = template.id;
        opt.textContent = template.label;
        templateSelect.appendChild(opt);
    });
}

templateApplyBtn.addEventListener("click", () => {
    if (!templateSelect.value) { setStatus("Hãy chọn một món mẫu trước.", "error"); return; }
    useRecipe(templateSelect.value, "template");
});

/* ------------------------------------------------------------------ */
/* Gợi ý món đã có khi gõ tên                                          */
/* ------------------------------------------------------------------ */

let nameTimer = null;

async function suggestByName() {
    const query = nameInput.value.trim();
    if (query.length < 3) { nameSuggestions.hidden = true; return; }
    try {
        const data = await api.get("/recipes", { q: query, limit: 4 });
        // Bỏ chính công thức gốc đang dùng (nếu có)
        const items = (data.items || []).filter(item => !baseRecipe || item.id !== baseRecipe.id);
        if (!items.length) { nameSuggestions.hidden = true; return; }
        nameSuggestions.innerHTML =
            `<li class="name-suggestions__title">Món này đã có trên NomNom, bạn có muốn dùng làm mẫu?</li>` +
            items.map(item => `
                <li class="name-suggestions__item">
                    <a href="${esc(window.NomNom.recipeUrl(item.id))}" target="_blank" rel="noopener">${esc(item.name || item.title)}</a>
                    <button type="button" data-use-recipe="${esc(item.id)}">DÙNG LÀM MẪU</button>
                </li>`).join("");
        nameSuggestions.hidden = false;
    } catch (error) {
        nameSuggestions.hidden = true;
    }
}

nameInput.addEventListener("input", () => {
    clearTimeout(nameTimer);
    nameTimer = setTimeout(suggestByName, 400); // đợi người dùng gõ xong một chút rồi mới tìm
});

nameSuggestions.addEventListener("click", event => {
    const btn = event.target.closest("[data-use-recipe]");
    if (btn) useRecipe(btn.dataset.useRecipe, "template");
});

/* ------------------------------------------------------------------ */
/* Vùng miền                                                           */
/* ------------------------------------------------------------------ */

function showRegionHint() {
    const rule = REGION_RULES[regionInput.value];
    regionHint.hidden = !rule;
    regionApplyBtn.hidden = !rule;
    regionHint.textContent = rule ? rule.hint : "";
}

regionInput.addEventListener("change", () => {
    regionApplied = "";
    showRegionHint();
});

regionApplyBtn.addEventListener("click", () => {
    const region = regionInput.value;
    const rule = REGION_RULES[region];
    if (!rule || !picker) return;
    if (regionApplied === region) { setStatus(`Đã áp dụng gợi ý ${region} rồi.`, "info"); return; }

    const changed = [];
    const items = picker.getItems().map(item => {
        const factor = rule.change[item.ingredientId];
        if (!factor || !(Number(item.qty) > 0)) return item;
        const newQty = Math.round(Number(item.qty) * factor * 10) / 10; // làm tròn 1 chữ số thập phân
        changed.push(`${item.name}: ${item.qty} → ${newQty} ${item.unit}`);
        return { ...item, qty: newQty };
    });

    if (!changed.length) { setStatus("Công thức chưa có nguyên liệu nào cần chỉnh theo gợi ý này.", "info"); return; }
    picker.setItems(items);
    regionApplied = region;
    setStatus("Đã chỉnh theo " + region + ": " + changed.join("; "), "ok");
});

/* ------------------------------------------------------------------ */
/* Tự tính dinh dưỡng từ nguyên liệu                                   */
/*   gram = số lượng đổi ra gram (g, kg, ml, lít, muỗng, hoặc          */
/*          số quả × gramsPerUnit)                                     */
/*   chất = per100g × gram / 100, cộng tất cả rồi chia cho khẩu phần   */
/* ------------------------------------------------------------------ */

async function loadNutritionData() {
    try {
        const response = await fetch("/data/nutrition.json");
        if (!response.ok) throw new Error(response.status);
        nutritionData = await response.json();
    } catch (error) {
        nutritionData = null;
        nutritionAutoBtn.disabled = true;
        nutritionAutoNote.textContent = "Không tải được dữ liệu dinh dưỡng, bạn hãy tự nhập.";
    }
}

async function loadUnits() {
    try {
        const data = await api.get("/ingredients");
        catalogUnits = data.units || {};
    } catch (error) {
        catalogUnits = {};
    }
}

// Đổi số lượng của 1 nguyên liệu ra gram. Trả về null nếu không đổi được.
function gramsOf(item) {
    const qty = Number(item.qty);
    if (!(qty > 0)) return null;
    const unit = catalogUnits[item.unit];
    if (!unit) return null;
    if (unit.dimension === "mass") return qty * unit.toBase;     // g, kg
    if (unit.dimension === "volume") return qty * unit.toBase;   // ml, lít, muỗng: tạm coi 1ml ≈ 1g
    const perUnit = nutritionData.gramsPerUnit[item.ingredientId]; // quả, củ, ổ...
    return perUnit ? qty * perUnit : null;
}

function calcNutrition() {
    if (!nutritionData) return;
    const items = pickerItems;
    const servings = toInt(servingsInput.value) || 1;
    const total = { calories: 0, carbs: 0, protein: 0, fat: 0, sodium: 0, fiber: 0 };
    const missing = [];
    let counted = 0;

    items.forEach(item => {
        const per100 = nutritionData.per100g[item.ingredientId];
        const grams = per100 ? gramsOf(item) : null;
        if (!per100 || grams == null) { if (Number(item.qty) > 0) missing.push(item.name); return; }
        NUTRIENTS.forEach(nutrientId => { total[nutrientId] += (per100[nutrientId] || 0) * grams / 100; });
        counted++;
    });

    if (!counted) {
        if (items.length) nutritionAutoNote.textContent = "Chưa tính được: hãy nhập số lượng cho nguyên liệu.";
        return;
    }

    // Chỉ điền vào ô người dùng chưa tự sửa
    NUTRIENTS.forEach(nutrientId => {
        const element = document.getElementById(nutrientId);
        if (!element || element.dataset.manual === "1") return;
        const perServing = total[nutrientId] / servings;
        element.value = nutrientId === "calories" || nutrientId === "sodium" ? Math.round(perServing) : Math.round(perServing * 10) / 10;
    });

    let note = `Đã tự tính cho 1 khẩu phần (công thức ${servings} khẩu phần) từ ${counted} nguyên liệu. Bạn vẫn có thể sửa lại.`;
    if (missing.length) note += " Chưa có dữ liệu: " + missing.join(", ") + ".";
    nutritionAutoNote.textContent = note;
}

// Người dùng tự gõ vào ô dinh dưỡng -> đánh dấu, lần tính sau không ghi đè ô đó
NUTRIENTS.forEach(nutrientId => {
    document.getElementById(nutrientId)?.addEventListener("input", event => {
        event.target.dataset.manual = event.target.value !== "" ? "1" : "";
    });
});

// Bấm TÍNH TỰ ĐỘNG: bỏ hết đánh dấu, tính lại toàn bộ
nutritionAutoBtn.addEventListener("click", () => {
    NUTRIENTS.forEach(nutrientId => {
        const element = document.getElementById(nutrientId);
        if (element) element.dataset.manual = "";
    });
    calcNutrition();
    scheduleDraft();
});

servingsInput.addEventListener("change", calcNutrition);
servingsInput.closest(".small-input__wrapper")?.addEventListener("click", calcNutrition);

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
    else if (ingredients.some(i => !(Number(i.qty) > 0))) {
        const noQty = ingredients.filter(i => !(Number(i.qty) > 0)).map(i => i.name).join(", ");
        add(document.getElementById("ingredient-picker"), "Nhập số lượng (lớn hơn 0) cho tất cả nguyên liệu. Còn thiếu: " + noQty + ".");
    }

    const filled = steps.filter(step => step.text.trim());
    if (!filled.length) add(addStepBtn, "Vui lòng thêm ít nhất 1 bước trong hướng dẫn cụ thể.");
    else steps.forEach((step, i) => {
        if (!step.text.trim()) add(stepsContainer.querySelector(`[data-step-text="${i}"]`), `Bước ${i + 1} ở Hướng dẫn cụ thể đang để trống: hãy nhập nội dung hoặc xóa bước.`);
    });

    // Dùng mẫu / cải tiến: tên phải khác công thức gốc
    if (baseRecipe && normalizeText(nameInput.value) === normalizeText(baseRecipe.name)) {
        add(nameInput, "Hãy đặt tên mới, khác với tên công thức gốc.");
    }
    // Cải tiến: bắt buộc đổi nguyên liệu và sửa ít nhất 1 bước
    if (baseRecipe && baseRecipe.mode === "fork") {
        if (ingredients.length && ingredientKey(ingredients) === baseRecipe.ingredientKey) {
            add(document.getElementById("ingredient-picker"), "Bạn cần thay đổi nguyên liệu (thêm, bớt hoặc đổi số lượng) so với công thức gốc.");
        }
        const nowTexts = steps.map(step => normalizeText(step.text));
        const sameSteps = nowTexts.length === baseRecipe.stepTexts.length && nowTexts.every((text, i) => text === baseRecipe.stepTexts[i]);
        if (filled.length && sameSteps) add(addStepBtn, "Bạn cần sửa nội dung ít nhất 1 bước so với công thức gốc.");
    }

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
    // Số liệu dinh dưỡng tính cho 1 khẩu phần (giống dữ liệu mẫu trong db.json: servings = 1)
    const out = { servings: 1 };
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
            category: categoryName(),
            time: prepTime + cookTime,
            prepTime,
            cookTime,
            servings,
            baseServings: servings,
            costTotal: toInt(priceInput.value),
            ingredients: pickerItems.map(i => ({
                ingredientId: i.ingredientId, name: i.name, quantity: Number(i.qty), qty: Number(i.qty), unit: i.unit
            })),
            quickSteps: steps.map(step => step.quick.trim()).filter(Boolean),
            steps: stepPayload,
            nutrition: nutritionPayload(),
            // Tag vùng miền viết giống bộ lọc ở trang Danh mục ("Miền Bắc"...) để lọc được
            tags: regionInput.value ? [regionInput.value] : [],
            tested: testedInput.checked,
            forkOf: baseRecipe && baseRecipe.mode === "fork" ? baseRecipe.id : null
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
    renderTemplates();
    await Promise.all([loadCategories(), loadUnits(), loadNutritionData()]);

    // Trang mở từ nút CẢI TIẾN: /pages/upload.html?fork=<id> -> không khôi phục bản nháp
    const forkId = new URLSearchParams(window.location.search).get("fork");

    const draft = forkId ? null : loadDraft();
    applyDraft(draft);
    if (draft && !isDraftEmpty(draft)) {
        draftClearBtn.hidden = false;
        setStatus("Đã khôi phục bản nháp gần nhất. Hãy chọn lại ảnh trước khi đăng.", "info");
    }

    try {
        picker = await createIngredientPicker(document.getElementById("ingredient-picker"), {
            onChange(items) {
                pickerItems = items;
                calcNutrition();
                scheduleDraft();
            }
        });
        if (draftIngredients.length) picker.setItems(draftIngredients);
    } catch (error) {
        console.error(error);
    }

    if (forkId) {
        try {
            const recipe = await api.get("/recipes/" + encodeURIComponent(forkId), { history: 0 });
            fillFormFromRecipe(recipe, "fork");
        } catch (error) {
            setStatus("Không tìm thấy công thức để cải tiến.", "error");
        }
    }

    renderAllSteps();
    initScrollSpy();
}

init().catch(error => console.error(error));
