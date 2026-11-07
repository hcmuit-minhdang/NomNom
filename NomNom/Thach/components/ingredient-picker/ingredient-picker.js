/* ------------------------------------------------------------------ */
/* Ingredient picker                                                   */
/*   Tra cứu nguyên liệu trong catalog thay vì cho người dùng gõ tay.   */
/*   Mỗi nguyên liệu đã chọn có dạng: { ingredientId, qty, unit }.      */
/*   Dùng được ở cả trang tạo công thức và trang so sánh giá.           */
/* ------------------------------------------------------------------ */

(function (global) {
    "use strict";

    const MAX_SUGGESTIONS = 12;
    let instanceCount = 0;

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char]));
    }

    // "Gạo tấm" -> "gao tam", để gõ không dấu vẫn tìm được.
    function normalize(text) {
        return String(text ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .toLowerCase()
            .trim();
    }

    async function loadJson(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
        return response.json();
    }

    function toQty(value) {
        if (value === "" || value == null) return null;
        const number = Number(value);
        return Number.isFinite(number) ? number : null;
    }

    async function createIngredientPicker(root, options = {}) {
        if (!root) throw new Error("createIngredientPicker: thiếu element gốc");
        if (!options.ingredientsUrl || !options.unitsUrl) {
            throw new Error("createIngredientPicker: cần ingredientsUrl và unitsUrl");
        }

        const onChange = typeof options.onChange === "function" ? options.onChange : () => {};
        let catalog;
        let units;

        try {
            [catalog, units] = await Promise.all([
                loadJson(options.ingredientsUrl),
                loadJson(options.unitsUrl)
            ]);
        } catch (error) {
            root.innerHTML = `<p class="ip-error">Không tải được dữ liệu nguyên liệu. Hãy chạy local server thay vì mở file://.</p>`;
            throw error;
        }

        const byId = new Map(catalog.map(ingredient => [ingredient.id, ingredient]));
        const searchText = new Map(catalog.map(ingredient => [
            ingredient.id,
            normalize([ingredient.name, ...(ingredient.aliases || [])].join(" "))
        ]));

        const instanceId = `ip-${++instanceCount}`;
        const listboxId = `${instanceId}-listbox`;

        let items = [];
        let suggestions = [];
        let activeIndex = -1;

        root.classList.add("ip");
        root.innerHTML = `
            <div class="ip-combobox">
                <div class="ip-search">
                    <span class="ip-pills" data-ip="pills"></span>
                    <input
                        class="ip-input"
                        data-ip="input"
                        type="text"
                        autocomplete="off"
                        spellcheck="false"
                        placeholder="Tìm nguyên liệu, ví dụ: gạo, trứng, mắm..."
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded="false"
                        aria-controls="${listboxId}"
                    />
                </div>
                <ul class="ip-suggestions" data-ip="suggestions" id="${listboxId}" role="listbox" hidden></ul>
                <p class="ip-no-match" data-ip="no-match" role="status" hidden>Không tìm thấy nguyên liệu phù hợp.</p>
            </div>
            <div class="ip-sheet" data-ip="sheet"></div>`;

        const els = {
            pills: root.querySelector('[data-ip="pills"]'),
            input: root.querySelector('[data-ip="input"]'),
            suggestions: root.querySelector('[data-ip="suggestions"]'),
            noMatch: root.querySelector('[data-ip="no-match"]'),
            sheet: root.querySelector('[data-ip="sheet"]')
        };

        /* ---------------- Dữ liệu ---------------- */

        function getItems() {
            return items.map(item => ({ ...item }));
        }

        function setItems(nextItems) {
            items = (nextItems || []).reduce((result, item) => {
                const ingredient = byId.get(item && item.ingredientId);
                if (!ingredient) return result;

                const allowedUnits = unitsFor(ingredient);
                const unit = allowedUnits.includes(item.unit) ? item.unit : ingredient.defaultUnit;
                result.push({ ingredientId: ingredient.id, qty: toQty(item.qty), unit });
                return result;
            }, []);

            renderAll();
            emit();
        }

        function clear() {
            setItems([]);
        }

        function emit() {
            onChange(getItems());
        }

        function unitsFor(ingredient) {
            // Catalog có thể giới hạn đơn vị riêng (vd: trứng chỉ quả/trái);
            // nếu không thì lấy mọi đơn vị cùng dimension.
            if (Array.isArray(ingredient.units) && ingredient.units.length > 0) {
                return ingredient.units.filter(unitId => units[unitId]);
            }

            return Object.entries(units)
                .filter(([, unit]) => unit.dimension === ingredient.dimension)
                .map(([id]) => id);
        }

        function unitLabel(unitId) {
            return units[unitId]?.label || unitId;
        }

        function nameOf(item) {
            return byId.get(item.ingredientId)?.name || item.ingredientId;
        }

        /* ---------------- Render ---------------- */

        function renderAll() {
            renderPills();
            renderSheet();
            closeSuggestions();
        }

        function renderPills() {
            els.pills.innerHTML = items.map((item, index) => `
                <span class="ip-pill">
                    ${escapeHtml(nameOf(item))}
                    <button
                        type="button"
                        class="ip-pill-remove"
                        data-remove-index="${index}"
                        aria-label="Xóa ${escapeHtml(nameOf(item))}"
                    >×</button>
                </span>`).join("");
        }

        function renderSheet() {
            if (items.length === 0) {
                els.sheet.innerHTML = `<p class="ip-sheet-empty">Chưa có nguyên liệu nào. Tìm ở ô phía trên rồi nhấn Enter để thêm.</p>`;
                return;
            }

            els.sheet.innerHTML = items.map((item, index) => {
                const name = nameOf(item);
                const options = unitsFor(byId.get(item.ingredientId)).map(unitId => `
                    <option value="${escapeHtml(unitId)}"${unitId === item.unit ? " selected" : ""}>${escapeHtml(unitLabel(unitId))}</option>`).join("");

                return `
                    <div class="ip-row" data-row-index="${index}">
                        <span class="ip-name">${escapeHtml(name)}</span>
                        <input
                            class="ip-qty"
                            data-role="qty"
                            type="number"
                            inputmode="decimal"
                            min="0"
                            step="any"
                            placeholder="SL"
                            value="${item.qty ?? ""}"
                            aria-label="Số lượng ${escapeHtml(name)}"
                        />
                        <select class="ip-unit" data-role="unit" aria-label="Đơn vị của ${escapeHtml(name)}">${options}</select>
                        <button type="button" class="ip-remove" data-role="remove" aria-label="Xóa ${escapeHtml(name)}">×</button>
                    </div>`;
            }).join("");
        }

        function renderSuggestions(query) {
            const normalizedQuery = normalize(query);
            const selectedIds = new Set(items.map(item => item.ingredientId));

            suggestions = catalog
                .filter(ingredient => !selectedIds.has(ingredient.id))
                .filter(ingredient => !normalizedQuery || searchText.get(ingredient.id).includes(normalizedQuery))
                .slice(0, MAX_SUGGESTIONS);

            activeIndex = -1;
            els.input.removeAttribute("aria-activedescendant");

            if (suggestions.length === 0) {
                els.suggestions.hidden = true;
                els.suggestions.innerHTML = "";
                els.noMatch.hidden = normalizedQuery === "";
                els.input.setAttribute("aria-expanded", "false");
                return;
            }

            els.noMatch.hidden = true;

            els.suggestions.innerHTML = suggestions.map((ingredient, index) => `
                <li
                    class="ip-option"
                    role="option"
                    id="${instanceId}-option-${index}"
                    data-suggestion-index="${index}"
                    aria-selected="false"
                >
                    <span class="ip-option-name">${escapeHtml(ingredient.name)}</span>
                    <span class="ip-option-unit">${escapeHtml(unitLabel(ingredient.defaultUnit))}</span>
                </li>`).join("");

            els.suggestions.hidden = false;
            els.input.setAttribute("aria-expanded", "true");
        }

        function setActive(index) {
            if (suggestions.length === 0) return;

            activeIndex = (index + suggestions.length) % suggestions.length;

            [...els.suggestions.querySelectorAll(".ip-option")].forEach((option, i) => {
                const isActive = i === activeIndex;
                option.classList.toggle("is-active", isActive);
                option.setAttribute("aria-selected", String(isActive));
            });

            els.input.setAttribute("aria-activedescendant", `${instanceId}-option-${activeIndex}`);
            els.suggestions.children[activeIndex].scrollIntoView({ block: "nearest" });
        }

        function closeSuggestions() {
            suggestions = [];
            activeIndex = -1;
            els.suggestions.hidden = true;
            els.suggestions.innerHTML = "";
            els.noMatch.hidden = true;
            els.input.setAttribute("aria-expanded", "false");
            els.input.removeAttribute("aria-activedescendant");
        }

        /* ---------------- Hành động ---------------- */

        function addItem(ingredient) {
            if (!ingredient) return;

            items.push({
                ingredientId: ingredient.id,
                qty: null,
                unit: ingredient.defaultUnit
            });

            els.input.value = "";
            renderAll();
            emit();
            els.input.focus();
        }

        function removeItem(index) {
            if (index < 0 || index >= items.length) return;
            items.splice(index, 1);
            renderAll();
            emit();
        }

        /* ---------------- Sự kiện ---------------- */

        els.input.addEventListener("input", () => renderSuggestions(els.input.value));
        els.input.addEventListener("focus", () => renderSuggestions(els.input.value));

        els.input.addEventListener("keydown", event => {
            if (event.isComposing) return;

            if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive(activeIndex + 1);
                return;
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive(activeIndex - 1);
                return;
            }

            if (event.key === "Enter") {
                event.preventDefault();
                if (activeIndex >= 0) addItem(suggestions[activeIndex]);
                else if (suggestions.length === 1) addItem(suggestions[0]);
                return;
            }

            if (event.key === "Escape") {
                closeSuggestions();
                return;
            }

            if (event.key === "Backspace" && els.input.value === "" && items.length > 0) {
                removeItem(items.length - 1);
            }
        });

        // pointerdown + preventDefault để input không bị blur trước khi chọn.
        els.suggestions.addEventListener("pointerdown", event => {
            const option = event.target.closest("[data-suggestion-index]");
            if (!option) return;
            event.preventDefault();
            addItem(suggestions[Number(option.dataset.suggestionIndex)]);
        });

        els.pills.addEventListener("click", event => {
            const button = event.target.closest("[data-remove-index]");
            if (!button) return;
            removeItem(Number(button.dataset.removeIndex));
            els.input.focus();
        });

        els.sheet.addEventListener("input", event => {
            if (!event.target.matches('[data-role="qty"]')) return;
            const row = event.target.closest("[data-row-index]");
            if (!row) return;
            items[Number(row.dataset.rowIndex)].qty = toQty(event.target.value);
            emit();
        });

        els.sheet.addEventListener("change", event => {
            if (!event.target.matches('[data-role="unit"]')) return;
            const row = event.target.closest("[data-row-index]");
            if (!row) return;
            items[Number(row.dataset.rowIndex)].unit = event.target.value;
            emit();
        });

        els.sheet.addEventListener("click", event => {
            const button = event.target.closest('[data-role="remove"]');
            if (!button) return;
            const row = button.closest("[data-row-index]");
            if (!row) return;
            removeItem(Number(row.dataset.rowIndex));
            els.input.focus();
        });

        function handleOutsidePointerDown(event) {
            if (!root.contains(event.target)) closeSuggestions();
        }

        document.addEventListener("pointerdown", handleOutsidePointerDown);

        // Trạng thái ban đầu + thông báo cho trang đang dùng component.
        renderAll();
        emit();

        return {
            getItems,
            setItems,
            clear,
            destroy() {
                document.removeEventListener("pointerdown", handleOutsidePointerDown);
                root.classList.remove("ip");
                root.innerHTML = "";
            }
        };
    }

    global.createIngredientPicker = createIngredientPicker;
})(window);
