const MAX_SUGGESTIONS = 12;
let instanceCount = 0;

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (replacedValue) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[replacedValue];
  });
}

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
  if(!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

function toQty(value) {
  if (value === "" || value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export async function createIngredientPicker(root, options = {}) {
  if (!root) throw new Error("createIngredientPicker: thiếu element gốc");
  if (!options.ingredientsUrl || !options.unitsUrl) {
    throw new Error("createIngredientPicker: cần ingredientsUrl và unitsUrl");
  }

  const onChange = typeof options.onChange === "function" ? options.onChange : function() {};

  let ingredients;
  let units;

  try {
    [ingredients, units] = await Promise.all([
      loadJson(options.ingredientsUrl),
      loadJson(options.unitsUrl)
    ]);
  } catch (error) {
    root.innerHTML = `<p class="ip-error">Không tải được dữ liệu nguyên liệu. Hãy chạy local server thay vì mở file://.</p>`;
    throw error;
  }

  ingredients.forEach((ingredient) => {
    ingredient.searchText = normalize(
      [ingredient.name].concat(ingredient.aliases || []).join(" ")
    );
  });

  let items = [];
  let matches = [];

  const instanceId = "ip-" + (++instanceCount);

  root.classList.add("ip");
  root.innerHTML =
    `<div class="ip-combobox">
      <div class="ip-search">
        <span class="ip-pills" data-part="pills"></span>
        <input class="ip-input" data-part="input" type="text"
          autocomplete="off" spellcheck="false" placeholder="Tìm nguyên liệu"
          role="combobox" aria-autocomplete="list" aria-expanded="false"
          aria-controls="${instanceId}-list" />
      </div>
      <ul class="ip-suggestions" data-part="list" id="${instanceId}-list" role="listbox" hidden></ul>
      <p class="ip-no-match" data-part="no-match" role="status" hidden>No ingredient found</p>
    </div>
    <div class="ip-sheet" data-part="sheet"></div>`;

  const els = {
    pills: root.querySelector('[data-part="pills"]'),
    input: root.querySelector('[data-part="input"]'),
    list: root.querySelector('[data-part="list"]'),
    noMatch: root.querySelector('[data-part="no-match"]'),
    sheet: root.querySelector('[data-part="sheet"]')
  };

  function findIngredient(id) {
    return ingredients.find((ingredient) => {
      return ingredient.id === id;
    });
  }

  function allowedUnits(ingredient) {
    if (!ingredient) return [];
    if (Array.isArray(ingredient.units) && ingredient.units.length > 0) {
      return ingredient.units.filter((unitId) => {return units[unitId]; });
    }

    return Object.keys(units).filter((unitId) => {
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

  function render() {
    renderPills();
    renderRows();
    closeList();
  }

  function renderPills() {
    els.pills.innerHTML = items.map((item, index) => {
      const name = escapeHTML(nameOf(item));
      return `<span class="ip-pill">${name}<button type="button" class="ip-pill-remove" data-remove-index="${index}" aria-label="Delete ${name}">x</button></span>`;
    }).join("");
  }

  function renderRows() {
    if (items.length === 0) {
      els.sheet.innerHTML = `<p class="ip-sheet-empty">No ingredient</p>`;
      return;
    }
    
    els.sheet.innerHTML = items.map((item, index) => {
      const name = escapeHTML(nameOf(item));

      const optionsHtml = allowedUnits(findIngredient(item.ingredientId)).map((unitId) => {
        const selected = unitId === item.unit ? " selected" : "";
        return `<option value="${escapeHTML(unitId)}"${selected}>${escapeHTML(unitLabel(unitId))}</option>`;
      }).join("");

      return `<div class="ip-row" data-row="${index}">
          <span class="ip-name">${name}</span>
          <input class="ip-qty" data-field="qty" type="number" inputmode="decimal" min="0" step="any" placeholder="SL" value="${item.qty ?? ""}" aria-label="Số lượng ${name}" />
          <select class="ip-unit" data-field="unit" aria-label="Đơn vị của ${name}">${optionsHtml}</select>
          <button type="button" class="ip-remove" data-action="remove" aria-label="Delete ${name}">x</button>
        </div>`;
    }).join("");
  }

  function renderSuggestions() {
    const query = normalize(els.input.value); //value entered into the search box
    const chosenIds = items.map((item) => { return item.ingredientId; });

    matches = ingredients
      .filter((ingredient) => { return !chosenIds.includes(ingredient.id); })
      .filter((ingredient) => { return !query || ingredient.searchText.includes(query); })
      .slice(0, MAX_SUGGESTIONS);

    if (matches.length === 0) {
      const hadQuery = query !== "";//hadQuery true if query is not null -> there're input value but no match, false if query is null -> no input
      closeList();
      els.noMatch.hidden = !hadQuery;//noMatch is hidden if there're no query, not hidden if there's query
      return;
    }

    els.list.innerHTML = matches.map((ingredient, index) => {
      return `<li class="ip-option" role="option" data-option="${index}">
        <span class="ip-option-name">${escapeHTML(ingredient.name)}</span>
        <span class="ip-option-unit">${escapeHTML(unitLabel(ingredient.defaultUnit))}</span>
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

  //changing data
  function getItems() {
    return items.map((item) => {
      return { ingredientId: item.ingredientId, qty: item.qty, unit: item.unit };
    });
  }

  function setItems(nextItems) {
    items = [];

    (nextItems || []).forEach((candidate) => {
      const ingredient = candidate && findIngredient(candidate.ingredientId);
      if (!ingredient) return;

      const unitOptions = allowedUnits(ingredient);
      const unit = unitOptions.includes(candidate.unit) ? candidate.unit : ingredient.defaultUnit;

      items.push({ ingredientId: ingredient.id, qty: toQty(candidate.qty), unit: unit});
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
    if(!ingredient) return;

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

  els.input.addEventListener("input", renderSuggestions);
  els.input.addEventListener("focus", renderSuggestions);

  els.input.addEventListener("keydown", (event) => {
    if (event.isComposing) return;

    if (event.key === "Enter") {
      event.preventDefault();
      if(matches.length === 1) addItem(matches[0]);
      return;
    }

    if(event.key === "Escape") {
      closeList();
      return;
    }

    if (event.key === "Backspace" && els.input.value === "" && items.length > 0) {
      removeItem(items.length - 1);
    }
  });
  
  els.list.addEventListener("pointerdown", (event) => {
    const option = event.target.closest("[data-option]");
    if(!option) return;
    event.preventDefault();
    addItem(matches[Number(option.dataset.option)]);
  });

  els.pills.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-index]");
    if (!button) return;
    removeItem(Number(button.dataset.removeIndex));
    els.input.focus();
  });
  
  els.sheet.addEventListener("input", (event) => {
    const input = event.target.closest('[data-field="qty"]');
    if (!input) return;
    const row = input.closest("[data-row]");
    items[Number(row.dataset.row)].qty = toQty(input.value);
    emit(); //no render() so the input keeps focus
  });

  els.sheet.addEventListener("change", (event) => {
    const select = event.target.closest('[data-field="unit"]');
    if(!select) return;
    const row = select.closest("[data-row]");
    items[Number(row.dataset.row)].unit = select.value;
    emit();
  });

  els.sheet.addEventListener("click", (event) => {
    const button = event.target.closest('[data-action="remove"]');
    if (!button) return;
    removeItem(Number(button.closest("[data-row]").dataset.row));
    els.input.focus();
  });

  function handleOutsidePointerDown(event) {
    if (!root.contains(event.target)) closeList();
  }

  document.addEventListener("pointerdown", handleOutsidePointerDown);

  render();
  emit();

  return {
    getItems: getItems,
    setItems: setItems,
    clear: clear,
    destroy: () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
      root.classList.remove("ip");
      root.innerHTML = "";
    }
  };
}