import express from "express";
import ContactController from "../controllers/contact.js";

export const router = express.Router();

router.get("/", ContactController.getContacts);

router.post("/", ContactController.addContact);

