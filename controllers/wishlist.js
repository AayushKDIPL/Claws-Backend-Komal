import wishlist from "../models/wishlist.js";
import { removeImage } from "../utils/common.js";

const WishlistController = {
  getProducts: async (req, res) => {
    try {
      // if (!req.query.page || !req.query.limit)
      //   throw new Error("Page, Limit is required !");

      const skipUsers = (req.query.page - 1) * req.query.limit;
      const ITEM_PER_PAGE = req.query.page * req.query.limit;

      const products = await wishlist.find().populate('id');

      const totalProducts = await wishlist.find().count();

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
      let {
        id
      } = req.body;



      if (
        !id
      )
        throw new Error(
          "product are reqired !"
        );

      const products = await wishlist.create({
        id
      });

      return res.status(200).json({ message: products });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      let product = await wishlist.findById(req.params._id);
      if (!product) throw new Error("Invalid call");
      await wishlist.findByIdAndDelete(req.params._id);

      return res
        .status(200)
        .json({ message: "Deleted Successfully", status: true });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
};

export default WishlistController;
