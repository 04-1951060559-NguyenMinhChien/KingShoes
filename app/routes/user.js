
var resp = require('../response');
var users = require('../lib/user/index');
// var middlewarePermission = require('../middleware/checkPermission');
const multer = require('multer');
const path = require('path'); // Import thư viện path để xác định đường dẫn của thư mục public

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../lib/public/images')); // Xác định thư mục đích để lưu trữ tệp ảnh
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Sử dụng tên gốc của tệp ảnh
    }
});
const upload = multer({ storage: storage });
module.exports = function (app, passport) {
    // Tạo mới người dùng
    app.post('/signup', (req, res) => {
        // console.log("data", req.body);
        users.Signup(req).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    });
    // đăng nhập
    app.post('/login', (req, res) => {
        console.log("data", req.body);
        users.Login(req.body).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    });
    // Cập nhật sản phẩm
    app.route('/users/:id', upload.single('image'))
        .put((req, res) => {
            users.updateProduct(req.params.id, req).then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        });
    // Xóa sản phẩm
    app.route('/users/:id')
        .delete((req, res) => {
            users.deleteProduct(req.params.id).then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        });




}