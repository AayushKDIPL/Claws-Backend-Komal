import express from "express";
import CategoryController from "../controllers/category.js";
import multer from "multer";
import fs from "fs"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = `uploads/category`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },

  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + "webp");
  },
});

const upload = multer({ storage: storage }).fields([
  { name: "file", maxCount: 1 },
]);

export const router = express.Router();

router.get("/", CategoryController.getCategories);//Done
router.get("/:_id", CategoryController.getCategory);//Done
router.post("/", CategoryController.addCategory);//upload Done
router.patch("/:_id", CategoryController.updateCategory);//Done
router.delete("/:_id", CategoryController.deleteCategory);//Not Check
