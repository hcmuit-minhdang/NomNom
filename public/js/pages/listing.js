/* NomNom — tiện ích dùng chung cho trang danh sách (category, search, home): thẻ món ăn, phân trang, skeleton. */
(function () {
  "use strict";
  var NomNom = (window.NomNom = window.NomNom || {});
  var esc = function (s) { return NomNom.esc(s); };

  NomNom.fallbackImg = function (img) {
    img.onerror = null;
    img.src = "/assets/images/food.png";
  };

  /* Nhãn trạng thái nguyên liệu trên thẻ món ở Danh mục / Tìm kiếm (theo Figma).
     Dữ liệu có thể có enoughIngredients: false để hiện "Chưa đủ nguyên liệu"; mặc định là đủ. */
  NomNom.statusTagHtml = function (r) {
    return r.enoughIngredients === false
      ? '<span class="recipe-status is-missing">Chưa đủ nguyên liệu</span>'
      : '<span class="recipe-status">Đủ nguyên liệu</span>';
  };

  /* Thẻ món ăn (RecipeCard) -> HTML. cls: 'similar-card' (category/search) | 'recipe-card' | 'recipe-card-compressed' */
  /* showStatus = true: hiện nhãn "Đủ / Chưa đủ nguyên liệu" (chỉ trang Danh mục dùng); mặc định ẩn. */
  NomNom.cardHtml = function (r, cls, imgCls, showStatus) {
    cls = cls || "similar-card";
    imgCls = imgCls || "similar-image";
    var plain = cls === "similar-card";
    var img = r.image || "/assets/images/food.png";
    return '<a href="' + esc(NomNom.recipeUrl(r.id)) + '" class="' + cls + '">' +
      '<img src="' + esc(img) + '" alt="' + esc(r.name) + '" class="' + imgCls + '" loading="lazy" onerror="NomNom.fallbackImg(this)">' +
      (plain ? "" : '<div class="recipe-info">') +
      '<span class="recipe-name">' + esc(r.name) + '</span>' +
      '<span class="recipe-price">' + esc(NomNom.money(r.price)) + ' / phần</span>' +
      (plain && showStatus ? NomNom.statusTagHtml(r) : "") +
      '<span class="recipe-time">Thời gian: ' + esc(NomNom.minutes(r.time)) + '</span>' +
      (plain ? "" : '</div>') +
      '</a>';
  };

  NomNom.skeletonHtml = function (n, cls) {
    var out = "";
    for (var i = 0; i < n; i++) {
      out += '<div class="' + (cls || "similar-card") + ' is-skeleton" aria-hidden="true"><div class="skeleton-img"></div><span class="skeleton-line"></span><span class="skeleton-line short"></span></div>';
    }
    return out;
  };

  /* Phân trang: hrefFor(page) -> URL thật (không bao giờ '#'). */
  NomNom.pagerHtml = function (page, pages, hrefFor) {
    if (!pages || pages <= 1) return "";
    var out = [];
    function link(p, label, active, aria) {
      return '<a href="' + esc(hrefFor(p)) + '" class="page-link' + (active ? " is-active" : "") + '" data-page="' + p + '" aria-label="' + aria + '"' +
        (active ? ' aria-current="page"' : "") + '>' + label + '</a>';
    }
    /* Nút trước/sau luôn hiện như Figma; ở trang đầu/cuối thì mờ và không bấm được. */
    function disabled(label) {
      return '<span class="page-link is-disabled" aria-disabled="true">' + label + '</span>';
    }
    out.push(page > 1 ? link(page - 1, "◀ Trang trước", false, "Trang trước") : disabled("◀ Trang trước"));
    var show = {};
    [1, 2, page - 1, page, page + 1, pages - 1, pages].forEach(function (p) { if (p >= 1 && p <= pages) show[p] = true; });
    var last = 0;
    Object.keys(show).map(Number).sort(function (a, b) { return a - b; }).forEach(function (p) {
      if (last && p - last > 1) out.push('<span class="page-link page-dots">...</span>');
      out.push(link(p, p, p === page, "Trang " + p));
      last = p;
    });
    out.push(page < pages ? link(page + 1, "Trang sau ▶", false, "Trang sau") : disabled("Trang sau ▶"));
    return out.join("");
  };

  NomNom.errorText = function (e) {
    return (e && e.message) || "Không tải được dữ liệu. Vui lòng thử lại.";
  };
})();
