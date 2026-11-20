/* NomNom - Góc của tôi: dữ liệu từ NomNom.data (localStorage) cho 5 trang user.
   Cần: /js/data.js (NomNom.data, NomNom.esc, NomNom.recipeUrl) và NomNomAuth (auth.js). */
(function () {
  "use strict";

  const FALLBACK_IMG = "/images/account/recipe.png";
  const PAGE_SIZE = 12;
  const nomNom = window.NomNom;
  const esc = nomNom.esc;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* 1. Tab đang chọn */
  let file = (location.pathname.split("/").pop() || "overview.html").toLowerCase();
  if (file === "index.html" || file === "") file = "overview.html";
  $$(".user-tabs__tab").forEach(function (tab) {
    const isActive = tab.getAttribute("href").split("/").pop().toLowerCase() === file;
    tab.classList.toggle("is-active", isActive);
    if (isActive) tab.setAttribute("aria-current", "page");
    else tab.removeAttribute("aria-current");
  });

  /* ---------- tiện ích ---------- */
  function fmtDate(iso) {
    const date = new Date(iso);
    if (isNaN(date)) return "";
    const pad = function (number) { return (number < 10 ? "0" : "") + number; };
    return pad(date.getDate()) + "." + pad(date.getMonth() + 1) + "." + String(date.getFullYear()).slice(2) +
      " " + pad(date.getHours()) + "." + pad(date.getMinutes());
  }
  function emptyMsg(list, text) {
    list.innerHTML = '<li class="u-empty">' + esc(text) + "</li>";
  }
  function fixImgs(root) {
    $$("img[data-fb]", root).forEach(function (img) {
      img.addEventListener("error", function () {
        if (img.getAttribute("src") !== FALLBACK_IMG) img.src = FALLBACK_IMG;
      });
    });
  }

  function cardHtml(recipe, action) {
    let btn = "";
    if (action === "unsave") {
      btn = '<button type="button" class="recipe-card__act" data-act="unsave" data-id="' + esc(recipe.id) +
        '" aria-label="Bỏ lưu công thức ' + esc(recipe.name) + '" title="Bỏ lưu">&#9829;</button>';
    } else if (action === "delete") {
      btn = '<button type="button" class="recipe-card__act recipe-card__act--edit" data-act="edit" data-id="' + esc(recipe.id) +
        '" aria-label="Cập nhật công thức ' + esc(recipe.name) + '" title="Cập nhật công thức">&#9998;</button>' +
        '<button type="button" class="recipe-card__act recipe-card__act--del" data-act="delete" data-id="' + esc(recipe.id) +
        '" aria-label="Xóa công thức ' + esc(recipe.name) + '" title="Xóa công thức">&#10005;</button>';
    }
    return '<li class="recipe-card"><a href="' + esc(nomNom.recipeUrl(recipe.id)) + '"><img loading="lazy" decoding="async" class="recipe-card__img" data-fb src="' +
      esc(recipe.image || FALLBACK_IMG) + '" alt="" width="248" height="185"><span class="recipe-card__name">' +
      esc(recipe.name) + "</span></a>" + btn + "</li>";
  }

  function reviewHtml(review, mode) {
    const delBtn = '<button class="cmt__reply" type="button" data-act="del-review" data-id="' + esc(review.id) + '">Xóa</button>';
    return '<li class="cmt__card" data-review="' + esc(review.id) + '"><article class="cmt">' +
      '<a class="cmt__recipe" href="' + esc(nomNom.recipeUrl(review.recipeId)) + '">' + esc(review.recipeName) + "</a>" +
      '<div class="cmt__meta"><p class="cmt__who"><span>' + esc(review.user && review.user.username) + "</span> " +
      '<span class="cmt__stars" aria-label="' + esc(review.rating) + ' trên 5 sao">' + esc(nomNom.stars(review.rating)) + "</span></p>" +
      '<span class="cmt__time"><img loading="lazy" decoding="async" src="/images/account/clock.png" alt=""><time datetime="' + esc(review.createdAt) + '">' +
      esc(fmtDate(review.createdAt)) + "</time></span></div>" +
      '<p class="cmt__text">' + esc(review.text) + "</p>" +
      '<div class="cmt__actions"><button class="cmt__like" type="button" data-act="like" data-id="' + esc(review.id) +
      '" aria-pressed="' + (review.liked ? "true" : "false") + '" aria-label="Thích đánh giá"><img loading="lazy" decoding="async" src="/images/account/like.png" alt="">' +
      '<span class="cmt__like-count">' + esc(review.likes || 0) + "</span></button>" +
      (mode === "full" ? delBtn : "") + "</div></article></li>";
  }

  /* ---------- phân trang ---------- */
  function renderPager(pager, total, current, onGo) {
    const list = $(".pager__list", pager);
    pager.hidden = total <= 1;
    list.innerHTML = "";
    if (total <= 1) return;
    function btn(pageNumber) {
      const listItem = document.createElement("li"), b = document.createElement("button");
      b.type = "button"; b.className = "pager__btn" + (pageNumber === current ? " is-current" : "");
      b.textContent = pageNumber; b.dataset.page = pageNumber;
      if (pageNumber === current) b.setAttribute("aria-current", "page");
      listItem.appendChild(b); return listItem;
    }
    function dots() {
      const listItem = document.createElement("li");
      listItem.className = "pager__dots"; listItem.setAttribute("aria-hidden", "true");
      listItem.innerHTML = "<i></i><i></i><i></i>"; return listItem;
    }
    function arrow(dir) {
      const listItem = document.createElement("li"), b = document.createElement("button");
      b.type = "button"; b.className = "pager__next"; b.dataset.dir = dir;
      const img = '<img src="/images/account/page-next.svg" alt="">';
      b.innerHTML = dir === "next" ? "Trang sau" + img : img.replace("<img", '<img style="transform:rotate(90deg)"') + "Trang trước";
      listItem.appendChild(b); return listItem;
    }
    const set = {};
    [1, 2, 3, total, current - 1, current, current + 1].forEach(function (pageNumber) {
      if (pageNumber >= 1 && pageNumber <= total) set[pageNumber] = true;
    });
    const pages = Object.keys(set).map(Number).sort(function (a, b) { return a - b; });
    if (current > 1) list.appendChild(arrow("prev"));
    pages.forEach(function (pageNumber, i) {
      if (i > 0 && pageNumber - pages[i - 1] > 1) list.appendChild(dots());
      list.appendChild(btn(pageNumber));
    });
    if (current < total) list.appendChild(arrow("next"));
    list.onclick = function (e) {
      const target = e.target.closest("button");
      if (!target) return;
      if (target.dataset.page) onGo(parseInt(target.dataset.page, 10));
      else if (target.dataset.dir === "next") onGo(current + 1);
      else if (target.dataset.dir === "prev") onGo(current - 1);
    };
  }

  /* ---------- trang danh sách: saved / uploaded / history ---------- */
  function initList(kind) {
    const list = $("[data-list]");
    const pager = $(".pager");
    const heading = $(".u-heading");
    let page = 1;
    let clearBtn = null;
    const action = kind === "saved" ? "unsave" : kind === "uploaded" ? "delete" : null;
    const emptyText = {
      saved: "Bạn chưa lưu công thức nào. Hãy khám phá và nhấn lưu món bạn thích!",
      uploaded: "Bạn chưa đăng tải công thức nào.",
      history: "Lịch sử xem còn trống."
    }[kind];

    if (kind === "history") {
      const bar = document.createElement("div");
      bar.className = "u-toolbar";
      bar.innerHTML = '<button type="button" class="u-btn u-btn--danger" data-act="clear-history">Xóa lịch sử</button>';
      heading.insertAdjacentElement("afterend", bar);
      clearBtn = $("button", bar);
    }
    if (kind === "uploaded") {
      const bar2 = document.createElement("div");
      bar2.className = "u-toolbar";
      bar2.innerHTML = '<a class="u-btn" href="/pages/upload.html">+ Đăng công thức mới</a>';
      heading.insertAdjacentElement("afterend", bar2);
    }

    function load(pageNumber) {
      page = Math.max(1, pageNumber || 1);
      list.setAttribute("aria-busy", "true");
      nomNom.data.get("/me/" + kind, { page: page, limit: PAGE_SIZE }).then(function (response) {
        if (response.pages && page > response.pages) { return load(response.pages); }
        const items = response.items || [];
        if (!items.length) {
          emptyMsg(list, emptyText);
          pager.hidden = true;
          if (clearBtn) clearBtn.hidden = true;
        } else {
          list.innerHTML = items.map(function (recipe) { return cardHtml(recipe, action); }).join("");
          fixImgs(list);
          if (clearBtn) clearBtn.hidden = false;
          renderPager(pager, response.pages || 1, response.page || page, function (pageNumber) {
            load(pageNumber);
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
        }
      }).catch(function (err) {
        emptyMsg(list, err.message);
      }).then(function () { list.removeAttribute("aria-busy"); });
    }

    document.addEventListener("click", function (e) {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      const act = b.dataset.act, recipeId = b.dataset.id;
      if (act === "unsave") {
        b.disabled = true;
        nomNom.data.del("/recipes/" + encodeURIComponent(recipeId) + "/save").then(function () { load(page); })
          .catch(function (err) { b.disabled = false; alert(err.message); });
      } else if (act === "delete") {
        if (!confirm("Xóa công thức này? Thao tác không thể hoàn tác.")) return;
        b.disabled = true;
        nomNom.data.del("/recipes/" + encodeURIComponent(recipeId)).then(function () { load(page); })
          .catch(function (err) { b.disabled = false; alert(err.message); });
      } else if (act === "edit") {
        nomNom.data.get("/recipes/" + encodeURIComponent(recipeId), { history: 0 }).then(function (recipe) {
          openEditor({ title: "Cập nhật công thức", fields: [
            { name: "name", label: "Tên món", value: recipe.name || recipe.title },
            { name: "description", label: "Mô tả", type: "textarea", value: recipe.description || "" },
            { name: "time", label: "Tổng thời gian (phút)", type: "number", value: recipe.time || "" },
            { name: "servings", label: "Khẩu phần (người)", type: "number", value: recipe.baseServings || recipe.servings || "" }],
            onSubmit: function (formValues) {
              const body = { name: formValues.name.trim(), description: formValues.description.trim() };
              if (String(formValues.time).trim() !== "") body.time = Number(formValues.time);
              if (String(formValues.servings).trim() !== "") body.servings = Number(formValues.servings);
              return nomNom.data.patch("/recipes/" + encodeURIComponent(recipeId), body).then(function () { load(page); });
            } });
        }).catch(function (err) { alert(err.message); });
      } else if (act === "clear-history") {
        if (!confirm("Xóa toàn bộ lịch sử xem?")) return;
        nomNom.data.del("/me/history").then(function () { load(1); }).catch(function (err) { alert(err.message); });
      }
    });
    load(1);
  }

  /* ---------- đánh giá ---------- */
  function bindReviewActions(list, reload) {
    list.addEventListener("click", function (e) {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      const reviewId = b.dataset.id;
      if (b.dataset.act === "like") {
        nomNom.data.post("/reviews/" + encodeURIComponent(reviewId) + "/like").then(function (response) {
          b.setAttribute("aria-pressed", response.liked ? "true" : "false");
          $(".cmt__like-count", b).textContent = response.likes;
        }).catch(function (err) { alert(err.message); });
      } else if (b.dataset.act === "del-review") {
        if (!confirm("Xóa đánh giá này?")) return;
        nomNom.data.del("/reviews/" + encodeURIComponent(reviewId)).then(reload).catch(function (err) { alert(err.message); });
      }
    });
  }
  function initReviewed() {
    const list = $("[data-list]");
    function load() {
      nomNom.data.get("/me/reviews").then(function (response) {
        const items = response.items || [];
        if (!items.length) emptyMsg(list, "Bạn chưa đánh giá công thức nào.");
        else list.innerHTML = items.map(function (review) { return reviewHtml(review, "full"); }).join("");
      }).catch(function (err) { emptyMsg(list, err.message); });
    }
    bindReviewActions(list, load);
    load();
  }

  /* ---------- tổng quan ---------- */
  function initOverview() {
    const lists = {};
    $$("[data-list]").forEach(function (listElement) {
      const sec = listElement.closest("section");
      const sectionId = (sec && sec.getAttribute("aria-labelledby")) || "";
      lists[sectionId.replace("h-", "")] = listElement;
    });
    function cards(key, items, text) {
      const listElement = lists[key];
      if (!listElement) return;
      if (!items || !items.length) return emptyMsg(listElement, text);
      listElement.innerHTML = items.map(function (recipe) { return cardHtml(recipe, null); }).join("");
      fixImgs(listElement);
    }
    function load() {
      nomNom.data.get("/me/overview").then(function (overview) {
        cards("saved", overview.recentSaved, "Bạn chưa lưu công thức nào.");
        cards("uploaded", overview.recentUploaded, "Bạn chưa đăng tải công thức nào.");
        nomNom.data.get("/me/history", { limit: 4 }).then(function (historyResponse) {
          cards("history", historyResponse.items, "Lịch sử xem còn trống.");
        }).catch(function () { emptyMsg(lists.history, "Lịch sử xem còn trống."); });
        if (lists.reviews) {
          if (!overview.recentReviews || !overview.recentReviews.length) emptyMsg(lists.reviews, "Bạn chưa đánh giá công thức nào.");
          else lists.reviews.innerHTML = overview.recentReviews.map(function (review) { return reviewHtml(review, "brief"); }).join("");
        }
        const counts = overview.counts || {};
        ["saved", "uploaded", "reviews", "history"].forEach(function (k) {
          const heading = $("#h-" + k);
          if (heading && counts[k] != null && !heading.dataset.counted) {
            heading.dataset.counted = "1";
            heading.insertAdjacentHTML("beforeend", ' <small class="u-count">(' + esc(counts[k]) + ")</small>");
          }
        });
      }).catch(function (err) {
        Object.keys(lists).forEach(function (k) { emptyMsg(lists[k], err.message); });
      });
    }
    if (lists.reviews) bindReviewActions(lists.reviews, load);
    load();
    initAccountBox();
  }

  function renderProfile(user) {
    const name = $(".profile-banner__name");
    if (name) name.textContent = user.username;
    const avatarImage = $(".avatar__img");
    if (avatarImage && user.avatar) avatarImage.src = user.avatar;
    const coverImage = $(".profile-banner__bg img");
    if (coverImage && user.cover) coverImage.src = user.cover;
    const vals = [user.email, user.username, "••••••••"];
    $$(".acc-row__value").forEach(function (a, i) {
      const valueSpan = $("span", a);
      if (valueSpan && vals[i] != null) valueSpan.textContent = vals[i];
    });
  }

  /* ---------- đổi ảnh đại diện / ảnh bìa ---------- */
  // Đọc file ảnh, thu nhỏ bằng canvas (avatar: vuông 256px, bìa: tối đa 1400px) rồi lưu vào hồ sơ.
  function pickImage(kind) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/webp";
    input.onchange = function () {
      const file = input.files && input.files[0];
      if (!file) return;
      if (file.size > 8 * 1024 * 1024) { alert("Ảnh quá lớn (tối đa 8 MB)."); return; }
      const reader = new FileReader();
      reader.onload = function () {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement("canvas"), context = canvas.getContext("2d");
          if (kind === "avatar") {
            const side = Math.min(img.width, img.height);
            canvas.width = canvas.height = 256;
            context.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, 256, 256);
          } else {
            const k = Math.min(1, 1400 / img.width, 600 / img.height);
            canvas.width = Math.round(img.width * k); canvas.height = Math.round(img.height * k);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
          const body = {};
          body[kind] = canvas.toDataURL("image/jpeg", 0.82);
          nomNom.data.patch("/me", body).then(function (response) {
            if (response && response.user) { window.NomNomAuth && NomNomAuth.refresh(response.user); renderProfile(response.user); }
          }).catch(function (err) { alert((err && err.message) || "Không đổi được ảnh. Hãy thử ảnh khác."); });
        };
        img.onerror = function () { alert("Không đọc được ảnh này."); };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }
  (function initImagePickers() {
    const badge = $(".avatar__badge");
    if (badge) {
      badge.setAttribute("role", "button"); badge.setAttribute("tabindex", "0"); badge.setAttribute("title", "Đổi ảnh đại diện");
      badge.addEventListener("click", function () { pickImage("avatar"); });
      badge.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickImage("avatar"); } });
    }
    const banner = $(".profile-banner");
    if (banner) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "profile-banner__cover-btn"; b.textContent = "Đổi ảnh bìa";
      b.addEventListener("click", function () { pickImage("cover"); });
      banner.appendChild(b);
    }
  })();

  /* ---------- sửa / xóa tài khoản ---------- */
  let dlg;
  function ensureDialog() {
    if (dlg) return dlg;
    dlg = document.createElement("dialog");
    dlg.className = "acc-dialog";
    dlg.innerHTML = '<form class="acc-dialog__form" novalidate>' +
      '<h3 class="acc-dialog__title"></h3><div class="acc-dialog__fields"></div>' +
      '<p class="acc-dialog__error" role="alert" hidden></p>' +
      '<div class="acc-dialog__btns"><button type="button" class="u-btn" data-cancel>Hủy</button>' +
      '<button type="submit" class="u-btn u-btn--primary">Lưu</button></div></form>';
    document.body.appendChild(dlg);
    $("[data-cancel]", dlg).addEventListener("click", function () { dlg.close(); });
    return dlg;
  }
  function openEditor(opts) {
    const dialog = ensureDialog();
    const form = $("form", dialog), errEl = $(".acc-dialog__error", dialog), submit = $("[type=submit]", dialog);
    $(".acc-dialog__title", dialog).textContent = opts.title;
    $(".acc-dialog__fields", dialog).innerHTML = opts.fields.map(function (field) {
      // type "textarea": ô nhiều dòng (vd. Mô tả công thức)
      if (field.type === "textarea") return '<label class="acc-dialog__label">' + esc(field.label) + '<textarea class="acc-dialog__input acc-dialog__textarea" name="' +
        esc(field.name) + '" rows="5" maxlength="5000">' + esc(field.value || "") + '</textarea></label>';
      return '<label class="acc-dialog__label">' + esc(field.label) + '<input class="acc-dialog__input" name="' + esc(field.name) +
        '" type="' + (field.type || "text") + '" value="' + esc(field.value || "") + '" autocomplete="' + (field.ac || "off") + '"></label>';
    }).join("");
    submit.textContent = opts.submit || "Lưu";
    submit.classList.toggle("u-btn--danger", !!opts.danger);
    errEl.hidden = true;
    form.onsubmit = function (e) {
      e.preventDefault();
      const data = {};
      opts.fields.forEach(function (field) { data[field.name] = form.elements[field.name].value; });
      errEl.hidden = true;
      submit.disabled = true;
      Promise.resolve().then(function () { return opts.onSubmit(data); }).then(function () { dialog.close(); }).catch(function (err) {
        errEl.textContent = (err && err.message) || "Có lỗi xảy ra.";
        errEl.hidden = false;
        const inp = err && err.field && form.elements[err.field];
        if (inp) inp.focus();
      }).then(function () { submit.disabled = false; });
    };
    dialog.showModal();
    form.elements[opts.fields[0].name].focus();
  }

  function initAccountBox() {
    const auth = window.NomNomAuth;
    function patch(body) {
      return nomNom.data.patch("/me", body).then(function (response) {
        if (response && response.user) { auth.refresh(response.user); renderProfile(response.user); }
      });
    }
    const defs = [
      function () {
        openEditor({ title: "Đổi email", fields: [
          { name: "email", label: "Email mới", type: "email", value: auth.user.email, ac: "email" },
          { name: "currentPassword", label: "Mật khẩu hiện tại", type: "password", ac: "current-password" }],
          onSubmit: function (formValues) { return patch({ email: formValues.email.trim(), currentPassword: formValues.currentPassword }); } });
      },
      function () {
        openEditor({ title: "Đổi tên đăng nhập", fields: [
          { name: "username", label: "Tên đăng nhập mới (3–24 ký tự a-z, 0-9, _ .)", value: auth.user.username, ac: "username" },
          { name: "currentPassword", label: "Mật khẩu hiện tại", type: "password", ac: "current-password" }],
          onSubmit: function (formValues) { return patch({ username: formValues.username.trim().toLowerCase(), currentPassword: formValues.currentPassword }); } });
      },
      function () {
        openEditor({ title: "Đổi mật khẩu", fields: [
          { name: "currentPassword", label: "Mật khẩu hiện tại", type: "password", ac: "current-password" },
          { name: "newPassword", label: "Mật khẩu mới (tối thiểu 6 ký tự)", type: "password", ac: "new-password" },
          { name: "confirm", label: "Nhập lại mật khẩu mới", type: "password", ac: "new-password" }],
          onSubmit: function (formValues) {
            if (formValues.newPassword.length < 6) return Promise.reject({ message: "Mật khẩu mới cần ít nhất 6 ký tự.", field: "newPassword" });
            if (formValues.newPassword !== formValues.confirm) return Promise.reject({ message: "Mật khẩu xác nhận chưa trùng khớp.", field: "confirm" });
            return patch({ newPassword: formValues.newPassword, currentPassword: formValues.currentPassword });
          } });
      }
    ];
    $$(".acc-row__value").forEach(function (a, i) {
      if (!defs[i]) return;
      a.addEventListener("click", function (e) { e.preventDefault(); defs[i](); });
    });
    const del = $('[data-action="delete-account"]');
    if (del) del.addEventListener("click", function (e) {
      e.preventDefault();
      openEditor({ title: "Xóa tài khoản", submit: "Xóa vĩnh viễn", danger: true, fields: [
        { name: "password", label: "Nhập mật khẩu để xác nhận. Thao tác không thể hoàn tác.", type: "password", ac: "current-password" }],
        onSubmit: function (formValues) {
          return nomNom.data.del("/me", { password: formValues.password }).then(function () { return auth.logout(); });
        } });
    });
  }

  /* ---------- khởi động: yêu cầu đăng nhập ---------- */
  function start() {
    const auth = window.NomNomAuth;
    if (!auth) return;
    auth.ready.then(function (user) {
      if (!user) {
        location.replace("/?login=1&next=" + encodeURIComponent(location.pathname + location.search));
        return;
      }
      renderProfile(user);
      if (file === "saved.html") initList("saved");
      else if (file === "uploaded.html") initList("uploaded");
      else if (file === "history.html") initList("history");
      else if (file === "reviewed.html") initReviewed();
      else initOverview();
    });
  }
  if (document.readyState !== "complete") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
