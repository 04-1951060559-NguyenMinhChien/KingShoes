let models = require('../../models/brands');

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
exports.createBrand = async (data, body = {}) => {
    try {
        let errors = [];
        const { brandName, emailBrand, phoneNumber, adress, image } = data;
        // console.log("non the nho", data);
        if (brandName && emailBrand && phoneNumber) {
            let checkExists1 = await models.findOne({ brandName });
            let checkExists2 = await models.findOne({ emailBrand });
            let checkExists3 = await models.findOne({ phoneNumber });
            if (checkExists1 && checkExists2 && checkExists3) {
                errors.push({ 'label': 'brand_exist', 'message': 'Nhãn hàng đã tồn tại' });
                return Promise.reject({ show: true, message: errors });
            }
        }
        // Thực hiện tạo sản phẩm
        let created = await models.create({ brandName, emailBrand, phoneNumber, adress, image });

        // Trả về thông báo thành công nếu tạo sản phẩm thành công
        return Promise.resolve(created);
    } catch (error) {
        // Bắt và xử lý lỗi nếu có
        console.error("Error creating Brand:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

exports.allBrand = async () => {
    try {
        let data = await models.find()
        console.log("data");
        return Promise.resolve(data);
    } catch (error) {
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}
exports.updateBrand = async (id, body = {}) => {
    try {
        let updated = await models.findByIdAndUpdate(id, body, { new: true });
        return Promise.resolve(updated);
    } catch (error) {
        // Bắt và xử lý lỗi nếu có
        console.error("Error updating Brand:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}
exports.deleteBrand = async (id) => {
    try {
        let deleted = await models.findByIdAndRemove({ _id: id });
        return Promise.resolve(deleted);
    } catch (error) {
        console.error("Error delete Brand:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}