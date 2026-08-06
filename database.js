// Trước đây file này tự đọc/ghi data.json riêng, tách biệt với data.js.
// Hai bản dữ liệu trong RAM lệch nhau khiến !xidach/!taixiu (dùng file này)
// và !profile/!fish (dùng data.js) hiển thị số dư khác nhau.
// Giờ trỏ về data.js để chỉ còn một nguồn dữ liệu duy nhất.

module.exports = require("./data");
