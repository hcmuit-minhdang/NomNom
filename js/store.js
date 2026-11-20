/* NomNom: kho dữ liệu chạy ngay trong trình duyệt (không có máy chủ).
   Cung cấp NomNomStore.run(method, path, body): trả lời bằng dữ liệu tĩnh /data/db.json, tải một lần bằng fetch (công thức, nguyên liệu, tài khoản demo)
   cộng phần người dùng thay đổi (tài khoản, phiên, công thức đã lưu/đăng, đánh giá, lịch sử) lưu ở localStorage.
   Nhờ đó site chạy được trên mọi hosting tĩnh, không cần Node.js hay máy chủ nào.
   Nạp file này TRƯỚC /js/data.js. Dữ liệu của mỗi trình duyệt tách biệt; xóa dữ liệu trang web để đặt lại.
   Phần module bên dưới được ghép từ các route/model đã kiểm thử của phiên bản có máy chủ trước đây. */
(function () {
'use strict';
const origFetch = window.fetch.bind(window); // chỉ dùng để đọc file tĩnh /data/db.json
const KEY = 'nomnom:state:v2', SID_KEY = 'nomnom:sid';
const COLLECTIONS = ['users', 'sessions', 'saved', 'reviews', 'history', 'contacts', 'uploads'];
const FILES = {"ingredients.json":"[\r\n  {\r\n    \"id\": \"gao-tam\",\r\n    \"name\": \"Gạo tấm\",\r\n    \"aliases\": [\"gạo\", \"tấm\", \"gao tam\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"thit-heo\",\r\n    \"name\": \"Thịt heo\",\r\n    \"aliases\": [\"sườn\", \"cốt lết\", \"ba rọi\", \"thit heo\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"nuoc-cot-dua\",\r\n    \"name\": \"Nước cốt dừa\",\r\n    \"aliases\": [\"cốt dừa\", \"nuoc cot dua\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"nuoc-cot-chanh\",\r\n    \"name\": \"Nước cốt chanh\",\r\n    \"aliases\": [\"chanh\", \"nuoc cot chanh\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"la-dua\",\r\n    \"name\": \"Lá dứa\",\r\n    \"aliases\": [\"la dua\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"trung-vit\",\r\n    \"name\": \"Trứng vịt\",\r\n    \"aliases\": [\"trứng\", \"trung vit\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"quả\", \"trái\"],\r\n    \"defaultUnit\": \"quả\"\r\n  },\r\n  {\r\n    \"id\": \"toi-bam\",\r\n    \"name\": \"Tỏi băm\",\r\n    \"aliases\": [\"tỏi\", \"toi bam\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"hanh-tim\",\r\n    \"name\": \"Hành tím\",\r\n    \"aliases\": [\"hành\", \"hanh tim\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"củ\"],\r\n    \"defaultUnit\": \"củ\"\r\n  },\r\n  {\r\n    \"id\": \"hanh-la\",\r\n    \"name\": \"Hành lá\",\r\n    \"aliases\": [\"hanh la\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"bó\", \"nhánh\"],\r\n    \"defaultUnit\": \"bó\"\r\n  },\r\n  {\r\n    \"id\": \"dua-chua\",\r\n    \"name\": \"Dưa chua\",\r\n    \"aliases\": [\"đồ chua\", \"dua chua\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"món\"],\r\n    \"defaultUnit\": \"món\"\r\n  },\r\n  {\r\n    \"id\": \"hoa-hoi\",\r\n    \"name\": \"Hoa hồi\",\r\n    \"aliases\": [\"hồi\", \"hoa hoi\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"nhánh\"],\r\n    \"defaultUnit\": \"nhánh\"\r\n  },\r\n  {\r\n    \"id\": \"dau-hao\",\r\n    \"name\": \"Dầu hào\",\r\n    \"aliases\": [\"dau hao\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"dau-an\",\r\n    \"name\": \"Dầu ăn\",\r\n    \"aliases\": [\"dau an\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"muoi\",\r\n    \"name\": \"Muối\",\r\n    \"aliases\": [\"muoi\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"nuoc-mam\",\r\n    \"name\": \"Nước mắm\",\r\n    \"aliases\": [\"mắm\", \"nuoc mam\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"nuoc-tuong\",\r\n    \"name\": \"Nước tương\",\r\n    \"aliases\": [\"tương\", \"nuoc tuong\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"bot-ngot\",\r\n    \"name\": \"Bột ngọt\",\r\n    \"aliases\": [\"mì chính\", \"bot ngot\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"duong-cat\",\r\n    \"name\": \"Đường cát\",\r\n    \"aliases\": [\"đường\", \"duong cat\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"mat-ong\",\r\n    \"name\": \"Mật ong\",\r\n    \"aliases\": [\"mat ong\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"ngu-vi-huong\",\r\n    \"name\": \"Ngũ vị hương\",\r\n    \"aliases\": [\"ngu vi huong\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"nuoc-dua\",\r\n    \"name\": \"Nước dừa\",\r\n    \"aliases\": [\"nuoc dua\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"ot\",\r\n    \"name\": \"Ớt\",\r\n    \"aliases\": [\"ớt\", \"ot\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"trái\", \"quả\"],\r\n    \"defaultUnit\": \"trái\"\r\n  },\r\n  {\r\n    \"id\": \"banh-mi\",\r\n    \"name\": \"Bánh mì\",\r\n    \"aliases\": [\"bánh mì\", \"banh mi\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"ổ\"],\r\n    \"defaultUnit\": \"ổ\"\r\n  },\r\n  {\r\n    \"id\": \"dua-leo\",\r\n    \"name\": \"Dưa leo\",\r\n    \"aliases\": [\"dưa chuột\", \"dua leo\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"quả\", \"trái\"],\r\n    \"defaultUnit\": \"quả\"\r\n  },\r\n  {\r\n    \"id\": \"rau-thom\",\r\n    \"name\": \"Rau thơm\",\r\n    \"aliases\": [\"ngò\", \"rau mùi\", \"rau thom\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"pa-te\",\r\n    \"name\": \"Pa-tê\",\r\n    \"aliases\": [\"pate\", \"pa te\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"tuong-ot\",\r\n    \"name\": \"Tương ớt\",\r\n    \"aliases\": [\"tuong ot\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"bun-tuoi\",\r\n    \"name\": \"Bún tươi\",\r\n    \"aliases\": [\"bún\", \"bun tuoi\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"banh-pho\",\r\n    \"name\": \"Bánh phở\",\r\n    \"aliases\": [\"phở\", \"banh pho\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"thit-bo\",\r\n    \"name\": \"Thịt bò\",\r\n    \"aliases\": [\"bò\", \"thit bo\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"thit-ga\",\r\n    \"name\": \"Thịt gà\",\r\n    \"aliases\": [\"gà\", \"thit ga\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"xuong-ong\",\r\n    \"name\": \"Xương ống\",\r\n    \"aliases\": [\"xương\", \"xuong ong\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"tom-kho\",\r\n    \"name\": \"Tôm khô\",\r\n    \"aliases\": [\"tom kho\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"tom-tuoi\",\r\n    \"name\": \"Tôm tươi\",\r\n    \"aliases\": [\"tôm\", \"tom tuoi\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"ca-chua\",\r\n    \"name\": \"Cà chua\",\r\n    \"aliases\": [\"ca chua\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"quả\", \"trái\"],\r\n    \"defaultUnit\": \"quả\"\r\n  },\r\n  {\r\n    \"id\": \"sa\",\r\n    \"name\": \"Sả\",\r\n    \"aliases\": [\"sả cây\", \"sa\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"nhánh\"],\r\n    \"defaultUnit\": \"nhánh\"\r\n  },\r\n  {\r\n    \"id\": \"gung\",\r\n    \"name\": \"Gừng\",\r\n    \"aliases\": [\"gung\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"củ\"],\r\n    \"defaultUnit\": \"củ\"\r\n  },\r\n  {\r\n    \"id\": \"rieng\",\r\n    \"name\": \"Riềng\",\r\n    \"aliases\": [\"củ riềng\", \"rieng\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"củ\"],\r\n    \"defaultUnit\": \"củ\"\r\n  },\r\n  {\r\n    \"id\": \"mam-tom\",\r\n    \"name\": \"Mắm tôm\",\r\n    \"aliases\": [\"mam tom\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"que\",\r\n    \"name\": \"Quế\",\r\n    \"aliases\": [\"quế thanh\", \"que\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"nhánh\"],\r\n    \"defaultUnit\": \"nhánh\"\r\n  },\r\n  {\r\n    \"id\": \"thao-qua\",\r\n    \"name\": \"Thảo quả\",\r\n    \"aliases\": [\"thao qua\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"quả\", \"trái\"],\r\n    \"defaultUnit\": \"quả\"\r\n  },\r\n  {\r\n    \"id\": \"tieu\",\r\n    \"name\": \"Tiêu\",\r\n    \"aliases\": [\"hạt tiêu\", \"tiêu sọ\", \"tieu\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"chanh\",\r\n    \"name\": \"Chanh\",\r\n    \"aliases\": [\"chanh tươi\", \"chanh\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"quả\", \"trái\"],\r\n    \"defaultUnit\": \"quả\"\r\n  },\r\n  {\r\n    \"id\": \"nam-rom\",\r\n    \"name\": \"Nấm rơm\",\r\n    \"aliases\": [\"nam rom\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"nam-huong\",\r\n    \"name\": \"Nấm hương\",\r\n    \"aliases\": [\"nấm đông cô\", \"nam huong\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"hanh-tay\",\r\n    \"name\": \"Hành tây\",\r\n    \"aliases\": [\"hanh tay\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"củ\"],\r\n    \"defaultUnit\": \"củ\"\r\n  },\r\n  {\r\n    \"id\": \"khoai-tay\",\r\n    \"name\": \"Khoai tây\",\r\n    \"aliases\": [\"khoai tay\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"củ\"],\r\n    \"defaultUnit\": \"củ\"\r\n  },\r\n  {\r\n    \"id\": \"ca-rot\",\r\n    \"name\": \"Cà rốt\",\r\n    \"aliases\": [\"ca rot\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"củ\"],\r\n    \"defaultUnit\": \"củ\"\r\n  },\r\n  {\r\n    \"id\": \"dau-hu\",\r\n    \"name\": \"Đậu hũ\",\r\n    \"aliases\": [\"đậu phụ\", \"dau hu\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"nuoc-dung\",\r\n    \"name\": \"Nước dùng\",\r\n    \"aliases\": [\"nước lèo\", \"nuoc dung\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"ruou-trang\",\r\n    \"name\": \"Rượu trắng\",\r\n    \"aliases\": [\"rượu\", \"ruou trang\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"hat-nem\",\r\n    \"name\": \"Hạt nêm\",\r\n    \"aliases\": [\"bột nêm\", \"hat nem\"],\r\n    \"dimension\": \"mass\",\r\n    \"defaultUnit\": \"g\"\r\n  },\r\n  {\r\n    \"id\": \"rau-muong\",\r\n    \"name\": \"Rau muống\",\r\n    \"aliases\": [\"rau muong\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"bó\"],\r\n    \"defaultUnit\": \"bó\"\r\n  },\r\n  {\r\n    \"id\": \"ca-tim\",\r\n    \"name\": \"Cà tím\",\r\n    \"aliases\": [\"ca tim\"],\r\n    \"dimension\": \"count\",\r\n    \"units\": [\"quả\", \"trái\"],\r\n    \"defaultUnit\": \"quả\"\r\n  },\r\n  {\r\n    \"id\": \"sua-dac\",\r\n    \"name\": \"Sữa đặc\",\r\n    \"aliases\": [\"sua dac\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"giam\",\r\n    \"name\": \"Giấm\",\r\n    \"aliases\": [\"dấm\", \"giam\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  },\r\n  {\r\n    \"id\": \"tuong-den\",\r\n    \"name\": \"Tương đen\",\r\n    \"aliases\": [\"tương ăn phở\", \"tuong den\"],\r\n    \"dimension\": \"volume\",\r\n    \"defaultUnit\": \"ml\"\r\n  }\r\n]\r\n","units.json":"{\r\n  \"g\": { \"label\": \"g\", \"dimension\": \"mass\", \"toBase\": 1, \"compact\": true },\r\n  \"kg\": { \"label\": \"kg\", \"dimension\": \"mass\", \"toBase\": 1000, \"compact\": true },\r\n  \"ml\": { \"label\": \"ml\", \"dimension\": \"volume\", \"toBase\": 1, \"compact\": true },\r\n  \"lít\": { \"label\": \"lít\", \"dimension\": \"volume\", \"toBase\": 1000, \"compact\": true },\r\n  \"muỗng cà phê\": { \"label\": \"muỗng cà phê\", \"dimension\": \"volume\", \"toBase\": 5 },\r\n  \"muỗng canh\": { \"label\": \"muỗng canh\", \"dimension\": \"volume\", \"toBase\": 15 },\r\n  \"quả\": { \"label\": \"quả\", \"dimension\": \"count\", \"toBase\": 1 },\r\n  \"trái\": { \"label\": \"trái\", \"dimension\": \"count\", \"toBase\": 1 },\r\n  \"củ\": { \"label\": \"củ\", \"dimension\": \"count\", \"toBase\": 1 },\r\n  \"nhánh\": { \"label\": \"nhánh\", \"dimension\": \"count\", \"toBase\": 1 },\r\n  \"tép\": { \"label\": \"tép\", \"dimension\": \"count\", \"toBase\": 1 },\r\n  \"bó\": { \"label\": \"bó\", \"dimension\": \"count\", \"toBase\": 1 },\r\n  \"món\": { \"label\": \"món\", \"dimension\": \"count\", \"toBase\": 1 },\r\n  \"ổ\": { \"label\": \"ổ\", \"dimension\": \"count\", \"toBase\": 1 }\r\n}\r\n"};

/* ---- shim cho vài API của Node mà route còn dùng ---- */
const shims = {
  crypto: { randomBytes: function (byteCount) {
    const a = crypto.getRandomValues(new Uint8Array(byteCount));
    a.toString = function () { return Array.from(this, function (b) { return b.toString(16).padStart(2, '0'); }).join(''); };
    return a;
  } },
  fs: { readFileSync: function (filePath) { const k = String(filePath).split('/').pop(); if (!(k in FILES)) throw new Error('Thiếu file ' + filePath); return FILES[k]; } },
  path: { join: function () { return Array.prototype.join.call(arguments, '/'); }, basename: function (filePath) { return String(filePath).split('/').pop(); } }
};
const Buffer = { from: function (str) {
  const bin = atob(str), bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  bytes.toString = function (e, start, end) { return String.fromCharCode.apply(null, Array.prototype.slice.call(this, start || 0, end || this.length)); };
  return bytes;
} };

/* Thu nhỏ ảnh tải lên (tối đa 800px, JPEG) để vừa dung lượng localStorage. */
function shrinkImage(dataUrl) {
  return new Promise(function (resolve) {
    const img = new Image();
    img.onload = function () {
      try {
        const scale = Math.min(1, 800 / Math.max(img.width, img.height)), canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale)); canvas.height = Math.max(1, Math.round(img.height * scale));
        const canvasCtx = canvas.getContext('2d'); canvasCtx.fillStyle = '#fff'; canvasCtx.fillRect(0, 0, canvas.width, canvas.height); canvasCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      } catch (e) { resolve(dataUrl); }
    };
    img.onerror = function () { resolve(dataUrl); };
    img.src = dataUrl;
  });
}

