/* NomNom — kho dữ liệu chạy ngay trong trình duyệt (không có máy chủ).
   Cung cấp NomNomStore.run(method, path, body): trả lời bằng dữ liệu tĩnh /data/db.json, tải một lần bằng fetch (công thức, nguyên liệu, tài khoản demo)
   cộng phần người dùng thay đổi (tài khoản, phiên, công thức đã lưu/đăng, đánh giá, lịch sử) lưu ở localStorage.
   Nhờ đó site chạy được trên mọi hosting tĩnh, không cần Node.js hay máy chủ nào.
   Nạp file này TRƯỚC /js/data.js. Dữ liệu của mỗi trình duyệt tách biệt; xóa dữ liệu trang web để đặt lại.
   Phần module bên dưới được ghép từ các route/model đã kiểm thử của phiên bản có máy chủ trước đây. */
(function () {
'use strict';
var origFetch = window.fetch.bind(window); // chỉ dùng để đọc file tĩnh /data/db.json
var KEY = 'nomnom:state:v1', SID_KEY = 'nomnom:sid';
var COLLECTIONS = ['users', 'sessions', 'saved', 'reviews', 'history', 'contacts', 'uploads'];
var FILES = {"ingredients.json":"[\r\n  {\r\n    \"id\": \"gao-tam\",\r\n    \"name\": \"Gạo tấm\",\r\n    \"aliases\": [\"gạo\", \"tấm\", \"gao tam\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"thit-heo\",\r\n    \"name\": \"Thịt heo\",\r\n    \"aliases\": [\"sườn\", \"cốt lết\", \"ba rọi\", \"thit heo\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"nuoc-cot-dua\",\r\n    \"name\": \"Nước cốt dừa\",\r\n    \"aliases\": [\"cốt dừa\", \"nuoc cot dua\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"nuoc-cot-chanh\",\r\n    \"name\": \"Nước cốt chanh\",\r\n    \"aliases\": [\"chanh\", \"nuoc cot chanh\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"la-dua\",\r\n    \"name\": \"Lá dứa\",\r\n    \"aliases\": [\"la dua\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"trung-vit\",\r\n    \"name\": \"Trứng vịt\",\r\n    \"aliases\": [\"trứng\", \"trung vit\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"quả\", \"trái\"],\r\n    \"defaultUnit\": \"quả\"\r\n  },\r\n  {\r\n    \"id\": \"toi-bam\",\r\n    \"name\": \"Tỏi băm\",\r\n    \"aliases\": [\"tỏi\", \"toi bam\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"hanh-tim\",\r\n    \"name\": \"Hành tím\",\r\n    \"aliases\": [\"hành\", \"hanh tim\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"củ\"],\r\n    \"defaultUnit\": \"củ\"\r\n  },\r\n  {\r\n    \"id\": \"hanh-la\",\r\n    \"name\": \"Hành lá\",\r\n    \"aliases\": [\"hanh la\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"bó\", \"nhánh\"],\r\n    \"defaultUnit\": \"bó\"\r\n  },\r\n  {\r\n    \"id\": \"dua-chua\",\r\n    \"name\": \"Dưa chua\",\r\n    \"aliases\": [\"đồ chua\", \"dua chua\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"món\"],\r\n    \"defaultUnit\": \"món\"\r\n  },\r\n  {\r\n    \"id\": \"hoa-hoi\",\r\n    \"name\": \"Hoa hồi\",\r\n    \"aliases\": [\"hồi\", \"hoa hoi\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"nhánh\"],\r\n    \"defaultUnit\": \"nhánh\"\r\n  },\r\n  {\r\n    \"id\": \"dau-hao\",\r\n    \"name\": \"Dầu hào\",\r\n    \"aliases\": [\"dau hao\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"dau-an\",\r\n    \"name\": \"Dầu ăn\",\r\n    \"aliases\": [\"dau an\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"muoi\",\r\n    \"name\": \"Muối\",\r\n    \"aliases\": [\"muoi\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"nuoc-mam\",\r\n    \"name\": \"Nước mắm\",\r\n    \"aliases\": [\"mắm\", \"nuoc mam\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"nuoc-tuong\",\r\n    \"name\": \"Nước tương\",\r\n    \"aliases\": [\"tương\", \"nuoc tuong\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"bot-ngot\",\r\n    \"name\": \"Bột ngọt\",\r\n    \"aliases\": [\"mì chính\", \"bot ngot\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"duong-cat\",\r\n    \"name\": \"Đường cát\",\r\n    \"aliases\": [\"đường\", \"duong cat\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"mat-ong\",\r\n    \"name\": \"Mật ong\",\r\n    \"aliases\": [\"mat ong\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"ngu-vi-huong\",\r\n    \"name\": \"Ngũ vị hương\",\r\n    \"aliases\": [\"ngu vi huong\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"nuoc-dua\",\r\n    \"name\": \"Nước dừa\",\r\n    \"aliases\": [\"nuoc dua\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"ot\",\r\n    \"name\": \"Ớt\",\r\n    \"aliases\": [\"ớt\", \"ot\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"trái\", \"quả\"],\r\n    \"defaultUnit\": \"trái\"\r\n  },\r\n  {\r\n    \"id\": \"banh-mi\",\r\n    \"name\": \"Bánh mì\",\r\n    \"aliases\": [\"bánh mì\", \"banh mi\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"ổ\"],\r\n    \"defaultUnit\": \"ổ\"\r\n  },\r\n  {\r\n    \"id\": \"dua-leo\",\r\n    \"name\": \"Dưa leo\",\r\n    \"aliases\": [\"dưa chuột\", \"dua leo\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"quả\", \"trái\"],\r\n    \"defaultUnit\": \"quả\"\r\n  },\r\n  {\r\n    \"id\": \"rau-thom\",\r\n    \"name\": \"Rau thơm\",\r\n    \"aliases\": [\"ngò\", \"rau mùi\", \"rau thom\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"pa-te\",\r\n    \"name\": \"Pa-tê\",\r\n    \"aliases\": [\"pate\", \"pa te\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"tuong-ot\",\r\n    \"name\": \"Tương ớt\",\r\n    \"aliases\": [\"tuong ot\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"bun-tuoi\",\r\n    \"name\": \"Bún tươi\",\r\n    \"aliases\": [\"bún\", \"bun tuoi\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"banh-pho\",\r\n    \"name\": \"Bánh phở\",\r\n    \"aliases\": [\"phở\", \"banh pho\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"thit-bo\",\r\n    \"name\": \"Thịt bò\",\r\n    \"aliases\": [\"bò\", \"thit bo\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"thit-ga\",\r\n    \"name\": \"Thịt gà\",\r\n    \"aliases\": [\"gà\", \"thit ga\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"xuong-ong\",\r\n    \"name\": \"Xương ống\",\r\n    \"aliases\": [\"xương\", \"xuong ong\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"tom-kho\",\r\n    \"name\": \"Tôm khô\",\r\n    \"aliases\": [\"tom kho\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"tom-tuoi\",\r\n    \"name\": \"Tôm tươi\",\r\n    \"aliases\": [\"tôm\", \"tom tuoi\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"ca-chua\",\r\n    \"name\": \"Cà chua\",\r\n    \"aliases\": [\"ca chua\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"quả\", \"trái\"],\r\n    \"defaultUnit\": \"quả\"\r\n  },\r\n  {\r\n    \"id\": \"sa\",\r\n    \"name\": \"Sả\",\r\n    \"aliases\": [\"sả cây\", \"sa\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"nhánh\"],\r\n    \"defaultUnit\": \"nhánh\"\r\n  },\r\n  {\r\n    \"id\": \"gung\",\r\n    \"name\": \"Gừng\",\r\n    \"aliases\": [\"gung\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"củ\"],\r\n    \"defaultUnit\": \"củ\"\r\n  },\r\n  {\r\n    \"id\": \"rieng\",\r\n    \"name\": \"Riềng\",\r\n    \"aliases\": [\"củ riềng\", \"rieng\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"củ\"],\r\n    \"defaultUnit\": \"củ\"\r\n  },\r\n  {\r\n    \"id\": \"mam-tom\",\r\n    \"name\": \"Mắm tôm\",\r\n    \"aliases\": [\"mam tom\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"que\",\r\n    \"name\": \"Quế\",\r\n    \"aliases\": [\"quế thanh\", \"que\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"nhánh\"],\r\n    \"defaultUnit\": \"nhánh\"\r\n  },\r\n  {\r\n    \"id\": \"thao-qua\",\r\n    \"name\": \"Thảo quả\",\r\n    \"aliases\": [\"thao qua\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"quả\", \"trái\"],\r\n    \"defaultUnit\": \"quả\"\r\n  },\r\n  {\r\n    \"id\": \"tieu\",\r\n    \"name\": \"Tiêu\",\r\n    \"aliases\": [\"hạt tiêu\", \"tiêu sọ\", \"tieu\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"chanh\",\r\n    \"name\": \"Chanh\",\r\n    \"aliases\": [\"chanh tươi\", \"chanh\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"quả\", \"trái\"],\r\n    \"defaultUnit\": \"quả\"\r\n  },\r\n  {\r\n    \"id\": \"nam-rom\",\r\n    \"name\": \"Nấm rơm\",\r\n    \"aliases\": [\"nam rom\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"nam-huong\",\r\n    \"name\": \"Nấm hương\",\r\n    \"aliases\": [\"nấm đông cô\", \"nam huong\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"hanh-tay\",\r\n    \"name\": \"Hành tây\",\r\n    \"aliases\": [\"hanh tay\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"củ\"],\r\n    \"defaultUnit\": \"củ\"\r\n  },\r\n  {\r\n    \"id\": \"khoai-tay\",\r\n    \"name\": \"Khoai tây\",\r\n    \"aliases\": [\"khoai tay\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"củ\"],\r\n    \"defaultUnit\": \"củ\"\r\n  },\r\n  {\r\n    \"id\": \"ca-rot\",\r\n    \"name\": \"Cà rốt\",\r\n    \"aliases\": [\"ca rot\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"củ\"],\r\n    \"defaultUnit\": \"củ\"\r\n  },\r\n  {\r\n    \"id\": \"dau-hu\",\r\n    \"name\": \"Đậu hũ\",\r\n    \"aliases\": [\"đậu phụ\", \"dau hu\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"nuoc-dung\",\r\n    \"name\": \"Nước dùng\",\r\n    \"aliases\": [\"nước lèo\", \"nuoc dung\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"ruou-trang\",\r\n    \"name\": \"Rượu trắng\",\r\n    \"aliases\": [\"rượu\", \"ruou trang\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"hat-nem\",\r\n    \"name\": \"Hạt nêm\",\r\n    \"aliases\": [\"bột nêm\", \"hat nem\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"rau-muong\",\r\n    \"name\": \"Rau muống\",\r\n    \"aliases\": [\"rau muong\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"bó\"],\r\n    \"defaultUnit\": \"bó\"\r\n  },\r\n  {\r\n    \"id\": \"ca-tim\",\r\n    \"name\": \"Cà tím\",\r\n    \"aliases\": [\"ca tim\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"quả\", \"trái\"],\r\n    \"defaultUnit\": \"quả\"\r\n  },\r\n  {\r\n    \"id\": \"sua-dac\",\r\n    \"name\": \"Sữa đặc\",\r\n    \"aliases\": [\"sua dac\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"giam\",\r\n    \"name\": \"Giấm\",\r\n    \"aliases\": [\"dấm\", \"giam\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"tuong-den\",\r\n    \"name\": \"Tương đen\",\r\n    \"aliases\": [\"tương ăn phở\", \"tuong den\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  }\r\n]\r\n","units.json":"{\r\n  \"g\": { \"label\": \"g\", \"dimension\": \"mass\", \"toBase\": 1, \"compact\": true },\r\n  \"kg\": { \"label\": \"kg\", \"dimension\": \"mass\", \"toBase\": 1000, \"compact\": true },\r\n  \"ml\": { \"label\": \"ml\", \"dimension\": \"volume\", \"toBase\": 1, \"compact\": true },\r\n  \"lít\": { \"label\": \"lít\", \"dimension\": \"volume\", \"toBase\": 1000, \"compact\": true },\r\n  \"muỗng cà phê\": { \"label\": \"muỗng cà phê\", \"dimension\": \"volume\", \"toBase\": 5 },\r\n  \"muỗng canh\": { \"label\": \"muỗng canh\", \"dimension\": \"volume\", \"toBase\": 15 },\r\n  \"quả\": { \"label\": \"quả\", \"dimension\": \"count\", \"toBase\": 1 },\r\n  \"trái\": { \"label\": \"trái\", \"dimension\": \"count\", \"toBase\": 1 },\r\n  \"củ\": { \"label\": \"củ\", \"dimension\": \"count\", \"toBase\": 1 },\r\n  \"nhánh\": { \"label\": \"nhánh\", \"dimension\": \"count\", \"toBase\": 1 },\r\n  \"tép\": { \"label\": \"tép\", \"dimension\": \"count\", \"toBase\": 1 },\r\n  \"bó\": { \"label\": \"bó\", \"dimension\": \"count\", \"toBase\": 1 },\r\n  \"món\": { \"label\": \"món\", \"dimension\": \"count\", \"toBase\": 1 },\r\n  \"ổ\": { \"label\": \"ổ\", \"dimension\": \"count\", \"toBase\": 1 }\r\n}\r\n"};

/* ---- shim cho vài API của Node mà route còn dùng ---- */
var shims = {
  crypto: { randomBytes: function (n) {
    var a = crypto.getRandomValues(new Uint8Array(n));
    a.toString = function () { return Array.from(this, function (b) { return b.toString(16).padStart(2, '0'); }).join(''); };
    return a;
  } },
  fs: { readFileSync: function (p) { var k = String(p).split('/').pop(); if (!(k in FILES)) throw new Error('Thiếu file ' + p); return FILES[k]; } },
  path: { join: function () { return Array.prototype.join.call(arguments, '/'); }, basename: function (p) { return String(p).split('/').pop(); } }
};
var Buffer = { from: function (str) {
  var bin = atob(str), u = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  u.toString = function (e, s, t) { return String.fromCharCode.apply(null, Array.prototype.slice.call(this, s || 0, t || this.length)); };
  return u;
} };

/* Thu nhỏ ảnh tải lên (tối đa 900px, JPEG) để vừa dung lượng localStorage. */
function shrinkImage(dataUrl) {
  return new Promise(function (resolve) {
    var img = new Image();
    img.onload = function () {
      try {
        var s = Math.min(1, 900 / Math.max(img.width, img.height)), c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * s)); c.height = Math.max(1, Math.round(img.height * s));
        var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.82));
      } catch (e) { resolve(dataUrl); }
    };
    img.onerror = function () { resolve(dataUrl); };
    img.src = dataUrl;
  });
}

