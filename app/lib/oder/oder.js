let models = require('../../models/oder');

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
exports.createOder = async (data) => {
    try {
        // let errors = [];
        const { user_id, product_data, name, totalPrice, phone, email, content, address, ward, district, province, typePay, statusPay, note, statusOder } = data;
        const productIdsWithQuantity = product_data.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
        }));
        // if (user_id) {
        //     // Kiểm tra xem giỏ hàng có tồn tại không
        //     let checkExists1 = await models.findOne({ user_id });
        //     if (checkExists1) {
        //         // Nếu giỏ hàng đã tồn tại, thực hiện cập nhật
        //         return await this.updateOder(user_id, statusPay, statusOder);
        //         // return Promise.resolve(checkExists1); // Trả về thông tin giỏ hàng đã cập nhật
        //     }
        // }

        // Nếu giỏ hàng chưa tồn tại, thực hiện tạo mới
        let created = await models.create({ user_id, product: productIdsWithQuantity, name, totalPrice, phone, note, email, content, address, ward, district, province, typePay, statusPay, statusOder });
        return Promise.resolve(created); // Trả về thông tin giỏ hàng đã tạo mới
    } catch (error) {
        // Bắt và xử lý lỗi nếu có
        console.error("Error creating Oder:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}


exports.allOderByUser = async (user_id) => {
    try {
        let data = await models.find({ user_id })
            .populate('user_id') // Lấy thông tin của người dùng nếu cần
            .populate({
                path: 'product.product_id', // Đường dẫn đến trường mảng product và trường product_id bên trong mảng đó
            });

        return Promise.resolve(data);
    } catch (error) {
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

exports.allOder = async () => {
    try {
        let data = await models.find()
            .populate('user_id') // Lấy thông tin của người dùng nếu cần
            .populate({
                path: 'product.product_id', // Đường dẫn đến trường mảng product và trường product_id bên trong mảng đó
            });

        return Promise.resolve(data);
    } catch (error) {
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

exports.updateOder = async (user_id, statusPay, statusOder) => {
    try {
        console.log("user_id", user_id);
        let oder = await models.findOne({ user_id });

        if (!oder) {
            throw new Error('Không tìm thấy đơn hàng');
        }
        if (statusPay) {
            oder.statusPay = statusPay;
        } if (statusOder) {
            oder.statusOder = statusOder;

        }
        let updatedOder = await oder.save();

        return Promise.resolve(updatedOder);
    } catch (error) {
        console.error("Lỗi khi cập nhật giỏ hàng:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}


