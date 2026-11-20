/* NomNom: trang Kết quả tìm kiếm: /pages/search.html?q=&maxTime=&maxPrice=&sort=&page= -> NomNom.data.get("/recipes") */
(function () {
  "use strict";
  const LIMIT = 12;
  const grid = document.getElementById("search-results-grid");
  const msg = document.getElementById("grid-message");
  const count = document.getElementById("result-count");
  const pager = document.getElementById("pagination");
  const keywordElement = document.getElementById("search-keyword-text");
  const form = document.getElementById("search-page-form");
  const input = document.getElementById("search-page-input");
  const sortSel = document.getElementById("sort-select");
  const timeSel = document.getElementById("max-time-select");
  const priceSel = document.getElementById("max-price-select");
  let reqId = 0;

  function readState() {
    const searchParams = new URLSearchParams(location.search);
    return {
      q: (searchParams.get("q") || "").trim(),
      sort: searchParams.get("sort") || "", // trống = xếp theo độ liên quan (có từ khóa) hoặc đánh giá (không từ khóa)
      maxTime: searchParams.get("maxTime") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      page: Math.max(1, parseInt(searchParams.get("page"), 10) || 1)
    };
  }
  function urlFor(state) {
    const out = [];
    ["q", "maxTime", "maxPrice"].forEach(function (k) { if (state[k]) out.push(k + "=" + encodeURIComponent(state[k])); });
    if (state.sort) out.push("sort=" + encodeURIComponent(state.sort));
    if (state.page > 1) out.push("page=" + state.page);
    return "/pages/search.html" + (out.length ? "?" + out.join("&") : "");
  }
  function navigateTo(state, replace) {
    const url = urlFor(state);
    if (replace) history.replaceState(null, "", url); else history.pushState(null, "", url);
    render();
  }
  function setSelect(sel, value) {
    sel.value = value;
    if (sel.value !== value) sel.selectedIndex = 0;
  }
  function showMessage(text, retry, linkHref, linkText) {
    msg.hidden = false;
    msg.textContent = text;
    if (linkHref) {
      msg.appendChild(document.createTextNode(" "));
      const a = document.createElement("a");
      a.href = linkHref;
      a.textContent = linkText;
      msg.appendChild(a);
    }
    if (retry) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = "Thử lại";
      b.addEventListener("click", render);
      msg.appendChild(b);
    }
  }

  function render() {
    const state = readState();
    input.value = state.q;
    keywordElement.textContent = state.q ? state.q : "tất cả công thức";
    // Không dùng dấu ngoặc kép trong tiêu đề tab (một số trình duyệt/khung xem bỏ dấu " làm hiện hai dấu cách)
    document.title = (state.q ? "Tìm kiếm: " + state.q : "Kết quả tìm kiếm") + " | NomNom";
    setSelect(sortSel, state.sort);
    setSelect(timeSel, state.maxTime);
    setSelect(priceSel, state.maxPrice);
    const requestId = ++reqId;
    msg.hidden = true;
    grid.setAttribute("aria-busy", "true");
    grid.innerHTML = NomNom.skeletonHtml(6);
    pager.innerHTML = "";
    count.textContent = "Đang tìm...";
    NomNom.data.get("/recipes", { q: state.q, sort: state.sort, maxTime: state.maxTime, maxPrice: state.maxPrice, page: state.page, limit: LIMIT })
      .then(function (response) {
        if (requestId !== reqId) return;
        grid.setAttribute("aria-busy", "false");
        if (response.pages && state.page > response.pages) { state.page = response.pages; navigateTo(state, true); return; }
        grid.innerHTML = (response.items || []).map(function (recipe) { return NomNom.cardHtml(recipe); }).join("");
        if (!response.total) {
          count.textContent = "Không có kết quả";
          showMessage('Không tìm thấy công thức nào' + (state.q ? ' cho "' + state.q + '"' : "") + ". Hãy thử từ khóa khác hoặc", false, "/pages/category.html", "xem danh mục món ăn.");
          return;
        }
        count.textContent = "Tìm thấy " + response.total + " công thức";
        pager.innerHTML = NomNom.pagerHtml(response.page || state.page, response.pages || 1, function (pageNumber) {
          return urlFor(Object.assign({}, state, { page: pageNumber }));
        });
      })
      .catch(function (e) {
        if (requestId !== reqId) return;
        grid.setAttribute("aria-busy", "false");
        grid.innerHTML = "";
        count.textContent = "";
        showMessage(NomNom.errorText(e), true);
      });
  }

  function update(patch) { navigateTo(Object.assign(readState(), { page: 1 }, patch)); }

  form.addEventListener("submit", function (e) { e.preventDefault(); update({ q: input.value.trim() }); });
  sortSel.addEventListener("change", function () { update({ sort: sortSel.value }); });
  timeSel.addEventListener("change", function () { update({ maxTime: timeSel.value }); });
  priceSel.addEventListener("change", function () { update({ maxPrice: priceSel.value }); });
  pager.addEventListener("click", function (e) {
    const a = e.target.closest("a[data-page]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    update({ page: parseInt(a.dataset.page, 10) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener("popstate", render);
  render();
})();
