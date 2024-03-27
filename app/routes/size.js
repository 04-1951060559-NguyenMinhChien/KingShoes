
var resp = require('../response');
var sizes = require('../lib/size/index');
// var middlewarePermission = require('../middleware/checkPermission');

module.exports = function (app, passport) {
    // Tạo mới 
    app.route('/sizes')
        .post((req, res) => {
            console.log("data", req.body);
            sizes.createSize(req.body).then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        }),
        // Đọc danh sách 
        app.route('/sizes')
            .get((req, res) => {
                sizes.allSize().then((ok) => {
                    resp.sendOK(res, req, ok)
                }).catch(function (err) {
                    resp.throws(res, req, err)
                })
            })
    // Cập nhật 
    app.route('/sizes/:id')
        .put((req, res) => {
            sizes.updateSize(req.params.id, req.body).then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        });
    // Xóa 
    app.route('/sizes/:id')
        .delete((req, res) => {
            sizes.deleteSize(req.params.id).then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        });

    // Tìm kiếm
    app.route('/sizes/:data')
        .post((req, res) => {
            sizes.searchSize(req.params).then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        });


}