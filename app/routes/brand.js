
var resp = require('../response');
var brands = require('../lib/brand/index');
// var middlewarePermission = require('../middleware/checkPermission');

module.exports = function (app, passport) {
    // Tạo mới nhãn hiệu
    app.route('/brands')
        .post((req, res) => {
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
    app.route('/brands/:id')
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




}