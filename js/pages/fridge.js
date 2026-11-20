/* Luồng tìm công thức theo nguyên liệu tủ lạnh.
   - /pages/fridge.html: form chọn nguyên liệu -> chuyển sang /pages/fridge-results.html?ingredients=dam:thit-bo,tinh-bot:gao&vung-mien=Miền Nam (bộ lọc nhãn tách riêng)
   - /pages/fridge-results.html: đọc query, khôi phục ô đã chọn, gọi NomNom.data.get("/fridge") (store.js tính điểm khớp nguyên liệu). */
(function () {
  "use strict";

  const page = document.body.dataset.page;
  const RESULTS_URL = "/pages/fridge-results.html";
  const form = document.querySelector(".filter-sidebar form");

  function createElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function selectedTokens() {
    const out = [];
    document.querySelectorAll(".filter-sidebar input[type=checkbox]:checked:not([data-tag-filter])").forEach(function (box) {
      out.push(box.name + ":" + box.value);
    });
    // Nguyên liệu nhập tay ở mục "Khác": token "nhom:ten nguyen lieu"
    document.querySelectorAll(".filter-other__list button").forEach(function (chip) {
      out.push(chip.dataset.token);
    });
    return out;
  }

  // Bộ lọc nhãn (Chế độ ăn, Vùng miền, Ngân sách): mỗi nhóm một tham số trên URL, giống trang Danh mục (vd. vung-mien=Miền Nam)
  const TAG_GROUPS = ["che-do-an", "vung-mien", "ngan-sach"];
  function selectedTags() {
    const out = {};
    document.querySelectorAll(".filter-sidebar input[data-tag-filter]:checked").forEach(function (box) {
      (out[box.name] = out[box.name] || []).push(box.value);
    });
    return out;
  }

  // Nhãn hiển thị của mỗi token "nhom:id" lấy từ các ô chọn trong trang.
  const labels = {};
  document.querySelectorAll(".filter-sidebar input[type=checkbox]").forEach(function (box) {
    labels[box.name + ":" + box.value] = box.parentNode.textContent.trim();
    if (!labels[box.value]) labels[box.value] = box.parentNode.textContent.trim();
  });
  function labelOf(item) {
    if (item && typeof item === "object") return item.name || item.label || labels[item.id] || String(item.id || "");
    return labels[item] || String(item);
  }

  /* ---- Ô nhập nguyên liệu khác (mục "Khác") ---- */
  const knownNames = {};
  const catalogNames = [];
  const MAX_SUGGEST = 6; // chỉ hiện tối đa 6 gợi ý cho gọn

  // Bỏ dấu và chữ hoa để so khớp chữ đang gõ với tên trong danh mục
  function plain(text) {
    return String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();
  }

  // Nạp danh mục nguyên liệu để làm gợi ý
  if (window.NomNom && NomNom.data) {
    NomNom.data.get("/ingredients").then(function (data) {
      (data.items || []).forEach(function (i) {
        knownNames[i.name.toLowerCase()] = i.name;
        catalogNames.push({ name: i.name, key: plain(i.name) });
      });
    }, function () { /* không có gợi ý thì vẫn nhập tay được */ });
  }

  // Thêm một nguyên liệu vào thẻ của nhóm; trả về false nếu trống hoặc đã có
  function addOther(block, rawName) {
    let name = String(rawName || "").replace(/[,:]/g, " ").replace(/\s+/g, " ").trim();
    if (!name) return false;
    name = knownNames[name.toLowerCase()] || name;
    const token = block.dataset.otherGroup + ":" + name;
    let exists = false;
    block.querySelectorAll(".filter-other__list button").forEach(function (b) {
      if (b.dataset.token === token) exists = true;
    });
    if (exists) return false;
    const listItem = document.createElement("li");
    const chip = document.createElement("button");
    chip.type = "button";
    chip.dataset.token = token;
    chip.textContent = name;
    chip.title = "Bấm để xóa";
    chip.addEventListener("click", function () { listItem.remove(); });
    listItem.appendChild(chip);
    block.querySelector(".filter-other__list").appendChild(listItem);
    labels[token] = name;
    return true;
  }

  document.querySelectorAll(".filter-other").forEach(function (block) {
    const input = block.querySelector(".filter-other__input");
    // Danh sách gợi ý riêng: hiện dưới ô nhập, lọc theo chữ đang gõ
    const menu = document.createElement("ul");
    menu.className = "filter-other__suggest";
    menu.hidden = true;
    block.insertBefore(menu, block.querySelector(".filter-other__list"));
    let active = -1;

    function closeMenu() {
      menu.hidden = true;
      active = -1;
    }
    function highlight(i) {
      const items = menu.querySelectorAll("li");
      items.forEach(function (listItem, k) { listItem.classList.toggle("is-active", k === i); });
      active = i;
      if (items[i]) items[i].scrollIntoView({ block: "nearest" });
    }
    function pick(name) {
      if (addOther(block, name)) input.value = "";
      closeMenu();
      input.focus();
    }
    function openMenu() {
      const query = plain(input.value);
      menu.textContent = "";
      if (!query) { closeMenu(); return; }
      const hits = catalogNames.filter(function (catalogEntry) { return catalogEntry.key.indexOf(query) !== -1; })
        .sort(function (x, other) { return (x.key.indexOf(query) === 0 ? 0 : 1) - (other.key.indexOf(query) === 0 ? 0 : 1); })
        .slice(0, MAX_SUGGEST);
      if (!hits.length) { closeMenu(); return; }
      hits.forEach(function (catalogEntry) {
        const listItem = document.createElement("li");
        listItem.textContent = catalogEntry.name;
        // mousedown (không phải click) để chọn được trước khi ô nhập mất focus
        listItem.addEventListener("mousedown", function (e) { e.preventDefault(); pick(catalogEntry.name); });
        menu.appendChild(listItem);
      });
      menu.hidden = false;
      active = -1;
    }

    input.addEventListener("input", openMenu);
    input.addEventListener("focus", openMenu);
    input.addEventListener("blur", closeMenu);
    input.addEventListener("keydown", function (e) {
      const count = menu.hidden ? 0 : menu.querySelectorAll("li").length;
      if (e.key === "ArrowDown" && count) { e.preventDefault(); highlight((active + 1) % count); }
      else if (e.key === "ArrowUp" && count) { e.preventDefault(); highlight((active - 1 + count) % count); }
      else if (e.key === "Escape") { closeMenu(); }
      else if (e.key === "Enter") {
        // Enter: chọn gợi ý đang sáng, nếu không thì thêm đúng chữ đã gõ; không gửi cả biểu mẫu
        e.preventDefault();
        if (active >= 0 && count) pick(menu.querySelectorAll("li")[active].textContent);
        else pick(input.value);
      }
    });
    // Ô "Khác" của nhóm: tick thì hiện ô nhập, bỏ tick thì ẩn và xóa các thẻ đã thêm
    const box = block.parentNode.querySelector('input[value="khac"]');
    function sync() {
      block.hidden = !box.checked;
      if (!box.checked) {
        input.value = "";
        closeMenu();
        block.querySelector(".filter-other__list").textContent = "";
      }
    }
    box.addEventListener("change", sync);
    block.syncOther = sync;
  });

  // Chọn nguyên liệu -> sang trang kết quả với đúng các token "nhom:id".
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      // Chữ đang gõ dở trong ô "Khác" cũng được tính
      document.querySelectorAll(".filter-other").forEach(function (block) {
        const inp = block.querySelector(".filter-other__input");
        if (!block.hidden && inp.value && addOther(block, inp.value)) inp.value = "";
      });
      const tokens = selectedTokens();
      const kwInput = form.querySelector("input[name=keyword]");
      const keyword = kwInput ? kwInput.value.trim() : "";
      const parts = [];
      if (tokens.length) parts.push("ingredients=" + encodeURIComponent(tokens.join(",")).replace(/%3A/gi, ":").replace(/%2C/gi, ","));
      const tags = selectedTags();
      TAG_GROUPS.forEach(function (groupName) { if (tags[groupName]) parts.push(groupName + "=" + encodeURIComponent(tags[groupName].join(","))); });
      if (keyword) parts.push("keyword=" + encodeURIComponent(keyword));
      window.location.href = RESULTS_URL + (parts.length ? "?" + parts.join("&") : "");
    });
  }

  function foodCard(recipe, extra) {
    const href = NomNom.recipeUrl(recipe.id);
    const card = createElement("article", "food-card");
    const imageLink = createElement("a");
    imageLink.href = href;
    const img = createElement("img", "food-image");
    img.src = recipe.image || "/images/food.png";
    img.alt = recipe.name || "";
    img.loading = "lazy";
    img.onerror = function () { NomNom.fallbackImg(img); };
    imageLink.appendChild(img);
    const name = createElement("a", "food-name", recipe.name);
    name.href = href;
    const price = createElement("p", "food-price");
    price.append("$ Giá: " + NomNom.money(recipe.price) + " / phần");
    const time = createElement("p", "food-time");
    const clock = createElement("img");
    clock.src = "/images/icons/clock.png";
    clock.alt = "";
    time.append(clock, " Thời gian nấu: " + NomNom.minutes(recipe.time));
    card.append(imageLink, name, price);
    if (extra) extra.forEach(function (extraNode) { card.append(extraNode); });
    card.append(time);
    return card;
  }

  function showError(box, message, retry) {
    box.textContent = "";
    const paragraph = createElement("p", "result-summary", message + " ");
    const b = createElement("button", "filter-sidebar__reset", "Thử lại");
    b.type = "button";
    b.addEventListener("click", retry);
    paragraph.appendChild(b);
    box.appendChild(paragraph);
  }

  /* ---- Trang chọn nguyên liệu: danh sách công thức mới nhất ---- */
  function loadLatest() {
    const list = document.getElementById("latest-list");
    if (!list) return;
    list.textContent = "Đang tải...";
    NomNom.data.get("/recipes", { sort: "new", limit: 6 }).then(function (data) {
      list.textContent = "";
      (data.items || []).forEach(function (recipe) { list.appendChild(foodCard(recipe)); });
      if (!(data.items || []).length) list.textContent = "Chưa có công thức nào.";
    }, function (e) { showError(list, NomNom.errorText(e), loadLatest); });
  }

  /* ---- Trang kết quả ---- */
  const PAGE_SIZE = 9;
  let allItems = [];

  // Trang hiện tại nằm trên URL (?page=2); giữ nguyên các tham số khác
  function currentPage() {
    return Math.max(1, parseInt(new URLSearchParams(window.location.search).get("page"), 10) || 1);
  }
  function pageUrl(pageNumber) {
    const params = new URLSearchParams(window.location.search);
    if (pageNumber > 1) params.set("page", pageNumber); else params.delete("page");
    const queryString = params.toString().replace(/%3A/gi, ":").replace(/%2C/gi, ",");
    return RESULTS_URL + (queryString ? "?" + queryString : "");
  }

  // Vẽ các thẻ của trang hiện tại và thanh phân trang
  function renderPage() {
    const list = document.getElementById("result-list");
    const pager = document.getElementById("pagination");
    const pages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
    const pageNumber = Math.min(currentPage(), pages);
    list.textContent = "";
    allItems.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE).forEach(function (item) {
      const full = item.status === "du";
      const hasPick = !!(item.matched && item.matched.length);
      const extra = [];
      if (hasPick) extra.push(createElement("p", "food-tag " + (full ? "food-tag--enough" : "food-tag--lacking"), (full ? "Đủ nguyên liệu" : "Chưa đủ nguyên liệu") + " · " + Math.round((item.score || 0) * 100) + "%"));
      if (hasPick) extra.push(createElement("p", "food-match", "Bạn có: " + item.matched.map(labelOf).join(", ")));
      if (hasPick && item.missing && item.missing.length) extra.push(createElement("p", "food-match food-missing", "Còn thiếu: " + item.missing.map(labelOf).join(", ")));
      list.appendChild(foodCard(item.recipe, extra));
    });
    if (pager) pager.innerHTML = NomNom.pagerHtml(pageNumber, pages, pageUrl);
  }

  function loadResults(tokens, keyword, tags) {
    const list = document.getElementById("result-list");
    const summary = document.getElementById("result-summary");
    const pager = document.getElementById("pagination");
    if (!list || !summary) return;
    list.textContent = "";
    if (pager) pager.textContent = "";
    tags = tags || {};
    const hasTags = TAG_GROUPS.some(function (groupName) { return tags[groupName] && tags[groupName].length; });
    if (!tokens.length && !hasTags) {
      summary.textContent = "Bạn chưa chọn nguyên liệu nào. Hãy quay lại trang chọn nguyên liệu.";
      return;
    }
    // Ô "Khác" (token "nhom:khac") không phải một nguyên liệu nên không đếm
    const ingCount = tokens.filter(function (token) { return !/:khac$/.test(token); }).length;
    summary.textContent = "Đang tìm công thức phù hợp...";
    // Lấy tối đa 100 kết quả một lần rồi chia trang ở trình duyệt, nên đổi trang không tính lại
    const query = { ingredients: tokens.join(","), q: keyword, limit: 100 };
    TAG_GROUPS.forEach(function (groupName) { if (tags[groupName] && tags[groupName].length) query[groupName] = tags[groupName].join(","); });
    NomNom.data.get("/fridge", query).then(function (data) {
      allItems = data.items || [];
      summary.textContent = "";
      if (!allItems.length) {
        summary.textContent = "Chưa có công thức phù hợp. Hãy thử chọn thêm nguyên liệu hoặc đổi từ khóa.";
        return;
      }
      summary.append("Tìm thấy ", createElement("strong", "", String(allItems.length)), " công thức" +
        (ingCount ? " cho " + ingCount + " nguyên liệu đã chọn" : "") +
        (hasTags ? (ingCount ? ", " : " ") + "theo bộ lọc đã chọn" : "") +
        (keyword ? ", từ khóa “" + keyword + "”" : "") + ".");
      renderPage();
    }, function (e) {
      summary.textContent = "";
      showError(list, NomNom.errorText(e), function () { loadResults(tokens, keyword, tags); });
    });
  }

  // Bấm số trang: đổi URL và vẽ lại, không tải lại trang
  if (page === "fridge-results") {
    const pagerBox = document.getElementById("pagination");
    if (pagerBox) pagerBox.addEventListener("click", function (e) {
      const a = e.target.closest("a[data-page]");
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      history.pushState(null, "", pageUrl(parseInt(a.dataset.page, 10)));
      renderPage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("popstate", renderPage);
  }

  if (page === "fridge") loadLatest();

  if (page === "fridge-results") {
    const params = new URLSearchParams(window.location.search);
    const tokens = (params.get("ingredients") || "").split(",").map(function (part) { return part.trim(); }).filter(Boolean);
    const keyword = (params.get("keyword") || "").trim();
    const tagSel = {};
    TAG_GROUPS.forEach(function (groupName) {
      const values = (params.get(groupName) || "").split(",").map(function (part) { return part.trim(); }).filter(Boolean);
      if (values.length) tagSel[groupName] = values;
    });
    // Khôi phục ô đã chọn từ query string và mở nhóm có ô được chọn.
    document.querySelectorAll(".filter-sidebar input[type=checkbox]").forEach(function (box) {
      const isChecked = box.hasAttribute("data-tag-filter")
        ? (tagSel[box.name] || []).indexOf(box.value) !== -1
        : tokens.indexOf(box.name + ":" + box.value) !== -1;
      if (isChecked) {
        box.checked = true;
        // Mở sẵn nhóm có ô được chọn
        const group = box.closest(".filter-group");
        if (group) {
          group.classList.add("is-open");
          const trigger = group.querySelector(".filter-group__trigger");
          if (trigger) trigger.setAttribute("aria-expanded", "true");
        }
      }
    });
    // Token không khớp ô nào (nguyên liệu nhập tay): tạo lại thẻ trong mục "Khác" của nhóm đó
    const known = {};
    document.querySelectorAll(".filter-sidebar input[type=checkbox]").forEach(function (box) { known[box.name + ":" + box.value] = true; });
    tokens.forEach(function (token) {
      if (known[token] || token.indexOf(":") < 1) return;
      const group = token.split(":")[0];
      const block = document.querySelector('.filter-other[data-other-group="' + group + '"]');
      if (!block) return;
      const khac = block.parentNode.querySelector('input[value="khac"]');
      khac.checked = true;
      block.syncOther();
      addOther(block, token.slice(token.indexOf(":") + 1));
      const acc = block.closest(".filter-group");
      if (acc) {
        acc.classList.add("is-open");
        const trig = acc.querySelector(".filter-group__trigger");
        if (trig) trig.setAttribute("aria-expanded", "true");
      }
    });
    // Ô "Khác" đã tick từ URL thì hiện ô nhập
    document.querySelectorAll(".filter-other").forEach(function (block) { block.syncOther(); });
    const keywordInput = document.querySelector(".filter-sidebar input[name=keyword]");
    if (keywordInput) keywordInput.value = keyword;
    loadResults(tokens, keyword, tagSel);
  }
})();
