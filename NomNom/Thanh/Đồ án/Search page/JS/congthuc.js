// ===== DANH SÁCH MÓN MỚI NHẤT =====
const tatCaMon = MON_AN_MAU;
const SO_TRANG_MINH_HOA = 77; 

const danhSachMon = locMonAn(tatCaMon, taoBoLocRong());
let trangHienTai = 1;

// ===== PHÂN TRANG =====
function hienThiTrang(soTrang) {
  trangHienTai = soTrang;
  veDanhSachMon(danhSachMon, trangHienTai);
  vePhanTrang(danhSachMon.length, trangHienTai, hienThiTrang, SO_TRANG_MINH_HOA);
  document.querySelector(".food-section").scrollIntoView();
}

const cacO = document.querySelectorAll(".filter-options input");
cacO.forEach(function (o) {
  o.addEventListener("change", function () {
    capNhatNhomDangChon(false);
  });
});

document.querySelector(".filter-sidebar form").addEventListener("submit", function (e) {
  const boLoc = docBoLocTuForm();
  let soOTick = 0;
  for (let key in boLoc) {
    if (key !== "keyword") soOTick += boLoc[key].length;
  }
  if (soOTick === 0 && boLoc.keyword === "") {
    e.preventDefault();
       alert("Hãy chọn ít nhất 1 ô trong bộ lọc hoặc nhập từ khoá để tìm món.");
  }
});


veDanhSachMon(danhSachMon, 1);
vePhanTrang(danhSachMon.length, 1, hienThiTrang, SO_TRANG_MINH_HOA);