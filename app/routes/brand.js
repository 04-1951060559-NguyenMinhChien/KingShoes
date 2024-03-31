
var resp = require('../response');
var brands = require('../lib/brand/index');
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
    // Tạo mới nhãn hiệu
    app.post('/brands', upload.single('image'), (req, res) => {
        console.log("data", req.body);
        brands.createBrand(req.body).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    }),
        // Đọc danh sách nhãn hiệu
        app.route('/brands')
            .get((req, res) => {
                brands.allBrand().then((ok) => {
                    resp.sendOK(res, req, ok)
                }).catch(function (err) {
                    resp.throws(res, req, err)
                })
            })
    // Cập nhật nhãn hiệu
    app.route('/brands/:id', upload.single('image'))
        .put((req, res) => {
            brands.updateBrand(req.params.id, req.body).then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        });
    // Xóa nhãn hiệu
    app.route('/brands/:id')
        .delete((req, res) => {
            brands.deleteBrand(req.params.id).then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        });

    // Tìm kiếm
    app.route('/brands/:data')
        .post((req, res) => {
            brands.searchBrand(req.params).then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        });


}