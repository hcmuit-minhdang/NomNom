// === CÀI ĐẶT CHUNG ===
const SO_MON_MOI_TRANG = 9; 

// Trang công thức chi tiết: Thach/Recipe-page/recipe.html

const TRANG_CHI_TIET = "../../../../Thach/Recipe-page/recipe.html";

const NHOM_NGUYEN_LIEU = ["dam", "tinh-bot", "rau-cu", "trai-cay"];

// === HÀM TIỆN ÍT ===
function coTrongMang(mang, giaTri) {
  return mang.some(function (phanTu) {
    return phanTu === giaTri;
  });
}

function dinhDangGia(soTien) {
  return soTien.toLocaleString("vi-VN") + "đ";
}

function khopTuKhoa(chuoi, tuKhoa) {
  if (tuKhoa === "") return false;
  const cacTu = tuKhoa.split(",");
  return cacTu.some(function (tu) {
    tu = tu.trim().toLowerCase();
    return tu !== "" && chuoi.toLowerCase().indexOf(tu) !== -1;
  });
}

// === ĐỌC BỘ LỌC ===
function taoBoLocRong() {
  return {
    keyword: "",
    "dam": [],
    "tinh-bot": [],
    "rau-cu": [],
    "trai-cay": [],
    "che-do-an": [],
    "vung-mien": [],
    "ngan-sach": []
  };
}
function docBoLocTuForm() {
  const boLoc = taoBoLocRong();
  boLoc.keyword = document.querySelector(".search-box input").value.trim();

  const cacO = document.querySelectorAll(".filter-options input");
  cacO.forEach(function (o) {
    if (o.checked) {
      boLoc[o.name].push(o.value);
    }
  });
  return boLoc;
}

function docBoLocTuURL() {
  const boLoc = taoBoLocRong();
  let chuoi = location.search;
  if (chuoi === "") return boLoc;

  chuoi = chuoi.slice(1); 
  const cacCap = chuoi.split("&");

  cacCap.forEach(function (cap) {
    const phan = cap.split("="); 
    const ten = phan[0];
    const giaTri = decodeURIComponent((phan[1] || "").split("+").join(" "));

    if (ten === "keyword") {
      boLoc.keyword = giaTri.trim();
    } else if (boLoc[ten] !== undefined) {
      boLoc[ten].push(giaTri);
    }
  });
  return boLoc;
}

function ganBoLocVaoForm(boLoc) {
  document.querySelector(".search-box input").value = boLoc.keyword;

  const cacO = document.querySelectorAll(".filter-options input");
  cacO.forEach(function (o) {
    o.checked = coTrongMang(boLoc[o.name], o.value);
  });
  capNhatNhomDangChon(true);
}

function capNhatNhomDangChon(moNhom) {
  const cacNhom = document.querySelectorAll(".filter-item");
  cacNhom.forEach(function (nhom) {
    const soOTick = nhom.querySelectorAll("input:checked").length;
    if (soOTick > 0) {
      nhom.classList.add("dang-chon");
      if (moNhom) nhom.open = true; 
    } else {
      nhom.classList.remove("dang-chon");
    }
  });
}

// === KIỂM TRA NGUYÊN LIỆU NGƯỜI DÙNG ===
function coChonNguyenLieu(boLoc) {
  const coTick = NHOM_NGUYEN_LIEU.some(function (nhom) {
    return boLoc[nhom].length > 0;
  });
  return coTick || boLoc.keyword !== "";
}

function layLuaChonCuaNhom(nhom) {
  const ketQua = [];
  const cacO = document.querySelectorAll('.filter-options input[name="' + nhom + '"]');
  cacO.forEach(function (o) {
    if (o.value !== "khac") ketQua.push(o.value);
  });
  return ketQua;
}

function layNguyenLieuChinh(mon) {
  const ketQua = [];
  mon.ingredients.forEach(function (nl) {
    const thongTin = NGUYEN_LIEU[nl.ingredientId];
    if (thongTin !== undefined && coTrongMang(NHOM_NGUYEN_LIEU, thongTin.nhom)) {
      ketQua.push({
        id: nl.ingredientId,
        ten: thongTin.ten,
        nhom: thongTin.nhom,
        boLoc: thongTin.boLoc || nl.ingredientId
      });
    }
  });
  return ketQua;
}

function nguoiDungCo(nl, boLoc) {
  const cacOTick = boLoc[nl.nhom];

  if (coTrongMang(cacOTick, nl.boLoc)) return true;

  if (coTrongMang(cacOTick, "khac") && !coTrongMang(layLuaChonCuaNhom(nl.nhom), nl.boLoc)) {
    return true;
  }

  return khopTuKhoa(nl.ten, boLoc.keyword);
}

function khopCheDoAn(mon, cacOTick) {
  if (cacOTick.length === 0) return true;
  return mon.diets.some(function (cheDo) {
    return coTrongMang(cacOTick, cheDo);
  });
}

function khopVungMien(mon, cacOTick) {
  if (cacOTick.length === 0) return true;
  return coTrongMang(cacOTick, mon.region);
}

function khopNganSach(mon, cacOTick) {
  if (cacOTick.length === 0) return true;
  return cacOTick.some(function (muc) {
    switch (muc) {
      case "duoi-50k":
        return mon.costTotal <= 50000;
      case "duoi-100k":
        return mon.costTotal <= 100000;
      case "duoi-200k":
        return mon.costTotal <= 200000;
      case "duoi-500k":
        return mon.costTotal <= 500000;
      case "tren-500k":
        return mon.costTotal > 500000;
      default:
        return true;
    }
  });
}

