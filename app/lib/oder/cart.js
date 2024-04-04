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
        const { user_id, product_data } = data;
        const productIdsWithQuantity = product_data.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
        }));
        if (user_id) {
            // Kiểm tra xem giỏ hàng có tồn tại không
            let checkExists1 = await models.findOne({ user_id });
            if (checkExists1) {
                // Nếu giỏ hàng đã tồn tại, thực hiện cập nhật
                return await this.updateCart(user_id, productIdsWithQuantity);
                // return Promise.resolve(checkExists1); // Trả về thông tin giỏ hàng đã cập nhật
            }
        }

        // Nếu giỏ hàng chưa tồn tại, thực hiện tạo mới
        let created = await models.create({ user_id, product: productIdsWithQuantity });
        return Promise.resolve(created); // Trả về thông tin giỏ hàng đã tạo mới
    } catch (error) {
        // Bắt và xử lý lỗi nếu có
        console.error("Error creating Cart:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}


exports.allCart = async (user_id) => {
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

const mongoose = require('mongoose');

exports.updateCart = async (user_id, product) => {
    try {
        console.log(user_id);
        let cart = await models.findOne({ user_id });

        if (!cart) {
            throw new Error('Không tìm thấy giỏ hàng');
        }

        // Cập nhật sản phẩm trong giỏ hàng
        product.forEach(newItem => {
            // Tìm kiếm sản phẩm trong giỏ hàng
            let existingProduct = cart.product.find(item =>
                item.product_id.toString() === newItem.product_id.toString()
            );

            if (existingProduct) {
                // Nếu sản phẩm đã tồn tại, cập nhật số lượng
                existingProduct.quantity = newItem.quantity;
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào giỏ hàng
                cart.product.push(newItem);
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

