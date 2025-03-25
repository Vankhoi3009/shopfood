import User from "../models/User.js";

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (err) {
        console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };