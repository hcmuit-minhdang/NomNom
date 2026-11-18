/* NomNom – trang Danh mục: lọc / sắp xếp / phân trang qua /api/recipes, trạng thái nằm trên URL. */
(function () {
  "use strict";
  var LIMIT = 12;
  var grid = document.getElementById("recipeGrid");
  var msg = document.getElementById("gridMessage");
  var count = document.getElementById("resultCount");
  var pager = document.getElementById("pagination");
  var title = document.getElementById("categoryTitle");
  var sortSel = document.getElementById("sortSelect");
  var filterForm = document.getElementById("filterForm");
  // 7 nhóm bộ lọc (khớp thiết kế của Phát); mỗi nhóm là một tham số trên URL, ví dụ ?dam=Thịt bò,Thịt gà
  var GROUPS = ["dam", "tinh-bot", "rau-cu", "trai-cay", "che-do-an", "vung-mien", "ngan-sach"];
  // 4 nhóm đầu là nguyên liệu; một món "đủ nguyên liệu" khi mọi nguyên liệu của món nằm trong các ô đã chọn
  var INGREDIENT_GROUPS = ["dam", "tinh-bot", "rau-cu", "trai-cay"];
  var categories = [];
  var reqId = 0;

  function readState() {
    var p = new URLSearchParams(location.search);
    var s = {
      category: p.get("category") || "",
      q: p.get("q") || "",
      sort: p.get("sort") || "rating",
      page: Math.max(1, parseInt(p.get("page"), 10) || 1)
    };
    GROUPS.forEach(function (g) {
      s[g] = (p.get(g) || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean);
    });
    return s;
  }
  function urlFor(s) {
    var out = [];
    ["category", "q"].forEach(function (k) { if (s[k]) out.push(k + "=" + encodeURIComponent(s[k])); });
    // Nhóm lọc: giữ dấu phẩy và khoảng trắng dễ đọc trên URL
    GROUPS.forEach(function (g) {
      if (s[g] && s[g].length) out.push(g + "=" + s[g].map(encodeURIComponent).join(","));
    });
    if (s.sort && s.sort !== "rating") out.push("sort=" + encodeURIComponent(s.sort));
    if (s.page > 1) out.push("page=" + s.page);
    return "/pages/category.html" + (out.length ? "?" + out.join("&") : "");
  }
  function go(s, replace) {
    var url = urlFor(s);
    if (replace) history.replaceState(null, "", url); else history.pushState(null, "", url);
    render();
  }

  // Tick đúng các ô theo URL (mở sẵn nhóm nào có ô được chọn).
  function syncChecks(s) {
    GROUPS.forEach(function (g) {
      var acc = document.querySelector('.filter-accordion[data-group="' + g + '"]');
      if (!acc) return;
      var any = false;
      acc.querySelectorAll('input[type="checkbox"]').forEach(function (box) {
        box.checked = s[g].indexOf(box.value) !== -1;
        if (box.checked) any = true;
      });
      if (any) setOpen(acc, true);
    });
  }

  function setOpen(acc, open) {
    acc.classList.toggle("is-open", open);
    var btn = acc.querySelector(".filter-trigger-btn");
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function syncControls(s) {
    sortSel.value = s.sort;
    if (sortSel.value !== s.sort) sortSel.value = "rating";
    syncChecks(s);
    var cat = categories.filter(function (c) { return c.id === s.category; })[0];
    title.textContent = (cat ? cat.name : s.q ? 'Kết quả cho "' + s.q + '"' : "Tất cả món ăn").toUpperCase();
    document.title = "NomNom - " + (cat ? cat.name : "Danh mục món ăn");
  }

  function showMessage(text, retry) {
    msg.hidden = false;
    msg.textContent = text;
    if (retry) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = "Thử lại";
      b.addEventListener("click", render);
      msg.appendChild(b);
    }
  }

  // Gắn enoughIngredients cho từng món theo các ô nguyên liệu đang chọn (chưa chọn gì thì chưa đủ)
  function markEnough(items, s) {
    var chosen = {};
    var known = {};
    INGREDIENT_GROUPS.forEach(function (g) {
      s[g].forEach(function (v) { chosen[v] = true; });
      document.querySelectorAll('input[type="checkbox"][name="' + g + '"]').forEach(function (b) { known[b.value] = true; });
    });
    items.forEach(function (r) {
      var need = (r.tags || []).filter(function (t) { return known[t]; });
      r.enoughIngredients = need.length > 0 && need.every(function (t) { return chosen[t]; });
    });
  }

  function render() {
    var s = readState();
    syncControls(s);
    var id = ++reqId;
    msg.hidden = true;
    grid.setAttribute("aria-busy", "true");
    grid.innerHTML = NomNom.skeletonHtml(6);
    pager.innerHTML = "";
    count.textContent = "Đang tải...";
    var params = { category: s.category, q: s.q, sort: s.sort, page: s.page, limit: LIMIT };
    GROUPS.forEach(function (g) { if (s[g].length) params[g] = s[g].join(","); });
    NomNom.data.get("/recipes", params).then(function (d) {
      if (id !== reqId) return;
      grid.setAttribute("aria-busy", "false");
      if (d.pages && s.page > d.pages) { s.page = d.pages; go(s, true); return; }
      count.textContent = d.total ? "Có " + d.total + " món ăn" : "Không có món ăn";
      markEnough(d.items || [], s);
      // Chưa chọn nguyên liệu nào (chưa lọc) thì không hiện nhãn; lọc rồi mới hiện "Đủ / Chưa đủ nguyên liệu"
      var filtered = INGREDIENT_GROUPS.some(function (g) { return s[g].length > 0; });
      grid.innerHTML = (d.items || []).map(function (r) { return NomNom.cardHtml(r, null, null, filtered); }).join("");
      if (!d.items || !d.items.length) showMessage("Không tìm thấy món ăn phù hợp. Hãy thử bỏ bớt bộ lọc.");
      pager.innerHTML = NomNom.pagerHtml(d.page || s.page, d.pages || 1, function (p) {
        return urlFor(Object.assign({}, s, { page: p }));
      });
    }).catch(function (e) {
      if (id !== reqId) return;
      grid.setAttribute("aria-busy", "false");
      grid.innerHTML = "";
      count.textContent = "";
      showMessage(NomNom.errorText(e), true);
    });
  }

  function update(patch) {
    var s = Object.assign(readState(), { page: 1 }, patch);
    go(s);
  }

  // Gửi bộ lọc một lần khi bấm "TÌM CÔNG THỨC PHÙ HỢP": gom các ô đã tick của mọi nhóm rồi lọc từ trang 1
  filterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var p = {};
    GROUPS.forEach(function (g) {
      p[g] = [];
      document.querySelectorAll('input[type="checkbox"][name="' + g + '"]:checked').forEach(function (b) { p[g].push(b.value); });
    });
    update(p);
  });
  sortSel.addEventListener("change", function () { update({ sort: sortSel.value }); });
  document.getElementById("filterReset").addEventListener("click", function (e) {
    e.preventDefault();
    var cleared = { category: "", q: "", sort: "rating", page: 1 };
    GROUPS.forEach(function (g) { cleared[g] = []; });
    go(cleared);
  });
  pager.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-page]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    update({ page: parseInt(a.dataset.page, 10) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener("popstate", render);

  NomNom.data.get("/categories").then(function (d) { categories = d.items || []; }, function () { categories = []; })
    .then(render);
})();
