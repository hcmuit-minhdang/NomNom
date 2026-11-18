/* NomNom — trang Kết quả tìm kiếm: /pages/search.html?q=&maxTime=&maxPrice=&sort=&page= -> GET /api/recipes */
(function () {
  "use strict";
  var LIMIT = 12;
  var grid = document.getElementById("searchResultsGrid");
  var msg = document.getElementById("gridMessage");
  var count = document.getElementById("resultCount");
  var pager = document.getElementById("pagination");
  var kw = document.getElementById("search-keyword-text");
  var form = document.getElementById("searchPageForm");
  var input = document.getElementById("searchPageInput");
  var sortSel = document.getElementById("sortSelect");
  var timeSel = document.getElementById("maxTimeSelect");
  var priceSel = document.getElementById("maxPriceSelect");
  var reqId = 0;

  function readState() {
    var p = new URLSearchParams(location.search);
    return {
      q: (p.get("q") || "").trim(),
      sort: p.get("sort") || "rating",
      maxTime: p.get("maxTime") || "",
      maxPrice: p.get("maxPrice") || "",
      page: Math.max(1, parseInt(p.get("page"), 10) || 1)
    };
  }
  function urlFor(s) {
    var out = [];
    ["q", "maxTime", "maxPrice"].forEach(function (k) { if (s[k]) out.push(k + "=" + encodeURIComponent(s[k])); });
    if (s.sort && s.sort !== "rating") out.push("sort=" + encodeURIComponent(s.sort));
    if (s.page > 1) out.push("page=" + s.page);
    return "/pages/search.html" + (out.length ? "?" + out.join("&") : "");
  }
  function go(s, replace) {
    var url = urlFor(s);
    if (replace) history.replaceState(null, "", url); else history.pushState(null, "", url);
    render();
  }
  function setSelect(sel, v) {
    sel.value = v;
    if (sel.value !== v) sel.selectedIndex = 0;
  }
  function showMessage(text, retry, linkHref, linkText) {
    msg.hidden = false;
    msg.textContent = text;
    if (linkHref) {
      msg.appendChild(document.createTextNode(" "));
      var a = document.createElement("a");
      a.href = linkHref;
      a.textContent = linkText;
      msg.appendChild(a);
    }
    if (retry) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = "Thử lại";
      b.addEventListener("click", render);
      msg.appendChild(b);
    }
  }

  function render() {
    var s = readState();
    input.value = s.q;
    kw.textContent = s.q ? s.q : "tất cả công thức";
    document.title = "NomNom - " + (s.q ? 'Tìm "' + s.q + '"' : "Kết quả tìm kiếm");
    setSelect(sortSel, s.sort);
    setSelect(timeSel, s.maxTime);
    setSelect(priceSel, s.maxPrice);
    var id = ++reqId;
    msg.hidden = true;
    grid.setAttribute("aria-busy", "true");
    grid.innerHTML = NomNom.skeletonHtml(6);
    pager.innerHTML = "";
    count.textContent = "Đang tìm...";
    NomNom.data.get("/recipes", { q: s.q, sort: s.sort, maxTime: s.maxTime, maxPrice: s.maxPrice, page: s.page, limit: LIMIT })
      .then(function (d) {
        if (id !== reqId) return;
        grid.setAttribute("aria-busy", "false");
        if (d.pages && s.page > d.pages) { s.page = d.pages; go(s, true); return; }
        grid.innerHTML = (d.items || []).map(function (r) { return NomNom.cardHtml(r); }).join("");
        if (!d.total) {
          count.textContent = "Không có kết quả";
          showMessage('Không tìm thấy công thức nào' + (s.q ? ' cho "' + s.q + '"' : "") + ". Hãy thử từ khóa khác hoặc", false, "/pages/category.html", "xem danh mục món ăn.");
          return;
        }
        count.textContent = "Tìm thấy " + d.total + " công thức";
        pager.innerHTML = NomNom.pagerHtml(d.page || s.page, d.pages || 1, function (p) {
          return urlFor(Object.assign({}, s, { page: p }));
        });
      })
      .catch(function (e) {
        if (id !== reqId) return;
        grid.setAttribute("aria-busy", "false");
        grid.innerHTML = "";
        count.textContent = "";
        showMessage(NomNom.errorText(e), true);
      });
  }

  function update(patch) { go(Object.assign(readState(), { page: 1 }, patch)); }

  form.addEventListener("submit", function (e) { e.preventDefault(); update({ q: input.value.trim() }); });
  sortSel.addEventListener("change", function () { update({ sort: sortSel.value }); });
  timeSel.addEventListener("change", function () { update({ maxTime: timeSel.value }); });
  priceSel.addEventListener("change", function () { update({ maxPrice: priceSel.value }); });
  pager.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-page]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    update({ page: parseInt(a.dataset.page, 10) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener("popstate", render);
  render();
})();