/* ---- trình nạp module kiểu CommonJS ---- */
var defs = {}, cache = {};
function def(name, fn) { defs[name] = fn; }
function resolve(from, req) {
  if (shims[req]) return req;
  var parts = from.split('/').slice(0, -1);
  req.split('/').forEach(function (p) { if (p === '..') parts.pop(); else if (p !== '.') parts.push(p); });
  return parts.join('/');
}
function load(name) {
  if (shims[name]) return shims[name];
  if (cache[name]) return cache[name].exports;
  if (!defs[name]) throw new Error('Thiếu module ' + name);
  var m = cache[name] = { exports: {} };
  defs[name](m, m.exports, function (r) { return load(resolve(name, r)); }, '');
  return m.exports;
}

/* ===== lib/text ===== */
def("lib/text", function (module, exports, require, __dirname) {
'use strict';
// Chuẩn hóa tiếng Việt: bỏ dấu, đ -> d, hạ chữ thường.
function norm(s) {
  return String(s == null ? '' : s)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .toLowerCase().replace(/\s+/g, ' ').trim();
}
function slugify(s) {
  return norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function hash32(str) { // FNV-1a, deterministic
  let h = 0x811c9dc5;
  const s = String(str);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}
function formatVnd(n) {
  return Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
}
module.exports = { norm, slugify, hash32, formatVnd };

});

/* ===== lib/validate ===== */
def("lib/validate", function (module, exports, require, __dirname) {
'use strict';
const { HttpError } = require('./http');

const USERNAME_RE = /^[A-Za-z0-9_.]{3,24}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(v) { return typeof v === 'string' ? v.trim() : ''; }

function checkUsername(v) {
  const s = str(v);
  if (!USERNAME_RE.test(s)) throw new HttpError(400, 'Tên đăng nhập gồm 3–24 ký tự: chữ cái, số, dấu chấm hoặc gạch dưới', 'username');
  return s;
}
function checkEmail(v) {
  const s = str(v).toLowerCase();
  if (s.length > 120 || !EMAIL_RE.test(s)) throw new HttpError(400, 'Email không hợp lệ', 'email');
  return s;
}
function checkPassword(v, field) {
  if (typeof v !== 'string' || v.length < 6) throw new HttpError(400, 'Mật khẩu phải có ít nhất 6 ký tự', field || 'password');
  if (v.length > 200) throw new HttpError(400, 'Mật khẩu quá dài', field || 'password');
  return v;
}
function intParam(q, name, def, min, max) {
  const raw = q[name];
  if (raw === undefined || raw === '') return def;
  const n = Number(raw);
  if (!Number.isFinite(n)) throw new HttpError(400, 'Tham số "' + name + '" không hợp lệ', name);
  return Math.min(max, Math.max(min, Math.floor(n)));
}
function numParam(q, name) {
  const raw = q[name];
  if (raw === undefined || raw === '') return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) throw new HttpError(400, 'Tham số "' + name + '" không hợp lệ', name);
  return n;
}
function paging(q) {
  return { page: intParam(q, 'page', 1, 1, 100000), limit: intParam(q, 'limit', 12, 1, 50) };
}
function paginate(list, q) {
  const { page, limit } = paging(q);
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  return { slice: list.slice((page - 1) * limit, page * limit), total, page, pages };
}
module.exports = { str, checkUsername, checkEmail, checkPassword, intParam, numParam, paging, paginate };

});