// === BỘ LỌC MÓN ĂN + GẮN NHÃ ĐỦ/THIẾU ===
function locMonAn(danhSachMon, boLoc) {
  const coLocNguyenLieu = coChonNguyenLieu(boLoc);
  const ketQua = [];

  danhSachMon.forEach(function (mon) {
    const thieu = [];
    let soCo = 0;
    layNguyenLieuChinh(mon).forEach(function (nl) {
      if (nguoiDungCo(nl, boLoc)) {
        soCo++;
      } else {
        thieu.push(nl.ten);
      }
    });

    if (coLocNguyenLieu && soCo === 0 && !khopTuKhoa(mon.title, boLoc.keyword)) return;
    if (!khopCheDoAn(mon, boLoc["che-do-an"])) return;
    if (!khopVungMien(mon, boLoc["vung-mien"])) return;
    if (!khopNganSach(mon, boLoc["ngan-sach"])) return;

    ketQua.push({
      mon: mon,
      coNhan: coLocNguyenLieu,
      du: thieu.length === 0,
      thieu: thieu
    });
  });

  const monDu = ketQua.filter(function (item) {
    return item.coNhan && item.du;
  });
  const monConLai = ketQua.filter(function (item) {
    return !(item.coNhan && item.du);
  });
  return monDu.concat(monConLai);
}

// === HIỂN THỊ THẺ MÓN ===
function taoTheMon(item) {
  const mon = item.mon;
  const the = document.createElement("article");
  the.classList.add("food-card");

  const link = TRANG_CHI_TIET + "?id=" + mon.id;

  let nhan = "";
  if (item.coNhan) {
    nhan = item.du
      ? '<p class="food-tag tag-du">Đủ nguyên liệu</p>'
      : '<p class="food-tag tag-thieu">Thiếu nguyên liệu</p>';
  }

   the.innerHTML =
    '<a href="' + link + '">' +
      '<img src="' + mon.image + '" alt="' + mon.title + '" class="food-image" />' +
    '</a>' +
    '<a href="' + link + '" class="food-name">' + mon.title + '</a>' +
    '<p class="food-price">$ Giá: ' + dinhDangGia(mon.costTotal) +
      ' <br/> Khẩu phần: ' + mon.baseServings + ' người</p>' +
    nhan +
    '<p class="food-time">' +
      '<img src="../image/icon/clock.png" alt="" /> Thời gian nấu: ' + mon.cookTime + ' phút' +
    '</p>';


  the.addEventListener("click", function () {
    window.location.href = link;
  });
  return the;
}

function veDanhSachMon(ketQua, trangHienTai) {
  const khung = document.querySelector(".food-list");
  khung.innerHTML = ""; 

  if (ketQua.length === 0) {
    khung.innerHTML =
      '<p class="food-empty">Không tìm thấy món phù hợp. Hãy bỏ bớt điều kiện lọc hoặc thử từ khoá khác.</p>';
    return;
  }

  const batDau = (trangHienTai - 1) * SO_MON_MOI_TRANG;
  const monTrongTrang = ketQua.slice(batDau, batDau + SO_MON_MOI_TRANG);

  monTrongTrang.forEach(function (item) {
    khung.appendChild(taoTheMon(item));
  });
}

// === PHÂN TRANG ===
function themNutTrang(nav, chu, soTrang, tenClass, khiChonTrang) {
  const nut = document.createElement("a");
  nut.href = "#";
  nut.innerHTML = chu;
  if (tenClass !== "") nut.classList.add(tenClass);
  nut.addEventListener("click", function (e) {
    e.preventDefault();
    khiChonTrang(soTrang);
  });
  nav.appendChild(nut);
}

function themDauBaCham(nav) {
  const span = document.createElement("span");
  span.innerHTML = "...";
  nav.appendChild(span);
}

function themSoMinhHoa(nav, soTrang) {
  const span = document.createElement("span");
  span.innerHTML = soTrang;
  span.classList.add("page-minh-hoa");
  nav.appendChild(span);
}

function vePhanTrang(tongSoMon, trangHienTai, khiChonTrang, soTrangMinhHoa) {
  const nav = document.querySelector(".pagination");
  nav.innerHTML = "";

  const tongSoTrang = Math.ceil(tongSoMon / SO_MON_MOI_TRANG);
  if (tongSoTrang <= 1) return; 

  let tu = trangHienTai - 1;
  if (tu < 1) tu = 1;
  let den = tu + 2;
  if (den > tongSoTrang) {
    den = tongSoTrang;
    tu = den - 2;
    if (tu < 1) tu = 1;
  }

  if (trangHienTai > 1) {
    themNutTrang(nav, "◂ Trang trước", trangHienTai - 1, "page-prev", khiChonTrang);
  }
  if (tu > 1) {
    themNutTrang(nav, "1", 1, "", khiChonTrang);
    if (tu > 2) themDauBaCham(nav);
  }
  for (let i = tu; i <= den; i++) {
    const lop = i === trangHienTai ? "page-active" : "";
    themNutTrang(nav, i, i, lop, khiChonTrang);
  }
  if (den < tongSoTrang) {
    if (den < tongSoTrang - 1) themDauBaCham(nav);
    themNutTrang(nav, tongSoTrang, tongSoTrang, "", khiChonTrang);
  }
  if (soTrangMinhHoa > tongSoTrang) {
    themDauBaCham(nav);
    themSoMinhHoa(nav, soTrangMinhHoa);
  }
  if (trangHienTai < tongSoTrang) {
    themNutTrang(nav, "Trang sau ▸", trangHienTai + 1, "page-next", khiChonTrang);
  }
}