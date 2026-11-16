const tatCaMon = MON_AN_MAU; 

let ketQuaLoc = []; 
let trangHienTai = 1;

function hienThiTrang(soTrang) {
  trangHienTai = soTrang;
  veDanhSachMon(ketQuaLoc, trangHienTai);
  vePhanTrang(ketQuaLoc.length, trangHienTai, chuyenTrang);
}

function chuyenTrang(soTrang) {
  hienThiTrang(soTrang);
  document.querySelector(".food-section").scrollIntoView();
}

function chayBoLoc(boLoc) {
  ketQuaLoc = locMonAn(tatCaMon, boLoc);

  const dongDem = document.querySelector(".result-count");
  if (ketQuaLoc.length === 0) {
    dongDem.innerHTML = "";
  } else if (coChonNguyenLieu(boLoc)) {
    const soMonDu = ketQuaLoc.filter(function (item) {
      return item.du;
    }).length;
    dongDem.innerHTML =
      "Tìm thấy " + ketQuaLoc.length + " món – " + soMonDu + " món đủ nguyên liệu";
  } else {
    dongDem.innerHTML = "Tìm thấy " + ketQuaLoc.length + " món";
  }

  hienThiTrang(1); 
}

const boLocTuURL = docBoLocTuURL();
ganBoLocVaoForm(boLocTuURL);
chayBoLoc(boLocTuURL);

const cacO = document.querySelectorAll(".filter-options input");
cacO.forEach(function (o) {
  o.addEventListener("change", function () {
    capNhatNhomDangChon(false);
    chayBoLoc(docBoLocTuForm());
  });
});
