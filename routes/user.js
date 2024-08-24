import express from "express";
import UserController from "../controllers/user.js";
import { isAuthorised } from "../middlewares/auth.js"

export const router = express.Router();

router.get("/:_id", isAuthorised, UserController.getUser);//Done
router.get("/all", UserController.getUsers);//Done
router.post("/", UserController.addUser);//Done