/* ---- trình nạp module kiểu CommonJS ---- */
const defs = {}, cache = {};
function def(name, factory) { defs[name] = factory; }
function resolve(from, req) {
  if (shims[req]) return req;
  const parts = from.split('/').slice(0, -1);
  req.split('/').forEach(function (part) { if (part === '..') parts.pop(); else if (part !== '.') parts.push(part); });
  return parts.join('/');
}
function load(name) {
  if (shims[name]) return shims[name];
  if (cache[name]) return cache[name].exports;
  if (!defs[name]) throw new Error('Thiếu module ' + name);
  const mod = cache[name] = { exports: {} };
  defs[name](mod, mod.exports, function (relPath) { return load(resolve(name, relPath)); }, '');
  return mod.exports;
}

/* ===== lib/text ===== */
def("lib/text", function (module, exports, require, __dirname) {
'use strict';
// Chuẩn hóa tiếng Việt: bỏ dấu, đ -> d, hạ chữ thường.
function norm(text) {
  return String(text == null ? '' : text)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .toLowerCase().replace(/\s+/g, ' ').trim();
}
function slugify(text) {
  return norm(text).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function hash32(str) { // FNV-1a, deterministic
  let hash = 0x811c9dc5;
  const text = String(str);
  for (let i = 0; i < text.length; i++) { hash ^= text.charCodeAt(i); hash = Math.imul(hash, 0x01000193) >>> 0; }
  return hash >>> 0;
}
function formatVnd(amount) {
  return Math.round(Number(amount) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
}
module.exports = { norm, slugify, hash32, formatVnd };

});

/* ===== lib/validate ===== */
def("lib/validate", function (module, exports, require, __dirname) {
'use strict';
const { HttpError } = require('./http');

const USERNAME_RE = /^[A-Za-z0-9_.]{3,24}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(value) { return typeof value === 'string' ? value.trim() : ''; }

function checkUsername(value) {
  const username = str(value);
  if (!USERNAME_RE.test(username)) throw new HttpError(400, 'Tên đăng nhập gồm 3–24 ký tự: chữ cái, số, dấu chấm hoặc gạch dưới', 'username');
  return username;
}
function checkEmail(value) {
  const email = str(value).toLowerCase();
  if (email.length > 120 || !EMAIL_RE.test(email)) throw new HttpError(400, 'Email không hợp lệ', 'email');
  return email;
}
function checkPassword(value, field) {
  if (typeof value !== 'string' || value.length < 6) throw new HttpError(400, 'Mật khẩu phải có ít nhất 6 ký tự', field || 'password');
  if (value.length > 200) throw new HttpError(400, 'Mật khẩu quá dài', field || 'password');
  return value;
}
function intParam(query, name, def, min, max) {
  const raw = query[name];
  if (raw === undefined || raw === '') return def;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) throw new HttpError(400, 'Tham số "' + name + '" không hợp lệ', name);
  return Math.min(max, Math.max(min, Math.floor(parsed)));
}
function numParam(query, name) {
  const raw = query[name];
  if (raw === undefined || raw === '') return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) throw new HttpError(400, 'Tham số "' + name + '" không hợp lệ', name);
  return parsed;
}
function paging(query) {
  return { page: intParam(query, 'page', 1, 1, 100000), limit: intParam(query, 'limit', 12, 1, 50) };
}
function paginate(list, query) {
  const { page, limit } = paging(query);
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

function publicUser(user) {
  return user ? { id: user.id, username: user.username, email: user.email, avatar: user.avatar || null, cover: user.cover || null, createdAt: user.createdAt } : null;
}

// Ngữ cảnh một request: các map tra cứu nhanh.
function makeCtx(database, user) {
  // stats: phần chênh lệch so với điểm mẫu (seedRating/seedCount).
  // Review mẫu có sẵn trong db.json coi như đã nằm trong seedCount: chỉ cộng phần người dùng sửa sao, xóa thì trừ ra;
  // review người dùng tạo mới thì cộng thêm cả sao lẫn lượt.
  const stats = new Map();
  const seedRv = database.seedReviews || new Map();
  const add = (recipeId, sum, count) => { const entry = stats.get(recipeId) || { sum: 0, count: 0 }; entry.sum += sum; entry.count += count; stats.set(recipeId, entry); };
  const present = new Set();
  for (const review of database.reviews) {
    const seed = seedRv.get(review.id);
    if (seed) { present.add(review.id); add(review.recipeId, review.rating - seed.rating, 0); }
    else add(review.recipeId, review.rating, 1);
  }
  seedRv.forEach((seed, reviewId) => { if (!present.has(reviewId)) add(seed.recipeId, -seed.rating, -1); });
  const users = new Map(database.users.map((account) => [account.id, account]));
  const recipes = new Map();
  for (const recipe of database.recipes) { recipes.set(recipe.id, recipe); }
  for (const recipe of database.recipes) if (recipe.legacyId && !recipes.has(recipe.legacyId)) recipes.set(recipe.legacyId, recipe);
  let savedSet = null;
  if (user) savedSet = new Set(database.saved.filter((entry) => entry.userId === user.id).map((entry) => entry.recipeId));
  return { db: database, user, stats, users, recipes, savedSet };
}

function ratingOf(context, rec) {
  // Trung bình gộp: (điểm mẫu * lượt mẫu + tổng sao review mới) / (lượt mẫu + số review mới)
  const stat = context.stats.get(rec.id) || { sum: 0, count: 0 };
  const baseCount = rec.seedCount || 0;
  const count = Math.max(0, baseCount + stat.count);
  if (!count) return { rating: 0, ratingCount: 0 };
  const total = (rec.seedRating || 0) * baseCount + stat.sum;
  return { rating: Math.max(0, Math.min(5, Math.round((total / count) * 10) / 10)), ratingCount: count };
}
function authorOf(context, rec) {
  const author = rec.authorId && context.users.get(rec.authorId);
  return author ? { id: author.id, username: author.username, avatar: author.avatar || null } : null;
}
function cardOf(context, rec) {
  const rating = ratingOf(context, rec);
  const card = {
    id: rec.id, name: rec.name, image: rec.image, time: rec.time, price: rec.price, category: rec.category,
    rating: rating.rating, ratingCount: rating.ratingCount, author: authorOf(context, rec)
  };
  if (context.user) card.saved = context.savedSet.has(rec.id);
  return card;
}

const searchCache = new WeakMap();
// Chữ thường giữ nguyên dấu (dạng NFC) để so khớp khi người dùng gõ từ khóa có dấu
function lowerVi(text) { return String(text == null ? '' : text).normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim(); }
// Trả về { plain: bản bỏ dấu, accent: bản có dấu } của tên món + danh mục + nhãn + nguyên liệu
function searchTexts(rec) {
  let texts = searchCache.get(rec);
  if (!texts || texts.name !== rec.name) {
    const ing = (rec.ingredients || []).map((i) => i.name || nameOf(i.ingredientId)).join(' ');
    const raw = [rec.name, rec.category, rec.subcategory, (rec.tags || []).join(' '), ing].join(' | ');
    texts = { name: rec.name, plain: norm(raw), accent: lowerVi(raw) };
    searchCache.set(rec, texts);
  }
  return texts;
}
function searchText(rec) { return searchTexts(rec).plain; }

function similarOf(context, rec) {
  const out = [];
  const seen = new Set([rec.id]);
  const push = (candidate) => { if (candidate && !seen.has(candidate.id) && out.length < 4) { seen.add(candidate.id); out.push(candidate); } };
  for (const similarId of rec.similar || []) push(context.recipes.get(typeof similarId === 'string' ? similarId : similarId && similarId.id));
  const same = context.db.recipes.filter((candidate) => candidate.category === rec.category && !seen.has(candidate.id));
  same.sort((a, b) => hash32(rec.id + a.id) - hash32(rec.id + b.id)).forEach(push);
  if (out.length < 4) context.db.recipes.filter((candidate) => !seen.has(candidate.id)).sort((a, b) => hash32(rec.id + a.id) - hash32(rec.id + b.id)).forEach(push);
  return out.map((recipe) => ({ id: recipe.id, name: recipe.name, price: formatVnd(recipe.price) + ' / phần', time: recipe.time + ' phút', image: recipe.image }));
}

function detailOf(context, rec) {
  const out = {};
  for (const k of Object.keys(rec)) if (!INTERNAL.has(k)) out[k] = rec[k];
  const rating = ratingOf(context, rec);
  out.rating = rating.rating; out.ratingCount = rating.ratingCount;
  out.ratingScore = rating.rating; out.reviewCount = rating.ratingCount;
  out.author = authorOf(context, rec);
  out.similar = similarOf(context, rec);
  const top = context.db.reviews.filter((x) => x.recipeId === rec.id).sort((a, b) => (b.likedBy || []).length - (a.likedBy || []).length || (a.createdAt < b.createdAt ? 1 : -1))[0];
  const topUser = top && context.users.get(top.userId);
  out.featuredReview = top ? { rating: top.rating, text: top.text, author: topUser ? topUser.username : '' } : { rating: 0, text: '', author: '' };
  if (context.user) out.saved = context.savedSet.has(rec.id);
  return out;
}

function reviewOf(context, review) {
  const reviewer = context.users.get(review.userId);
  const rec = context.recipes.get(review.recipeId);
  const out = {
    id: review.id, recipeId: review.recipeId, recipeName: rec ? rec.name : '',
    user: reviewer ? { id: reviewer.id, username: reviewer.username, avatar: reviewer.avatar || null } : { id: null, username: 'Người dùng đã xóa', avatar: null },
    rating: review.rating, text: review.text, createdAt: review.createdAt, likes: (review.likedBy || []).length
  };
  if (context.user) out.liked = (review.likedBy || []).includes(context.user.id);
  return out;
}

function categoriesOf(database) {
  const counts = new Map();
  for (const recipe of database.recipes) counts.set(recipe.category, (counts.get(recipe.category) || 0) + 1);
  const { slugify } = require('./text');
  return Array.from(counts.entries()).map(([name, count]) => ({ id: slugify(name), name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'vi'));
}

module.exports = { publicUser, makeCtx, ratingOf, cardOf, detailOf, reviewOf, searchText, searchTexts, lowerVi, categoriesOf, catalog };

});

/* ===== lib/router ===== */
def("lib/router", function (module, exports, require, __dirname) {
'use strict';
class Router {
  constructor() { this.routes = []; }
  add(method, pattern, handler, opts) {
    const keys = [];
    const matcher = new RegExp('^' + pattern.replace(/:([a-zA-Z]+)/g, (whole, k) => { keys.push(k); return '([^/]+)'; }) + '/?$');
    this.routes.push({ method, re: matcher, keys, handler, opts: opts || {} });
  }
  get(pattern, handler, options) { this.add('GET', pattern, handler, options); }
  post(pattern, handler, options) { this.add('POST', pattern, handler, options); }
  put(pattern, handler, options) { this.add('PUT', pattern, handler, options); }
  patch(pattern, handler, options) { this.add('PATCH', pattern, handler, options); }
  delete(pattern, handler, options) { this.add('DELETE', pattern, handler, options); }
  match(method, pathname) {
    const methods = [];
    for (const route of this.routes) {
      const matched = route.re.exec(pathname);
      if (!matched) continue;
      if (route.method !== method) { methods.push(route.method); continue; }
      const params = {};
      for (let i = 0; i < route.keys.length; i++) {
        try { params[route.keys[i]] = decodeURIComponent(matched[i + 1]); } catch (e) { return { badRequest: true }; }
      }
      return { route: route, params };
    }
    return methods.length ? { methods } : null;
  }
}
module.exports = { Router };

});

/* ===== lib/catalog ===== */
def("lib/catalog", function (module, exports, require, __dirname) {
'use strict';
const fileSystem = require('fs');
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
  const items = JSON.parse(fileSystem.readFileSync(path.join(SEED_DIR, 'ingredients.json'), 'utf8'));
  const units = JSON.parse(fileSystem.readFileSync(path.join(SEED_DIR, 'units.json'), 'utf8'));
  const byId = new Map();
  for (const ingredient of items.concat(EXTRA, EXTRA2)) if (!byId.has(ingredient.id)) byId.set(ingredient.id, ingredient);
  const aliasMap = new Map();
  for (const ingredient of byId.values()) {
    aliasMap.set(ingredient.id, ingredient.id);
    aliasMap.set(norm(ingredient.name), ingredient.id);
  }
  for (const ingredient of byId.values()) for (const a of ingredient.aliases || []) if (!aliasMap.has(norm(a))) aliasMap.set(norm(a), ingredient.id);
  return { items: Array.from(byId.values()), units, byId, aliasMap };
}
const catalog = load();

// Đưa một chuỗi (id, tên, "nhom:id") về id nguyên liệu chuẩn.
function canonId(token) {
  let cleaned = String(token || '').trim();
  if (cleaned.indexOf(':') > 0) cleaned = cleaned.slice(cleaned.indexOf(':') + 1);
  const normalized = norm(cleaned);
  if (!normalized) return '';
  const slug = normalized.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (catalog.byId.has(slug)) return slug;
  if (SYNONYMS[slug]) return SYNONYMS[slug];
  if (catalog.aliasMap.has(normalized)) return catalog.aliasMap.get(normalized);
  return slug;
}
function nameOf(ingredientId) {
  const ingredient = catalog.byId.get(ingredientId);
  return ingredient ? ingredient.name : ingredientId;
}
// Tìm nguyên liệu theo tên (cho so sánh giá): khớp chính xác rồi khớp chứa.
function findByName(text, exact) {
  const normalized = norm(text);
  if (!normalized) return null;
  const direct = catalog.aliasMap.get(normalized) || catalog.aliasMap.get(normalized.replace(/ /g, '-'));
  if (direct) return catalog.byId.get(direct);
  if (exact) return null;
  for (const ingredient of catalog.byId.values()) {
    if (norm(ingredient.name).includes(normalized) || normalized.includes(norm(ingredient.name))) return ingredient;
    for (const a of ingredient.aliases || []) { const aliasNorm = norm(a); if (aliasNorm.length > 2 && (aliasNorm === normalized || normalized.includes(aliasNorm))) return ingredient; }
  }
  return null;
}
module.exports = { catalog, canonId, nameOf, findByName, slugify, SEED_DIR };

});

/* ===== routes/recipes ===== */
def("routes/recipes", function (module, exports, require, __dirname) {
'use strict';
const crypto = require('crypto');
const fileSystem = require('fs');
const path = require('path');
const { HttpError } = require('../lib/http');
const validateLib = require('../lib/validate');
const modelLib = require('../lib/model');
const { norm, slugify } = require('../lib/text');
const { findByName, catalog } = require('../lib/catalog');

const SORTS = new Set(['rating', 'time', 'price', 'new']);
// Tên 7 nhóm bộ lọc của trang Danh mục; mỗi nhóm là một tham số trên URL, giá trị là các nhãn cách nhau bằng dấu phẩy.
const TAG_GROUPS = ['dam', 'tinh-bot', 'rau-cu', 'trai-cay', 'che-do-an', 'vung-mien', 'ngan-sach'];
const IMG_RE = /^(\/images\/[\w\-./%]{1,300}|https?:\/\/[^\s"'<>]{1,500}|data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+\/=]+)$/;
const FORBIDDEN_KEYS = new Set(['id', 'authorId', 'author', 'rating', 'ratingCount', 'ratingScore', 'reviewCount', 'seedRating', 'seedCount', 'main', 'legacyId', 'createdAt', 'saved', '__proto__', 'constructor', 'prototype']);

// Khớp nguyên từ/cụm từ: hai bên là đầu/cuối chuỗi hoặc ký tự không phải chữ/số
function hasWord(text, word) {
  return !!word && new RegExp('(^|[^\\p{L}\\p{N}])' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^\\p{L}\\p{N}])', 'u').test(text);
}

function cleanStr(value, max, field, required) {
  const text = typeof value === 'string' ? value.trim() : (typeof value === 'number' ? String(value) : '');
  if (!text) { if (required) throw new HttpError(400, 'Thiếu thông tin bắt buộc', field); return ''; }
  if (text.length > max) throw new HttpError(400, 'Nội dung quá dài (tối đa ' + max + ' ký tự)', field);
  return text;
}
function checkImage(value, field) {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value !== 'string' || !IMG_RE.test(value) || value.includes('..')) throw new HttpError(400, 'Đường dẫn ảnh không hợp lệ', field);
  return value;
}
function numField(value, field, def, min, max) {
  if (value === undefined || value === null || value === '') return def;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) throw new HttpError(400, 'Giá trị "' + field + '" không hợp lệ', field);
  return parsed;
}

const NUTRI_KEYS = ['servings', 'calories', 'carbs', 'protein', 'fat', 'sodium', 'fiber'];
function cleanNutrition(nutrition) {
  const out = { servings: 1 };
  if (nutrition && typeof nutrition === 'object' && !Array.isArray(nutrition)) for (const k of NUTRI_KEYS) {
    const value = nutrition[k];
    if (typeof value === 'number' && Number.isFinite(value)) out[k] = value;
    else if (typeof value === 'string' && value.trim() && value.length <= 40) out[k] = value.trim();
  }
  return out;
}

function buildRecipe(b, userId, database) {
  const name = cleanStr(b.name || b.title, 120, 'name', true);
  if (name.length < 3) throw new HttpError(400, 'Tên món cần ít nhất 3 ký tự', 'name');
  const description = cleanStr(b.description, 5000, 'description');
  const image = checkImage(b.image, 'image') || '/images/recipes/bo-kho/placeholder.svg';
  const time = numField(b.time, 'time', 30, 1, 1440);
  const servings = numField(b.servings !== undefined ? b.servings : b.baseServings, 'servings', 2, 1, 100);
  let category = (typeof b.category === 'string' ? b.category.trim() : '').slice(0, 60) || 'Món khác';
  { // slug/id danh mục -> tên danh mục đã có
    const normCategory = norm(category), slugCategory = slugify(category);
    const hit = database.recipes.find((recipe) => norm(recipe.category) === normCategory || slugify(recipe.category) === slugCategory);
    if (hit) category = hit.category;
  }
  if (!Array.isArray(b.ingredients) || !b.ingredients.length) throw new HttpError(400, 'Cần ít nhất một nguyên liệu', 'ingredients');
  if (b.ingredients.length > 100) throw new HttpError(400, 'Quá nhiều nguyên liệu', 'ingredients');
  const ingredients = b.ingredients.map((x) => {
    if (!x || typeof x !== 'object') throw new HttpError(400, 'Nguyên liệu không hợp lệ', 'ingredients');
    const ingName = cleanStr(x.name, 80, 'ingredients', true);
    const qty = x.quantity !== undefined ? x.quantity : x.qty;
    const quantity = qty === undefined || qty === '' || qty === null ? '' : (Number.isFinite(Number(qty)) ? Number(qty) : cleanStr(qty, 20, 'ingredients'));
    const known = findByName(ingName, true);
    const cid = typeof x.ingredientId === 'string' && catalog.byId.has(x.ingredientId) ? x.ingredientId : null;
    const out = { ingredientId: cid || (known ? known.id : (slugify(ingName) || 'nguyen-lieu')), name: ingName, qty: quantity, unit: cleanStr(x.unit, 20, 'ingredients') };
    const note = cleanStr(x.note, 120, 'ingredients'); if (note) out.note = note;
    return out;
  });
  if (!Array.isArray(b.steps) || !b.steps.length) throw new HttpError(400, 'Cần ít nhất một bước thực hiện', 'steps');
  if (b.steps.length > 60) throw new HttpError(400, 'Quá nhiều bước', 'steps');
  const steps = b.steps.map((step) => {
    const stepData = typeof step === 'string' ? { text: step } : step;
    if (!stepData || typeof stepData !== 'object') throw new HttpError(400, 'Bước thực hiện không hợp lệ', 'steps');
    const raw = Array.isArray(stepData.text) ? stepData.text.join('\n') : stepData.text;
    const text = cleanStr(raw, 3000, 'steps', true);
    const imgs = [];
    if (stepData.image) imgs.push(checkImage(stepData.image, 'steps'));
    if (Array.isArray(stepData.images)) for (const stepImage of stepData.images.slice(0, 6)) imgs.push(checkImage(stepImage, 'steps'));
    return { text: text.split(/\n+/).map((line) => line.trim()).filter(Boolean), images: Array.from(new Set(imgs.filter(Boolean))) };
  });
  const gallery = [image];
  for (const arr of [b.gallery, b.images]) if (Array.isArray(arr)) for (const galleryImage of arr.slice(0, 8)) { const x = checkImage(galleryImage, 'gallery'); if (x && !gallery.includes(x)) gallery.push(x); }
  const price = numField(b.price, 'price', numField(b.costTotal, 'costTotal', 0, 0, 1e9) / servings, 0, 1e8);
  const rec = {}; // chỉ nhận các trường trong danh sách cho phép (không giữ trường lạ)
  let recipeId = slugify(name) || 'cong-thuc';
  const taken = new Set(database.recipes.map((recipe) => recipe.id));
  recipeId = recipeId.slice(0, 60) + '-' + crypto.randomBytes(3).toString('hex');
  while (taken.has(recipeId)) recipeId = recipeId.slice(0, 60) + '-' + crypto.randomBytes(3).toString('hex');
  const prep = Math.max(1, Math.round(time * 0.3));
  const now = new Date();
  const prepIn = b.prepTime !== undefined && b.prepTime !== null && b.prepTime !== '' ? numField(b.prepTime, 'prepTime', 0, 0, 1440) : null;
  const cookIn = b.cookTime !== undefined && b.cookTime !== null && b.cookTime !== '' ? numField(b.cookTime, 'cookTime', 0, 0, 1440) : null;
  const quickIn = Array.isArray(b.quickSteps) && b.quickSteps.length ? b.quickSteps.slice(0, 60).map((quickStep) => cleanStr(quickStep, 1000, 'quickSteps')).filter(Boolean) : null;
  const tags = Array.isArray(b.tags) ? b.tags.filter((tag) => typeof tag === 'string').slice(0, 10).map((tag) => tag.slice(0, 40)) : [category];
  return Object.assign(rec, {
    id: recipeId, name, title: name, category, categoryGroup: 'Công thức cộng đồng', subcategory: '',
    description, summary: ((typeof b.summary === 'string' ? b.summary.trim() : '') || description).slice(0, 500), image, gallery, price: Math.round(price), time,
    prepTime: prepIn !== null ? prepIn : Math.min(prep, time), cookTime: cookIn !== null ? cookIn : Math.max(0, time - prep), baseServings: servings, costTotal: Math.round(price * servings),
    ingredients, quickSteps: quickIn && quickIn.length ? quickIn : steps.map((step) => step.text.join(' ')), steps,
    nutrition: cleanNutrition(b.nutrition),
    similar: [], tags, uploaded: String(now.getDate()).padStart(2, '0') + '/' + String(now.getMonth() + 1).padStart(2, '0') + '/' + now.getFullYear(),
    authorId: userId, createdAt: now.toISOString(), seedRating: 0, seedCount: 0, main: ingredients.map((i) => i.ingredientId).slice(0, 6)
  });
}

const MAGIC = {
  png: (b) => b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  jpeg: (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  webp: (b) => b.length > 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP'
};

module.exports = function (app) {
  const appRouter = app.router;
  function writeLimit(ctx) {
    const wait = app.writeLimiter.hit(ctx.user ? 'u:' + ctx.user.id : 'ip:' + ctx.ip);
    if (wait) { const e = new HttpError(429, 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ' + wait + ' giây.'); e.headers = { 'Retry-After': String(wait) }; throw e; }
  }
  app.writeLimit = writeLimit;

  appRouter.get('/api/recipes', (ctx) => {
    const query = ctx.query;
    const context = modelLib.makeCtx(ctx.db, ctx.user);
    const maxTime = validateLib.numParam(query, 'maxTime');
    const maxPrice = validateLib.numParam(query, 'maxPrice');
    const sort = query.sort === undefined || query.sort === '' ? null : query.sort;
    if (sort && !SORTS.has(sort)) throw new HttpError(400, 'Giá trị sort không hợp lệ (rating|time|price|new)', 'sort');
    // Mỗi từ khóa giữ hai bản: có dấu (a) và bỏ dấu (p). Từ gõ có dấu chỉ khớp bản có dấu ("bò" không khớp "bơ", "bông"),
    // từ gõ không dấu khớp không phân biệt dấu như cũ.
    const fullA = modelLib.lowerVi(query.q || '');
    const terms = fullA.split(' ').map((a) => ({ a, p: norm(a) })).filter((term) => term.p).slice(0, 8);
    terms.forEach((term) => { term.accent = term.a !== term.p; });
    const fullP = terms.map((term) => term.p).join(' ');
    const cat = query.category ? norm(query.category) : '';
    // Bộ lọc theo nhóm (Đạm, Tinh bột, ...): trong một nhóm chỉ cần khớp MỘT nhãn, giữa các nhóm phải khớp TẤT CẢ.
    const groups = TAG_GROUPS
      .map((group) => String(query[group] || '').split(',').map((token) => norm(token)).filter(Boolean).slice(0, 12))
      .filter((group) => group.length);
    const list = ctx.db.recipes.filter((rec) => {
      if (cat && norm(rec.category) !== cat && slugify(rec.category) !== cat) return false;
      if (groups.length) {
        const have = new Set((rec.tags || []).map((tag) => norm(tag)));
        for (const group of groups) if (!group.some((tag) => have.has(tag))) return false;
      }
      if (maxTime !== null && rec.time > maxTime) return false;
      if (maxPrice !== null && rec.price > maxPrice) return false;
      if (terms.length) {
        const texts = modelLib.searchTexts(rec);
        for (const term of terms) if (term.accent ? !texts.accent.includes(term.a) : !texts.plain.includes(term.p)) return false;
      }
      return true;
    });
    const rate = new Map(list.map((rec) => [rec.id, modelLib.ratingOf(context, rec)]));
    // Độ liên quan (số nhỏ = liên quan hơn): khớp đúng cụm có dấu > khớp nguyên từ không dấu > chỉ chứa chuỗi; tên món xếp trước phần còn lại
    const rel = new Map();
    if (terms.length) {
      const tier = (a, plain) => {
        if (hasWord(a, fullA)) return 0;
        if (hasWord(plain, fullP)) return 1;
        if (terms.every((term) => hasWord(plain, term.p))) return 2;
        return terms.every((term) => plain.includes(term.p)) ? 3 : 9;
      };
      for (const rec of list) {
        const texts = modelLib.searchTexts(rec);
        const nameTier = tier(modelLib.lowerVi(rec.name), norm(rec.name)), textTier = tier(texts.accent, texts.plain);
        rel.set(rec.id, nameTier < 3 ? nameTier : textTier < 3 ? 3 + textTier : nameTier === 3 ? 6 : 7);
      }
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
    const page = validateLib.paginate(list, query);
    return { items: page.slice.map((rec) => Object.assign(modelLib.cardOf(context, rec), { tags: rec.tags || [] })), total: page.total, page: page.page, pages: page.pages };
  });

  appRouter.get('/api/categories', (ctx) => ({ items: modelLib.categoriesOf(ctx.db) }));

  appRouter.get('/api/recipes/:id', (ctx) => {
    const context = modelLib.makeCtx(ctx.db, ctx.user);
    const rec = context.recipes.get(ctx.params.id);
    if (!rec) throw new HttpError(404, 'Không tìm thấy công thức');
    // ?history=0: chỉ đọc dữ liệu (ví dụ form sửa ở trang tài khoản), không ghi vào Lịch sử xem
    if (ctx.user && ctx.query.history !== '0') {
      const history = ctx.db.history;
      const uid = ctx.user.id;
      for (let i = history.length - 1; i >= 0; i--) if (history[i].userId === uid && history[i].recipeId === rec.id) history.splice(i, 1);
      history.push({ userId: uid, recipeId: rec.id, at: new Date().toISOString() });
      const mine = history.filter((x) => x.userId === uid);
      if (mine.length > 200) { const drop = new Set(mine.slice(0, mine.length - 200)); ctx.db.history = history.filter((x) => !drop.has(x)); }
      try { ctx.store.saveSoon(); } catch (e) { /* lịch sử xem không quan trọng: bộ nhớ đầy thì vẫn cho xem công thức */ }
    }
    return modelLib.detailOf(context, rec);
  });

  appRouter.post('/api/recipes', async (ctx) => {
    const user = ctx.requireUser();
    writeLimit(ctx);
    const b = await ctx.body(1024 * 1024);
    const rec = buildRecipe(b, user.id, ctx.db);
    ctx.db.recipes.push(rec);
    ctx.store.save();
    ctx.status = 201;
    return { id: rec.id };
  });

  // Cập nhật nhanh các thông tin chính của công thức do chính mình đăng
  appRouter.patch('/api/recipes/:id', async (ctx) => {
    const user = ctx.requireUser();
    const rec = ctx.db.recipes.find((x) => x.id === ctx.params.id);
    if (!rec) throw new HttpError(404, 'Không tìm thấy công thức');
    if (rec.authorId !== user.id) throw new HttpError(403, 'Bạn chỉ có thể sửa công thức do chính mình đăng');
    const b = await ctx.body(64 * 1024);
    // Kiểm tra hết rồi mới ghi: dữ liệu sai thì không sửa gì cả
    const upd = {};
    if (b.name !== undefined) {
      const name = cleanStr(b.name, 120, 'name', true);
      if (name.length < 3) throw new HttpError(400, 'Tên món cần ít nhất 3 ký tự', 'name');
      upd.name = name; if (rec.title !== undefined) upd.title = name;
    }
    if (b.description !== undefined) { upd.description = cleanStr(b.description, 5000, 'description'); if (rec.summary !== undefined) upd.summary = upd.description; }
    if (b.time !== undefined) {
      const minutes = Math.round(numField(b.time, 'time', rec.time || 30, 1, 1440));
      const old = rec.time || 0, oldPrep = Number(rec.prepTime) || 0, oldCook = Number(rec.cookTime) || 0;
      const autoPrep = (x) => Math.min(Math.max(1, Math.round(x * 0.3)), x);
      upd.time = minutes;
      if (!oldPrep && !oldCook || (oldPrep === autoPrep(old) && oldCook === Math.max(0, old - oldPrep))) {
        // thời gian sơ chế/nấu do hệ thống tự chia (30% / 70%): chia lại theo tổng mới
        upd.prepTime = autoPrep(minutes); upd.cookTime = Math.max(0, minutes - upd.prepTime);
      } else {
        // người dùng đã nhập riêng: giữ thời gian sơ chế, phần còn lại là thời gian nấu
        upd.prepTime = Math.min(oldPrep, minutes); upd.cookTime = minutes - upd.prepTime;
      }
    }
    if (b.servings !== undefined) {
      const servings = Math.round(numField(b.servings, 'servings', rec.baseServings || rec.servings || 2, 1, 100));
      upd.servings = servings; upd.baseServings = servings;
      // giá theo phần (price) giữ nguyên như trên thẻ món; tổng chi phí tính lại = price * khẩu phần (trang chi tiết tính như vậy)
      upd.costTotal = Math.round((Number(rec.price) || 0) * servings);
    }
    Object.assign(rec, upd);
    if (baseIds.has(rec.id)) { // công thức có sẵn trong db.json: nhớ phần đã sửa để còn nguyên sau khi tải lại
      database.seedEdits = database.seedEdits || {};
      database.seedEdits[rec.id] = Object.assign(database.seedEdits[rec.id] || {}, upd);
    }
    ctx.store.save();
    return { ok: true };
  });

  appRouter.delete('/api/recipes/:id', (ctx) => {
    const user = ctx.requireUser();
    const database = ctx.db;
    const i = database.recipes.findIndex((x) => x.id === ctx.params.id);
    if (i < 0) throw new HttpError(404, 'Không tìm thấy công thức');
    const rec = database.recipes[i];
    if (rec.authorId !== user.id) throw new HttpError(403, 'Bạn chỉ có thể xóa công thức do chính mình đăng');
    database.recipes.splice(i, 1);
    database.saved = database.saved.filter((x) => x.recipeId !== rec.id);
    database.reviews = database.reviews.filter((x) => x.recipeId !== rec.id);
    database.history = database.history.filter((x) => x.recipeId !== rec.id);
    ctx.store.save();
    return { ok: true };
  });

  appRouter.post('/api/uploads', async (ctx) => {
    const upUser = ctx.requireUser();
    writeLimit(ctx);
    const b = await ctx.body(4.5 * 1024 * 1024);
    const match = typeof b.dataUrl === 'string' && /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=\s]+)$/.exec(b.dataUrl);
    if (!match) throw new HttpError(400, 'Ảnh không hợp lệ (chỉ nhận PNG, JPEG hoặc WebP dạng data URL)', 'dataUrl');
    const buf = Buffer.from(match[2].replace(/\s+/g, ''), 'base64');
    if (!buf.length) throw new HttpError(400, 'Ảnh rỗng', 'dataUrl');
    if (buf.length > 3 * 1024 * 1024) throw new HttpError(413, 'Ảnh quá lớn (tối đa 3 MB)', 'dataUrl');
    if (!MAGIC[match[1]](buf)) throw new HttpError(400, 'Nội dung ảnh không khớp định dạng khai báo', 'dataUrl');
    const file = crypto.randomBytes(12).toString('hex');
    const url = await shrinkImage(b.dataUrl);
    return { url };
  });
};

});

/* ===== routes/auth ===== */
def("routes/auth", function (module, exports, require, __dirname) {
'use strict';
const crypto = require('crypto');
const { HttpError } = require('../lib/http');
const validateLib = require('../lib/validate');
const sessionLib = require('../lib/session');
const { hashPassword, verifyPassword, fakeVerify } = require('../lib/hash');
const { publicUser } = require('../lib/model');

function secure(req) { return req.headers['x-forwarded-proto'] === 'https'; }
function rateCheck(ctx, ident) {
  const key = ctx.ip + '|' + String(ident == null ? '' : ident).toLowerCase().slice(0, 120);
  const wait = Math.max(ctx.app.ipLimiter.hit(ctx.ip), ctx.app.limiter.hit(key));
  if (wait) { const e = new HttpError(429, 'Bạn thử quá nhiều lần. Vui lòng thử lại sau ' + wait + ' giây.'); e.headers = { 'Retry-After': String(wait) }; throw e; }
}
function lowerCase(text) { return String(text).toLowerCase(); }

// Xóa mọi dữ liệu gắn với một người dùng (dùng khi xóa tài khoản)
function purgeUser(database, uid) {
  database.sessions = database.sessions.filter((entry) => entry.userId !== uid);
  database.saved = database.saved.filter((entry) => entry.userId !== uid);
  database.history = database.history.filter((entry) => entry.userId !== uid);
  database.reviews = database.reviews.filter((review) => review.userId !== uid);
  for (const review of database.reviews) if (review.likedBy) review.likedBy = review.likedBy.filter((x) => x !== uid);
  for (const rec of database.recipes) if (rec.authorId === uid) rec.authorId = null;
  database.users = database.users.filter((account) => account.id !== uid);
}

module.exports = function (app) {
  const appRouter = app.router;

  appRouter.post('/api/auth/register', async (ctx) => {
    if (ctx.app.cfg.demoOnly) throw new HttpError(403, 'Bản demo trực tuyến tạm đóng đăng ký. Hãy đăng nhập bằng tài khoản demo (demo / demo123).');
    const b = await ctx.body();
    rateCheck(ctx, typeof b.username === 'string' ? b.username : '');
    const username = validateLib.checkUsername(b.username);
    const email = validateLib.checkEmail(b.email);
    const password = validateLib.checkPassword(b.password);
    const database = ctx.db;
    if (database.users.some((account) => lowerCase(account.username) === lowerCase(username))) throw new HttpError(409, 'Tên đăng nhập đã được sử dụng', 'username');
    if (database.users.some((account) => lowerCase(account.email) === email)) throw new HttpError(409, 'Email đã được sử dụng', 'email');
    const passwordHash = await hashPassword(password);
    // kiểm tra lại sau await (tránh đua)
    if (database.users.some((account) => lowerCase(account.username) === lowerCase(username))) throw new HttpError(409, 'Tên đăng nhập đã được sử dụng', 'username');
    if (database.users.some((account) => lowerCase(account.email) === email)) throw new HttpError(409, 'Email đã được sử dụng', 'email');
    const user = { id: 'u_' + crypto.randomBytes(6).toString('hex'), username, email, avatar: null, passwordHash, createdAt: new Date().toISOString() };
    database.users.push(user);
    const sid = sessionLib.createSession(database, user.id);
    ctx.store.save();
    ctx.setCookie(sessionLib.cookieHeader(sid, secure(ctx.req)));
    ctx.status = 201;
    return { user: publicUser(user) };
  });

  appRouter.post('/api/auth/login', async (ctx) => {
    const b = await ctx.body();
    rateCheck(ctx, typeof b.identifier === 'string' ? b.identifier : '');
    const ident = validateLib.str(b.identifier);
    const password = typeof b.password === 'string' ? b.password : '';
    if (!ident || !password) throw new HttpError(400, 'Vui lòng nhập tên đăng nhập/email và mật khẩu');
    if (ident.length > 120 || password.length > 200) throw new HttpError(401, 'Thông tin đăng nhập không đúng');
    const identLower = lowerCase(ident);
    const user = ctx.db.users.find((account) => lowerCase(account.username) === identLower || lowerCase(account.email) === identLower);
    if (!user) { await fakeVerify(password); throw new HttpError(401, 'Tên đăng nhập/email hoặc mật khẩu không đúng'); }
    if (!(await verifyPassword(password, user.passwordHash))) throw new HttpError(401, 'Tên đăng nhập/email hoặc mật khẩu không đúng');
    if (ctx.sid) sessionLib.destroySession(ctx.db, ctx.sid);
    sessionLib.purgeExpired(ctx.db);
    const sid = sessionLib.createSession(ctx.db, user.id);
    ctx.store.save();
    ctx.setCookie(sessionLib.cookieHeader(sid, secure(ctx.req)));
    return { user: publicUser(user) };
  });

  appRouter.post('/api/auth/logout', async (ctx) => {
    if (ctx.sid) { sessionLib.destroySession(ctx.db, ctx.sid); ctx.store.save(); }
    ctx.setCookie(sessionLib.clearCookieHeader());
    return { ok: true };
  });

  appRouter.get('/api/me', (ctx) => ({ user: publicUser(ctx.user) }));

  appRouter.patch('/api/me', async (ctx) => {
    const user = ctx.requireUser();
    const b = await ctx.body();
    // Đổi email / tên đăng nhập / mật khẩu cần nhập mật khẩu hiện tại; đổi ảnh đại diện hoặc ảnh bìa thì không
    if (b.username !== undefined || b.email !== undefined || b.newPassword !== undefined) {
      if (typeof b.currentPassword !== 'string' || !b.currentPassword) throw new HttpError(400, 'Vui lòng nhập mật khẩu hiện tại', 'currentPassword');
      if (!(await verifyPassword(b.currentPassword, user.passwordHash))) throw new HttpError(403, 'Mật khẩu hiện tại không đúng', 'currentPassword');
    }
    const upd = {};
    if (b.username !== undefined) {
      upd.username = validateLib.checkUsername(b.username);
      if (ctx.db.users.some((account) => account.id !== user.id && lowerCase(account.username) === lowerCase(upd.username))) throw new HttpError(409, 'Tên đăng nhập đã được sử dụng', 'username');
    }
    if (b.email !== undefined) {
      upd.email = validateLib.checkEmail(b.email);
      if (ctx.db.users.some((account) => account.id !== user.id && lowerCase(account.email) === upd.email)) throw new HttpError(409, 'Email đã được sử dụng', 'email');
    }
    if (b.newPassword !== undefined) { validateLib.checkPassword(b.newPassword, 'newPassword'); upd.passwordHash = await hashPassword(b.newPassword); }
    if (b.avatar !== undefined) {
      if (b.avatar !== null && !(typeof b.avatar === 'string' && b.avatar.length <= 600000 && ((/^\/images\/[\w\-./]{1,200}$/.test(b.avatar) && !b.avatar.includes('..')) || /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+\/=]+$/.test(b.avatar)))) throw new HttpError(400, 'Ảnh đại diện không hợp lệ', 'avatar');
      upd.avatar = b.avatar;
    }
    if (b.cover !== undefined) {
      if (b.cover !== null && !(typeof b.cover === 'string' && b.cover.length <= 600000 && ((/^\/images\/[\w\-./]{1,200}$/.test(b.cover) && !b.cover.includes('..')) || /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+\/=]+$/.test(b.cover)))) throw new HttpError(400, 'Ảnh bìa không hợp lệ', 'cover');
      upd.cover = b.cover;
    }
    Object.assign(user, upd);
    if (upd.passwordHash) sessionLib.revokeOthers(ctx.db, user.id, ctx.sid);
    ctx.store.save();
    return { user: publicUser(user) };
  });

  appRouter.delete('/api/me', async (ctx) => {
    const user = ctx.requireUser();
    const b = await ctx.body();
    if (typeof b.password !== 'string' || !b.password) throw new HttpError(400, 'Vui lòng nhập mật khẩu để xác nhận', 'password');
    if (!(await verifyPassword(b.password, user.passwordHash))) throw new HttpError(403, 'Mật khẩu không đúng', 'password');
    purgeUser(ctx.db, user.id);
    ctx.store.save();
    ctx.setCookie(sessionLib.clearCookieHeader());
    return { ok: true };
  });
};

});

