/* NomNom — lớp truy cập dữ liệu dùng chung. Nạp bằng <script src="/js/data.js"></script> (sau /js/store.js) (TRƯỚC script của trang).
   Dùng: const data = await NomNom.data.get('/recipes', { q: 'bò', page: 2 });
         await NomNom.data.post('/auth/login', { identifier, password });
   Lỗi: ném NomNom.ApiError { status, message, field } (message tiếng Việt).
   Cũng có tiện ích hiển thị: NomNom.esc, NomNom.money, NomNom.minutes, NomNom.stars, NomNom.qs. */
(function () {
  "use strict";
  var NomNom = (window.NomNom = window.NomNom || {});

  function ApiError(status, message, field) {
    this.name = "ApiError";
    this.status = status;
    this.message = message;
    this.field = field || null;
  }
  ApiError.prototype = Object.create(Error.prototype);
  NomNom.ApiError = ApiError;

  function qs(params) {
    var out = [];
    Object.keys(params || {}).forEach(function (k) {
      var v = params[k];
      if (v === undefined || v === null || v === "") return;
      out.push(encodeURIComponent(k) + "=" + encodeURIComponent(Array.isArray(v) ? v.join(",") : v));
    });
    return out.length ? "?" + out.join("&") : "";
  }
  NomNom.qs = qs;

  /* Gọi vào "kho dữ liệu" (store.js) — không có mạng/máy chủ. Lỗi (status >= 400) ném ApiError. */
  function request(method, path, body, params) {
    return window.NomNomStore.run(method, path + qs(params), body).then(function (res) {
      var data = res.data;
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
  NomNom.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  NomNom.money = function (n) {
    n = Number(n) || 0;
    return n.toLocaleString("vi-VN") + "đ";
  };
  NomNom.minutes = function (n) {
    n = Number(n) || 0;
    if (n < 60) return n + " phút";
    var h = Math.floor(n / 60), m = n % 60;
    return h + " giờ" + (m ? " " + m + " phút" : "");
  };
  NomNom.stars = function (n) {
    n = Math.round(Number(n) || 0);
    return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
  };
  NomNom.recipeUrl = function (id) { return "/pages/recipe.html?id=" + encodeURIComponent(id); };
})();
