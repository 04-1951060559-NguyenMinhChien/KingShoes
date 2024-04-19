let models = require('../../models/oder');
let Product = require('../../models/products');
var nodemailer = require("nodemailer");
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
        const { user_id, product_data, name, totalPrice, phone, email, content, address, ward, district, province, typePay, statusPay, note, statusOder } = data;
        const productIdsWithQuantity = product_data.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
        }));

        let created = await models.create({ user_id, product: productIdsWithQuantity, name, totalPrice, phone, note, email, content, address, ward, district, province, typePay, statusPay, statusOder });
        if (created) {
            // this.sendMail(email)
            for (const { product_id, quantity } of productIdsWithQuantity) {
                const product = await Product.findById(product_id);
                if (!product) {
                    return Promise.reject({ show: true, message: `Sản phẩm với id ${product_id} không tồn tại` });
                }
                if (product.numberInStock < quantity) {
                    return Promise.reject({ show: true, message: `Không đủ số lượng sản phẩm với tên ${product.name}` });
                }
                product.numberInStock -= quantity;
                await product.save();
            }
        }
        return Promise.resolve(created);
    } catch (error) {
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

exports.updateOder = async (data) => {
    try {
        let _id = data._id;
        let statusPay = data.statusPay
        let statusOder = data.statusOder
        let oder = await models.findOne({ _id });

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

exports.sendMail = async (data) => {
    try {
        console.log(data);
        // Tạo transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'huumanhk129@gmail.com',
                pass: 'manh29062001',
            },
        });

        // Tạo options cho email
        const mailOptions = {
            from: 'huumanhk129@gmail.com',
            to: data,
            subject: 'Thông báo đặt hàng',
            text: 'Đơn hàng của bạn đã được đặt thành công !',
        };

        // Gửi email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info; // Trả về thông tin về email đã gửi nếu cần thiết
    } catch (error) {
        console.error('Error occurred:', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm nếu cần thiết
    }
};


