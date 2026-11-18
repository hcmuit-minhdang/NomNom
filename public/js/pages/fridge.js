/* Luồng tìm công thức theo nguyên liệu tủ lạnh.
   - /pages/fridge.html: form chọn nguyên liệu -> chuyển sang /pages/fridge-results.html?ingredients=dam:thit-bo,tinh-bot:gao
   - /pages/fridge-results.html: đọc query, khôi phục ô đã chọn, gọi GET /api/fridge (backend sở hữu dữ liệu & cách chấm điểm). */
(function () {
  "use strict";

  var page = document.body.dataset.page;
  var RESULTS_URL = "/pages/fridge-results.html";
  var form = document.querySelector(".filter-sidebar form");

  // Bấm "Danh mục nguyên liệu" trên header: đang ở trang chọn thì cuộn lên bộ lọc, ở trang kết quả thì về trang chọn.
  document.addEventListener("nomnom:navigation-request", function (event) {
    if (!event.detail || event.detail.target !== "ingredients") return;
    event.preventDefault();
    if (page === "fridge") {
      var sidebar = document.querySelector(".filter-sidebar");
      if (sidebar) sidebar.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = "/pages/fridge.html";
    }
  });

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function selectedTokens() {
    var out = [];
    document.querySelectorAll(".filter-sidebar input[type=checkbox]:checked").forEach(function (box) {
      out.push(box.name + ":" + box.value);
    });
    // Nguyên liệu nhập tay ở mục "Khác": token "nhom:ten nguyen lieu"
    document.querySelectorAll(".filter-other-list button").forEach(function (chip) {
      out.push(chip.dataset.token);
    });
    return out;
  }

  // Nhãn hiển thị của mỗi token "nhom:id" lấy từ các ô chọn trong trang.
  var labels = {};
  document.querySelectorAll(".filter-sidebar input[type=checkbox]").forEach(function (box) {
    labels[box.name + ":" + box.value] = box.parentNode.textContent.trim();
    if (!labels[box.value]) labels[box.value] = box.parentNode.textContent.trim();
  });
  function labelOf(item) {
    if (item && typeof item === "object") return item.name || item.label || labels[item.id] || String(item.id || "");
    return labels[item] || String(item);
  }

  /* ---- Ô nhập nguyên liệu khác (mục "Khác") ---- */
  var knownNames = {};
  var catalogNames = [];
  var MAX_SUGGEST = 6; // chỉ hiện tối đa 6 gợi ý cho gọn

  // Bỏ dấu và chữ hoa để so khớp chữ đang gõ với tên trong danh mục
  function plain(s) {
    return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();
  }

  // Nạp danh mục nguyên liệu để làm gợi ý
  if (window.NomNom && NomNom.data) {
    NomNom.data.get("/ingredients").then(function (d) {
      (d.items || []).forEach(function (i) {
        knownNames[i.name.toLowerCase()] = i.name;
        catalogNames.push({ name: i.name, key: plain(i.name) });
      });
    }, function () { /* không có gợi ý thì vẫn nhập tay được */ });
  }

  // Thêm một nguyên liệu vào thẻ của nhóm; trả về false nếu trống hoặc đã có
  function addOther(block, rawName) {
    var name = String(rawName || "").replace(/[,:]/g, " ").replace(/\s+/g, " ").trim();
    if (!name) return false;
    name = knownNames[name.toLowerCase()] || name;
    var token = block.dataset.otherGroup + ":" + name;
    var exists = false;
    block.querySelectorAll(".filter-other-list button").forEach(function (b) {
      if (b.dataset.token === token) exists = true;
    });
    if (exists) return false;
    var li = document.createElement("li");
    var chip = document.createElement("button");
    chip.type = "button";
    chip.dataset.token = token;
    chip.textContent = name;
    chip.title = "Bấm để xóa";
    chip.addEventListener("click", function () { li.remove(); });
    li.appendChild(chip);
    block.querySelector(".filter-other-list").appendChild(li);
    labels[token] = name;
    return true;
  }

  document.querySelectorAll(".filter-other").forEach(function (block) {
    var input = block.querySelector(".filter-other-input");
    // Danh sách gợi ý riêng: hiện dưới ô nhập, lọc theo chữ đang gõ
    var menu = document.createElement("ul");
    menu.className = "filter-other-suggest";
    menu.hidden = true;
    block.insertBefore(menu, block.querySelector(".filter-other-list"));
    var active = -1;

    function closeMenu() {
      menu.hidden = true;
      active = -1;
    }
    function highlight(i) {
      var items = menu.querySelectorAll("li");
      items.forEach(function (li, k) { li.classList.toggle("is-active", k === i); });
      active = i;
      if (items[i]) items[i].scrollIntoView({ block: "nearest" });
    }
    function pick(name) {
      if (addOther(block, name)) input.value = "";
      closeMenu();
      input.focus();
    }
    function openMenu() {
      var q = plain(input.value);
      menu.textContent = "";
      if (!q) { closeMenu(); return; }
      var hits = catalogNames.filter(function (n) { return n.key.indexOf(q) !== -1; })
        .sort(function (x, y) { return (x.key.indexOf(q) === 0 ? 0 : 1) - (y.key.indexOf(q) === 0 ? 0 : 1); })
        .slice(0, MAX_SUGGEST);
      if (!hits.length) { closeMenu(); return; }
      hits.forEach(function (n) {
        var li = document.createElement("li");
        li.textContent = n.name;
        // mousedown (không phải click) để chọn được trước khi ô nhập mất focus
        li.addEventListener("mousedown", function (e) { e.preventDefault(); pick(n.name); });
        menu.appendChild(li);
      });
      menu.hidden = false;
      active = -1;
    }

    input.addEventListener("input", openMenu);
    input.addEventListener("focus", openMenu);
    input.addEventListener("blur", closeMenu);
    input.addEventListener("keydown", function (e) {
      var count = menu.hidden ? 0 : menu.querySelectorAll("li").length;
      if (e.key === "ArrowDown" && count) { e.preventDefault(); highlight((active + 1) % count); }
      else if (e.key === "ArrowUp" && count) { e.preventDefault(); highlight((active - 1 + count) % count); }
      else if (e.key === "Escape") { closeMenu(); }
      else if (e.key === "Enter") {
        // Enter: chọn gợi ý đang sáng, nếu không thì thêm đúng chữ đã gõ; không gửi cả biểu mẫu
        e.preventDefault();
        if (active >= 0 && count) pick(menu.querySelectorAll("li")[active].textContent);
        else pick(input.value);
      }
    });
    // Ô "Khác" của nhóm: tick thì hiện ô nhập, bỏ tick thì ẩn và xóa các thẻ đã thêm
    var box = block.parentNode.querySelector('input[value="khac"]');
    function sync() {
      block.hidden = !box.checked;
      if (!box.checked) {
        input.value = "";
        closeMenu();
        block.querySelector(".filter-other-list").textContent = "";
      }
    }
    box.addEventListener("change", sync);
    block.syncOther = sync;
  });

  // Chọn nguyên liệu -> sang trang kết quả với đúng các token "nhom:id".
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      // Chữ đang gõ dở trong ô "Khác" cũng được tính
      document.querySelectorAll(".filter-other").forEach(function (block) {
        var inp = block.querySelector(".filter-other-input");
        if (!block.hidden && inp.value && addOther(block, inp.value)) inp.value = "";
      });
      var tokens = selectedTokens();
      var kwInput = form.querySelector("input[name=keyword]");
      var keyword = kwInput ? kwInput.value.trim() : "";
      var parts = [];
      if (tokens.length) parts.push("ingredients=" + encodeURIComponent(tokens.join(",")).replace(/%3A/gi, ":").replace(/%2C/gi, ","));
      if (keyword) parts.push("keyword=" + encodeURIComponent(keyword));
      window.location.href = RESULTS_URL + (parts.length ? "?" + parts.join("&") : "");
    });
  }

  function foodCard(r, extra) {
    var href = NomNom.recipeUrl(r.id);
    var card = el("article", "food-card");
    var imageLink = el("a");
    imageLink.href = href;
    var img = el("img", "food-image");
    img.src = r.image || "/assets/images/food.png";
    img.alt = r.name || "";
    img.loading = "lazy";
    img.onerror = function () { NomNom.fallbackImg(img); };
    imageLink.appendChild(img);
    var name = el("a", "food-name", r.name);
    name.href = href;
    var price = el("p", "food-price");
    price.append("$ Giá: " + NomNom.money(r.price) + " / phần");
    var time = el("p", "food-time");
    var clock = el("img");
    clock.src = "/assets/icons/clock.png";
    clock.alt = "";
    time.append(clock, " Thời gian nấu: " + NomNom.minutes(r.time));
    card.append(imageLink, name, price);
    if (extra) extra.forEach(function (n) { card.append(n); });
    card.append(time);
    return card;
  }

  function showError(box, message, retry) {
    box.textContent = "";
    var p = el("p", "result-summary", message + " ");
    var b = el("button", "filter-reset", "Thử lại");
    b.type = "button";
    b.addEventListener("click", retry);
    p.appendChild(b);
    box.appendChild(p);
  }

  /* ---- Trang chọn nguyên liệu: danh sách công thức mới nhất ---- */
  function loadLatest() {
    var list = document.getElementById("latest-list");
    if (!list) return;
    list.textContent = "Đang tải...";
    NomNom.data.get("/recipes", { sort: "new", limit: 6 }).then(function (d) {
      list.textContent = "";
      (d.items || []).forEach(function (r) { list.appendChild(foodCard(r)); });
      if (!(d.items || []).length) list.textContent = "Chưa có công thức nào.";
    }, function (e) { showError(list, NomNom.errorText(e), loadLatest); });
  }

  /* ---- Trang kết quả ---- */
  var PAGE_SIZE = 9;
  var allItems = [];

  // Trang hiện tại nằm trên URL (?page=2); giữ nguyên các tham số khác
  function currentPage() {
    return Math.max(1, parseInt(new URLSearchParams(window.location.search).get("page"), 10) || 1);
  }
  function pageUrl(p) {
    var params = new URLSearchParams(window.location.search);
    if (p > 1) params.set("page", p); else params.delete("page");
    var qs = params.toString().replace(/%3A/gi, ":").replace(/%2C/gi, ",");
    return RESULTS_URL + (qs ? "?" + qs : "");
  }

  // Vẽ các thẻ của trang hiện tại và thanh phân trang
  function renderPage() {
    var list = document.getElementById("result-list");
    var pager = document.getElementById("pagination");
    var pages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
    var p = Math.min(currentPage(), pages);
    list.textContent = "";
    allItems.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE).forEach(function (it) {
      var full = it.status === "du";
      var extra = [
        el("p", "food-tag " + (full ? "tag-du" : "tag-thieu"), (full ? "Đủ nguyên liệu" : "Chưa đủ nguyên liệu") + " · " + Math.round((it.score || 0) * 100) + "%")
      ];
      if (it.matched && it.matched.length) extra.push(el("p", "food-match", "Bạn có: " + it.matched.map(labelOf).join(", ")));
      if (it.missing && it.missing.length) extra.push(el("p", "food-match food-missing", "Còn thiếu: " + it.missing.map(labelOf).join(", ")));
      list.appendChild(foodCard(it.recipe, extra));
    });
    if (pager) pager.innerHTML = NomNom.pagerHtml(p, pages, pageUrl);
  }

  function loadResults(tokens, keyword) {
    var list = document.getElementById("result-list");
    var summary = document.getElementById("result-summary");
    var pager = document.getElementById("pagination");
    if (!list || !summary) return;
    list.textContent = "";
    if (pager) pager.textContent = "";
    if (!tokens.length) {
      summary.textContent = "Bạn chưa chọn nguyên liệu nào. Hãy quay lại trang chọn nguyên liệu.";
      return;
    }
    summary.textContent = "Đang tìm công thức phù hợp...";
    // Lấy tối đa 100 kết quả một lần rồi chia trang ở trình duyệt, nên đổi trang không gọi lại API
    NomNom.data.get("/fridge", { ingredients: tokens.join(","), q: keyword, limit: 100 }).then(function (d) {
      allItems = d.items || [];
      summary.textContent = "";
      if (!allItems.length) {
        summary.textContent = "Chưa có công thức phù hợp. Hãy thử chọn thêm nguyên liệu hoặc đổi từ khóa.";
        return;
      }
      summary.append("Tìm thấy ", el("strong", "", String(allItems.length)), " công thức cho " + tokens.length + " nguyên liệu đã chọn" +
        (keyword ? ", từ khóa “" + keyword + "”" : "") + ".");
      renderPage();
    }, function (e) {
      summary.textContent = "";
      showError(list, NomNom.errorText(e), function () { loadResults(tokens, keyword); });
    });
  }

  // Bấm số trang: đổi URL và vẽ lại, không tải lại trang
  if (page === "fridge-results") {
    var pagerBox = document.getElementById("pagination");
    if (pagerBox) pagerBox.addEventListener("click", function (e) {
      var a = e.target.closest("a[data-page]");
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      history.pushState(null, "", pageUrl(parseInt(a.dataset.page, 10)));
      renderPage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("popstate", renderPage);
  }

  if (page === "fridge") loadLatest();

  if (page === "fridge-results") {
    var params = new URLSearchParams(window.location.search);
    var tokens = (params.get("ingredients") || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    var keyword = (params.get("keyword") || "").trim();
    // Khôi phục ô đã chọn từ query string và mở nhóm có ô được chọn.
    document.querySelectorAll(".filter-sidebar input[type=checkbox]").forEach(function (box) {
      if (tokens.indexOf(box.name + ":" + box.value) !== -1) {
        box.checked = true;
        // Mở sẵn nhóm có ô được chọn
        var group = box.closest(".filter-accordion");
        if (group) {
          group.classList.add("is-open");
          var trigger = group.querySelector(".filter-trigger-btn");
          if (trigger) trigger.setAttribute("aria-expanded", "true");
        }
      }
    });
    // Token không khớp ô nào (nguyên liệu nhập tay): tạo lại thẻ trong mục "Khác" của nhóm đó
    var known = {};
    document.querySelectorAll(".filter-sidebar input[type=checkbox]").forEach(function (box) { known[box.name + ":" + box.value] = true; });
    tokens.forEach(function (t) {
      if (known[t] || t.indexOf(":") < 1) return;
      var group = t.split(":")[0];
      var block = document.querySelector('.filter-other[data-other-group="' + group + '"]');
      if (!block) return;
      var khac = block.parentNode.querySelector('input[value="khac"]');
      khac.checked = true;
      block.syncOther();
      addOther(block, t.slice(t.indexOf(":") + 1));
      var acc = block.closest(".filter-accordion");
      if (acc) {
        acc.classList.add("is-open");
        var trig = acc.querySelector(".filter-trigger-btn");
        if (trig) trig.setAttribute("aria-expanded", "true");
      }
    });
    // Ô "Khác" đã tick từ URL thì hiện ô nhập
    document.querySelectorAll(".filter-other").forEach(function (block) { block.syncOther(); });
    var keywordInput = document.querySelector(".filter-sidebar input[name=keyword]");
    if (keywordInput) keywordInput.value = keyword;
    loadResults(tokens, keyword);
  }
})();
