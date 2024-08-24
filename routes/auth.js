import express from "express";
import AuthController from "../controllers/auth.js";

export const router = express.Router();

router.post("/login", AuthController.login);// Done
router.get("/logout", AuthController.logout);// Done
router.post("/signup", AuthController.signup);// Done
router.post("/forgot-password", AuthController.forgotPin);


router.post("/reset-password", AuthController.resetPin);
