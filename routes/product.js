import express from "express";
import ProductsController from "../controllers/product.js";
import multer from "multer";
import fs from "fs"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = `uploads/products`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },

  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + "png");
  },
});

const upload = multer({ storage: storage }).fields([
  { name: "images", maxCount: 10 },
]);

export const router = express.Router();

router.get("/", ProductsController.getProducts);// Done
router.get("/:_id", ProductsController.getProduct);// Done
router.post("/", upload, ProductsController.addProduct);// Done
router.patch("/:_id", ProductsController.updateProduct);// Done
router.delete("/:_id", ProductsController.deleteProduct);// Done
router.post("/search", ProductsController.searchProduct);// Not Check
