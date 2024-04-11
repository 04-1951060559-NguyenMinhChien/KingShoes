
var resp = require('../response');
var oders = require('../lib/oder/oder');
// var middlewarePermission = require('../middleware/checkPermission');

module.exports = function (app, passport) {
    // Tạo mới 
    app.post('/oders', (req, res) => {
        console.log("data 111111", req.body);
        oders.createOder(req.body).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    }),
        // Đọc danh sách 
        app.get('/oders', (req, res) => {
            console.log("data allOder");
            oders.allOder().then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        })
    // Đọc danh sách 
    app.get('/oders/:user_id', (req, res) => {
        console.log("data 1", req.query.user_id);
        oders.allOderByUser(req.params.user_id).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    })

}