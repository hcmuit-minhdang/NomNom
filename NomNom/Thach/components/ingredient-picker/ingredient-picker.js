/* ------------------------------------------------------------------ */
/* Ingredient picker                                                   */
/*   Tra cứu nguyên liệu trong catalog thay vì cho người dùng gõ tay.   */
/*   Mỗi nguyên liệu đã chọn có dạng: { ingredientId, qty, unit }      */
/*   — khớp thẳng field "ingredients" của data/recipe-template.json.    */
/*   Dùng được ở cả trang tạo công thức và trang so sánh giá.           */
/* ------------------------------------------------------------------ */

const MAX_SUGGESTIONS = 12;
let instanceCount = 0;

/* ---------- Hàm phụ, không đụng DOM ---------- */

// Chặn HTML lạ trước khi đổ dữ liệu JSON vào innerHTML.
function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (ch) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
}

// "Gạo tấm" -> "gao tam": bỏ dấu để gõ không dấu vẫn tìm được.
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

// "" -> null, "5" -> 5, "abc" -> null
function toQty(value) {
    if (value === "" || value == null) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

/* ---------- Component ---------- */

export async function createIngredientPicker(root, options = {}) {
    if (!root) throw new Error("createIngredientPicker: thiếu element gốc");
    if (!options.ingredientsUrl || !options.unitsUrl) {
        throw new Error("createIngredientPicker: cần ingredientsUrl và unitsUrl");
    }

    const onChange = typeof options.onChange === "function" ? options.onChange : function () {};

    /* 1. Nạp dữ liệu */
    let ingredients;
    let units;

    try {
        const loaded = await Promise.all([
            loadJson(options.ingredientsUrl),
            loadJson(options.unitsUrl)
        ]); //load ingredients.json and units.json path
        ingredients = loaded[0];
        units = loaded[1];
    } catch (error) {
        root.innerHTML = `<p class="ip-error">Không tải được dữ liệu nguyên liệu. Hãy chạy local server thay vì mở file://.</p>`;
        throw error;
    }

    // Tính sẵn chuỗi tìm kiếm, không phải normalize lại mỗi lần gõ.
    ingredients.forEach(function (ingredient) {
        ingredient.searchText = normalize(
            [ingredient.name].concat(ingredient.aliases || []).join(" ")
        );
        //normalize ingredients to searchable input
    });

    /* 2. Trạng thái */
    let items = [];    // nguyên liệu đã chọn  (model duy nhất)
    let matches = [];  // gợi ý đang hiển thị

    /* 3. Dựng khung HTML */
    const instanceId = "ip-" + (++instanceCount);

    root.classList.add("ip");
    root.innerHTML =
        `<div class="ip-combobox">
            <div class="ip-search">
                <span class="ip-pills" data-part="pills"></span>
                <input class="ip-input" data-part="input" type="text"
                    autocomplete="off" spellcheck="false"
                    placeholder="Tìm nguyên liệu, ví dụ: gạo, trứng, mắm..."
                    role="combobox" aria-autocomplete="list" aria-expanded="false"
                    aria-controls="${instanceId}-list" />
            </div>
            <ul class="ip-suggestions" data-part="list" id="${instanceId}-list" role="listbox" hidden></ul>
            <p class="ip-no-match" data-part="no-match" role="status" hidden>Không tìm thấy nguyên liệu phù hợp.</p>
        </div>
        <div class="ip-sheet" data-part="sheet"></div>`;

    const els = {
        pills: root.querySelector('[data-part="pills"]'),
        input: root.querySelector('[data-part="input"]'),
        list: root.querySelector('[data-part="list"]'),
        noMatch: root.querySelector('[data-part="no-match"]'),
        sheet: root.querySelector('[data-part="sheet"]')
    };

    /* 4. Tra cứu */

    function findIngredient(id) {
        return ingredients.find(function (ingredient) { return ingredient.id === id; });
    }

    function allowedUnits(ingredient) {
        if (!ingredient) return [];

        // Catalog có thể giới hạn đơn vị riêng (vd: trứng chỉ quả/trái);
        // nếu không thì lấy mọi đơn vị cùng dimension.
        if (Array.isArray(ingredient.units) && ingredient.units.length > 0) {
            return ingredient.units.filter(function (unitId) { return units[unitId]; });
        }

        return Object.keys(units).filter(function (unitId) {
            return units[unitId].dimension === ingredient.dimension;
        });
    }

    function unitLabel(unitId) {
        return (units[unitId] && units[unitId].label) || unitId;
    }

    function nameOf(item) {
        const ingredient = findIngredient(item.ingredientId);
        return ingredient ? ingredient.name : item.ingredientId;
    }

    /* 5. Render — DOM luôn được dựng lại từ `items` */

    function render() {
        renderPills();
        renderRows();
        closeList();
    }

    function renderPills() {
        els.pills.innerHTML = items.map(function (item, index) {
            const name = nameOf(item);
            return `<span class="ip-pill">${escapeHtml(name)}<button type="button" class="ip-pill-remove" data-remove-index="${index}" aria-label="Xóa ${escapeHtml(name)}">×</button></span>`;
        }).join("");
    }

    function renderRows() {
        if (items.length === 0) {
            els.sheet.innerHTML = `<p class="ip-sheet-empty">Chưa có nguyên liệu nào. Tìm ở ô phía trên rồi nhấn Enter để thêm.</p>`;
            return;
        }

        els.sheet.innerHTML = items.map(function (item, index) {
            const name = nameOf(item);

            const optionsHtml = allowedUnits(findIngredient(item.ingredientId)).map(function (unitId) {
                const selected = unitId === item.unit ? " selected" : "";
                return `<option value="${escapeHtml(unitId)}"${selected}>${escapeHtml(unitLabel(unitId))}</option>`;
            }).join("");

            return `<div class="ip-row" data-row="${index}">
                
            <span class="ip-name">${escapeHtml(name)}</span>
               
            <input class="ip-qty" data-field="qty" type="number" inputmode="decimal" min="0" step="any" placeholder="SL" value="${item.qty ?? ""}" aria-label="Số lượng ${escapeHtml(name)}" />
                
            <select class="ip-unit" data-field="unit" aria-label="Đơn vị của ${escapeHtml(name)}">${optionsHtml}</select>
                
            <button type="button" class="ip-remove" data-action="remove" aria-label="Xóa ${escapeHtml(name)}">×</button>
            
            </div>`;
        }).join("");
    }

    function renderSuggestions() {
        const query = normalize(els.input.value);
        const chosenIds = items.map(function (item) { return item.ingredientId; });

        matches = ingredients
            .filter(function (ingredient) { return !chosenIds.includes(ingredient.id); })
            .filter(function (ingredient) { return !query || ingredient.searchText.includes(query); })
            .slice(0, MAX_SUGGESTIONS);

        if (matches.length === 0) {
            const hadQuery = query !== "";
            closeList();
            els.noMatch.hidden = !hadQuery;
            return;
        }

        els.list.innerHTML = matches.map(function (ingredient, index) {
            return `<li class="ip-option" role="option" data-option="${index}">
                <span class="ip-option-name">${escapeHtml(ingredient.name)}</span>
                <span class="ip-option-unit">${escapeHtml(unitLabel(ingredient.defaultUnit))}</span>
            </li>`;
        }).join("");

        els.list.hidden = false;
        els.noMatch.hidden = true;
        els.input.setAttribute("aria-expanded", "true");
    }

    function closeList() {
        matches = [];
        els.list.hidden = true;
        els.list.innerHTML = "";
        els.noMatch.hidden = true;
        els.input.setAttribute("aria-expanded", "false");
    }

    /* 6. Thay đổi dữ liệu */

    function getItems() {
        return items.map(function (item) {
            return { ingredientId: item.ingredientId, qty: item.qty, unit: item.unit };
        });
    }

    function setItems(nextItems) {
        items = [];

        (nextItems || []).forEach(function (candidate) {
            const ingredient = candidate && findIngredient(candidate.ingredientId);
            if (!ingredient) return;  // id lạ -> bỏ qua

            const unitOptions = allowedUnits(ingredient);
            const unit = unitOptions.includes(candidate.unit) ? candidate.unit : ingredient.defaultUnit;

            items.push({ ingredientId: ingredient.id, qty: toQty(candidate.qty), unit: unit });
        });

        render();
        emit();
    }

    function clear() {
        setItems([]);
    }

    function emit() {
        onChange(getItems());
    }

    function addItem(ingredient) {
        if (!ingredient) return;

        items.push({ ingredientId: ingredient.id, qty: null, unit: ingredient.defaultUnit });
        els.input.value = "";
        render();
        emit();
        els.input.focus();
    }

    function removeItem(index) {
        if (index < 0 || index >= items.length) return;
        items.splice(index, 1);
        render();
        emit();
    }

    /* 7. Sự kiện */

    els.input.addEventListener("input", renderSuggestions);
    els.input.addEventListener("focus", renderSuggestions);

    // Không hỗ trợ điều hướng bằng mũi tên; chỉ giữ Enter/Escape/Backspace.
    els.input.addEventListener("keydown", function (event) {
        if (event.isComposing) return;  // đang gõ IME tiếng Việt thì bỏ qua

        if (event.key === "Enter") {
            event.preventDefault();                       // không cho submit form
            if (matches.length === 1) addItem(matches[0]);
            return;
        }

        if (event.key === "Escape") {
            closeList();
            return;
        }

        if (event.key === "Backspace" && els.input.value === "" && items.length > 0) {
            removeItem(items.length - 1);
        }
    });

    // pointerdown thay vì click: input không bị blur trước khi chọn xong.
    els.list.addEventListener("pointerdown", function (event) {
        const option = event.target.closest("[data-option]");
        if (!option) return;
        event.preventDefault();
        addItem(matches[Number(option.dataset.option)]);
    });

    // Sự kiện uỷ quyền: row/pill bị dựng lại liên tục nên nghe ở phần tử cha.
    els.pills.addEventListener("click", function (event) {
        const button = event.target.closest("[data-remove-index]");
        if (!button) return;
        removeItem(Number(button.dataset.removeIndex));
        els.input.focus();
    });

    els.sheet.addEventListener("input", function (event) {
        const input = event.target.closest('[data-field="qty"]');
        if (!input) return;
        const row = input.closest("[data-row]");
        items[Number(row.dataset.row)].qty = toQty(input.value);
        emit();  // không render() để không mất focus
    });

    els.sheet.addEventListener("change", function (event) {
        const select = event.target.closest('[data-field="unit"]');
        if (!select) return;
        const row = select.closest("[data-row]");
        items[Number(row.dataset.row)].unit = select.value;
        emit();
    });

    els.sheet.addEventListener("click", function (event) {
        const button = event.target.closest('[data-action="remove"]');
        if (!button) return;
        removeItem(Number(button.closest("[data-row]").dataset.row));
        els.input.focus();
    });

    function handleOutsidePointerDown(event) {
        if (!root.contains(event.target)) closeList();
    }

    document.addEventListener("pointerdown", handleOutsidePointerDown);

    /* 8. Trạng thái ban đầu + thông báo cho trang đang dùng component. */
    render();
    emit();

    return {
        getItems: getItems,
        setItems: setItems,
        clear: clear,
        destroy: function () {
            document.removeEventListener("pointerdown", handleOutsidePointerDown);
            root.classList.remove("ip");
            root.innerHTML = "";
        }
    };
}