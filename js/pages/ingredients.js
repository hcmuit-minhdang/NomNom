/* NomNom – So sánh giá nguyên liệu.
   NomNom.data.get("/ingredients") -> danh sách nguyên liệu; get("/ingredients/compare", {names}) -> giá theo cửa hàng.
   Mỗi lần chỉ so sánh một nguyên liệu; trạng thái nằm trên URL: /pages/ingredients.html?names=thit-heo */
(function () {
  "use strict";
  const chipsBox = document.getElementById("picker-chips");
  const results = document.getElementById("comparison-results");
  const form = document.getElementById("search-form");
  const input = document.getElementById("ingredient-search");
  const hint = document.getElementById("picker-hint");
  let all = [];
  let selected = [];
  let reqId = 0;

  function createElement(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }
  function norm(text) {
    return String(text == null ? "" : text).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();
  }
  function byId(ingredientId) {
    return all.filter(function (i) { return i.id === ingredientId; })[0];
  }
  function storeClass(name) {
    const normalizedName = norm(name);
    if (normalizedName.indexOf("bach hoa") !== -1) return "store-bach-hoa-xanh";
    if (normalizedName.indexOf("coop") !== -1) return "store-coop-food";
    if (normalizedName.indexOf("win") !== -1) return "store-winmart";
    if (normalizedName.indexOf("sun") !== -1) return "store-sunmart";
    if (normalizedName.indexOf("gs25") !== -1) return "store-gs25";
    if (normalizedName.indexOf("circle") !== -1) return "store-circle-k";
    return "";
  }
  function safeUrl(url) {
    return /^https?:\/\//i.test(String(url || "")) ? url : "";
  }
  function pick(record, keys) {
    for (let i = 0; i < keys.length; i++) if (record[keys[i]] != null && record[keys[i]] !== "") return record[keys[i]];
    return null;
  }

  function writeUrl() {
    const pageUrl = "/pages/ingredients.html" + (selected.length ? "?names=" + selected.map(encodeURIComponent).join(",") : "");
    history.replaceState(null, "", pageUrl);
  }

  // Số nguyên liệu hiện sẵn khi chưa bấm "Xem thêm"; nguyên liệu đã chọn luôn hiện
  const CHIP_LIMIT = 14;
  let chipsExpanded = false;

  // Cập nhật số nguyên liệu đã chọn trên nút gửi (chưa gửi request nào)
  function syncSubmit() {
    const btn = document.getElementById("picker-submit");
    if (!btn) return;
    btn.textContent = selected.length ? "SO SÁNH GIÁ (" + selected.length + ")" : "SO SÁNH GIÁ";
    btn.disabled = !selected.length;
  }

  function renderChips() {
    const query = norm(input.value);
    chipsBox.textContent = "";
    const matched = all.filter(function (i) {
      if (selected.indexOf(i.id) !== -1) return true;
      if (!query) return true;
      return norm(i.name).indexOf(query) !== -1 || (i.aliases || []).some(function (a) { return norm(a).indexOf(query) !== -1; });
    });
    syncSubmit();
    if (!matched.length) {
      chipsBox.appendChild(createElement("span", "ing-loading", "Không tìm thấy nguyên liệu phù hợp."));
      return;
    }
    // Đang tìm kiếm hoặc đã bấm "Xem thêm" thì hiện hết; ngược lại chỉ hiện một phần đầu danh sách
    const collapsed = !query && !chipsExpanded && matched.length > CHIP_LIMIT;
    const shown = collapsed
      ? matched.filter(function (i, idx) { return idx < CHIP_LIMIT || selected.indexOf(i.id) !== -1; })
      : matched;
    shown.forEach(function (i) {
      const b = createElement("button", "ing-chip" + (selected.indexOf(i.id) !== -1 ? " is-selected" : ""), i.name);
      b.type = "button";
      b.setAttribute("aria-pressed", selected.indexOf(i.id) !== -1 ? "true" : "false");
      // Chỉ đánh dấu chọn; việc gửi request nằm ở nút "SO SÁNH GIÁ" để tránh so sánh nhiều lần
      b.addEventListener("click", function () {
        const k = selected.indexOf(i.id);
        // Chỉ so sánh giá một nguyên liệu mỗi lần: chọn cái mới thì thay cái cũ, bấm lại thì bỏ chọn
        selected = k === -1 ? [i.id] : [];
        renderChips();
      });
      chipsBox.appendChild(b);
    });
    // Nút bật/tắt danh sách đầy đủ (chỉ khi không đang tìm kiếm)
    if (!query && matched.length > CHIP_LIMIT) {
      const more = createElement("button", "ing-more", chipsExpanded ? "Thu gọn ▲" : "Xem thêm " + (matched.length - shown.length) + " nguyên liệu ▼");
      more.type = "button";
      more.setAttribute("aria-expanded", chipsExpanded ? "true" : "false");
      more.addEventListener("click", function () {
        chipsExpanded = !chipsExpanded;
        renderChips();
      });
      chipsBox.appendChild(more);
    }
  }

  function storeCard(store, unitFallback) {
    const storeName = pick(store, ["store", "storeName", "shop"]) || "Cửa hàng";
    const title = pick(store, ["product", "productName", "title", "label", "item"]) || "";
    const url = safeUrl(pick(store, ["url", "link", "href"]));
    const price = Number(store.price);
    const unit = pick(store, ["unit", "per", "perUnit"]) || unitFallback || "";
    const old = Number(pick(store, ["oldPrice", "originalPrice", "listPrice"]));
    let discount = pick(store, ["discount", "discountPercent"]);
    if (!discount && old && price && old > price) discount = "-" + Math.round((1 - price / old) * 100) + "%";
    if (discount && String(discount).charAt(0) !== "-") discount = "-" + String(discount).replace(/%?$/, "%");

    const card = createElement("div", "store-card");
    card.appendChild(createElement("p", "store-name " + storeClass(storeName), String(storeName).toUpperCase()));
    // Có ảnh sản phẩm thì hiện ảnh; chưa có thì hiện ô trống "Chưa có ảnh" (không dùng ảnh món ăn thay thế)
    const rawImg = pick(store, ["image", "img", "imageUrl"]);
    let image;
    if (rawImg && (safeUrl(rawImg) || String(rawImg).charAt(0) === "/")) {
      image = createElement("img", "ingredient-image");
      image.src = rawImg;
      image.alt = title || storeName;
      image.loading = "lazy";
      image.onerror = function () { const placeholder = createElement("div", "ingredient-image ingredient-image--empty", "Chưa có ảnh"); image.replaceWith(placeholder); };
    } else {
      image = createElement("div", "ingredient-image ingredient-image--empty", "Chưa có ảnh");
    }
    card.appendChild(image);
    const info = createElement("div", "ingredient-info");
    if (title) info.appendChild(createElement("span", "ingredient-name", title));
    const priceBox = createElement("div", "ingredient-price");
    priceBox.appendChild(createElement("p", "", isFinite(price) && store.price != null ? NomNom.money(price) : "Liên hệ"));
    if (unit) priceBox.appendChild(createElement("span", "", "/" + unit));
    info.appendChild(priceBox);
    if (old && old > price) {
      const oldPriceBox = createElement("div", "ingredient-old-price");
      oldPriceBox.appendChild(createElement("p", "", NomNom.money(old)));
      if (discount) oldPriceBox.appendChild(createElement("span", "discount", discount));
      info.appendChild(oldPriceBox);
    }
    card.appendChild(info);
    if (url) {
      const a = createElement("a", "buy-button", "MUA NGAY");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      card.appendChild(a);
    }
    return card;
  }

  function section(item) {
    const sec = createElement("section", "comparison-section");
    const titleBox = createElement("div", "title comparison-title");
    titleBox.appendChild(createElement("p", "", String(item.name || "").toUpperCase())).id = "";
    titleBox.firstChild.className = "comparison-label";
    titleBox.appendChild(createElement("div", "line comparison-line"));
    sec.appendChild(titleBox);
    const wrap = createElement("div", "store-card__container");
    const stores = (item.stores || item.offers || []).slice();
    stores.sort(function (a, b) { return (Number(a.price) || 1e12) - (Number(b.price) || 1e12); });
    if (!stores.length) wrap.appendChild(createElement("p", "ing-loading", "Chưa có dữ liệu giá cho nguyên liệu này."));
    stores.forEach(function (store) { wrap.appendChild(storeCard(store, item.unit)); });
    sec.appendChild(wrap);
    return sec;
  }

  function compare() {
    writeUrl();
    const requestId = ++reqId;
    results.textContent = "";
    if (!selected.length) {
      results.appendChild(createElement("p", "ing-empty", "Hãy chọn ít nhất một nguyên liệu ở phía trên để xem giá."));
      return;
    }
    results.appendChild(createElement("p", "ing-empty", "Đang tải giá..."));
    const names = selected.map(function (sid) { const i = byId(sid); return i ? i.name : sid; });
    NomNom.data.get("/ingredients/compare", { names: names }).then(function (data) {
      if (requestId !== reqId) return;
      results.textContent = "";
      const items = data.items || [];
      if (!items.length) results.appendChild(createElement("p", "ing-empty", "Chưa có dữ liệu giá cho các nguyên liệu đã chọn."));
      items.forEach(function (item) { results.appendChild(section(item)); });
    }, function (e) {
      if (requestId !== reqId) return;
      results.textContent = "";
      const paragraph = createElement("p", "ing-empty", NomNom.errorText(e) + " ");
      const b = createElement("button", "ing-retry", "Thử lại");
      b.type = "button";
      b.addEventListener("click", compare);
      paragraph.appendChild(b);
      results.appendChild(paragraph);
    });
  }

  input.addEventListener("input", renderChips);
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = norm(input.value);
    renderChips();
    if (!query) return;
    const first = all.filter(function (i) { return norm(i.name).indexOf(query) !== -1 || (i.aliases || []).some(function (a) { return norm(a).indexOf(query) !== -1; }); })[0];
    // Enter ở ô tìm chỉ chọn nguyên liệu khớp đầu tiên; gửi so sánh bằng nút "SO SÁNH GIÁ"
    if (first && selected.indexOf(first.id) === -1) { selected = [first.id]; renderChips(); }
  });

  // Nút gửi: so sánh đúng một lần cho các nguyên liệu đã chọn
  document.getElementById("picker-submit").addEventListener("click", compare);
  // Nút bỏ chọn: xóa lựa chọn, chưa so sánh
  document.getElementById("picker-reset").addEventListener("click", function () {
    selected = [];
    renderChips();
  });

  NomNom.data.get("/ingredients").then(function (data) {
    all = data.items || [];
    const want = (new URLSearchParams(location.search).get("names") || "").split(",").map(function (part) { return part.trim(); }).filter(Boolean);
    selected = want.map(function (wantedId) {
      const hit = byId(wantedId) || all.filter(function (i) { return norm(i.name) === norm(wantedId); })[0];
      return hit && hit.id;
    }).filter(Boolean).slice(0, 1);
    if (!selected.length && all.length) selected = [(byId("thit-heo") || all[0]).id];
    renderChips();
    compare();
  }, function (e) {
    chipsBox.textContent = "";
    const paragraph = createElement("p", "ing-empty", NomNom.errorText(e) + " ");
    const b = createElement("button", "ing-retry", "Tải lại trang");
    b.type = "button";
    b.addEventListener("click", function () { location.reload(); });
    paragraph.appendChild(b);
    chipsBox.appendChild(paragraph);
    hint.hidden = true;
  });
})();