/* ===== lib/model ===== */
def("lib/model", function (module, exports, require, __dirname) {
'use strict';
const { norm, hash32, formatVnd } = require('./text');
const { catalog, nameOf } = require('./catalog');

const INTERNAL = new Set(['authorId', 'main', 'seedRating', 'seedCount', 'legacyId', 'passwordHash']);

function publicUser(u) {
  return u ? { id: u.id, username: u.username, email: u.email, avatar: u.avatar || null, createdAt: u.createdAt } : null;
}

// Ngữ cảnh một request: các map tra cứu nhanh.
function makeCtx(db, user) {
  const stats = new Map();
  for (const r of db.reviews) {
    const s = stats.get(r.recipeId) || { sum: 0, count: 0 };
    s.sum += r.rating; s.count++; stats.set(r.recipeId, s);
  }
  const users = new Map(db.users.map((u) => [u.id, u]));
  const recipes = new Map();
  for (const r of db.recipes) { recipes.set(r.id, r); }
  for (const r of db.recipes) if (r.legacyId && !recipes.has(r.legacyId)) recipes.set(r.legacyId, r);
  let savedSet = null;
  if (user) savedSet = new Set(db.saved.filter((s) => s.userId === user.id).map((s) => s.recipeId));
  return { db, user, stats, users, recipes, savedSet };
}

function ratingOf(c, rec) {
  const s = c.stats.get(rec.id);
  if (s && s.count) return { rating: Math.round((s.sum / s.count) * 10) / 10, ratingCount: s.count };
  return { rating: rec.seedRating || 0, ratingCount: rec.seedCount || 0 };
}
function authorOf(c, rec) {
  const u = rec.authorId && c.users.get(rec.authorId);
  return u ? { id: u.id, username: u.username } : null;
}
function cardOf(c, rec) {
  const r = ratingOf(c, rec);
  const card = {
    id: rec.id, name: rec.name, image: rec.image, time: rec.time, price: rec.price, category: rec.category,
    rating: r.rating, ratingCount: r.ratingCount, author: authorOf(c, rec)
  };
  if (c.user) card.saved = c.savedSet.has(rec.id);
  return card;
}

const searchCache = new WeakMap();
function searchText(rec) {
  let s = searchCache.get(rec);
  if (!s) {
    const ing = (rec.ingredients || []).map((i) => i.name || nameOf(i.ingredientId)).join(' ');
    s = norm([rec.name, rec.category, rec.subcategory, (rec.tags || []).join(' '), ing].join(' | '));
    searchCache.set(rec, s);
  }
  return s;
}

function similarOf(c, rec) {
  const out = [];
  const seen = new Set([rec.id]);
  const push = (r) => { if (r && !seen.has(r.id) && out.length < 4) { seen.add(r.id); out.push(r); } };
  for (const id of rec.similar || []) push(c.recipes.get(typeof id === 'string' ? id : id && id.id));
  const same = c.db.recipes.filter((r) => r.category === rec.category && !seen.has(r.id));
  same.sort((a, b) => hash32(rec.id + a.id) - hash32(rec.id + b.id)).forEach(push);
  if (out.length < 4) c.db.recipes.filter((r) => !seen.has(r.id)).sort((a, b) => hash32(rec.id + a.id) - hash32(rec.id + b.id)).forEach(push);
  return out.map((r) => ({ id: r.id, name: r.name, price: formatVnd(r.price) + ' / phần', time: r.time + ' phút', image: r.image }));
}

function detailOf(c, rec) {
  const out = {};
  for (const k of Object.keys(rec)) if (!INTERNAL.has(k)) out[k] = rec[k];
  const r = ratingOf(c, rec);
  out.rating = r.rating; out.ratingCount = r.ratingCount;
  out.ratingScore = r.rating; out.reviewCount = r.ratingCount;
  out.author = authorOf(c, rec);
  out.similar = similarOf(c, rec);
  const top = c.db.reviews.filter((x) => x.recipeId === rec.id).sort((a, b) => (b.likedBy || []).length - (a.likedBy || []).length || (a.createdAt < b.createdAt ? 1 : -1))[0];
  const tu = top && c.users.get(top.userId);
  out.featuredReview = top ? { rating: top.rating, text: top.text, author: tu ? tu.username : '' } : { rating: 0, text: '', author: '' };
  if (c.user) out.saved = c.savedSet.has(rec.id);
  return out;
}

function reviewOf(c, rv) {
  const u = c.users.get(rv.userId);
  const rec = c.recipes.get(rv.recipeId);
  const out = {
    id: rv.id, recipeId: rv.recipeId, recipeName: rec ? rec.name : '',
    user: u ? { id: u.id, username: u.username, avatar: u.avatar || null } : { id: null, username: 'Người dùng đã xóa', avatar: null },
    rating: rv.rating, text: rv.text, createdAt: rv.createdAt, likes: (rv.likedBy || []).length
  };
  if (c.user) out.liked = (rv.likedBy || []).includes(c.user.id);
  return out;
}

function categoriesOf(db) {
  const m = new Map();
  for (const r of db.recipes) m.set(r.category, (m.get(r.category) || 0) + 1);
  const { slugify } = require('./text');
  return Array.from(m.entries()).map(([name, count]) => ({ id: slugify(name), name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'vi'));
}

module.exports = { publicUser, makeCtx, ratingOf, cardOf, detailOf, reviewOf, searchText, categoriesOf, catalog };

});

/* ===== lib/router ===== */
def("lib/router", function (module, exports, require, __dirname) {
'use strict';
class Router {
  constructor() { this.routes = []; }
  add(method, pattern, handler, opts) {
    const keys = [];
    const re = new RegExp('^' + pattern.replace(/:([a-zA-Z]+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '/?$');
    this.routes.push({ method, re, keys, handler, opts: opts || {} });
  }
  get(p, h, o) { this.add('GET', p, h, o); }
  post(p, h, o) { this.add('POST', p, h, o); }
  put(p, h, o) { this.add('PUT', p, h, o); }
  patch(p, h, o) { this.add('PATCH', p, h, o); }
  delete(p, h, o) { this.add('DELETE', p, h, o); }
  match(method, pathname) {
    const methods = [];
    for (const r of this.routes) {
      const m = r.re.exec(pathname);
      if (!m) continue;
      if (r.method !== method) { methods.push(r.method); continue; }
      const params = {};
      for (let i = 0; i < r.keys.length; i++) {
        try { params[r.keys[i]] = decodeURIComponent(m[i + 1]); } catch (e) { return { badRequest: true }; }
      }
      return { route: r, params };
    }
    return methods.length ? { methods } : null;
  }
}
module.exports = { Router };

});

/* ===== lib/catalog ===== */
def("lib/catalog", function (module, exports, require, __dirname) {
'use strict';
const fs = require('fs');
const path = require('path');
const { norm, slugify } = require('./text');

const SEED_DIR = 'seed';

// Nguyên liệu bổ sung (có trong công thức nhưng chưa có trong ingredients.json)
const EXTRA = [
  { id: 'ca-phi-le', name: 'Cá phi lê', aliases: ['cá', 'ca'], dimension: 'mass', defaultUnit: 'g' },
  { id: 'ca-dieu-hong', name: 'Cá diêu hồng', aliases: ['cá diêu hồng'], dimension: 'mass', defaultUnit: 'g' },
  { id: 'muc', name: 'Mực', aliases: ['mực', 'muc'], dimension: 'mass', defaultUnit: 'g' },
  { id: 'rau-cai', name: 'Rau cải', aliases: ['cải', 'rau cai'], dimension: 'mass', defaultUnit: 'g' },
  { id: 'bi-do', name: 'Bí đỏ', aliases: ['bí', 'bi do'], dimension: 'mass', defaultUnit: 'g' },
  { id: 'trai-cay', name: 'Trái cây theo mùa', aliases: ['trái cây', 'hoa quả'], dimension: 'mass', defaultUnit: 'g' },
  { id: 'xoai-xanh', name: 'Xoài xanh', aliases: ['xoài', 'xoai'], dimension: 'count', units: ['quả', 'trái'], defaultUnit: 'quả' },
  { id: 'dau-phong', name: 'Đậu phộng', aliases: ['đậu phụng', 'lạc'], dimension: 'mass', defaultUnit: 'g' },
  { id: 'bau', name: 'Bầu', aliases: ['bầu', 'bau'], dimension: 'count', units: ['quả', 'trái'], defaultUnit: 'quả' },
  { id: 'bap-cai', name: 'Bắp cải', aliases: ['bắp cải', 'bap cai'], dimension: 'mass', defaultUnit: 'g' },
  { id: 'dau-phu-non', name: 'Đậu hũ non', aliases: ['đậu hũ non'], dimension: 'mass', defaultUnit: 'g' }
];

const EXTRA2 = [
  {"id":"la-chanh","name":"Lá chanh","aliases":["lá chanh"],"dimension":"mass","defaultUnit":"g"},
  {"id":"suon-heo","name":"Sườn heo","aliases":["sườn"],"dimension":"mass","defaultUnit":"g"},
  {"id":"ba-chi","name":"Thịt ba chỉ","aliases":["ba chỉ","ba rọi"],"dimension":"mass","defaultUnit":"g"},
  {"id":"ca-hoi","name":"Cá hồi","aliases":["cá hồi"],"dimension":"mass","defaultUnit":"g"},
  {"id":"ca-loc","name":"Cá lóc","aliases":["cá lóc"],"dimension":"mass","defaultUnit":"g"},
  {"id":"cua","name":"Cua","aliases":["cua"],"dimension":"mass","defaultUnit":"g"},
  {"id":"ngheu","name":"Nghêu","aliases":["nghêu"],"dimension":"mass","defaultUnit":"g"},
  {"id":"bot-ca-ri","name":"Bột cà ri","aliases":["cà ri","cari"],"dimension":"mass","defaultUnit":"g"},
  {"id":"sa-te","name":"Sa tế","aliases":["sa tế"],"dimension":"mass","defaultUnit":"g"},
  {"id":"me","name":"Me","aliases":["me"],"dimension":"mass","defaultUnit":"g"},
  {"id":"chanh-day","name":"Chanh dây","aliases":["chanh dây"],"dimension":"count","defaultUnit":"quả","units":["quả","trái"]},
  {"id":"bo-trai","name":"Bơ (trái)","aliases":["trái bơ"],"dimension":"count","defaultUnit":"quả","units":["quả","trái"]},
  {"id":"bo-lat","name":"Bơ lạt","aliases":["bơ lạt"],"dimension":"mass","defaultUnit":"g"},
  {"id":"kem-tuoi","name":"Kem tươi","aliases":["kem tươi"],"dimension":"volume","defaultUnit":"ml"},
  {"id":"sua-tuoi","name":"Sữa tươi","aliases":["sữa tươi"],"dimension":"volume","defaultUnit":"ml"},
  {"id":"sua-chua","name":"Sữa chua","aliases":["sữa chua"],"dimension":"mass","defaultUnit":"g"},
  {"id":"xoai","name":"Xoài chín","aliases":["xoài chín"],"dimension":"count","defaultUnit":"quả","units":["quả","trái"]},
  {"id":"chuoi","name":"Chuối","aliases":["chuối"],"dimension":"count","defaultUnit":"quả","units":["quả","trái"]},
  {"id":"dau-xanh","name":"Đậu xanh","aliases":["đậu xanh"],"dimension":"mass","defaultUnit":"g"},
  {"id":"hat-sen","name":"Hạt sen","aliases":["hạt sen"],"dimension":"mass","defaultUnit":"g"},
  {"id":"long-nhan","name":"Long nhãn","aliases":["nhãn"],"dimension":"mass","defaultUnit":"g"},
  {"id":"mien","name":"Miến","aliases":["miến"],"dimension":"mass","defaultUnit":"g"},
  {"id":"mi-y","name":"Mì ý","aliases":["mì ý"],"dimension":"mass","defaultUnit":"g"},
  {"id":"mi-quang","name":"Mì quảng","aliases":["mì quảng"],"dimension":"mass","defaultUnit":"g"},
  {"id":"hu-tieu","name":"Hủ tiếu","aliases":["hủ tiếu"],"dimension":"mass","defaultUnit":"g"},
  {"id":"banh-trang","name":"Bánh tráng","aliases":["bánh tráng"],"dimension":"mass","defaultUnit":"g"},
  {"id":"rau-song","name":"Rau sống","aliases":["rau sống"],"dimension":"mass","defaultUnit":"g"},
  {"id":"rau-ram","name":"Rau răm","aliases":["rau răm"],"dimension":"mass","defaultUnit":"g"},
  {"id":"me-rang","name":"Mè rang","aliases":["mè"],"dimension":"mass","defaultUnit":"g"},
  {"id":"khoai-lang","name":"Khoai lang","aliases":["khoai lang"],"dimension":"count","defaultUnit":"củ","units":["củ"]},
  {"id":"khoai-mon","name":"Khoai môn","aliases":["khoai môn"],"dimension":"count","defaultUnit":"củ","units":["củ"]},
  {"id":"bong-cai","name":"Bông cải xanh","aliases":["bông cải"],"dimension":"mass","defaultUnit":"g"},
  {"id":"kho-qua","name":"Khổ qua","aliases":["mướp đắng"],"dimension":"count","defaultUnit":"quả","units":["quả","trái"]},
  {"id":"rong-bien","name":"Rong biển","aliases":["rong biển"],"dimension":"mass","defaultUnit":"g"},
  {"id":"nam-kim-cham","name":"Nấm kim châm","aliases":["kim châm"],"dimension":"mass","defaultUnit":"g"},
  {"id":"nam-dong-co","name":"Nấm đông cô","aliases":["đông cô"],"dimension":"mass","defaultUnit":"g"},
  {"id":"nam-bao-ngu","name":"Nấm bào ngư","aliases":["bào ngư"],"dimension":"mass","defaultUnit":"g"},
  {"id":"nam-meo","name":"Nấm mèo","aliases":["mộc nhĩ"],"dimension":"mass","defaultUnit":"g"},
  {"id":"nam-tuyet","name":"Nấm tuyết","aliases":["nấm tuyết"],"dimension":"mass","defaultUnit":"g"},
  {"id":"dau-o-liu","name":"Dầu ô liu","aliases":["dầu oliu"],"dimension":"volume","defaultUnit":"ml"},
  {"id":"bot-chien-gion","name":"Bột chiên giòn","aliases":["bột chiên"],"dimension":"mass","defaultUnit":"g"},
  {"id":"la-lot","name":"Lá lốt","aliases":["lá lốt"],"dimension":"mass","defaultUnit":"g"},
  {"id":"ot-chuong","name":"Ớt chuông","aliases":["ớt chuông"],"dimension":"count","defaultUnit":"quả","units":["quả","trái"]},
  {"id":"can-tay","name":"Cần tây","aliases":["cần tây"],"dimension":"mass","defaultUnit":"g"},
  {"id":"xa-lach","name":"Xà lách","aliases":["xà lách"],"dimension":"mass","defaultUnit":"g"},
  {"id":"thom","name":"Dứa (thơm)","aliases":["dứa","thơm"],"dimension":"count","defaultUnit":"quả","units":["quả","trái"]},
  {"id":"lap-xuong","name":"Lạp xưởng","aliases":["lạp xưởng"],"dimension":"mass","defaultUnit":"g"},
  {"id":"cha-lua","name":"Chả lụa","aliases":["chả lụa"],"dimension":"mass","defaultUnit":"g"},
  {"id":"ruou-vang","name":"Rượu vang đỏ","aliases":["rượu vang"],"dimension":"volume","defaultUnit":"ml"},
  {"id":"nghe","name":"Nghệ tươi","aliases":["nghệ"],"dimension":"mass","defaultUnit":"g"},
  {"id":"duong-den","name":"Đường đen","aliases":["đường đen"],"dimension":"mass","defaultUnit":"g"},
  {"id":"hanh-nhan","name":"Hạnh nhân","aliases":["hạnh nhân"],"dimension":"mass","defaultUnit":"g"},
  {"id":"hat-dieu","name":"Hạt điều","aliases":["hạt điều"],"dimension":"mass","defaultUnit":"g"},
  {"id":"hat-chia","name":"Hạt chia","aliases":["hạt chia"],"dimension":"mass","defaultUnit":"g"},
  {"id":"tao-do","name":"Táo đỏ","aliases":["táo đỏ"],"dimension":"mass","defaultUnit":"g"},
  {"id":"cai-thia","name":"Cải thìa","aliases":["cải thìa"],"dimension":"mass","defaultUnit":"g"},
  {"id":"ngo-non","name":"Ngô non","aliases":["ngô non"],"dimension":"mass","defaultUnit":"g"},
  {"id":"mang","name":"Măng","aliases":["măng"],"dimension":"mass","defaultUnit":"g"},
  {"id":"ngo-sen","name":"Ngó sen","aliases":["ngó sen"],"dimension":"mass","defaultUnit":"g"},
  {"id":"cu-sen","name":"Củ sen","aliases":["củ sen"],"dimension":"mass","defaultUnit":"g"},
  {"id":"bong-thien-ly","name":"Bông thiên lý","aliases":["thiên lý"],"dimension":"mass","defaultUnit":"g"},
  {"id":"gia-do","name":"Giá đỗ","aliases":["giá"],"dimension":"mass","defaultUnit":"g"},
  {"id":"dua-cai","name":"Dưa cải chua","aliases":["dưa cải"],"dimension":"mass","defaultUnit":"g"},
  {"id":"rau-cau","name":"Bột rau câu","aliases":["rau câu"],"dimension":"mass","defaultUnit":"g"},
  {"id":"la-e","name":"Lá é","aliases":["lá é"],"dimension":"mass","defaultUnit":"g"},
  {"id":"thi-la","name":"Thì là","aliases":["thì là"],"dimension":"mass","defaultUnit":"g"},
  {"id":"gao-nep","name":"Gạo nếp","aliases":["nếp"],"dimension":"mass","defaultUnit":"g"},
  {"id":"tran-chau","name":"Trân châu","aliases":["trân châu"],"dimension":"mass","defaultUnit":"g"},
  {"id":"xa-xiu","name":"Thịt xá xíu","aliases":["xá xíu"],"dimension":"mass","defaultUnit":"g"},
  {"id":"cha-ca","name":"Chả cá","aliases":["chả cá"],"dimension":"mass","defaultUnit":"g"},
  {"id":"trung-cut","name":"Trứng cút","aliases":["trứng cút"],"dimension":"count","defaultUnit":"quả","units":["quả","trái"]},
  {"id":"trung-muoi","name":"Trứng muối","aliases":["trứng muối"],"dimension":"count","defaultUnit":"quả","units":["quả","trái"]},
  {"id":"sot-teriyaki","name":"Sốt teriyaki","aliases":["teriyaki"],"dimension":"volume","defaultUnit":"ml"},
  {"id":"gio-heo","name":"Giò heo","aliases":["giò heo"],"dimension":"mass","defaultUnit":"g"},
  {"id":"thit-nguoi","name":"Thịt nguội","aliases":["thịt nguội"],"dimension":"mass","defaultUnit":"g"},
  {"id":"xiu-mai","name":"Xíu mại","aliases":["xíu mại"],"dimension":"mass","defaultUnit":"g"},
  {"id":"buoi","name":"Bưởi","aliases":["bưởi"],"dimension":"mass","defaultUnit":"g"},
  {"id":"tieu-xanh","name":"Tiêu xanh","aliases":["tiêu xanh"],"dimension":"mass","defaultUnit":"g"},
  {"id":"bot-gao","name":"Bột gạo","aliases":["bột gạo"],"dimension":"mass","defaultUnit":"g"},
  {"id":"dau-phu-chien","name":"Đậu hũ chiên","aliases":[],"dimension":"mass","defaultUnit":"g"},
  {"id":"cu-cai","name":"Củ cải","aliases":["củ cải"],"dimension":"mass","defaultUnit":"g"},
  {"id":"rau-cu","name":"Rau củ theo mùa","aliases":["rau củ"],"dimension":"mass","defaultUnit":"g"},
  {"id":"banh-quy","name":"Bánh quy","aliases":[],"dimension":"mass","defaultUnit":"g"},
  {"id":"dau-hu-ky","name":"Tàu hũ","aliases":["tàu hũ"],"dimension":"mass","defaultUnit":"g"},
  {"id":"bun-gao","name":"Bún gạo khô","aliases":[],"dimension":"mass","defaultUnit":"g"}
];

EXTRA2.push({ id: 'gao-lut', name: 'Gạo lứt', aliases: ['gạo lứt'], dimension: 'mass', defaultUnit: 'g' });

const SYNONYMS = {
  trung: 'trung-vit', gao: 'gao-tam', hanh: 'hanh-tim', toi: 'toi-bam', 'thit-lon': 'thit-heo',
  bun: 'bun-tuoi', pho: 'banh-pho', 'dau-phu': 'dau-hu', 'ca-chua-bi': 'ca-chua', tom: 'tom-tuoi',
  nam: 'nam-huong', 'ca-hoi': 'ca-phi-le', xoai: 'xoai-xanh'
};

function load() {
  const items = JSON.parse(fs.readFileSync(path.join(SEED_DIR, 'ingredients.json'), 'utf8'));
  const units = JSON.parse(fs.readFileSync(path.join(SEED_DIR, 'units.json'), 'utf8'));
  const byId = new Map();
  for (const it of items.concat(EXTRA, EXTRA2)) if (!byId.has(it.id)) byId.set(it.id, it);
  const aliasMap = new Map();
  for (const it of byId.values()) {
    aliasMap.set(it.id, it.id);
    aliasMap.set(norm(it.name), it.id);
  }
  for (const it of byId.values()) for (const a of it.aliases || []) if (!aliasMap.has(norm(a))) aliasMap.set(norm(a), it.id);
  return { items: Array.from(byId.values()), units, byId, aliasMap };
}
const catalog = load();

// Đưa một chuỗi (id, tên, "nhom:id") về id nguyên liệu chuẩn.
function canonId(token) {
  let t = String(token || '').trim();
  if (t.indexOf(':') > 0) t = t.slice(t.indexOf(':') + 1);
  const n = norm(t);
  if (!n) return '';
  const slug = n.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (catalog.byId.has(slug)) return slug;
  if (SYNONYMS[slug]) return SYNONYMS[slug];
  if (catalog.aliasMap.has(n)) return catalog.aliasMap.get(n);
  return slug;
}
function nameOf(id) {
  const it = catalog.byId.get(id);
  return it ? it.name : id;
}
// Tìm nguyên liệu theo tên (cho so sánh giá): khớp chính xác rồi khớp chứa.
function findByName(text, exact) {
  const n = norm(text);
  if (!n) return null;
  const direct = catalog.aliasMap.get(n) || catalog.aliasMap.get(n.replace(/ /g, '-'));
  if (direct) return catalog.byId.get(direct);
  if (exact) return null;
  for (const it of catalog.byId.values()) {
    if (norm(it.name).includes(n) || n.includes(norm(it.name))) return it;
    for (const a of it.aliases || []) { const na = norm(a); if (na.length > 2 && (na === n || n.includes(na))) return it; }
  }
  return null;
}
module.exports = { catalog, canonId, nameOf, findByName, slugify, SEED_DIR };

});

/* ===== routes/recipes ===== */
def("routes/recipes", function (module, exports, require, __dirname) {
'use strict';
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { HttpError } = require('../lib/http');
const V = require('../lib/validate');
const M = require('../lib/model');
const { norm, slugify } = require('../lib/text');
const { findByName, catalog } = require('../lib/catalog');

const SORTS = new Set(['rating', 'time', 'price', 'new']);
// Tên 7 nhóm bộ lọc của trang Danh mục; mỗi nhóm là một tham số trên URL, giá trị là các nhãn cách nhau bằng dấu phẩy.
const TAG_GROUPS = ['dam', 'tinh-bot', 'rau-cu', 'trai-cay', 'che-do-an', 'vung-mien', 'ngan-sach'];
const IMG_RE = /^(\/(uploads|assets)\/[\w\-./%]{1,300}|https?:\/\/[^\s"'<>]{1,500}|data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+\/=]+)$/;
const FORBIDDEN_KEYS = new Set(['id', 'authorId', 'author', 'rating', 'ratingCount', 'ratingScore', 'reviewCount', 'seedRating', 'seedCount', 'main', 'legacyId', 'createdAt', 'saved', '__proto__', 'constructor', 'prototype']);

function cleanStr(v, max, field, required) {
  const s = typeof v === 'string' ? v.trim() : (typeof v === 'number' ? String(v) : '');
  if (!s) { if (required) throw new HttpError(400, 'Thiếu thông tin bắt buộc', field); return ''; }
  if (s.length > max) throw new HttpError(400, 'Nội dung quá dài (tối đa ' + max + ' ký tự)', field);
  return s;
}
function checkImage(v, field) {
  if (v === undefined || v === null || v === '') return '';
  if (typeof v !== 'string' || !IMG_RE.test(v) || v.includes('..')) throw new HttpError(400, 'Đường dẫn ảnh không hợp lệ', field);
  return v;
}
function numField(v, field, def, min, max) {
  if (v === undefined || v === null || v === '') return def;
  const n = Number(v);
  if (!Number.isFinite(n) || n < min || n > max) throw new HttpError(400, 'Giá trị "' + field + '" không hợp lệ', field);
  return n;
}

const NUTRI_KEYS = ['servings', 'calories', 'carbs', 'protein', 'fat', 'sodium', 'fiber'];
function cleanNutrition(n) {
  const out = { servings: 1 };
  if (n && typeof n === 'object' && !Array.isArray(n)) for (const k of NUTRI_KEYS) {
    const v = n[k];
    if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
    else if (typeof v === 'string' && v.trim() && v.length <= 40) out[k] = v.trim();
  }
  return out;
}

function buildRecipe(b, userId, db) {
  const name = cleanStr(b.name || b.title, 120, 'name', true);
  if (name.length < 3) throw new HttpError(400, 'Tên món cần ít nhất 3 ký tự', 'name');
  const description = cleanStr(b.description, 5000, 'description');
  const image = checkImage(b.image, 'image') || '/assets/images/recipes/bo-kho/placeholder.svg';
  const time = numField(b.time, 'time', 30, 1, 1440);
  const servings = numField(b.servings !== undefined ? b.servings : b.baseServings, 'servings', 2, 1, 100);
  let category = (typeof b.category === 'string' ? b.category.trim() : '').slice(0, 60) || 'Món khác';
  { // slug/id danh mục -> tên danh mục đã có
    const nc = norm(category), sc = slugify(category);
    const hit = db.recipes.find((r) => norm(r.category) === nc || slugify(r.category) === sc);
    if (hit) category = hit.category;
  }
  if (!Array.isArray(b.ingredients) || !b.ingredients.length) throw new HttpError(400, 'Cần ít nhất một nguyên liệu', 'ingredients');
  if (b.ingredients.length > 100) throw new HttpError(400, 'Quá nhiều nguyên liệu', 'ingredients');
  const ingredients = b.ingredients.map((x) => {
    if (!x || typeof x !== 'object') throw new HttpError(400, 'Nguyên liệu không hợp lệ', 'ingredients');
    const nm = cleanStr(x.name, 80, 'ingredients', true);
    const qty = x.quantity !== undefined ? x.quantity : x.qty;
    const q = qty === undefined || qty === '' || qty === null ? '' : (Number.isFinite(Number(qty)) ? Number(qty) : cleanStr(qty, 20, 'ingredients'));
    const known = findByName(nm, true);
    const cid = typeof x.ingredientId === 'string' && catalog.byId.has(x.ingredientId) ? x.ingredientId : null;
    const out = { ingredientId: cid || (known ? known.id : (slugify(nm) || 'nguyen-lieu')), name: nm, qty: q, unit: cleanStr(x.unit, 20, 'ingredients') };
    const note = cleanStr(x.note, 120, 'ingredients'); if (note) out.note = note;
    return out;
  });
  if (!Array.isArray(b.steps) || !b.steps.length) throw new HttpError(400, 'Cần ít nhất một bước thực hiện', 'steps');
  if (b.steps.length > 60) throw new HttpError(400, 'Quá nhiều bước', 'steps');
  const steps = b.steps.map((s) => {
    const o = typeof s === 'string' ? { text: s } : s;
    if (!o || typeof o !== 'object') throw new HttpError(400, 'Bước thực hiện không hợp lệ', 'steps');
    const raw = Array.isArray(o.text) ? o.text.join('\n') : o.text;
    const text = cleanStr(raw, 3000, 'steps', true);
    const imgs = [];
    if (o.image) imgs.push(checkImage(o.image, 'steps'));
    if (Array.isArray(o.images)) for (const im of o.images.slice(0, 6)) imgs.push(checkImage(im, 'steps'));
    return { text: text.split(/\n+/).map((t) => t.trim()).filter(Boolean), images: Array.from(new Set(imgs.filter(Boolean))) };
  });
  const gallery = [image];
  for (const arr of [b.gallery, b.images]) if (Array.isArray(arr)) for (const g of arr.slice(0, 8)) { const x = checkImage(g, 'gallery'); if (x && !gallery.includes(x)) gallery.push(x); }
  const price = numField(b.price, 'price', numField(b.costTotal, 'costTotal', 0, 0, 1e9) / servings, 0, 1e8);
  const rec = {}; // chỉ nhận các trường trong danh sách cho phép (không giữ trường lạ)
  let id = slugify(name) || 'cong-thuc';
  const taken = new Set(db.recipes.map((r) => r.id));
  id = id.slice(0, 60) + '-' + crypto.randomBytes(3).toString('hex');
  while (taken.has(id)) id = id.slice(0, 60) + '-' + crypto.randomBytes(3).toString('hex');
  const prep = Math.max(1, Math.round(time * 0.3));
  const d = new Date();
  const prepIn = b.prepTime !== undefined && b.prepTime !== null && b.prepTime !== '' ? numField(b.prepTime, 'prepTime', 0, 0, 1440) : null;
  const cookIn = b.cookTime !== undefined && b.cookTime !== null && b.cookTime !== '' ? numField(b.cookTime, 'cookTime', 0, 0, 1440) : null;
  const quickIn = Array.isArray(b.quickSteps) && b.quickSteps.length ? b.quickSteps.slice(0, 60).map((q) => cleanStr(q, 1000, 'quickSteps')).filter(Boolean) : null;
  const tags = Array.isArray(b.tags) ? b.tags.filter((t) => typeof t === 'string').slice(0, 10).map((t) => t.slice(0, 40)) : [category];
  return Object.assign(rec, {
    id, name, title: name, category, categoryGroup: 'Công thức cộng đồng', subcategory: '',
    description, summary: ((typeof b.summary === 'string' ? b.summary.trim() : '') || description).slice(0, 500), image, gallery, price: Math.round(price), time,
    prepTime: prepIn !== null ? prepIn : Math.min(prep, time), cookTime: cookIn !== null ? cookIn : Math.max(0, time - prep), baseServings: servings, costTotal: Math.round(price * servings),
    ingredients, quickSteps: quickIn && quickIn.length ? quickIn : steps.map((s) => s.text.join(' ')), steps,
    nutrition: cleanNutrition(b.nutrition),
    similar: [], tags, uploaded: String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear(),
    authorId: userId, createdAt: d.toISOString(), seedRating: 0, seedCount: 0, main: ingredients.map((i) => i.ingredientId).slice(0, 6)
  });
}

const MAGIC = {
  png: (b) => b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  jpeg: (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  webp: (b) => b.length > 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP'
};

module.exports = function (app) {
  const r = app.router;
  function writeLimit(ctx) {
    const wait = app.writeLimiter.hit(ctx.user ? 'u:' + ctx.user.id : 'ip:' + ctx.ip);
    if (wait) { const e = new HttpError(429, 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ' + wait + ' giây.'); e.headers = { 'Retry-After': String(wait) }; throw e; }
  }
  app.writeLimit = writeLimit;

  r.get('/api/recipes', (ctx) => {
    const q = ctx.query;
    const c = M.makeCtx(ctx.db, ctx.user);
    const maxTime = V.numParam(q, 'maxTime');
    const maxPrice = V.numParam(q, 'maxPrice');
    const sort = q.sort === undefined || q.sort === '' ? null : q.sort;
    if (sort && !SORTS.has(sort)) throw new HttpError(400, 'Giá trị sort không hợp lệ (rating|time|price|new)', 'sort');
    const terms = norm(q.q || '').split(' ').filter(Boolean).slice(0, 8);
    const cat = q.category ? norm(q.category) : '';
    // Bộ lọc theo nhóm (Đạm, Tinh bột, ...): trong một nhóm chỉ cần khớp MỘT nhãn, giữa các nhóm phải khớp TẤT CẢ.
    const groups = TAG_GROUPS
      .map((g) => String(q[g] || '').split(',').map((t) => norm(t)).filter(Boolean).slice(0, 12))
      .filter((g) => g.length);
    let list = ctx.db.recipes.filter((rec) => {
      if (cat && norm(rec.category) !== cat && slugify(rec.category) !== cat) return false;
      if (groups.length) {
        const have = new Set((rec.tags || []).map((t) => norm(t)));
        for (const g of groups) if (!g.some((t) => have.has(t))) return false;
      }
      if (maxTime !== null && rec.time > maxTime) return false;
      if (maxPrice !== null && rec.price > maxPrice) return false;
      if (terms.length) { const s = M.searchText(rec); for (const t of terms) if (!s.includes(t)) return false; }
      return true;
    });
    const rate = new Map(list.map((rec) => [rec.id, M.ratingOf(c, rec)]));
    const rel = new Map();
    if (terms.length) {
      const full = terms.join(' ');
      for (const rec of list) { const n = norm(rec.name); rel.set(rec.id, n === full ? 0 : n.startsWith(full) ? 1 : n.includes(full) ? 2 : 3); }
    }
    const byRating = (a, b) => rate.get(b.id).rating - rate.get(a.id).rating || rate.get(b.id).ratingCount - rate.get(a.id).ratingCount;
    const tie = (a, b) => (a.id < b.id ? -1 : 1);
    list.sort((a, b) => {
      if (sort === 'time') return a.time - b.time || byRating(a, b) || tie(a, b);
      if (sort === 'price') return a.price - b.price || byRating(a, b) || tie(a, b);
      if (sort === 'new') return (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0) || tie(a, b);
      if (!sort && terms.length) return rel.get(a.id) - rel.get(b.id) || byRating(a, b) || tie(a, b);
      return byRating(a, b) || tie(a, b);
    });
    const p = V.paginate(list, q);
    return { items: p.slice.map((rec) => Object.assign(M.cardOf(c, rec), { tags: rec.tags || [] })), total: p.total, page: p.page, pages: p.pages };
  });

  r.get('/api/categories', (ctx) => ({ items: M.categoriesOf(ctx.db) }));

  r.get('/api/recipes/:id', (ctx) => {
    const c = M.makeCtx(ctx.db, ctx.user);
    const rec = c.recipes.get(ctx.params.id);
    if (!rec) throw new HttpError(404, 'Không tìm thấy công thức');
    if (ctx.user) {
      const h = ctx.db.history;
      const uid = ctx.user.id;
      for (let i = h.length - 1; i >= 0; i--) if (h[i].userId === uid && h[i].recipeId === rec.id) h.splice(i, 1);
      h.push({ userId: uid, recipeId: rec.id, at: new Date().toISOString() });
      const mine = h.filter((x) => x.userId === uid);
      if (mine.length > 200) { const drop = new Set(mine.slice(0, mine.length - 200)); ctx.db.history = h.filter((x) => !drop.has(x)); }
      ctx.store.saveSoon();
    }
    return M.detailOf(c, rec);
  });

  r.post('/api/recipes', async (ctx) => {
    const user = ctx.requireUser();
    writeLimit(ctx);
    const b = await ctx.body(1024 * 1024);
    const rec = buildRecipe(b, user.id, ctx.db);
    ctx.db.recipes.push(rec);
    ctx.store.save();
    ctx.status = 201;
    return { id: rec.id };
  });

  r.delete('/api/recipes/:id', (ctx) => {
    const user = ctx.requireUser();
    const db = ctx.db;
    const i = db.recipes.findIndex((x) => x.id === ctx.params.id);
    if (i < 0) throw new HttpError(404, 'Không tìm thấy công thức');
    const rec = db.recipes[i];
    if (rec.authorId !== user.id) throw new HttpError(403, 'Bạn chỉ có thể xóa công thức do chính mình đăng');
    db.recipes.splice(i, 1);
    db.saved = db.saved.filter((x) => x.recipeId !== rec.id);
    db.reviews = db.reviews.filter((x) => x.recipeId !== rec.id);
    db.history = db.history.filter((x) => x.recipeId !== rec.id);
    // xóa ảnh đã tải lên nếu không còn ai dùng
    const files = new Set([rec.image].concat(rec.gallery || []).concat((rec.steps || []).flatMap((s) => s.images || [])));
    for (const f of files) {
      if (typeof f !== 'string' || !f.startsWith('/uploads/')) continue;
      if (!db.uploads.some((x) => x.file === path.basename(f) && x.userId === user.id)) continue;
      const used = db.users.some((u) => u.avatar === f) || db.recipes.some((o) => o.image === f || (o.gallery || []).includes(f) || (o.steps || []).some((s) => (s.images || []).includes(f)));
      if (!used) { try { fs.unlinkSync(path.join(ctx.app.cfg.uploadsDir, path.basename(f))); } catch (e) { /* ignore */ } db.uploads = db.uploads.filter((x) => x.file !== path.basename(f)); }
    }
    ctx.store.save();
    return { ok: true };
  });

  r.post('/api/uploads', async (ctx) => {
    const upUser = ctx.requireUser();
    writeLimit(ctx);
    if (ctx.db.uploads.filter((x) => x.userId === upUser.id).length >= ctx.app.cfg.uploadQuota) throw new HttpError(429, 'Bạn đã đạt giới hạn ' + ctx.app.cfg.uploadQuota + ' ảnh tải lên');
    const b = await ctx.body(4.5 * 1024 * 1024);
    const m = typeof b.dataUrl === 'string' && /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=\s]+)$/.exec(b.dataUrl);
    if (!m) throw new HttpError(400, 'Ảnh không hợp lệ (chỉ nhận PNG, JPEG hoặc WebP dạng data URL)', 'dataUrl');
    const buf = Buffer.from(m[2].replace(/\s+/g, ''), 'base64');
    if (!buf.length) throw new HttpError(400, 'Ảnh rỗng', 'dataUrl');
    if (buf.length > 3 * 1024 * 1024) throw new HttpError(413, 'Ảnh quá lớn (tối đa 3 MB)', 'dataUrl');
    if (!MAGIC[m[1]](buf)) throw new HttpError(400, 'Nội dung ảnh không khớp định dạng khai báo', 'dataUrl');
    const file = crypto.randomBytes(12).toString('hex');
    const url = await shrinkImage(b.dataUrl);
    ctx.db.uploads.push({ file, userId: upUser.id, at: new Date().toISOString() });
    ctx.store.save();
    return { url };
  });
};

});

/* ===== routes/auth ===== */
def("routes/auth", function (module, exports, require, __dirname) {
'use strict';
const crypto = require('crypto');
const { HttpError } = require('../lib/http');
const V = require('../lib/validate');
const S = require('../lib/session');
const { hashPassword, verifyPassword, fakeVerify } = require('../lib/hash');
const { publicUser } = require('../lib/model');

function secure(req) { return req.headers['x-forwarded-proto'] === 'https'; }
function rateCheck(ctx, ident) {
  const key = ctx.ip + '|' + String(ident == null ? '' : ident).toLowerCase().slice(0, 120);
  const wait = Math.max(ctx.app.ipLimiter.hit(ctx.ip), ctx.app.limiter.hit(key));
  if (wait) { const e = new HttpError(429, 'Bạn thử quá nhiều lần. Vui lòng thử lại sau ' + wait + ' giây.'); e.headers = { 'Retry-After': String(wait) }; throw e; }
}
function lc(s) { return String(s).toLowerCase(); }

// Xóa mọi dữ liệu gắn với một người dùng (dùng khi xóa tài khoản)
function purgeUser(db, uid) {
  db.sessions = db.sessions.filter((s) => s.userId !== uid);
  db.saved = db.saved.filter((s) => s.userId !== uid);
  db.history = db.history.filter((s) => s.userId !== uid);
  db.reviews = db.reviews.filter((r) => r.userId !== uid);
  for (const r of db.reviews) if (r.likedBy) r.likedBy = r.likedBy.filter((x) => x !== uid);
  for (const rec of db.recipes) if (rec.authorId === uid) rec.authorId = null;
  db.users = db.users.filter((u) => u.id !== uid);
}

module.exports = function (app) {
  const r = app.router;

  r.post('/api/auth/register', async (ctx) => {
    if (ctx.app.cfg.demoOnly) throw new HttpError(403, 'Bản demo trực tuyến tạm đóng đăng ký. Hãy đăng nhập bằng tài khoản demo (demo / demo123).');
    const b = await ctx.body();
    rateCheck(ctx, typeof b.username === 'string' ? b.username : '');
    const username = V.checkUsername(b.username);
    const email = V.checkEmail(b.email);
    const password = V.checkPassword(b.password);
    const db = ctx.db;
    if (db.users.some((u) => lc(u.username) === lc(username))) throw new HttpError(409, 'Tên đăng nhập đã được sử dụng', 'username');
    if (db.users.some((u) => lc(u.email) === email)) throw new HttpError(409, 'Email đã được sử dụng', 'email');
    const passwordHash = await hashPassword(password);
    // kiểm tra lại sau await (tránh đua)
    if (db.users.some((u) => lc(u.username) === lc(username))) throw new HttpError(409, 'Tên đăng nhập đã được sử dụng', 'username');
    if (db.users.some((u) => lc(u.email) === email)) throw new HttpError(409, 'Email đã được sử dụng', 'email');
    const user = { id: 'u_' + crypto.randomBytes(6).toString('hex'), username, email, avatar: null, passwordHash, createdAt: new Date().toISOString() };
    db.users.push(user);
    const sid = S.createSession(db, user.id);
    ctx.store.save();
    ctx.setCookie(S.cookieHeader(sid, secure(ctx.req)));
    ctx.status = 201;
    return { user: publicUser(user) };
  });

  r.post('/api/auth/login', async (ctx) => {
    const b = await ctx.body();
    rateCheck(ctx, typeof b.identifier === 'string' ? b.identifier : '');
    const ident = V.str(b.identifier);
    const pw = typeof b.password === 'string' ? b.password : '';
    if (!ident || !pw) throw new HttpError(400, 'Vui lòng nhập tên đăng nhập/email và mật khẩu');
    if (ident.length > 120 || pw.length > 200) throw new HttpError(401, 'Thông tin đăng nhập không đúng');
    const li = lc(ident);
    const user = ctx.db.users.find((u) => lc(u.username) === li || lc(u.email) === li);
    if (!user) { await fakeVerify(pw); throw new HttpError(401, 'Tên đăng nhập/email hoặc mật khẩu không đúng'); }
    if (!(await verifyPassword(pw, user.passwordHash))) throw new HttpError(401, 'Tên đăng nhập/email hoặc mật khẩu không đúng');
    if (ctx.sid) S.destroySession(ctx.db, ctx.sid);
    S.purgeExpired(ctx.db);
    const sid = S.createSession(ctx.db, user.id);
    ctx.store.save();
    ctx.setCookie(S.cookieHeader(sid, secure(ctx.req)));
    return { user: publicUser(user) };
  });

  r.post('/api/auth/logout', async (ctx) => {
    if (ctx.sid) { S.destroySession(ctx.db, ctx.sid); ctx.store.save(); }
    ctx.setCookie(S.clearCookieHeader());
    return { ok: true };
  });

  r.get('/api/me', (ctx) => ({ user: publicUser(ctx.user) }));

  r.patch('/api/me', async (ctx) => {
    const user = ctx.requireUser();
    const b = await ctx.body();
    if (typeof b.currentPassword !== 'string' || !b.currentPassword) throw new HttpError(400, 'Vui lòng nhập mật khẩu hiện tại', 'currentPassword');
    if (!(await verifyPassword(b.currentPassword, user.passwordHash))) throw new HttpError(403, 'Mật khẩu hiện tại không đúng', 'currentPassword');
    const upd = {};
    if (b.username !== undefined) {
      upd.username = V.checkUsername(b.username);
      if (ctx.db.users.some((u) => u.id !== user.id && lc(u.username) === lc(upd.username))) throw new HttpError(409, 'Tên đăng nhập đã được sử dụng', 'username');
    }
    if (b.email !== undefined) {
      upd.email = V.checkEmail(b.email);
      if (ctx.db.users.some((u) => u.id !== user.id && lc(u.email) === upd.email)) throw new HttpError(409, 'Email đã được sử dụng', 'email');
    }
    if (b.newPassword !== undefined) { V.checkPassword(b.newPassword, 'newPassword'); upd.passwordHash = await hashPassword(b.newPassword); }
    if (b.avatar !== undefined) {
      if (b.avatar !== null && !(typeof b.avatar === 'string' && ((/^\/(uploads|assets)\/[\w\-./]{1,200}$/.test(b.avatar) && !b.avatar.includes('..')) || /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+\/=]+$/.test(b.avatar)))) throw new HttpError(400, 'Ảnh đại diện không hợp lệ', 'avatar');
      upd.avatar = b.avatar;
    }
    Object.assign(user, upd);
    if (upd.passwordHash) S.revokeOthers(ctx.db, user.id, ctx.sid);
    ctx.store.save();
    return { user: publicUser(user) };
  });

  r.delete('/api/me', async (ctx) => {
    const user = ctx.requireUser();
    const b = await ctx.body();
    if (typeof b.password !== 'string' || !b.password) throw new HttpError(400, 'Vui lòng nhập mật khẩu để xác nhận', 'password');
    if (!(await verifyPassword(b.password, user.passwordHash))) throw new HttpError(403, 'Mật khẩu không đúng', 'password');
    purgeUser(ctx.db, user.id);
    ctx.store.save();
    ctx.setCookie(S.clearCookieHeader());
    return { ok: true };
  });
};

});

/* ===== routes/me ===== */
def("routes/me", function (module, exports, require, __dirname) {
'use strict';
const { HttpError } = require('../lib/http');
const V = require('../lib/validate');
const M = require('../lib/model');

module.exports = function (app) {
  const r = app.router;

  function savedList(c) {
    return c.db.saved.filter((s) => s.userId === c.user.id).sort((a, b) => (a.at < b.at ? 1 : -1))
      .map((s) => c.recipes.get(s.recipeId)).filter(Boolean);
  }
  function uploadedList(c) {
    return c.db.recipes.filter((x) => x.authorId === c.user.id).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }
  function historyList(c) {
    return c.db.history.filter((h) => h.userId === c.user.id).sort((a, b) => (a.at < b.at ? 1 : -1))
      .map((h) => ({ rec: c.recipes.get(h.recipeId), at: h.at })).filter((x) => x.rec);
  }
  function reviewList(c) {
    return c.db.reviews.filter((x) => x.userId === c.user.id).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }
  function ctxOf(ctx) { ctx.requireUser(); return M.makeCtx(ctx.db, ctx.user); }

  r.get('/api/me/saved', (ctx) => {
    const c = ctxOf(ctx);
    const p = V.paginate(savedList(c), ctx.query);
    return { items: p.slice.map((x) => M.cardOf(c, x)), total: p.total, page: p.page, pages: p.pages };
  });
  r.get('/api/me/uploaded', (ctx) => {
    const c = ctxOf(ctx);
    const p = V.paginate(uploadedList(c), ctx.query);
    return { items: p.slice.map((x) => M.cardOf(c, x)), total: p.total, page: p.page, pages: p.pages };
  });
  r.get('/api/me/history', (ctx) => {
    const c = ctxOf(ctx);
    const p = V.paginate(historyList(c), ctx.query);
    return { items: p.slice.map((x) => Object.assign(M.cardOf(c, x.rec), { viewedAt: x.at })), total: p.total, page: p.page, pages: p.pages };
  });
  r.delete('/api/me/history', (ctx) => {
    const user = ctx.requireUser();
    ctx.db.history = ctx.db.history.filter((h) => h.userId !== user.id);
    ctx.store.save();
    return { ok: true };
  });
  r.get('/api/me/reviews', (ctx) => {
    const c = ctxOf(ctx);
    return { items: reviewList(c).map((x) => M.reviewOf(c, x)) };
  });
  r.get('/api/me/overview', (ctx) => {
    const c = ctxOf(ctx);
    const saved = savedList(c), up = uploadedList(c), hist = historyList(c), rv = reviewList(c);
    return {
      counts: { saved: saved.length, uploaded: up.length, reviews: rv.length, history: hist.length },
      recentSaved: saved.slice(0, 4).map((x) => M.cardOf(c, x)),
      recentUploaded: up.slice(0, 4).map((x) => M.cardOf(c, x)),
      recentReviews: rv.slice(0, 2).map((x) => M.reviewOf(c, x))
    };
  });

  function setSaved(ctx, on) {
    const user = ctx.requireUser();
    const c = M.makeCtx(ctx.db, user);
    const rec = c.recipes.get(ctx.params.id);
    if (!rec) throw new HttpError(404, 'Không tìm thấy công thức');
    const db = ctx.db;
    const has = db.saved.some((s) => s.userId === user.id && s.recipeId === rec.id);
    if (on && !has) db.saved.push({ userId: user.id, recipeId: rec.id, at: new Date().toISOString() });
    if (!on && has) db.saved = db.saved.filter((s) => !(s.userId === user.id && s.recipeId === rec.id));
    if (on !== has) ctx.store.save();
    return { saved: on };
  }
  r.put('/api/recipes/:id/save', (ctx) => setSaved(ctx, true));
  r.delete('/api/recipes/:id/save', (ctx) => setSaved(ctx, false));
};

});

/* ===== routes/reviews ===== */
def("routes/reviews", function (module, exports, require, __dirname) {
'use strict';
const crypto = require('crypto');
const { HttpError } = require('../lib/http');
const M = require('../lib/model');

module.exports = function (app) {
  const r = app.router;

  r.get('/api/recipes/:id/reviews', (ctx) => {
    const c = M.makeCtx(ctx.db, ctx.user);
    const rec = c.recipes.get(ctx.params.id);
    if (!rec) throw new HttpError(404, 'Không tìm thấy công thức');
    const list = ctx.db.reviews.filter((x) => x.recipeId === rec.id).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const sum = list.reduce((s, x) => s + x.rating, 0);
    return { items: list.map((x) => M.reviewOf(c, x)), average: list.length ? Math.round((sum / list.length) * 10) / 10 : 0, count: list.length };
  });

  r.post('/api/recipes/:id/reviews', async (ctx) => {
    const user = ctx.requireUser();
    app.writeLimit(ctx);
    const b = await ctx.body();
    const c = M.makeCtx(ctx.db, user);
    const rec = c.recipes.get(ctx.params.id);
    if (!rec) throw new HttpError(404, 'Không tìm thấy công thức');
    const rating = Number(b.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new HttpError(400, 'Số sao phải từ 1 đến 5', 'rating');
    const text = typeof b.text === 'string' ? b.text.trim() : '';
    if (b.text !== undefined && typeof b.text !== 'string') throw new HttpError(400, 'Nội dung đánh giá không hợp lệ', 'text');
    if (text.length > 2000) throw new HttpError(400, 'Nội dung đánh giá quá dài (tối đa 2000 ký tự)', 'text');
    let rv = ctx.db.reviews.find((x) => x.recipeId === rec.id && x.userId === user.id);
    let created = !rv;
    if (rv) { rv.rating = rating; rv.text = text; rv.updatedAt = new Date().toISOString(); }
    else {
      rv = { id: 'rv_' + crypto.randomBytes(6).toString('hex'), recipeId: rec.id, userId: user.id, rating, text, createdAt: new Date().toISOString(), likedBy: [] };
      ctx.db.reviews.push(rv);
    }
    ctx.store.save();
    ctx.status = created ? 201 : 200;
    return { review: M.reviewOf(c, rv) };
  });

  r.post('/api/reviews/:id/like', (ctx) => {
    const user = ctx.requireUser();
    app.writeLimit(ctx);
    const rv = ctx.db.reviews.find((x) => x.id === ctx.params.id);
    if (!rv) throw new HttpError(404, 'Không tìm thấy đánh giá');
    rv.likedBy = rv.likedBy || [];
    const i = rv.likedBy.indexOf(user.id);
    if (i >= 0) rv.likedBy.splice(i, 1); else rv.likedBy.push(user.id);
    ctx.store.save();
    return { liked: i < 0, likes: rv.likedBy.length };
  });

  r.delete('/api/reviews/:id', (ctx) => {
    const user = ctx.requireUser();
    const i = ctx.db.reviews.findIndex((x) => x.id === ctx.params.id);
    if (i < 0) throw new HttpError(404, 'Không tìm thấy đánh giá');
    if (ctx.db.reviews[i].userId !== user.id) throw new HttpError(403, 'Bạn chỉ có thể xóa đánh giá của chính mình');
    ctx.db.reviews.splice(i, 1);
    ctx.store.save();
    return { ok: true };
  });
};

});

/* ===== routes/ingredients ===== */
def("routes/ingredients", function (module, exports, require, __dirname) {
'use strict';
const { HttpError } = require('../lib/http');
const M = require('../lib/model');
const V = require('../lib/validate');
const { catalog, canonId, nameOf, findByName } = require('../lib/catalog');
const { norm, hash32 } = require('../lib/text');

// url: trang chủ của cửa hàng, dùng cho nút "MUA NGAY" (dữ liệu giá là số tham khảo, chưa lấy trực tiếp từ cửa hàng)
const STORES = [
  { store: 'BÁCH HÓA XANH', k: 0.97, url: 'https://www.bachhoaxanh.com/' }, { store: 'COOP FOOD', k: 1.06, url: 'https://cooponline.vn/' },
  { store: 'WINMART', k: 1.0, url: 'https://winmart.vn/' }, { store: 'SUNMART', k: 1.12, url: 'https://sunmart.vn/' },
  { store: 'GS25', k: 1.22, url: 'https://gs25.com.vn/' }, { store: 'CIRCLE K', k: 1.28, url: 'https://www.circlek.com.vn/' }
];
// Quy cách đóng gói gợi ý theo loại đơn vị, để mỗi cửa hàng có tên sản phẩm riêng
const PACKS = { mass: ['200g', '300g', '500g', '1kg'], volume: ['330ml', '500ml', '750ml', '1 lít'], count: ['vỉ 6', 'vỉ 10', '1 quả', 'túi 500g'] };
// Tên sản phẩm cụ thể đã biết (khớp với giá tham khảo bên dưới)
const KNOWN = { 'thit-heo': { 'BÁCH HÓA XANH': 'Thịt heo xay C.P 200g', 'COOP FOOD': 'Thịt heo xay kg-AHT990' } };
// Giá tham khảo (VND) theo đơn vị so sánh: 100g / 100ml / 1 đơn vị đếm
const BASE = {
  'thit-heo': 11069, 'thit-bo': 29000, 'thit-ga': 9500, 'tom-tuoi': 19000, 'ca-phi-le': 14000, 'trung-vit': 4500, 'gao-tam': 1800,
  'hanh-tim': 3000, 'hanh-la': 5000, 'toi-bam': 3500, 'ca-chua': 4000, 'ca-rot': 3500, 'khoai-tay': 2800, 'dau-hu': 3500,
  'nuoc-mam': 2500, 'nuoc-tuong': 2200, 'dau-an': 2400, 'duong-cat': 2200, 'muoi': 800, 'bun-tuoi': 2000, 'banh-mi': 3500, 'nam-huong': 12000
};
const UNIT_LABEL = { mass: '100g', volume: '100ml', count: 'quả' };

function compareOne(name) {
  const it = findByName(name);
  if (!it) return { name, id: null, unit: null, price: null, stores: [] };
  const unit = UNIT_LABEL[it.dimension] || '100g';
  const base = BASE[it.id] || (2000 + (hash32(it.id) % 20) * 500);
  const stores = STORES.map((s, i) => {
    const h = hash32(it.id + s.store);
    let price = Math.round((base * s.k * (0.95 + (h % 11) / 100)) / 10) * 10;
    if (it.id === 'thit-heo' && i === 0) price = 11069;
    if (it.id === 'thit-heo' && i === 1) price = 12700;
    const disc = [0, 10, 15, 20][h % 4];
    const pack = PACKS[it.dimension] || PACKS.mass;
    const product = (KNOWN[it.id] && KNOWN[it.id][s.store]) || (it.name + ' ' + pack[h % pack.length]);
    const o = { store: s.store, product, price, unit, url: s.url };
    if (disc) { o.oldPrice = Math.round(price / (1 - disc / 100) / 100) * 100; o.discount = disc; }
    return o;
  }).sort((a, b) => a.price - b.price);
  return { name: it.name, id: it.id, unit, price: stores[0].price, stores };
}

module.exports = function (app) {
  const r = app.router;

  // Chỉ trả danh mục chuẩn (không lẫn tên/đơn vị do người dùng tự nhập)
  r.get('/api/ingredients', () => ({ items: catalog.items, units: catalog.units }));

  r.get('/api/ingredients/compare', (ctx) => {
    const names = String(ctx.query.names || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (!names.length) throw new HttpError(400, 'Vui lòng nhập ít nhất một nguyên liệu (names=a,b,c)', 'names');
    if (names.length > 20) throw new HttpError(400, 'Tối đa 20 nguyên liệu mỗi lần so sánh', 'names');
    return { items: names.map(compareOne) };
  });

  r.get('/api/fridge', (ctx) => {
    const raw = String(ctx.query.ingredients || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 60);
    const limit = V.intParam(ctx.query, 'limit', 20, 1, 100);
    const kw = norm(ctx.query.q || '');
    const selFull = raw.map((t) => ({ group: t.includes(':') ? t.split(':')[0] : '', id: canonId(t) }));
    const selIds = new Set(selFull.map((s) => s.id));
    const selGroups = new Set(selFull.filter((s) => s.group).map((s) => s.group));
    const c = M.makeCtx(ctx.db, ctx.user);
    const out = [];
    for (const rec of ctx.db.recipes) {
      if (kw && !norm(rec.name).includes(kw)) continue;
      const main = (rec.main && rec.main.length ? rec.main : (rec.ingredients || []).map((i) => i.ingredientId)).slice(0, 8);
      const matched = [], missing = [];
      for (const m of main) {
        let label, hit;
        if (/:khac$/.test(m)) { const g = m.split(':')[0]; hit = selGroups.has(g); label = (g === 'dam' ? 'Đạm' : g === 'rau-cu' ? 'Rau củ' : g) + ' khác'; }
        else { hit = selIds.has(m); label = nameOf(m); }
        (hit ? matched : missing).push(label);
      }
      if (selIds.size && !matched.length) continue;
      const total = matched.length + missing.length;
      const score = total ? Math.round((matched.length / total) * 100) / 100 : 0;
      out.push({ recipe: M.cardOf(c, rec), matched, missing, score, status: selIds.size && !missing.length && (matched.length >= 2 || (main.length === 1 && !rec.legacyId)) ? 'du' : 'thieu' });
    }
    out.sort((a, b) => b.score - a.score || b.matched.length - a.matched.length || b.recipe.rating - a.recipe.rating || (a.recipe.id < b.recipe.id ? -1 : 1));
    return { items: out.slice(0, limit) };
  });
};

});

/* ===== routes/misc ===== */
def("routes/misc", function (module, exports, require, __dirname) {
'use strict';
const crypto = require('crypto');
const { HttpError } = require('../lib/http');
const V = require('../lib/validate');
const M = require('../lib/model');

module.exports = function (app) {
  const r = app.router;

  r.post('/api/contact', async (ctx) => {
    const wait = app.contactLimiter.hit(ctx.ip);
    if (wait) { const e = new HttpError(429, 'Bạn gửi quá nhiều tin nhắn. Vui lòng thử lại sau ' + wait + ' giây.'); e.headers = { 'Retry-After': String(wait) }; throw e; }
    const b = await ctx.body();
    const name = V.str(b.name);
    if (!name || name.length > 100) throw new HttpError(400, 'Vui lòng nhập họ tên (tối đa 100 ký tự)', 'name');
    const email = V.checkEmail(b.email);
    const message = V.str(b.message);
    if (message.length < 5 || message.length > 5000) throw new HttpError(400, 'Nội dung cần từ 5 đến 5000 ký tự', 'message');
    ctx.db.contacts.push({ id: 'ct_' + crypto.randomBytes(5).toString('hex'), name, email, message, createdAt: new Date().toISOString() });
    if (ctx.db.contacts.length > 2000) ctx.db.contacts.shift();
    ctx.store.save();
    ctx.status = 201;
    return { ok: true };
  });


  // Bảng vinh danh trang chủ: nhiều công thức nhất / nhiều đánh giá nhất / công thức được lưu nhiều nhất.
  r.get('/api/leaderboard', (ctx) => {
    const db = ctx.db;
    const byId = new Map(db.users.map((u) => [u.id, u]));
    function top(counter) {
      let best = null;
      counter.forEach((n, id) => {
        const u = byId.get(id);
        if (u && (!best || n > best.count)) best = { id: u.id, username: u.username, avatar: u.avatar || null, count: n };
      });
      return best;
    }
    const uploads = new Map(), reviews = new Map(), saves = new Map();
    db.recipes.forEach((x) => { if (x.authorId) uploads.set(x.authorId, (uploads.get(x.authorId) || 0) + 1); });
    db.reviews.forEach((x) => { reviews.set(x.userId, (reviews.get(x.userId) || 0) + 1); });
    db.saved.forEach((x) => { saves.set(x.recipeId, (saves.get(x.recipeId) || 0) + 1); });
    let bestRecipe = null;
    saves.forEach((n, id) => {
      const rec = db.recipes.find((x) => x.id === id);
      if (rec && (!bestRecipe || n > bestRecipe.saves)) bestRecipe = { id: rec.id, name: rec.name, saves: n, author: rec.authorId && byId.get(rec.authorId) ? { id: rec.authorId, username: byId.get(rec.authorId).username } : null };
    });
    return { mostRecipes: top(uploads), mostReviews: top(reviews), mostSaved: bestRecipe };
  });

  r.get('/api/health', (ctx) => { const o = { ok: true, recipes: ctx.db.recipes.length }; if (ctx.app.cfg.demoOnly) o.demoOnly = true; return o; });
};

});

/* ===== lib/http ===== */
def("lib/http", function (module, exports, require, __dirname) {
'use strict';
class HttpError extends Error { constructor(status, message, field) { super(message); this.status = status; this.field = field; } }
module.exports = { HttpError };

});

/* ===== lib/hash ===== */
def("lib/hash", function (module, exports, require, __dirname) {
'use strict';
// Băm mật khẩu bằng PBKDF2-SHA256 (Web Crypto) kèm salt ngẫu nhiên. Định dạng: p1$<salt hex>$<hash hex>
const enc = new TextEncoder();
const hex = (buf) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
const unhex = (h) => new Uint8Array((h.match(/../g) || []).map((x) => parseInt(x, 16)));
async function derive(pw, saltBytes) {
  const key = await crypto.subtle.importKey('raw', enc.encode(String(pw)), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations: 100000 }, key, 256));
}
async function hashPassword(pw) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return 'p1$' + hex(salt) + '$' + await derive(pw, salt);
}
async function verifyPassword(pw, stored) {
  const p = String(stored || '').split('$');
  if (p.length !== 3 || p[0] !== 'p1') return false;
  return (await derive(pw, unhex(p[1]))) === p[2];
}
async function fakeVerify() { /* không cần: không có máy chủ để dò thời gian phản hồi */ }
module.exports = { hashPassword, verifyPassword, fakeVerify };

});

/* ===== lib/session ===== */
def("lib/session", function (module, exports, require, __dirname) {
'use strict';
// Phiên đăng nhập lưu trong localStorage của trình duyệt (không có cookie hay máy chủ).
const MAX_AGE = 30 * 24 * 3600;
const rnd = () => Array.from(crypto.getRandomValues(new Uint8Array(24)), (b) => b.toString(16).padStart(2, '0')).join('');
function createSession(db, userId) {
  const sid = rnd(), now = Date.now();
  db.sessions.push({ id: sid, userId, createdAt: now, expiresAt: now + MAX_AGE * 1000 });
  return sid;
}
function findSession(db, sid) {
  if (!sid) return null;
  const s = db.sessions.find((x) => x.id === sid);
  return s && s.expiresAt >= Date.now() ? s : null;
}
function destroySession(db, sid) { db.sessions = db.sessions.filter((x) => x.id !== sid); }
function revokeOthers(db, userId, keepSid) { db.sessions = db.sessions.filter((s) => s.userId !== userId || s.id === keepSid); }
function purgeExpired(db) { const n = Date.now(); db.sessions = db.sessions.filter((x) => x.expiresAt >= n); }
const cookieHeader = (sid) => 'SET:' + sid;
const clearCookieHeader = () => 'CLEAR';
module.exports = { MAX_AGE, createSession, findSession, destroySession, purgeExpired, revokeOthers, cookieHeader, clearCookieHeader };

});

/* ===== Chạy: dùng fetch đọc /data/db.json một lần, rồi xử lý mọi yêu cầu ngay trong trình duyệt (không gọi mạng nào khác) ===== */
var HttpError = load('lib/http').HttpError, Router = load('lib/router').Router, S = load('lib/session');
var NOLIMIT = { hit: function () { return 0; } };
var router = new Router(), db = null, baseIds = null, baseRecipes = null, ready = null;
var app = {
  cfg: { demoOnly: false, uploadQuota: 40 },
  router: router, limiter: NOLIMIT, ipLimiter: NOLIMIT, writeLimiter: NOLIMIT, contactLimiter: NOLIMIT
};
var store = { data: null, save: persist, saveSoon: persist };

function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); return true; } catch (e) { return false; } }

function persist() {
  var st = {};
  COLLECTIONS.forEach(function (k) { st[k] = db[k] || []; });
  st.userRecipes = db.recipes.filter(function (r) { return !baseIds.has(r.id); });
  var have = new Set(db.recipes.map(function (r) { return r.id; }));
  st.deletedSeed = Array.from(baseIds).filter(function (id) { return !have.has(id); });
  if (!lsSet(KEY, JSON.stringify(st))) console.warn('NomNom: không lưu được dữ liệu (localStorage đầy hoặc bị chặn).');
}

function init() {
  return origFetch('/data/db.json').then(function (r) { return r.json(); }).then(function (base) {
    db = base;
    baseRecipes = base.recipes.slice();
    baseIds = new Set(baseRecipes.map(function (r) { return r.id; }));
    var raw = lsGet(KEY), st = null;
    try { st = raw ? JSON.parse(raw) : null; } catch (e) { st = null; }
    if (st) {
      COLLECTIONS.forEach(function (k) { db[k] = Array.isArray(st[k]) ? st[k] : []; });
      var del = new Set(st.deletedSeed || []);
      db.recipes = baseRecipes.filter(function (r) { return !del.has(r.id); }).concat(st.userRecipes || []);
    }
    COLLECTIONS.forEach(function (k) { if (!Array.isArray(db[k])) db[k] = []; });
    store.data = db;
    ['auth', 'recipes', 'me', 'reviews', 'ingredients', 'misc'].forEach(function (n) { load('routes/' + n)(app); });
  });
}

function json(status, obj) { return { status: status, data: obj }; }

async function handle(url, method, bodyText) {
  var u = new URL(url, location.origin);
  var m = router.match(method, u.pathname);
  if (!m) throw new HttpError(404, 'Không tìm thấy API này');
  if (m.badRequest) throw new HttpError(400, 'Đường dẫn không hợp lệ');
  if (m.methods) throw new HttpError(405, 'Phương thức không được hỗ trợ');
  var sid = lsGet(SID_KEY);
  var sess = S.findSession(db, sid);
  var user = sess ? db.users.find(function (x) { return x.id === sess.userId; }) || null : null;
  var query = {};
  u.searchParams.forEach(function (v, k) { if (!(k in query)) query[k] = v; });
  var ctx = {
    req: { headers: {} }, url: u, query: query, params: m.params, app: app, db: db, store: store,
    user: user, sid: sid, status: 200, headers: {}, ip: 'local',
    body: async function () {
      var v;
      try { v = bodyText ? JSON.parse(bodyText) : {}; } catch (e) { throw new HttpError(400, 'Dữ liệu JSON không hợp lệ'); }
      if (v === null || typeof v !== 'object' || Array.isArray(v)) throw new HttpError(400, 'Dữ liệu gửi lên phải là một đối tượng JSON');
      return v;
    },
    setCookie: function (v) { this.headers['Set-Cookie'] = v; },
    requireUser: function () { if (!this.user) throw new HttpError(401, 'Bạn cần đăng nhập để thực hiện thao tác này'); return this.user; }
  };
  var out = await m.route.handler(ctx);
  var c = ctx.headers['Set-Cookie'];
  if (c) { if (c === 'CLEAR') lsSet(SID_KEY, null); else if (c.indexOf('SET:') === 0) lsSet(SID_KEY, c.slice(4)); }
  return json(ctx.status, out === undefined ? { ok: true } : out);
}

/* Điểm vào duy nhất: NomNomStore.run('GET', '/recipes?limit=5') -> Promise<{status, data}> */
window.NomNomStore = { run: function (method, path, body) {
  return (ready = ready || init()).then(function () {
    return handle('/api' + path, String(method).toUpperCase(), body === undefined ? '' : JSON.stringify(body));
  }).catch(function (e) {
    if (e instanceof HttpError) return json(e.status, e.field ? { error: e.message, field: e.field } : { error: e.message });
    console.error('NomNom store:', e);
    return json(500, { error: 'Đã có lỗi xảy ra. Vui lòng thử lại.' });
  });
} };
window.NomNomLocal = { reset: function () { lsSet(KEY, null); lsSet(SID_KEY, null); location.reload(); } };

})();
