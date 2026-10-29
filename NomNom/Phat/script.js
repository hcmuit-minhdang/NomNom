/**
 * CẤU HÌNH ĐƯỜNG DẪN FILE TRONG THƯ MỤC ASSETS
 * Bạn chỉ cần đặt file đúng tên vào thư mục ./assets/ hoặc đổi tên file tại đây
 */
const ASSETS = {
  dishImage: './assets/dish-gyudon.jpg',
  clockIcon: './assets/icon-clock.svg',
  // Ảnh dự phòng tự động hiển thị nếu bạn chưa chép ảnh vào thư mục ./assets/
  fallbackDishImage:
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
};

/**
 * Dữ liệu danh sách "MÓN ĂN ĐƯỢC YÊU THÍCH" (1 thẻ lớn + 4 thẻ nhỏ)
 */
const favoriteRecipes = [
  {
    id: 1,
    name: 'Recipe Name',
    price: '$ price / serving',
    cookTime: 'Cook Time: 30 minutes',
    image: ASSETS.dishImage,
    featured: true
  },
  {
    id: 2,
    name: 'Recipe Name',
    price: '$ price / serving',
    cookTime: 'Cook Time: 30 minutes',
    image: ASSETS.dishImage,
    featured: false
  },
  {
    id: 3,
    name: 'Recipe Name',
    price: '$ price / serving',
    cookTime: 'Cook Time: 30 minutes',
    image: ASSETS.dishImage,
    featured: false
  },
  {
    id: 4,
    name: 'Recipe Name',
    price: '$ price / serving',
    cookTime: 'Cook Time: 30 minutes',
    image: ASSETS.dishImage,
    featured: false
  },
  {
    id: 5,
    name: 'Recipe Name',
    price: '$ price / serving',
    cookTime: 'Cook Time: 30 minutes',
    image: ASSETS.dishImage,
    featured: false
  }
];

/**
 * Dữ liệu danh sách "CÁC MÓN BÒ" (6 thẻ chia 3 cột x 2 hàng)
 */
const beefRecipes = [
  {
    id: 101,
    name: 'Recipe Name',
    price: '$ price / serving',
    cookTime: 'Cook Time: 30 minutes',
    image: ASSETS.dishImage
  },
  {
    id: 102,
    name: 'Recipe Name',
    price: '$ price / serving',
    cookTime: 'Cook Time: 30 minutes',
    image: ASSETS.dishImage
  },
  {
    id: 103,
    name: 'Recipe Name',
    price: '$ price / serving',
    cookTime: 'Cook Time: 30 minutes',
    image: ASSETS.dishImage
  },
  {
    id: 104,
    name: 'Recipe Name',
    price: '$ price / serving',
    cookTime: 'Cook Time: 30 minutes',
    image: ASSETS.dishImage
  },
  {
    id: 105,
    name: 'Recipe Name',
    price: '$ price / serving',
    cookTime: 'Cook Time: 30 minutes',
    image: ASSETS.dishImage
  },
  {
    id: 106,
    name: 'Recipe Name',
    price: '$ price / serving',
    cookTime: 'Cook Time: 30 minutes',
    image: ASSETS.dishImage
  }
];

/**
 * Tạo HTML cho icon đồng hồ (ưu tiên lấy từ ./assets/icon-clock.svg, có SVG dự phòng)
 */
function renderClockIcon() {
  return `
    <img 
      src="${ASSETS.clockIcon}" 
      alt="Clock" 
      class="clock-icon"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';"
    />
    <svg class="clock-icon" style="display:none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9"></circle>
      <polyline points="12 7 12 12 15 14"></polyline>
    </svg>
  `;
}

/**
 * Tạo HTML cho thẻ món ăn
 */
