let models = require('../../models/cart');

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
exports.createCart = async (data) => {
    try {
        // let errors = [];
        const { user_id, product_ids } = data;

        if (user_id) {
            // Kiểm tra xem giỏ hàng có tồn tại không
            let checkExists1 = await models.findOne({ user_id });
            if (checkExists1) {
                // Nếu giỏ hàng đã tồn tại, thực hiện cập nhật
                return await this.updateCart(user_id, product_ids);
                // return Promise.resolve(checkExists1); // Trả về thông tin giỏ hàng đã cập nhật
            }
        }

        // Nếu giỏ hàng chưa tồn tại, thực hiện tạo mới
        let created = await models.create({ user_id, product_ids });
        return Promise.resolve(created); // Trả về thông tin giỏ hàng đã tạo mới
    } catch (error) {
        // Bắt và xử lý lỗi nếu có
        console.error("Error creating Cart:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}


exports.allCart = async (user_id) => {
    try {
        let data = await models.findOne({ user_id })
            .populate('user_id') // Lấy thông tin của người dùng nếu cần
            .populate('product_ids'); // Lấy thông tin chi tiết về các sản phẩm trong giỏ hàng

        return Promise.resolve(data);
    } catch (error) {
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

exports.updateCart = async (user_id, product_ids) => {
    try {
        // Tìm đối tượng giỏ hàng dựa trên user_id
        let cart = await models.findOne({ user_id });

        if (!cart) {
            throw new Error('Không tìm thấy giỏ hàng');
        }

        // Kiểm tra xem sản phẩm mới đã tồn tại trong giỏ hàng hay chưa
        product_ids.forEach(product_id => {
            if (!cart.product_ids.includes(product_id)) {
                cart.product_ids.push(product_id); // Thêm sản phẩm mới vào mảng nếu chưa tồn tại
            }
        });

        // Lưu trạng thái mới của đối tượng giỏ hàng
        let updatedCart = await cart.save();

        return Promise.resolve(updatedCart);
    } catch (error) {
        console.error("Lỗi khi cập nhật giỏ hàng:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

exports.deleteCartItem = async (cartId, productId) => {
    try {
        // Tìm đối tượng giỏ hàng dựa trên ID
        let cart = await models.findById(cartId);
        if (!cart) {
            throw new Error('Không tìm thấy giỏ hàng');
        }

        // Loại bỏ ID cụ thể khỏi mảng "product_ids"
        cart.product_ids = cart.product_ids.filter(id => id.toString() !== productId.toString());

        // Lưu trạng thái mới của đối tượng giỏ hàng
        let updatedCart = await cart.save();

        return Promise.resolve(updatedCart);
    } catch (error) {
        console.error("Lỗi khi xóa mục giỏ hàng:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

