
var resp = require('../response');
var products = require('../lib/product/index');
// var middlewarePermission = require('../middleware/checkPermission');
const multer = require('multer');
const path = require('path'); // Import thư viện path để xác định đường dẫn của thư mục public

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images')); // Xác định thư mục đích để lưu trữ tệp ảnh
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Sử dụng tên gốc của tệp ảnh
    }
});
const upload = multer({ storage: storage });
module.exports = function (app, passport) {
    // Tạo mới sản phẩm
    app.post('/products', upload.single('image'), (req, res) => {
        console.log("data", req.body);
        products.createProduct(req).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    });
    // Đọc danh sách sản phẩm
    app.route('/products')
        .get((req, res) => {
            products.allProduct().then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        })
    // Đọc danh sách sản phẩm theo Nhãn Hiệu
    app.route('/productsbybrand')
        .get((req, res) => {
            products.ProductByBrand(req.query.brand_id).then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        })
    // Cập nhật sản phẩm
    app.route('/products/:id', upload.single('image'))
        .put((req, res) => {
            console.log("data checkk", req.body);
            products.updateProduct(req.params.id, req).then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        });
    // Xóa sản phẩm
    app.route('/products/:id')
        .delete((req, res) => {
            products.deleteProduct(req.params.id).then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        });
    // Tìm kiếm sản phẩm
    app.route('/products/:data')
        .post((req, res) => {
            users.SearchProduct(req.params).then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        });



}