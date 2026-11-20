/* NomNom: tiện ích dùng chung cho trang danh sách (category, search, home): thẻ món ăn, phân trang, skeleton. */
(function () {
  "use strict";
  const NomNom = (window.NomNom = window.NomNom || {});
  const esc = function (text) { return NomNom.esc(text); };

  NomNom.fallbackImg = function (img) {
    img.onerror = null;
    img.src = "/images/food.png";
  };

  /* Nhãn trạng thái nguyên liệu trên thẻ món ở Danh mục / Tìm kiếm (theo Figma).
     Dữ liệu có thể có enoughIngredients: false để hiện "Chưa đủ nguyên liệu"; mặc định là đủ. */
  NomNom.statusTagHtml = function (recipe) {
    return recipe.enoughIngredients === false
      ? '<span class="recipe-status recipe-status--missing">Chưa đủ nguyên liệu</span>'
      : '<span class="recipe-status">Đủ nguyên liệu</span>';
  };

  /* Thẻ món ăn (RecipeCard) -> HTML. cls: 'similar-card' (category/search) | 'recipe-card' | 'compact-recipe-card' */
  /* showStatus = true: hiện nhãn "Đủ / Chưa đủ nguyên liệu" (chỉ trang Danh mục dùng); mặc định ẩn. */
  NomNom.cardHtml = function (recipe, cls, imgCls, showStatus) {
    cls = cls || "similar-card";
    imgCls = imgCls || "similar-image";
    const plain = cls === "similar-card";
    const img = recipe.image || "/images/food.png";
    return '<a href="' + esc(NomNom.recipeUrl(recipe.id)) + '" class="' + cls + '">' +
      '<img loading="lazy" decoding="async" src="' + esc(img) + '" alt="' + esc(recipe.name) + '" class="' + imgCls + '" onerror="NomNom.fallbackImg(this)">' +
      (plain ? "" : '<div class="recipe-info">') +
      '<span class="recipe-name">' + esc(recipe.name) + '</span>' +
      '<span class="recipe-price">' + esc(NomNom.money(recipe.price)) + ' / phần</span>' +
      (plain && showStatus ? NomNom.statusTagHtml(recipe) : "") +
      '<span class="recipe-time">Thời gian: ' + esc(NomNom.minutes(recipe.time)) + '</span>' +
      (plain ? "" : '</div>') +
      '</a>';
  };

  NomNom.skeletonHtml = function (count, cls) {
    let out = "";
    for (let i = 0; i < count; i++) {
      out += '<div class="' + (cls || "similar-card") + ' is-skeleton" aria-hidden="true"><div class="skeleton__img"></div><span class="skeleton__line"></span><span class="skeleton__line skeleton__line--short"></span></div>';
    }
    return out;
  };

  /* Phân trang: hrefFor(page) -> URL thật (không bao giờ '#'). */
  NomNom.pagerHtml = function (page, pages, hrefFor) {
    if (!pages || pages <= 1) return "";
    const out = [];
    function link(pageNumber, label, active, aria) {
      return '<a href="' + esc(hrefFor(pageNumber)) + '" class="pagination__link' + (active ? " is-active" : "") + '" data-page="' + pageNumber + '" aria-label="' + aria + '"' +
        (active ? ' aria-current="page"' : "") + '>' + label + '</a>';
    }
    /* Nút trước/sau luôn hiện như Figma; ở trang đầu/cuối thì mờ và không bấm được. */
    function disabled(label) {
      return '<span class="pagination__link is-disabled" aria-disabled="true">' + label + '</span>';
    }
    out.push(page > 1 ? link(page - 1, "◀ Trang trước", false, "Trang trước") : disabled("◀ Trang trước"));
    const show = {};
    [1, 2, page - 1, page, page + 1, pages - 1, pages].forEach(function (pageNumber) { if (pageNumber >= 1 && pageNumber <= pages) show[pageNumber] = true; });
    let last = 0;
    Object.keys(show).map(Number).sort(function (a, b) { return a - b; }).forEach(function (pageNumber) {
      if (last && pageNumber - last > 1) out.push('<span class="pagination__link pagination__link--dots">...</span>');
      out.push(link(pageNumber, pageNumber, pageNumber === page, "Trang " + pageNumber));
      last = pageNumber;
    });
    out.push(page < pages ? link(page + 1, "Trang sau ▶", false, "Trang sau") : disabled("Trang sau ▶"));
    return out.join("");
  };

  NomNom.errorText = function (e) {
    return (e && e.message) || "Không tải được dữ liệu. Vui lòng thử lại.";
  };
})();
