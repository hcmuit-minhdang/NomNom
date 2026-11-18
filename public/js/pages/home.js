const track = document.getElementById('track');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');

let currentIndex = 0;
const totalSlides = document.querySelectorAll('.slide').length;

function updateSlidePosition() {
  // Pulls the track up on the Y axis
  track.style.transform = `translateY(-${currentIndex * 100}%)`;
}

downBtn.addEventListener('click', () => {
  // If we haven't reached the end, go to the next slide normally
  if (currentIndex < totalSlides - 1) {
    currentIndex++;
  } else {
    // If we are at the last slide, loop back to the first one (index 0)
    currentIndex = 0;
  }
  updateSlidePosition();
});

upBtn.addEventListener('click', () => {
  // If we haven't reached the start, go up normally
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    // If we are at the first slide (index 0), jump to the last slide
    currentIndex = totalSlides - 1;
  }
  updateSlidePosition();
});

/* ---------- Dữ liệu thật từ API ---------- */
(function () {
  var popular = document.querySelector(".popular-recipes-container");
  var community = document.querySelector(".new-community-recipe-container");
  var catBox = document.querySelector(".category-container");
  if (!window.NomNom || !NomNom.data) return;

  function errorBlock(box, retry) {
    box.innerHTML = '<p class="home-error">Không tải được dữ liệu. <button type="button">Thử lại</button></p>';
    box.querySelector("button").addEventListener("click", retry);
  }

  function loadRecipes(box, params, cls, imgCls, n, after) {
    box.innerHTML = NomNom.skeletonHtml(n, cls);
    NomNom.data.get("/recipes", params).then(function (d) {
      var items = d.items || [];
      box.innerHTML = items.length
        ? items.map(function (r) { return NomNom.cardHtml(r, cls, imgCls); }).join("")
        : '<p class="home-loading">Chưa có công thức nào.</p>';
      if (after) after(items);
    }, function () { errorBlock(box, function () { loadRecipes(box, params, cls, imgCls, n, after); }); });
  }

  function skeletonCompressed(n) {
    return NomNom.skeletonHtml(n, "recipe-card-compressed");
  }

  if (popular) {
    popular.innerHTML = skeletonCompressed(4);
    loadRecipes(popular, { sort: "rating", limit: 4 }, "recipe-card-compressed", "recipe-image-medium", 4, function (items) {
    });
  }
  if (community) loadRecipes(community, { sort: "new", limit: 4 }, "recipe-card", "recipe-image", 4);

  /* Bảng vinh danh: dữ liệu thật từ /api/leaderboard (nếu chưa có ai thì giữ nội dung mặc định). */
  (function loadLeaderboard() {
    var cards = document.querySelectorAll(".leaderboard-card");
    if (!cards.length) return;
    NomNom.data.get("/leaderboard").then(function (d) {
      function fill(card, user, descSel, text, href) {
        if (!card || !user) return;
        var name = card.querySelector(".user-name");
        if (name) name.textContent = user.username;
        var img = card.querySelector(".user-image-leaderboard");
        if (img && user.avatar) img.src = user.avatar;
        var link = card.querySelector(descSel + " a");
        if (link) { link.textContent = text; if (href) link.href = href; }
      }
      fill(document.querySelector(".most-recipes"), d.mostRecipes, ".most-recipes-description", d.mostRecipes && d.mostRecipes.count + " công thức");
      fill(document.querySelector(".most-reviews"), d.mostReviews, ".most-reviews-description", d.mostReviews && d.mostReviews.count + " đánh giá");
      var mr = d.mostSaved, c3 = document.querySelector(".most-liked-recipe");
      if (mr && c3) {
        var nm = c3.querySelector(".user-name");
        if (nm) nm.textContent = mr.author ? mr.author.username : "NomNom";
        var l3 = c3.querySelector(".most-liked-recipe-description a");
        if (l3) { l3.textContent = mr.name; l3.href = NomNom.recipeUrl(mr.id); }
      }
    }, function () { /* giữ nội dung mặc định */ });
  })();

  function loadCategories() {
    if (!catBox) return;
    NomNom.data.get("/categories").then(function (d) {
      var items = (d.items || []).slice(0, 7);
      // Mỗi danh mục lấy ảnh của món được đánh giá cao nhất trong danh mục đó.
      return Promise.all(items.map(function (c) {
        return NomNom.data.get("/recipes", { category: c.id, limit: 1, sort: "rating" }).then(function (r) {
          return r.items && r.items[0] ? r.items[0].image : null;
        }, function () { return null; });
      })).then(function (imgs) {
        var html = items.map(function (c, i) {
          return '<a href="/pages/category.html?category=' + encodeURIComponent(c.id) + '" class="category-card">' +
            '<img src="' + NomNom.esc(imgs[i] || "/assets/images/food.png") + '" alt="' + NomNom.esc(c.name) + '" class="category-image" loading="lazy" />' +
            '<span class="category-name">' + NomNom.esc(c.name) + '</span></a>';
        }).join("");
        html += '<a href="/pages/category.html" class="category-card category-more">' +
          '<img src="/assets/icons/right-arrow-black.svg" alt="Xem Thêm" class="category-image-more" />' +
          '<span class="category-name">Xem Thêm</span></a>';
        catBox.innerHTML = html;
      });
    }).catch(function () { errorBlock(catBox, loadCategories); });
  }
  loadCategories();
})();

// Link mở popup đăng nhập/đăng ký của Thinh (auth.js xử lý [data-auth-open]); chặn nhảy lên đầu trang do href="#".
document.querySelectorAll("a[data-auth-open]").forEach(link => {
  link.addEventListener("click", event => event.preventDefault());
});
