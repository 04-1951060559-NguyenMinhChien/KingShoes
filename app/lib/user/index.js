const models = require('../../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.Signup = async (req, body = {}) => {
    try {
        const { name, phone, email, password, role } = req.body;
        console.log(req.body);
        // Kiểm tra xem các trường bắt buộc đã được điền đầy đủ hay không
        if (!name || !phone || !email || !password) {
            return Promise.reject({ show: true, message: "Vui lòng điền đầy đủ thông tin" });
        }

        // Kiểm tra xem người dùng đã tồn tại hay chưa
        const userExists = await models.findOne({ $or: [{ phone }, { email }] });
        if (userExists) {
            return Promise.reject({ show: true, message: "Người dùng đã tồn tại" });
        }

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("hashedPassword", hashedPassword);
        // Tạo người dùng mới với mật khẩu đã được hash
        const newUser = await models.create({ name, phone, email, password: hashedPassword, role });

        // Trả về thông báo thành công và người dùng đã tạo nếu không có lỗi
        return Promise.resolve(newUser);
    } catch (error) {
        console.error("Error creating User:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}
exports.Login = async (req, body = {}) => {
    try {
        const { email, password } = req;
        let user;

        // Kiểm tra xem người dùng đã cung cấp email hoặc số điện thoại chưa
        if (!email) {
            return Promise.reject({ show: true, message: "Vui lòng nhập email hoặc số điện thoại" });
        }
        user = await models.findOne({ email: email });

        if (!user) {
            // Không tìm thấy người dùng với thông tin đăng nhập đã nhập
            return Promise.reject({ show: true, message: "Thông tin đăng nhập không tồn tại" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            delete user.password; // Xóa mật khẩu trước khi trả về thông tin người dùng
            return Promise.resolve({ user });
        } else {
            // Mật khẩu không khớp
            return Promise.reject({ show: true, message: "Mật khẩu không đúng" });
        }
    } catch (error) {
        // Bắt và xử lý lỗi nếu có
        console.error("Error logging in:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
};

exports.allUser = async () => {
    try {
        let data = await models.find()
        console.log("data");
        return Promise.resolve(data);
    } catch (error) {
        console.log(error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}
exports.updateUser = async (id, body = {}) => {
    try {
        const image = req.file.path; // Đường dẫn của hình ảnh đã được lưu trữ trong req.file
        body.image = image;
        // console.log("non the nho", data);
        let updated = await models.findByIdAndUpdate(id, body, { new: true });
        return Promisebb.resolve(updated);
    } catch (error) {
        // Bắt và xử lý lỗi nếu có
        console.error("Error updating User:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}
exports.deleteUser = async (id) => {
    try {
        const User = await models.findById(id);
        const imagePath = User.image;
        let deleted = await models.findByIdAndRemove({ _id: id });
        fs.unlinkSync(imagePath); // Xóa hình ảnh từ thư mục
        return Promise.resolve(deleted);
    } catch (error) {
        console.error("Error delete User:", error);
        return Promise.reject({ show: true, message: "Có lỗi xảy ra, xin vui lòng thử lại" });
    }
}

exports.SearchUser = async (search) => {
    try {

        // Tìm kiếm trong cơ sở dữ liệu
        let result = await models.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { role: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
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