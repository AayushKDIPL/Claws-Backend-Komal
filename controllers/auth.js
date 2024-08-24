import User from "../models/user.js";
import { comparePassword, hashPassword } from "../utils/auth.js";
import { createJwtToken, verifyToken } from "../utils/jwt.js";
import crypto from "crypto"
import { sendForgotEmail } from "../utils/sms.js";

const AuthController = {
  signup: async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user with the provided email already exists
        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
            return res.status(400).json({ message: "User already registered with this email, Plesae Login" });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "User Registration Success",
            user: newUser,
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({ message: "Error during signup. Please try again." });
    }
},
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email);

      if (!email || !password)
        throw new Error("Email and password is required !");

      const user = await User.findOne({
        email,
      });

      if (!user) throw new Error("User Not Found!");

      const isAuthorised = await comparePassword(password, user.password);
      if (!isAuthorised) throw new Error("Invalid Credentials !");

      const accesstoken = createJwtToken(
        email,
        user.tokenVersion,
        user._id,
        user.role
      );

      res.status(200).json({
        message: {
          accesstoken,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Invalid Login" });
    }
  },
  logout: async (req, res) => {
    try {
      const JWT = req.headers["authorization"].replaceAll("JWT ", "");
      const tokenDetails = await verifyToken(
        JWT,
        process.env.ACCESS_TOKEN_SECRET
      );
      if (!tokenDetails)
        return res.status(401).json({ message: "Unauthorised" });

      await User.findByIdAndUpdate(tokenDetails.id, {
        tokenVersion: tokenDetails.tokenVersion + 1,
      });

      return res.json({ message: "signout success" });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Error. Try again");
    }
  },
  forgotPin: async (req, res) => {
    try {
      const { email } = req.body;
      if(!email) throw new Error("Email is required !");

      crypto.randomBytes(32, async (err, buffer) => {
        if (err) console.log(err);

        const resetToken = buffer.toString("hex");
        const user = await User.findOne({
          email: req.body.email,
        }).select("email name");

        if (!user)
          return res.status(400).json({ message: "User does not exist" });

        user.resetToken = resetToken;
        user.expireToken = Date.now() + 3600000;
        await user.save();
        await sendForgotEmail(user.email, resetToken);

        return res
          .status(200)
          .json({ message: `http://localhost:3000/updatePassword/${resetToken}` });
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  resetPin: async (req, res) => {
    try {
      const { password, token } = req.body;
      if (!token || !password) throw new Error("token or password is required !");

      const user = await User.findOne({
        resetToken: token,
        expireToken: { $gt: Date.now() },
      });

      if (!user) throw new Error({ message: "Link is expired" });
      const hashedPassword = await hashPassword(password);
      await User.findByIdAndUpdate(user._id, {
        resetToken: "",
        expireToken: "",
        password: hashedPassword,
      });

      res.status(200).json({ message: "Pin reset successfully!" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
};

export default AuthController;
