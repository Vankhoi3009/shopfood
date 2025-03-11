import User from "../models/User.js"; // Import model User

export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }

        // Tạo user mới
        const newUser = new User({
            name,
            email,
            password,
            role
        });

        // Lưu vào database
        await newUser.save();
        res.status(201).json({ message: "Tạo user thành công", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};
