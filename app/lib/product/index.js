let models = require('../../models/products');
// const Joi = require('joi');
// const Promisebb = require('bluebird')
// const _ = require('lodash');
// const bcrypt = require('bcryptjs')
// const jwtConf = require('../../../config/jwt');
// var jwt = require('jsonwebtoken');
// var moment = require('moment');
// var logger = require('../logger');
// // var common = require('../common');
// var ObjectID = require('mongodb').ObjectID;
// // var elastic = require('../../elastic');
// const { join } = require('path');
// const util = require('../utils');
exports.createProduct = async (req, body = {}) => {
    try {
        let errors = [];
        const { name, description, status, price, brand_id, size_id } = req.body;
        const imagePath = req.file.path; // Đường dẫn của hình ảnh đã được lưu trữ trong req.file
        const imageFileNameWithoutPath = path.basename(imagePath); // Lấy tên tệp từ đường dẫn đầy đủ
        const image = '/images/' + imageFileNameWithoutPath; // Đường dẫn cố định của hình ảnh
        // console.log("non the nho", data);
        if (name && brand_id) {
            let checkExists1 = await models.findOne({ brand_id });
            let checkExists2 = await models.findOne({ name });
            if (checkExists1 && checkExists2) {
                errors.push({ 'label': 'product_exist', 'message': 'Sản phầm đã tồn tại' });
                return Promise.reject({ show: true, message: errors });
            }
        }
        if (!image) {
            errors.push({ 'label': 'product_exist', 'message': 'Sản phầm không có ảnh' });
            return Promise.reject({ show: true, message: errors });
        }
        // Thực hiện tạo sản phẩm
        let created = await models.create({ name, description, status, price, brand_id, size_id, image });

        // Trả về thông báo thành công nếu tạo sản phẩm thành công
        return Promise.resolve(created);
    } catch (error) {
        // Bắt và xử lý lỗi nếu có
        console.error("Error creating product:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

exports.allProduct = async () => {
    try {
        let data = await models.find()
            .populate('brand_id', 'name') // Lấy ra trường 'name' từ collection 'Brands' tương ứng với 'brand_id'
            .populate('size_id', 'name') // Lấy ra trường 'name' từ collection 'Sizes' tương ứng với 'size_id'
            .exec(); // Thực thi truy vấn và trả về kết quả

        // In ra dữ liệu trả về
        console.log(data);

        return Promise.resolve(data);
    } catch (error) {
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

// Hiển thị sản phầm theo nhãn hiệu
exports.ProductByBrand = async (brand_id) => {
    try {
        // Tìm kiếm các sản phẩm dựa trên brand_id
        let data = await models.find({ brand_id: brand_id })
            .populate('brand_id', 'name') // Lấy ra trường 'name' từ collection 'Brands' tương ứng với 'brand_id'
            .populate('size_id', 'name') // Lấy ra trường 'name' từ collection 'Sizes' tương ứng với 'size_id'
            .exec(); // Thực thi truy vấn và trả về kết quả

        // In ra dữ liệu trả về
        console.log(data);

        // Trả về kết quả cho người dùng
        return Promise.resolve(data);
    } catch (error) {
        // Xử lý lỗi
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

exports.updateProduct = async (id, body = {}) => {
    try {
        const image = req.file.path; // Đường dẫn của hình ảnh đã được lưu trữ trong req.file
        body.image = image;
        // console.log("non the nho", data);
        let updated = await models.findByIdAndUpdate(id, body, { new: true });
        return Promisebb.resolve(updated);
    } catch (error) {
        // Bắt và xử lý lỗi nếu có
        console.error("Error updating product:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}
exports.deleteProduct = async (id) => {
    try {
        const product = await Product.findById(id);
        const imagePath = product.image;
        let deleted = await models.findByIdAndRemove({ _id: id });
        fs.unlinkSync(imagePath); // Xóa hình ảnh từ thư mục
        return Promise.resolve(deleted);
    } catch (error) {
        console.error("Error delete product:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

exports.SearchProduct = async (search) => {
    try {

        // Tìm kiếm trong cơ sở dữ liệu
        let result = await models.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                // { phone: { $regex: search, $options: 'i' } },
                // { role: { $regex: search, $options: 'i' } },
                // { email: { $regex: search, $options: 'i' } },
            ]
        });

        // Kiểm tra kết quả trả về
        if (result.length === 0) {
            return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
        }

        // Trả về kết quả cho người dùng
        return Promise.resolve(result);
    } catch (error) {
        // Xử lý lỗi
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}