/* ===== routes/me ===== */
def("routes/me", function (module, exports, require, __dirname) {
'use strict';
const { HttpError } = require('../lib/http');
const validateLib = require('../lib/validate');
const modelLib = require('../lib/model');

module.exports = function (app) {
  const appRouter = app.router;

  function savedList(context) {
    return context.db.saved.filter((entry) => entry.userId === context.user.id).sort((a, b) => (a.at < b.at ? 1 : -1))
      .map((entry) => context.recipes.get(entry.recipeId)).filter(Boolean);
  }
  function uploadedList(context) {
    return context.db.recipes.filter((x) => x.authorId === context.user.id).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }
  function historyList(context) {
    return context.db.history.filter((entry) => entry.userId === context.user.id).sort((a, b) => (a.at < b.at ? 1 : -1))
      .map((entry) => ({ rec: context.recipes.get(entry.recipeId), at: entry.at })).filter((x) => x.rec);
  }
  function reviewList(context) {
    return context.db.reviews.filter((x) => x.userId === context.user.id).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }
  function ctxOf(ctx) { ctx.requireUser(); return modelLib.makeCtx(ctx.db, ctx.user); }

  appRouter.get('/api/me/saved', (ctx) => {
    const context = ctxOf(ctx);
    const page = validateLib.paginate(savedList(context), ctx.query);
    return { items: page.slice.map((x) => modelLib.cardOf(context, x)), total: page.total, page: page.page, pages: page.pages };
  });
  appRouter.get('/api/me/uploaded', (ctx) => {
    const context = ctxOf(ctx);
    const page = validateLib.paginate(uploadedList(context), ctx.query);
    return { items: page.slice.map((x) => modelLib.cardOf(context, x)), total: page.total, page: page.page, pages: page.pages };
  });
  appRouter.get('/api/me/history', (ctx) => {
    const context = ctxOf(ctx);
    const page = validateLib.paginate(historyList(context), ctx.query);
    return { items: page.slice.map((x) => Object.assign(modelLib.cardOf(context, x.rec), { viewedAt: x.at })), total: page.total, page: page.page, pages: page.pages };
  });
  appRouter.delete('/api/me/history', (ctx) => {
    const user = ctx.requireUser();
    ctx.db.history = ctx.db.history.filter((entry) => entry.userId !== user.id);
    ctx.store.save();
    return { ok: true };
  });
  appRouter.get('/api/me/reviews', (ctx) => {
    const context = ctxOf(ctx);
    return { items: reviewList(context).map((x) => modelLib.reviewOf(context, x)) };
  });
  appRouter.get('/api/me/overview', (ctx) => {
    const context = ctxOf(ctx);
    const saved = savedList(context), uploaded = uploadedList(context), hist = historyList(context), reviews = reviewList(context);
    return {
      counts: { saved: saved.length, uploaded: uploaded.length, reviews: reviews.length, history: hist.length },
      recentSaved: saved.slice(0, 4).map((x) => modelLib.cardOf(context, x)),
      recentUploaded: uploaded.slice(0, 4).map((x) => modelLib.cardOf(context, x)),
      recentReviews: reviews.slice(0, 2).map((x) => modelLib.reviewOf(context, x))
    };
  });

  function setSaved(ctx, shouldSave) {
    const user = ctx.requireUser();
    const context = modelLib.makeCtx(ctx.db, user);
    const rec = context.recipes.get(ctx.params.id);
    if (!rec) throw new HttpError(404, 'Không tìm thấy công thức');
    const database = ctx.db;
    const has = database.saved.some((entry) => entry.userId === user.id && entry.recipeId === rec.id);
    if (shouldSave && !has) database.saved.push({ userId: user.id, recipeId: rec.id, at: new Date().toISOString() });
    if (!shouldSave && has) database.saved = database.saved.filter((entry) => !(entry.userId === user.id && entry.recipeId === rec.id));
    if (shouldSave !== has) ctx.store.save();
    return { saved: shouldSave };
  }
  appRouter.put('/api/recipes/:id/save', (ctx) => setSaved(ctx, true));
  appRouter.delete('/api/recipes/:id/save', (ctx) => setSaved(ctx, false));
};

});

