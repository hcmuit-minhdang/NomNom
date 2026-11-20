/* NomNom – trang Danh mục: lọc / sắp xếp / phân trang qua NomNom.data, trạng thái nằm trên URL. */
(function () {
  "use strict";
  const LIMIT = 12;
  const grid = document.getElementById("recipe-grid");
  const msg = document.getElementById("grid-message");
  const count = document.getElementById("result-count");
  const pager = document.getElementById("pagination");
  const title = document.getElementById("category-title");
  const sortSel = document.getElementById("sort-select");
  const filterForm = document.getElementById("filter-form");
  // 7 nhóm bộ lọc (khớp thiết kế của Phát); mỗi nhóm là một tham số trên URL, ví dụ ?dam=Thịt bò,Thịt gà
  const GROUPS = ["dam", "tinh-bot", "rau-cu", "trai-cay", "che-do-an", "vung-mien", "ngan-sach"];
  // 4 nhóm đầu là nguyên liệu; một món "đủ nguyên liệu" khi mọi nguyên liệu của món nằm trong các ô đã chọn
  const INGREDIENT_GROUPS = ["dam", "tinh-bot", "rau-cu", "trai-cay"];
  let categories = [];
  let reqId = 0;

  function readState() {
    const searchParams = new URLSearchParams(location.search);
    const state = {
      category: searchParams.get("category") || "",
      q: searchParams.get("q") || "",
      sort: searchParams.get("sort") || "rating",
      page: Math.max(1, parseInt(searchParams.get("page"), 10) || 1)
    };
    GROUPS.forEach(function (group) {
      state[group] = (searchParams.get(group) || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean);
    });
    return state;
  }
  function urlFor(state) {
    const out = [];
    ["category", "q"].forEach(function (k) { if (state[k]) out.push(k + "=" + encodeURIComponent(state[k])); });
    // Nhóm lọc: giữ dấu phẩy và khoảng trắng dễ đọc trên URL
    GROUPS.forEach(function (group) {
      if (state[group] && state[group].length) out.push(group + "=" + state[group].map(encodeURIComponent).join(","));
    });
    if (state.sort && state.sort !== "rating") out.push("sort=" + encodeURIComponent(state.sort));
    if (state.page > 1) out.push("page=" + state.page);
    // Không có điều kiện nào: giữ sort=rating để URL không rỗng (URL rỗng là trang chọn danh mục)
    if (!out.length) out.push("sort=rating");
    return "/pages/category.html?" + out.join("&");
  }
  function navigateTo(state, replace) {
    const url = urlFor(state);
    if (replace) history.replaceState(null, "", url); else history.pushState(null, "", url);
    render();
  }

  // Tick đúng các ô theo URL (mở sẵn nhóm nào có ô được chọn).
  function syncChecks(state) {
    GROUPS.forEach(function (group) {
      const acc = document.querySelector('.filter-group[data-group="' + group + '"]');
      if (!acc) return;
      let any = false;
      acc.querySelectorAll('input[type="checkbox"]').forEach(function (box) {
        box.checked = state[group].indexOf(box.value) !== -1;
        if (box.checked) any = true;
      });
      if (any) setOpen(acc, true);
    });
  }

  function setOpen(acc, open) {
    acc.classList.toggle("is-open", open);
    const btn = acc.querySelector(".filter-group__trigger");
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function syncControls(state) {
    sortSel.value = state.sort;
    if (sortSel.value !== state.sort) sortSel.value = "rating";
    syncChecks(state);
    const cat = categories.filter(function (category) { return category.id === state.category; })[0];
    title.textContent = (cat ? cat.name : state.q ? 'Kết quả cho "' + state.q + '"' : state.sort === "new" ? "Công thức mới nhất" : "Tất cả món ăn").toUpperCase();
    document.title = (cat ? cat.name : "Danh mục món ăn") + " | NomNom";
  }

  function showMessage(text, retry) {
    msg.hidden = false;
    msg.textContent = text;
    if (retry) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = "Thử lại";
      b.addEventListener("click", render);
      msg.appendChild(b);
    }
  }

  // Gắn enoughIngredients cho từng món theo các ô nguyên liệu đang chọn (chưa chọn gì thì chưa đủ)
  function markEnough(items, state) {
    const chosen = {};
    const known = {};
    INGREDIENT_GROUPS.forEach(function (group) {
      state[group].forEach(function (value) { chosen[value] = true; });
      document.querySelectorAll('input[type="checkbox"][name="' + group + '"]').forEach(function (b) { known[b.value] = true; });
    });
    items.forEach(function (recipe) {
      const need = (recipe.tags || []).filter(function (tag) { return known[tag]; });
      recipe.enoughIngredients = need.length > 0 && need.every(function (tag) { return chosen[tag]; });
    });
  }

  // Vào trang không kèm tham số: chỉ hiện các biểu tượng danh mục; bấm vào một danh mục mới hiện danh sách món
  const pickerBox = document.getElementById("category-picker");
  const layoutBox = document.querySelector(".category-page-layout");
  let pickerLoaded = false;
  function showPicker() {
    layoutBox.hidden = true;
    pickerBox.hidden = false;
    document.title = "Danh mục món ăn | NomNom";
    if (pickerLoaded) return;
    const box = document.getElementById("cat-picker");
    const items = categories.slice();
    Promise.all(items.map(function (category) {
      return NomNom.data.get("/recipes", { category: category.id, limit: 1, sort: "rating" }).then(function (response) {
        return response.items && response.items[0] ? response.items[0].image : null;
      }, function () { return null; });
    })).then(function (imgs) {
      pickerLoaded = true;
      box.innerHTML = items.map(function (category, i) {
        return '<a href="/pages/category.html?category=' + encodeURIComponent(category.id) + '" class="cat-picker__card">' +
          '<img loading="lazy" decoding="async" src="' + NomNom.esc(imgs[i] || "/images/food.png") + '" alt="" />' +
          '<span>' + NomNom.esc(category.name) + '</span></a>';
      }).join("") + '<a href="/pages/category.html?sort=rating" class="cat-picker__card cat-picker__card--all"><span class="cat-picker__all">Tất cả món</span></a>';
    });
  }

  function render() {
    if (!location.search) { showPicker(); return; }
    pickerBox.hidden = true;
    layoutBox.hidden = false;
    const state = readState();
    syncControls(state);
    const requestId = ++reqId;
    msg.hidden = true;
    grid.setAttribute("aria-busy", "true");
    grid.innerHTML = NomNom.skeletonHtml(6);
    pager.innerHTML = "";
    count.textContent = "Đang tải...";
    const params = { category: state.category, q: state.q, sort: state.sort, page: state.page, limit: LIMIT };
    GROUPS.forEach(function (group) { if (state[group].length) params[group] = state[group].join(","); });
    NomNom.data.get("/recipes", params).then(function (response) {
      if (requestId !== reqId) return;
      grid.setAttribute("aria-busy", "false");
      if (response.pages && state.page > response.pages) { state.page = response.pages; navigateTo(state, true); return; }
      count.textContent = response.total ? "Có " + response.total + " món ăn" : "Không có món ăn";
      markEnough(response.items || [], state);
      // Chưa chọn nguyên liệu nào (chưa lọc) thì không hiện nhãn; lọc rồi mới hiện "Đủ / Chưa đủ nguyên liệu"
      const filtered = INGREDIENT_GROUPS.some(function (group) { return state[group].length > 0; });
      grid.innerHTML = (response.items || []).map(function (recipe) { return NomNom.cardHtml(recipe, null, null, filtered); }).join("");
      if (!response.items || !response.items.length) showMessage("Không tìm thấy món ăn phù hợp. Hãy thử bỏ bớt bộ lọc.");
      pager.innerHTML = NomNom.pagerHtml(response.page || state.page, response.pages || 1, function (pageNumber) {
        return urlFor(Object.assign({}, state, { page: pageNumber }));
      });
    }).catch(function (e) {
      if (requestId !== reqId) return;
      grid.setAttribute("aria-busy", "false");
      grid.innerHTML = "";
      count.textContent = "";
      showMessage(NomNom.errorText(e), true);
    });
  }

  function update(patch) {
    const state = Object.assign(readState(), { page: 1 }, patch);
    navigateTo(state);
  }

  // Gửi bộ lọc một lần khi bấm "TÌM CÔNG THỨC PHÙ HỢP": gom các ô đã tick của mọi nhóm rồi lọc từ trang 1
  filterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const filterParams = {};
    GROUPS.forEach(function (group) {
      filterParams[group] = [];
      document.querySelectorAll('input[type="checkbox"][name="' + group + '"]:checked').forEach(function (b) { filterParams[group].push(b.value); });
    });
    update(filterParams);
  });
  sortSel.addEventListener("change", function () { update({ sort: sortSel.value }); });
  document.getElementById("filter-reset").addEventListener("click", function (e) {
    e.preventDefault();
    const cleared = { category: readState().category, q: "", sort: "rating", page: 1 };
    GROUPS.forEach(function (group) { cleared[group] = []; });
    navigateTo(cleared);
  });
  pager.addEventListener("click", function (e) {
    const a = e.target.closest("a[data-page]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    update({ page: parseInt(a.dataset.page, 10) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener("popstate", render);

  NomNom.data.get("/categories").then(function (response) { categories = response.items || []; }, function () { categories = []; })
    .then(render);
})();
