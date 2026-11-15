import { createIngredientPicker } from "./ingredient-picker.js";
const SCROLLSPY_OFFSET = 140;

const DATA_PATH = "../data/";

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

async function loadJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
    return response.json();
}

function slugify(text) {
    return text
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/gi, "d")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function finalizeRecipe(draft) {
    return {
        id: slugify(draft.title),          // write-once
        ...draft,
        uploaded: new Date().toISOString().slice(0, 10),
        ratingScore: 0,
        reviewCount: 0
    };
}

/* ------------------------------------------------------------------ */
/* Trang                                                               */
/* ------------------------------------------------------------------ */

const priceInput = document.getElementById("price-input");

// Hiển thị chi phí dạng 25.000 trong lúc gõ.
priceInput.addEventListener("input", event => {
    const digits = event.target.value.replace(/\D/g, "");
    event.target.value = digits ? new Intl.NumberFormat("vi-VN").format(digits) : "";
});

let servingsInput = document.getElementById("servings-input");
let prepTimeInput = document.getElementById("prepTime-input");
let cookTimeInput = document.getElementById("cookTime-input");

function update(inputField) {
    const wrapper = inputField.closest(".small-input-wrapper");
    if(!wrapper) return;

    const upButton = wrapper.querySelector(".upBtn");
    const downButton = wrapper.querySelector(".downBtn");
    const min = Number(inputField.min) || 0;

    upButton?.addEventListener("click", () => {
        inputField.value = Number(inputField.value) + 1;
    });
    
    downButton?.addEventListener("click", () => {
        inputField.value = Math.max(min, Number(inputField.value) - 1);
    });
}

let stepList = [];

const container = document.getElementById("quick-step-list");
const addStepBtn = document.getElementById("add-step-btn");

function renderSteps() {
    container.innerHTML = stepList.map((text, index) => 
        `<li>
            <span class="quick-step-number">${index + 1}</span>
            <textarea class="textarea-input" id="step-${index}" name="quickSteps" data-step="${index}" placeholder="Thêm bước ${index + 1}">${escapeHtml(text)}</textarea>
            <button type="button" class="remove-step-btn" data-step="${index}" data-action="remove">XÓA</button>
        </li>`).join("");
}

function addStep() {
    stepList.push("");
    renderSteps();
    container.querySelector(`#step-${stepList.length - 1}`);
}

function removeStep(index) {
    if (index < 0 || index >= stepList.length) return;
    stepList.splice(index, 1);
    renderSteps();
}

let detailedStepList = [];

const dSContainer = document.getElementById("detailed-steps-container");
const addDSBtn = document.querySelector(".add-detailed-step-btn");

function renderDetailedSteps() {
    dSContainer.innerHTML = detailedStepList.map((text, index) => 
        `<li>
            <span class="step-label">BƯỚC ${index + 1}</span>
            <textarea class="textarea-input" id="ds-${index}" name="steps" data-detailed-step="${index}" placeholder="Thêm bước ${index + 1}">${escapeHtml(text)}</textarea>
            <label for="gallery-images" class="image-upload">
                <img src="../assets/imageFile.svg" alt="" class="image-upload-icon">
                <span class="image-upload-text">Nhấn vào đây để đăng tải hình ảnh</span>
            </label>
            <input type="file" name="images" accept="image/*" multiple>
            <button type="button" class="remove-step-btn remove-DS-Btn" data-step="${index}" data-action="remove">XÓA</button>
        </li>`).join("");
}

function addDetailedStep() {
    detailedStepList.push("");
    renderDetailedSteps();
}

function removeDetailedStep(index) {
    if (index < 0 || index >= detailedStepList.length) return;
    detailedStepList.splice(index, 1);
    renderDetailedSteps();
}

/* Srollspy */

function initScrollSpy() {
    const items = [...document.querySelectorAll('.toc a[href^="#"]')]
        .map(link => ({
            link,
            section: document.getElementById(link.getAttribute("href").slice(1))
        })).filter(item => item.section);

    if (items.length === 0) return;

    let activeLink = null;
    let ticking = false;

    function setActive(link) {
        if (link === activeLink) return;
        activeLink = link;

        document.querySelectorAll(".toc .toc-current").forEach(el => el.classList.remove("toc-current"));
        document.querySelectorAll(".toc .toc-active").forEach(el => el.classList.remove("toc-active"));

        const marker = link.closest("li") || link;
        marker.classList.add("toc-current");

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

async function init() {
    const [draft, catalog] = await Promise.all([
        loadJson(`${DATA_PATH}recipe-template.json`),
        loadJson(`${DATA_PATH}ingredients.json`)
    ]);

    const byId = new Map(catalog.map(ingredient => [ingredient.id, ingredient]));

    update(servingsInput);
    update(prepTimeInput);
    update(cookTimeInput);

    addStepBtn.addEventListener("click", addStep);
    addDSBtn.addEventListener("click", addDetailedStep);

    container.addEventListener("input", (event) => {
        const textarea = event.target.closest("textarea");
        if (!textarea) return;
        stepList[Number(textarea.dataset.step)] = textarea.value;
    });

    container.addEventListener("click", (event) => {
        const button = event.target.closest('[data-action="remove"]');
        if (!button) return;
        removeStep(Number(button.dataset.step));
    })

    dSContainer.addEventListener("input", (event) => {
        const textarea = event.target.closest("textarea");
        if (!textarea) return;
        detailedStepList[Number(textarea.dataset.step)] = textarea.value;
    });

    dSContainer.addEventListener("click", (event) => {
        const button = event.target.closest('[data-action="remove"]');
        if (!button) return;
        removeDetailedStep(Number(button.dataset.step));
    })

    await createIngredientPicker(document.getElementById("ingredient-picker"), {
        ingredientsUrl: `${DATA_PATH}ingredients.json`,
        unitsUrl: `${DATA_PATH}units.json`,
        onChange(items) {
            draft.ingredients = items;
        }
    });

    initScrollSpy();
}

init().catch(error => console.error(error));
