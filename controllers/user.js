import User from "../models/user.js";
import { hashPassword } from "../utils/auth.js"

const UserController = {
  getUser: async (req, res) => {
    try {
      const data = await User.findById(req.params._id).select("-password");
      return res.status(200).json({ message: data });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.find({}).select("-password");
      res.status(200).json({ message: users });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  addUser: async (req, res) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name)
        throw new Error("Email, name and password is required !");

      const hashedPassword = await hashPassword(password);

      const user = await User.create({
        email,
        name,
        password:hashedPassword,
        role:"ADMIN"
      });

      res.status(200).json({
        message: user,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
};

export default UserController;