/* ===== routes/reviews ===== */
def("routes/reviews", function (module, exports, require, __dirname) {
'use strict';
const crypto = require('crypto');
const { HttpError } = require('../lib/http');
const modelLib = require('../lib/model');

module.exports = function (app) {
  const appRouter = app.router;

  appRouter.get('/api/recipes/:id/reviews', (ctx) => {
    const context = modelLib.makeCtx(ctx.db, ctx.user);
    const rec = context.recipes.get(ctx.params.id);
    if (!rec) throw new HttpError(404, 'Không tìm thấy công thức');
    const list = ctx.db.reviews.filter((x) => x.recipeId === rec.id).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    // average/count: điểm gộp (điểm mẫu + review mới), khớp với thẻ món và trang chi tiết
    const rating = modelLib.ratingOf(context, rec);
    return { items: list.map((x) => modelLib.reviewOf(context, x)), average: rating.rating, count: rating.ratingCount };
  });

  appRouter.post('/api/recipes/:id/reviews', async (ctx) => {
    const user = ctx.requireUser();
    app.writeLimit(ctx);
    const b = await ctx.body();
    const context = modelLib.makeCtx(ctx.db, user);
    const rec = context.recipes.get(ctx.params.id);
    if (!rec) throw new HttpError(404, 'Không tìm thấy công thức');
    const rating = Number(b.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new HttpError(400, 'Số sao phải từ 1 đến 5', 'rating');
    const text = typeof b.text === 'string' ? b.text.trim() : '';
    if (b.text !== undefined && typeof b.text !== 'string') throw new HttpError(400, 'Nội dung đánh giá không hợp lệ', 'text');
    if (text.length > 2000) throw new HttpError(400, 'Nội dung đánh giá quá dài (tối đa 2000 ký tự)', 'text');
    let review = ctx.db.reviews.find((x) => x.recipeId === rec.id && x.userId === user.id);
    const created = !review;
    if (review) { review.rating = rating; review.text = text; review.updatedAt = new Date().toISOString(); }
    else {
      review = { id: 'rv_' + crypto.randomBytes(6).toString('hex'), recipeId: rec.id, userId: user.id, rating, text, createdAt: new Date().toISOString(), likedBy: [] };
      ctx.db.reviews.push(review);
    }
    ctx.store.save();
    ctx.status = created ? 201 : 200;
    return { review: modelLib.reviewOf(context, review) };
  });

  appRouter.post('/api/reviews/:id/like', (ctx) => {
    const user = ctx.requireUser();
    app.writeLimit(ctx);
    const review = ctx.db.reviews.find((x) => x.id === ctx.params.id);
    if (!review) throw new HttpError(404, 'Không tìm thấy đánh giá');
    review.likedBy = review.likedBy || [];
    const i = review.likedBy.indexOf(user.id);
    if (i >= 0) review.likedBy.splice(i, 1); else review.likedBy.push(user.id);
    ctx.store.save();
    return { liked: i < 0, likes: review.likedBy.length };
  });

  appRouter.delete('/api/reviews/:id', (ctx) => {
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
const modelLib = require('../lib/model');
const validateLib = require('../lib/validate');
const { catalog, canonId, nameOf, findByName } = require('../lib/catalog');
const { norm, hash32 } = require('../lib/text');

// url: trang chủ của cửa hàng, dùng cho nút "MUA NGAY" (dữ liệu giá là số tham khảo, chưa lấy trực tiếp từ cửa hàng)
const STORES = [
  { store: 'BÁCH HÓA XANH', k: 0.97, url: 'https://www.bachhoaxanh.com/' }, { store: 'COOP FOOD', k: 1.06, url: 'https://cooponline.vn/' },
  { store: 'WINMART', k: 1.0, url: 'https://winmart.vn/' }, { store: 'SUNMART', k: 1.12, url: 'https://sunmart.vn/' },
  { store: 'GS25', k: 1.22, url: 'https://gs25.com.vn/' }, { store: 'CIRCLE K', k: 1.28, url: 'https://www.circlek.com.vn/' }
];
// Quy cách đóng gói gợi ý theo nhóm nguyên liệu, để mỗi cửa hàng có tên sản phẩm riêng (số mô phỏng, chỉ cần hợp lý)
const HERBS = new Set(['hanh-la', 'rau-thom', 'rau-ram', 'thi-la', 'la-e', 'la-lot', 'la-chanh', 'la-dua', 'rau-song', 'tieu-xanh']);
const EGGS = new Set(['trung-vit', 'trung-cut', 'trung-muoi']);
const SPICES = new Set(['muoi', 'tieu', 'bot-ngot', 'hat-nem', 'ngu-vi-huong', 'bot-ca-ri', 'duong-cat', 'duong-den', 'sa-te', 'me-rang', 'bot-chien-gion', 'bot-gao', 'rau-cau', 'mam-tom', 'toi-bam']);
const COUNT_PACKS = { // theo đơn vị đếm mặc định của nguyên liệu
  'củ': ['túi 500g', 'túi 1kg', 'khay 300g'], 'quả': ['1 quả', 'khay 3 quả', 'túi 1kg'], 'trái': ['1 trái', 'khay 3 trái', 'túi 1kg'],
  'bó': ['1 bó', 'bó 300g', 'gói 500g'], 'nhánh': ['bó 5 cây', 'gói 100g', 'gói 200g'], 'ổ': ['1 ổ', 'túi 3 ổ', 'túi 5 ổ'], 'món': ['hũ 300g', 'hũ 500g']
};
function packsOf(ingredient) {
  if (EGGS.has(ingredient.id)) return ['vỉ 4 quả', 'vỉ 6 quả', 'vỉ 10 quả'];
  if (HERBS.has(ingredient.id)) return ['bó 100g', 'gói 50g', 'bó 200g'];
  if (ingredient.dimension === 'count') return COUNT_PACKS[ingredient.defaultUnit] || ['1 ' + (ingredient.defaultUnit || 'cái')];
  if (ingredient.dimension === 'volume') return ['chai 250ml', 'chai 500ml', 'chai 1 lít'];
  if (SPICES.has(ingredient.id)) return ['gói 100g', 'gói 200g', 'hũ 500g'];
  return ['khay 300g', 'gói 500g', 'túi 1kg'];
}
// Tên sản phẩm cụ thể đã biết (khớp với giá tham khảo bên dưới)
const KNOWN = { 'thit-heo': { 'BÁCH HÓA XANH': 'Thịt heo xay C.P 200g', 'COOP FOOD': 'Thịt heo xay kg-AHT990' } };
// Giá tham khảo (VND) theo đơn vị so sánh: 100g / 100ml / 1 đơn vị đếm (củ, quả, bó, nhánh...)
const BASE = {
  'thit-heo': 11069, 'thit-bo': 29000, 'thit-ga': 9500, 'tom-tuoi': 19000, 'ca-phi-le': 14000, 'trung-vit': 4500, 'gao-tam': 1800,
  'hanh-tim': 3000, 'hanh-la': 5000, 'toi-bam': 3500, 'ca-chua': 4000, 'ca-rot': 3500, 'khoai-tay': 2800, 'dau-hu': 3500,
  'nuoc-mam': 2500, 'nuoc-tuong': 2200, 'dau-an': 2400, 'duong-cat': 2200, 'muoi': 800, 'bun-tuoi': 2000, 'banh-mi': 3500, 'nam-huong': 12000
};
const UNIT_LABEL = { mass: '100g', volume: '100ml' }; // đơn vị đếm lấy theo defaultUnit của nguyên liệu

// Ảnh minh họa nguyên liệu (lấy từ Wikipedia/Wikimedia Commons, ghi công ở images/ingredients/CREDITS.md).
// Nguyên liệu nào chưa có ảnh thì trang So sánh giá hiện ô "Chưa có ảnh".
const INGREDIENT_IMAGES = {
  "ba-chi": "/images/ingredients/ba-chi.jpg",
  "banh-mi": "/images/ingredients/banh-mi.png",
  "banh-pho": "/images/ingredients/banh-pho.jpg",
  "banh-quy": "/images/ingredients/banh-quy.jpg",
  "banh-trang": "/images/ingredients/banh-trang.jpg",
  "bap-cai": "/images/ingredients/bap-cai.jpg",
  "bau": "/images/ingredients/bau.jpg",
  "bi-do": "/images/ingredients/bi-do.jpg",
  "bo-lat": "/images/ingredients/bo-lat.jpg",
  "bo-trai": "/images/ingredients/bo-trai.jpg",
  "bong-cai": "/images/ingredients/bong-cai.jpg",
  "bong-thien-ly": "/images/ingredients/bong-thien-ly.jpg",
  "bot-ca-ri": "/images/ingredients/bot-ca-ri.jpg",
  "bot-chien-gion": "/images/ingredients/bot-chien-gion.jpg",
  "bot-gao": "/images/ingredients/bot-gao.jpg",
  "bot-ngot": "/images/ingredients/bot-ngot.jpg",
  "bun-gao": "/images/ingredients/bun-gao.jpg",
  "bun-tuoi": "/images/ingredients/bun-tuoi.jpg",
  "buoi": "/images/ingredients/buoi.jpg",
  "ca-chua": "/images/ingredients/ca-chua.jpg",
  "ca-dieu-hong": "/images/ingredients/ca-dieu-hong.jpg",
  "ca-hoi": "/images/ingredients/ca-hoi.jpg",
  "ca-loc": "/images/ingredients/ca-loc.jpg",
  "ca-phi-le": "/images/ingredients/ca-phi-le.jpg",
  "ca-rot": "/images/ingredients/ca-rot.jpg",
  "ca-tim": "/images/ingredients/ca-tim.jpg",
  "cai-thia": "/images/ingredients/cai-thia.jpg",
  "can-tay": "/images/ingredients/can-tay.jpg",
  "cha-ca": "/images/ingredients/cha-ca.jpg",
  "cha-lua": "/images/ingredients/cha-lua.jpg",
  "chanh": "/images/ingredients/chanh.jpg",
  "chanh-day": "/images/ingredients/chanh-day.jpg",
  "chuoi": "/images/ingredients/chuoi.jpg",
  "cu-cai": "/images/ingredients/cu-cai.png",
  "cu-sen": "/images/ingredients/cu-sen.jpg",
  "cua": "/images/ingredients/cua.jpg",
  "dau-an": "/images/ingredients/dau-an.jpg",
  "dau-hao": "/images/ingredients/dau-hao.jpg",
  "dau-hu": "/images/ingredients/dau-hu.jpg",
  "dau-hu-ky": "/images/ingredients/dau-hu-ky.jpg",
  "dau-o-liu": "/images/ingredients/dau-o-liu.jpg",
  "dau-phong": "/images/ingredients/dau-phong.jpg",
  "dau-phu-chien": "/images/ingredients/dau-phu-chien.jpg",
  "dau-phu-non": "/images/ingredients/dau-phu-non.jpg",
  "dau-xanh": "/images/ingredients/dau-xanh.jpg",
  "dua-cai": "/images/ingredients/dua-cai.jpg",
  "dua-chua": "/images/ingredients/dua-chua.jpg",
  "dua-leo": "/images/ingredients/dua-leo.jpg",
  "duong-cat": "/images/ingredients/duong-cat.jpg",
  "duong-den": "/images/ingredients/duong-den.jpg",
  "gao-lut": "/images/ingredients/gao-lut.jpg",
  "gao-nep": "/images/ingredients/gao-nep.jpg",
  "gao-tam": "/images/ingredients/gao-tam.jpg",
  "gia-do": "/images/ingredients/gia-do.jpg",
  "giam": "/images/ingredients/giam.jpg",
  "gio-heo": "/images/ingredients/gio-heo.jpg",
  "gung": "/images/ingredients/gung.jpg",
  "hanh-la": "/images/ingredients/hanh-la.jpg",
  "hanh-nhan": "/images/ingredients/hanh-nhan.jpg",
  "hanh-tay": "/images/ingredients/hanh-tay.jpg",
  "hanh-tim": "/images/ingredients/hanh-tim.jpg",
  "hat-chia": "/images/ingredients/hat-chia.jpg",
  "hat-dieu": "/images/ingredients/hat-dieu.jpg",
  "hat-nem": "/images/ingredients/hat-nem.jpg",
  "hat-sen": "/images/ingredients/hat-sen.jpg",
  "hoa-hoi": "/images/ingredients/hoa-hoi.jpg",
  "hu-tieu": "/images/ingredients/hu-tieu.jpg",
  "kem-tuoi": "/images/ingredients/kem-tuoi.jpg",
  "kho-qua": "/images/ingredients/kho-qua.jpg",
  "khoai-lang": "/images/ingredients/khoai-lang.jpg",
  "khoai-mon": "/images/ingredients/khoai-mon.jpg",
  "khoai-tay": "/images/ingredients/khoai-tay.jpg",
  "la-chanh": "/images/ingredients/la-chanh.jpg",
  "la-dua": "/images/ingredients/la-dua.jpg",
  "la-e": "/images/ingredients/la-e.jpg",
  "la-lot": "/images/ingredients/la-lot.jpg",
  "lap-xuong": "/images/ingredients/lap-xuong.jpg",
  "long-nhan": "/images/ingredients/long-nhan.jpg",
  "mam-tom": "/images/ingredients/mam-tom.jpg",
  "mang": "/images/ingredients/mang.jpg",
  "mat-ong": "/images/ingredients/mat-ong.jpg",
  "me": "/images/ingredients/me.jpg",
  "me-rang": "/images/ingredients/me-rang.jpg",
  "mi-quang": "/images/ingredients/mi-quang.jpg",
  "mi-y": "/images/ingredients/mi-y.jpg",
  "mien": "/images/ingredients/mien.jpg",
  "muc": "/images/ingredients/muc.jpg",
  "muoi": "/images/ingredients/muoi.jpg",
  "nam-bao-ngu": "/images/ingredients/nam-bao-ngu.jpg",
  "nam-dong-co": "/images/ingredients/nam-dong-co.jpg",
  "nam-huong": "/images/ingredients/nam-huong.jpg",
  "nam-kim-cham": "/images/ingredients/nam-kim-cham.jpg",
  "nam-meo": "/images/ingredients/nam-meo.jpg",
  "nam-rom": "/images/ingredients/nam-rom.jpg",
  "nam-tuyet": "/images/ingredients/nam-tuyet.jpg",
  "nghe": "/images/ingredients/nghe.jpg",
  "ngheu": "/images/ingredients/ngheu.jpg",
  "ngo-non": "/images/ingredients/ngo-non.jpg",
  "ngo-sen": "/images/ingredients/ngo-sen.jpg",
  "ngu-vi-huong": "/images/ingredients/ngu-vi-huong.jpg",
  "nuoc-cot-chanh": "/images/ingredients/nuoc-cot-chanh.jpg",
  "nuoc-cot-dua": "/images/ingredients/nuoc-cot-dua.jpg",
  "nuoc-dua": "/images/ingredients/nuoc-dua.jpg",
  "nuoc-dung": "/images/ingredients/nuoc-dung.jpg",
  "nuoc-mam": "/images/ingredients/nuoc-mam.jpg",
  "nuoc-tuong": "/images/ingredients/nuoc-tuong.jpg",
  "ot": "/images/ingredients/ot.jpg",
  "ot-chuong": "/images/ingredients/ot-chuong.jpg",
  "pa-te": "/images/ingredients/pa-te.jpg",
  "que": "/images/ingredients/que.jpg",
  "rau-cai": "/images/ingredients/rau-cai.jpg",
  "rau-cau": "/images/ingredients/rau-cau.jpg",
  "rau-cu": "/images/ingredients/rau-cu.jpg",
  "rau-muong": "/images/ingredients/rau-muong.jpg",
  "rau-ram": "/images/ingredients/rau-ram.jpg",
  "rau-song": "/images/ingredients/rau-song.jpg",
  "rau-thom": "/images/ingredients/rau-thom.jpg",
  "rieng": "/images/ingredients/rieng.jpg",
  "rong-bien": "/images/ingredients/rong-bien.jpg",
  "ruou-trang": "/images/ingredients/ruou-trang.jpg",
  "ruou-vang": "/images/ingredients/ruou-vang.jpg",
  "sa": "/images/ingredients/sa.jpg",
  "sa-te": "/images/ingredients/sa-te.jpg",
  "sot-teriyaki": "/images/ingredients/sot-teriyaki.jpg",
  "sua-chua": "/images/ingredients/sua-chua.jpg",
  "sua-dac": "/images/ingredients/sua-dac.jpg",
  "sua-tuoi": "/images/ingredients/sua-tuoi.jpg",
  "suon-heo": "/images/ingredients/suon-heo.jpg",
  "tao-do": "/images/ingredients/tao-do.jpg",
  "thao-qua": "/images/ingredients/thao-qua.jpg",
  "thi-la": "/images/ingredients/thi-la.jpg",
  "thit-bo": "/images/ingredients/thit-bo.jpg",
  "thit-ga": "/images/ingredients/thit-ga.jpg",
  "thit-heo": "/images/ingredients/thit-heo.jpg",
  "thit-nguoi": "/images/ingredients/thit-nguoi.jpg",
  "thom": "/images/ingredients/thom.jpg",
  "tieu": "/images/ingredients/tieu.jpg",
  "tieu-xanh": "/images/ingredients/tieu-xanh.jpg",
  "toi-bam": "/images/ingredients/toi-bam.jpg",
  "tom-kho": "/images/ingredients/tom-kho.jpg",
  "tom-tuoi": "/images/ingredients/tom-tuoi.jpg",
  "trai-cay": "/images/ingredients/trai-cay.jpg",
  "tran-chau": "/images/ingredients/tran-chau.jpg",
  "trung-cut": "/images/ingredients/trung-cut.jpg",
  "trung-muoi": "/images/ingredients/trung-muoi.jpg",
  "trung-vit": "/images/ingredients/trung-vit.jpg",
  "tuong-den": "/images/ingredients/tuong-den.jpg",
  "tuong-ot": "/images/ingredients/tuong-ot.jpg",
  "xa-lach": "/images/ingredients/xa-lach.jpg",
  "xa-xiu": "/images/ingredients/xa-xiu.jpg",
  "xiu-mai": "/images/ingredients/xiu-mai.jpg",
  "xoai": "/images/ingredients/xoai.jpg",
  "xoai-xanh": "/images/ingredients/xoai-xanh.jpg",
  "xuong-ong": "/images/ingredients/xuong-ong.jpg"
};

function compareOne(name) {
  const ingredient = findByName(name);
  if (!ingredient) return { name, id: null, unit: null, price: null, stores: [] };
  const unit = ingredient.dimension === 'count' ? (ingredient.defaultUnit || 'quả') : (UNIT_LABEL[ingredient.dimension] || '100g');
  const base = BASE[ingredient.id] || (2000 + (hash32(ingredient.id) % 20) * 500);
  const stores = STORES.map((storeInfo, i) => {
    const seed = hash32(ingredient.id + storeInfo.store);
    let price = Math.round((base * storeInfo.k * (0.95 + (seed % 11) / 100)) / 10) * 10;
    if (ingredient.id === 'thit-heo' && i === 0) price = 11069;
    if (ingredient.id === 'thit-heo' && i === 1) price = 12700;
    const disc = [0, 10, 15, 20][seed % 4];
    const pack = packsOf(ingredient);
    const product = (KNOWN[ingredient.id] && KNOWN[ingredient.id][storeInfo.store]) || (ingredient.name + ' ' + pack[seed % pack.length]);
    const offer = { store: storeInfo.store, product, price, unit, url: storeInfo.url };
    if (INGREDIENT_IMAGES[ingredient.id]) offer.image = INGREDIENT_IMAGES[ingredient.id];
    if (disc) { offer.oldPrice = Math.round(price / (1 - disc / 100) / 100) * 100; offer.discount = disc; }
    return offer;
  }).sort((a, b) => a.price - b.price);
  return { name: ingredient.name, id: ingredient.id, unit, price: stores[0].price, stores };
}

module.exports = function (app) {
  const appRouter = app.router;

  // Chỉ trả danh mục chuẩn (không lẫn tên/đơn vị do người dùng tự nhập)
  appRouter.get('/api/ingredients', () => ({ items: catalog.items, units: catalog.units }));

  appRouter.get('/api/ingredients/compare', (ctx) => {
    const names = String(ctx.query.names || '').split(',').map((name) => name.trim()).filter(Boolean);
    if (!names.length) throw new HttpError(400, 'Vui lòng nhập ít nhất một nguyên liệu (names=a,b,c)', 'names');
    if (names.length > 20) throw new HttpError(400, 'Tối đa 20 nguyên liệu mỗi lần so sánh', 'names');
    return { items: names.map(compareOne) };
  });

  appRouter.get('/api/fridge', (ctx) => {
    const raw = String(ctx.query.ingredients || '').split(',').map((part) => part.trim()).filter(Boolean).slice(0, 60);
    const limit = validateLib.intParam(ctx.query, 'limit', 20, 1, 100);
    const keyword = norm(ctx.query.q || '');
    const selFull = raw.map((token) => ({ group: token.includes(':') ? token.split(':')[0] : '', id: canonId(token) }));
    // Ô "Khác" của một nhóm (token "nhom:khac") chỉ dùng để khớp mục "<nhóm> khác" của công thức, không phải nguyên liệu
    const selGroups = new Set(selFull.filter((entry) => entry.group && entry.id === 'khac').map((entry) => entry.group));
    const selIds = new Set(selFull.filter((entry) => entry.id !== 'khac').map((entry) => entry.id));
    // Bộ lọc nhãn (Chế độ ăn, Vùng miền, Ngân sách): cùng cơ chế với trang Danh mục, trong nhóm khớp MỘT nhãn, giữa các nhóm khớp TẤT CẢ
    const tagGroups = ['che-do-an', 'vung-mien', 'ngan-sach']
      .map((group) => String(ctx.query[group] || '').split(',').map((token) => norm(token)).filter(Boolean).slice(0, 12))
      .filter((group) => group.length);
    const context = modelLib.makeCtx(ctx.db, ctx.user);
    const out = [];
    for (const rec of ctx.db.recipes) {
      if (keyword && !norm(rec.name).includes(keyword)) continue;
      if (tagGroups.length) {
        const have = new Set((rec.tags || []).map((tag) => norm(tag)));
        if (tagGroups.some((group) => !group.some((tag) => have.has(tag)))) continue;
      }
      const main = (rec.main && rec.main.length ? rec.main : (rec.ingredients || []).map((i) => i.ingredientId)).slice(0, 8);
      const matched = [], missing = [];
      for (const mainItem of main) {
        let label, hit;
        if (/:khac$/.test(mainItem)) { const group = mainItem.split(':')[0]; hit = selGroups.has(group); label = (group === 'dam' ? 'Đạm' : group === 'rau-cu' ? 'Rau củ' : group) + ' khác'; }
        else { hit = selIds.has(mainItem); label = nameOf(mainItem); }
        (hit ? matched : missing).push(label);
      }
      const anySel = selIds.size > 0 || selGroups.size > 0;
      if (anySel && !matched.length) continue;
      const total = matched.length + missing.length;
      const score = total ? Math.round((matched.length / total) * 100) / 100 : 0;
      out.push({ recipe: modelLib.cardOf(context, rec), matched, missing, score, status: anySel && !missing.length && (matched.length >= 2 || (main.length === 1 && !rec.legacyId)) ? 'du' : 'thieu' });
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
const validateLib = require('../lib/validate');
const modelLib = require('../lib/model');

module.exports = function (app) {
  const appRouter = app.router;

  appRouter.post('/api/contact', async (ctx) => {
    const wait = app.contactLimiter.hit(ctx.ip);
    if (wait) { const e = new HttpError(429, 'Bạn gửi quá nhiều tin nhắn. Vui lòng thử lại sau ' + wait + ' giây.'); e.headers = { 'Retry-After': String(wait) }; throw e; }
    const b = await ctx.body();
    const name = validateLib.str(b.name);
    if (!name || name.length > 100) throw new HttpError(400, 'Vui lòng nhập họ tên (tối đa 100 ký tự)', 'name');
    const email = validateLib.checkEmail(b.email);
    const message = validateLib.str(b.message);
    if (message.length < 5 || message.length > 5000) throw new HttpError(400, 'Nội dung cần từ 5 đến 5000 ký tự', 'message');
    ctx.db.contacts.push({ id: 'ct_' + crypto.randomBytes(5).toString('hex'), name, email, message, createdAt: new Date().toISOString() });
    if (ctx.db.contacts.length > 2000) ctx.db.contacts.shift();
    ctx.store.save();
    ctx.status = 201;
    return { ok: true };
  });


  // Bảng vinh danh trang chủ: nhiều công thức nhất / nhiều đánh giá nhất / công thức được lưu nhiều nhất.
  appRouter.get('/api/leaderboard', (ctx) => {
    const database = ctx.db;
    const byId = new Map(database.users.map((account) => [account.id, account]));
    function top(counter) {
      let best = null;
      counter.forEach((count, userId) => {
        const account = byId.get(userId);
        if (account && (!best || count > best.count)) best = { id: account.id, username: account.username, avatar: account.avatar || null, count: count };
      });
      return best;
    }
    const uploads = new Map(), reviews = new Map(), saves = new Map();
    database.recipes.forEach((x) => { if (x.authorId) uploads.set(x.authorId, (uploads.get(x.authorId) || 0) + 1); });
    database.reviews.forEach((x) => { reviews.set(x.userId, (reviews.get(x.userId) || 0) + 1); });
    database.saved.forEach((x) => { saves.set(x.recipeId, (saves.get(x.recipeId) || 0) + 1); });
    let bestRecipe = null;
    saves.forEach((count, userId) => {
      const rec = database.recipes.find((x) => x.id === userId);
      if (rec && (!bestRecipe || count > bestRecipe.saves)) bestRecipe = { id: rec.id, name: rec.name, saves: count, author: rec.authorId && byId.get(rec.authorId) ? { id: rec.authorId, username: byId.get(rec.authorId).username } : null };
    });
    return { mostRecipes: top(uploads), mostReviews: top(reviews), mostSaved: bestRecipe };
  });

  appRouter.get('/api/health', (ctx) => { const health = { ok: true, recipes: ctx.db.recipes.length }; if (ctx.app.cfg.demoOnly) health.demoOnly = true; return health; });
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
const unhex = (hexText) => new Uint8Array((hexText.match(/../g) || []).map((x) => parseInt(x, 16)));
async function derive(password, saltBytes) {
  const key = await crypto.subtle.importKey('raw', enc.encode(String(password)), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations: 100000 }, key, 256));
}
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return 'p1$' + hex(salt) + '$' + await derive(password, salt);
}
async function verifyPassword(password, stored) {
  const parts = String(stored || '').split('$');
  if (parts.length !== 3 || parts[0] !== 'p1') return false;
  return (await derive(password, unhex(parts[1]))) === parts[2];
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
function createSession(database, userId) {
  const sid = rnd(), now = Date.now();
  database.sessions.push({ id: sid, userId, createdAt: now, expiresAt: now + MAX_AGE * 1000 });
  return sid;
}
function findSession(database, sid) {
  if (!sid) return null;
  const entry = database.sessions.find((x) => x.id === sid);
  return entry && entry.expiresAt >= Date.now() ? entry : null;
}
function destroySession(database, sid) { database.sessions = database.sessions.filter((x) => x.id !== sid); }
function revokeOthers(database, userId, keepSid) { database.sessions = database.sessions.filter((entry) => entry.userId !== userId || entry.id === keepSid); }
function purgeExpired(database) { const now = Date.now(); database.sessions = database.sessions.filter((x) => x.expiresAt >= now); }
const cookieHeader = (sid) => 'SET:' + sid;
const clearCookieHeader = () => 'CLEAR';
module.exports = { MAX_AGE, createSession, findSession, destroySession, purgeExpired, revokeOthers, cookieHeader, clearCookieHeader };

});

/* ===== Chạy: dùng fetch đọc /data/db.json một lần, rồi xử lý mọi yêu cầu ngay trong trình duyệt (không gọi mạng nào khác) ===== */
const HttpError = load('lib/http').HttpError, Router = load('lib/router').Router, sessionLib = load('lib/session');
const NOLIMIT = { hit: function () { return 0; } };
let router = new Router(), database = null, baseIds = null, baseRecipes = null, ready = null;
const app = {
  cfg: { demoOnly: false },
  router: router, limiter: NOLIMIT, ipLimiter: NOLIMIT, writeLimiter: NOLIMIT, contactLimiter: NOLIMIT
};
const store = { data: null, save: persist, saveSoon: persist };

function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, value) { try { if (value === null) localStorage.removeItem(k); else localStorage.setItem(k, value); return true; } catch (e) { return false; } }

function persist() {
  const state = {};
  COLLECTIONS.forEach(function (k) { state[k] = database[k] || []; });
  state.userRecipes = database.recipes.filter(function (recipe) { return !baseIds.has(recipe.id); });
  const have = new Set(database.recipes.map(function (recipe) { return recipe.id; }));
  state.deletedSeed = Array.from(baseIds).filter(function (recipeId) { return !have.has(recipeId); });
  state.seedEdits = database.seedEdits || {};
  if (!lsSet(KEY, JSON.stringify(state))) throw new HttpError(507, 'Bộ nhớ của trình duyệt đã đầy hoặc bị chặn nên chưa lưu được. Hãy xóa bớt công thức hoặc ảnh rồi thử lại.');
}

let baseText = null;

/* Dựng lại db từ db.json gốc + phần người dùng đã lưu trong localStorage. */
function loadState() {
  const base = JSON.parse(baseText);
  database = base;
  baseRecipes = base.recipes.slice();
  baseIds = new Set(baseRecipes.map(function (recipe) { return recipe.id; }));
  /* review mẫu gốc: đã tính trong seedRating/seedCount, dùng để không cộng trùng khi tính điểm (không lưu vào localStorage) */
  database.seedReviews = new Map((base.reviews || []).map(function (recipe) { return [recipe.id, { recipeId: recipe.recipeId, rating: recipe.rating }]; }));
  let raw = lsGet(KEY), stored = null;
  /* dữ liệu lưu từ phiên bản trước còn đường dẫn /assets/..., đổi sang cấu trúc thư mục mới */
  if (raw) raw = raw.replace(/\/assets\/icons\//g, '/images/icons/').replace(/\/assets\/images\//g, '/images/').replace(/\/assets\/fonts\//g, '/fonts/');
  try { stored = raw ? JSON.parse(raw) : null; } catch (e) { stored = null; }
  if (stored) {
    COLLECTIONS.forEach(function (k) { database[k] = Array.isArray(stored[k]) ? stored[k] : []; });
    const del = new Set(stored.deletedSeed || []);
    database.recipes = baseRecipes.filter(function (recipe) { return !del.has(recipe.id); }).concat(stored.userRecipes || []);
    database.seedEdits = stored.seedEdits && typeof stored.seedEdits === 'object' ? stored.seedEdits : {};
    database.recipes.forEach(function (recipe) { if (database.seedEdits[recipe.id]) Object.assign(recipe, database.seedEdits[recipe.id]); });
  }
  COLLECTIONS.forEach(function (k) { if (!Array.isArray(database[k])) database[k] = []; });
  store.data = database;
}

function init() {
  return origFetch('/data/db.json').then(function (response) {
    if (!response.ok) throw new Error('Không tải được /data/db.json (' + response.status + ')');
    return response.text();
  }).then(function (text) {
    baseText = text;
    loadState();
    ['auth', 'recipes', 'me', 'reviews', 'ingredients', 'misc'].forEach(function (routeName) { load('routes/' + routeName)(app); });
  });
}

function json(status, obj) { return { status: status, data: obj }; }

async function handle(url, method, bodyText) {
  const parsedUrl = new URL(url, location.origin);
  const matched = router.match(method, parsedUrl.pathname);
  if (!matched) throw new HttpError(404, 'Không tìm thấy API này');
  if (matched.badRequest) throw new HttpError(400, 'Đường dẫn không hợp lệ');
  if (matched.methods) throw new HttpError(405, 'Phương thức không được hỗ trợ');
  const sid = lsGet(SID_KEY);
  const sess = sessionLib.findSession(database, sid);
  const user = sess ? database.users.find(function (x) { return x.id === sess.userId; }) || null : null;
  const query = {};
  parsedUrl.searchParams.forEach(function (value, k) { if (!(k in query)) query[k] = value; });
  const ctx = {
    req: { headers: {} }, url: parsedUrl, query: query, params: matched.params, app: app, db: database, store: store,
    user: user, sid: sid, status: 200, headers: {}, ip: 'local',
    body: async function () {
      let parsed;
      try { parsed = bodyText ? JSON.parse(bodyText) : {}; } catch (e) { throw new HttpError(400, 'Dữ liệu JSON không hợp lệ'); }
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) throw new HttpError(400, 'Dữ liệu gửi lên phải là một đối tượng JSON');
      return parsed;
    },
    setCookie: function (cookie) { this.headers['Set-Cookie'] = cookie; },
    requireUser: function () { if (!this.user) throw new HttpError(401, 'Bạn cần đăng nhập để thực hiện thao tác này'); return this.user; }
  };
  let out;
  try { out = await matched.route.handler(ctx); } catch (e) { if (e instanceof HttpError && e.status === 507) loadState(); throw e; }
  const cookie = ctx.headers['Set-Cookie'];
  if (cookie) { if (cookie === 'CLEAR') lsSet(SID_KEY, null); else if (cookie.indexOf('SET:') === 0) lsSet(SID_KEY, cookie.slice(4)); }
  return json(ctx.status, out === undefined ? { ok: true } : out);
}

/* Điểm vào duy nhất: NomNomStore.run('GET', '/recipes?limit=5') -> Promise<{status, data}> */
window.NomNomStore = { run: function (method, path, body) {
  return (ready = ready || init().catch(function (e) { ready = null; throw e; })).then(function () {
    return handle('/api' + path, String(method).toUpperCase(), body === undefined ? '' : JSON.stringify(body));
  }).catch(function (e) {
    if (e instanceof HttpError) return json(e.status, e.field ? { error: e.message, field: e.field } : { error: e.message });
    console.error('NomNom store:', e);
    return json(500, { error: 'Đã có lỗi xảy ra. Vui lòng thử lại.' });
  });
} };
window.NomNomLocal = { reset: function () { lsSet(KEY, null); lsSet(SID_KEY, null); location.reload(); } };

})();
