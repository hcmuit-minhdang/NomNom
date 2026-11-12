import { createIngredientPicker } from "./ingredient-picker.js";

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
    container.querySelector(`#step-${stepList.length - 1}`).focus();
}

function removeStep(index) {
    if (index < 0 || index >= stepList.length) return;
    stepList.splice(index, 1);
    renderSteps();
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

    await createIngredientPicker(document.getElementById("ingredient-picker"), {
        ingredientsUrl: `${DATA_PATH}ingredients.json`,
        unitsUrl: `${DATA_PATH}units.json`,
        onChange(items) {
            draft.ingredients = items;
        }
    });
}

init().catch(error => console.error(error));