function createRecipeCardHTML(recipe) {
  // Thẻ dọc lớn ở cột trái của phần "Món ăn được yêu thích"
  if (recipe.featured) {
    return `
      <article class="recipe-card--featured" data-id="${recipe.id}">
        <img 
          src="${recipe.image}" 
          alt="${recipe.name}" 
          class="recipe-card__img"
          onerror="this.onerror=null; this.src='${ASSETS.fallbackDishImage}';"
        />
        <div class="recipe-card__overlay">
          <h3 class="overlay-tag overlay-tag--title">${recipe.name}</h3>
          <span class="overlay-tag overlay-tag--price">${recipe.price}</span>
          <span class="overlay-tag overlay-tag--time">
            ${renderClockIcon()}
            <span>${recipe.cookTime}</span>
          </span>
        </div>
      </article>
    `;
  }

  // Thẻ món ăn tiêu chuẩn
  return `
    <article class="recipe-card" data-id="${recipe.id}">
      <div class="recipe-card__thumb">
        <img 
          src="${recipe.image}" 
          alt="${recipe.name}" 
          class="recipe-card__img"
          onerror="this.onerror=null; this.src='${ASSETS.fallbackDishImage}';"
        />
      </div>
      <h3 class="recipe-card__title">${recipe.name}</h3>
      <p class="recipe-card__price">${recipe.price}</p>
      <div class="recipe-card__time">
        ${renderClockIcon()}
        <span>${recipe.cookTime}</span>
      </div>
    </article>
  `;
}

/**
 * Render danh sách món ăn ra giao diện
 */
function renderAllSections(keyword = '') {
  const favoriteGrid = document.getElementById('favoriteGrid');
  const beefGrid = document.getElementById('beefGrid');
  const normalizedQuery = keyword.trim().toLowerCase();

  const filteredFavorites = favoriteRecipes.filter((item) =>
    item.name.toLowerCase().includes(normalizedQuery)
  );
  const filteredBeef = beefRecipes.filter((item) =>
    item.name.toLowerCase().includes(normalizedQuery)
  );

  favoriteGrid.innerHTML = filteredFavorites.map(createRecipeCardHTML).join('');
  beefGrid.innerHTML = filteredBeef.map(createRecipeCardHTML).join('');
}

/**
 * Khởi tạo sự kiện tương tác cho Bộ lọc, Tìm kiếm, Xem thêm và Phân trang
 */
function initInteractions() {
  // 1. Đóng/mở từng danh mục trong BỘ LỌC
  const filterItems = document.querySelectorAll('.filter-item');
  filterItems.forEach((item) => {
    const btn = item.querySelector('.filter-btn');
    btn.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });

  // 2. Tìm kiếm món ăn
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  searchInput.addEventListener('input', (e) => {
    renderAllSections(e.target.value);
  });

  searchBtn.addEventListener('click', () => {
    renderAllSections(searchInput.value);
  });

  // 3. Nút "XEM THÊM CÁC MÓN BÒ"
  const loadMoreBeefBtn = document.getElementById('loadMoreBeefBtn');
  loadMoreBeefBtn.addEventListener('click', () => {
    const moreItems = [
      {
        id: Date.now() + 1,
        name: 'Recipe Name',
        price: '$ price / serving',
        cookTime: 'Cook Time: 30 minutes',
        image: ASSETS.dishImage
      },
      {
        id: Date.now() + 2,
        name: 'Recipe Name',
        price: '$ price / serving',
        cookTime: 'Cook Time: 30 minutes',
        image: ASSETS.dishImage
      },
      {
        id: Date.now() + 3,
        name: 'Recipe Name',
        price: '$ price / serving',
        cookTime: 'Cook Time: 30 minutes',
        image: ASSETS.dishImage
      }
    ];
    beefRecipes.push(...moreItems);
    renderAllSections(searchInput.value);
  });

  // 4. Chuyển trang (Pagination)
  const pageButtons = document.querySelectorAll('.page-item');
  const nextPageBtn = document.getElementById('nextPageBtn');

  pageButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      pageButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  nextPageBtn.addEventListener('click', () => {
    const activeBtn = document.querySelector('.page-item.active');
    const nextEl = activeBtn ? activeBtn.nextElementSibling : null;
    if (nextEl && nextEl.classList.contains('page-item')) {
      pageButtons.forEach((b) => b.classList.remove('active'));
      nextEl.classList.add('active');
    }
  });
}

// Khởi chạy khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', () => {
  renderAllSections();
  initInteractions();
});