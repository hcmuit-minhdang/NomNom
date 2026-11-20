/* NomNom: lớp truy cập dữ liệu dùng chung. Nạp bằng <script src="/js/data.js"></script> (sau /js/store.js) (TRƯỚC script của trang).
   Dùng: const data = await NomNom.data.get('/recipes', { q: 'bò', page: 2 });
         await NomNom.data.post('/auth/login', { identifier, password });
   Lỗi: ném NomNom.ApiError { status, message, field } (message tiếng Việt).
   Cũng có tiện ích hiển thị: NomNom.esc, NomNom.money, NomNom.minutes, NomNom.stars, NomNom.qs. */
(function () {
  "use strict";
  const NomNom = (window.NomNom = window.NomNom || {});

  function ApiError(status, message, field) {
    this.name = "ApiError";
    this.status = status;
    this.message = message;
    this.field = field || null;
  }
  ApiError.prototype = Object.create(Error.prototype);
  NomNom.ApiError = ApiError;

  function buildQueryString(params) {
    const out = [];
    Object.keys(params || {}).forEach(function (k) {
      const value = params[k];
      if (value === undefined || value === null || value === "") return;
      out.push(encodeURIComponent(k) + "=" + encodeURIComponent(Array.isArray(value) ? value.join(",") : value));
    });
    return out.length ? "?" + out.join("&") : "";
  }
  NomNom.qs = buildQueryString;

  /* Gọi vào "kho dữ liệu" (store.js), không có mạng/máy chủ. Lỗi (status >= 400) ném ApiError. */
  function request(method, path, body, params) {
    return window.NomNomStore.run(method, path + buildQueryString(params), body).then(function (res) {
      const data = res.data;
      if (res.status >= 400) throw new ApiError(res.status, (data && data.error) || "Có lỗi xảy ra (" + res.status + ")", data && data.field);
      return data;
    });
  }

  NomNom.data = {
    get: function (path, params) { return request("GET", path, undefined, params); },
    post: function (path, body) { return request("POST", path, body === undefined ? {} : body); },
    put: function (path, body) { return request("PUT", path, body === undefined ? {} : body); },
    patch: function (path, body) { return request("PATCH", path, body); },
    del: function (path, body) { return request("DELETE", path, body); }
  };

  /* ---- tiện ích hiển thị ---- */
  NomNom.esc = function (text) {
    return String(text == null ? "" : text).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  };
  NomNom.money = function (amount) {
    amount = Number(amount) || 0;
    return amount.toLocaleString("vi-VN") + "đ";
  };
  NomNom.minutes = function (totalMinutes) {
    totalMinutes = Number(totalMinutes) || 0;
    if (totalMinutes < 60) return totalMinutes + " phút";
    const hours = Math.floor(totalMinutes / 60), remainingMinutes = totalMinutes % 60;
    return hours + " giờ" + (remainingMinutes ? " " + remainingMinutes + " phút" : "");
  };
  NomNom.stars = function (starCount) {
    starCount = Math.round(Number(starCount) || 0);
    return "★★★★★".slice(0, starCount) + "☆☆☆☆☆".slice(0, 5 - starCount);
  };
  NomNom.recipeUrl = function (recipeId) { return "/pages/recipe.html?id=" + encodeURIComponent(recipeId); };
})();
