import express from "express";
import SubcategoryController from "../controllers/subcategory.js";
import multer from "multer";
import fs from "fs"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = `uploads/subcategory`;
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

router.get("/", SubcategoryController.getSubCategories);// Done
router.get("/:_id", SubcategoryController.getSubCategory);// Done
router.post("/", SubcategoryController.addSubCategory);// upload Done
router.patch("/:id",upload, SubcategoryController.updateSubCategory);// Done
router.delete("/:id", SubcategoryController.deleteSubCategory);//Not Check
