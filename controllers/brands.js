import brands from "../models/brands.js";
import { removeImage } from "../utils/common.js";

const BrandsController = {
  getProducts: async (req, res) => {
    try {
      // if (!req.query.page || !req.query.limit)
      //   throw new Error("Page, Limit is required !");

      const skipUsers = (req.query.page - 1) * req.query.limit;
      const ITEM_PER_PAGE = req.query.page * req.query.limit;

      const products = await brands.find({
        ...(req.query.subcategory),
      })
        .sort({ priority: -1 })
        .skip(skipUsers)
        .limit(req.query.limit);

      const totalProducts = await brands.find({
        ...(req.query.subcategory),
      }).count();

      res.status(200).send({
        succss: true,
        message: products,
        totalProducts,
        hasNextPage: ITEM_PER_PAGE < totalProducts,
        hasPreviousPage: req.query.page > 1,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  addProduct: async (req, res) => {
    try {

      const images = req.files.images.map(file => file.filename);

      if (
        !images?.length
      )
        throw new Error(
          "images are reqired !"
        );

      const product = await brands.create({
        images
      });

      return res.status(200).json({ message: product });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
};

export default BrandsController;
