import cart from "../models/cart.js";
import { removeImage } from "../utils/common.js";

const CardController = {
  getProducts: async (req, res) => {
    try {
      // if (!req.query.page || !req.query.limit)
      //   throw new Error("Page, Limit is required !");

      const skipUsers = (req.query.page - 1) * req.query.limit;
      const ITEM_PER_PAGE = req.query.page * req.query.limit;

      const products = await cart.find().populate('id');

      const totalProducts = await cart.find().count();

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

      const products = await cart.create({
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
      let product = await cart.findById(req.params._id);
      if (!product) throw new Error("Invalid call");
      await cart.findByIdAndDelete(req.params._id);

      return res
        .status(200)
        .json({ message: "Deleted Successfully", status: true });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  deleteProducts: async (req, res) => {
    try {
      await cart.deleteMany({});

      return res
        .status(200)
        .json({ message: "Deleted Successfully", status: true });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
};

export default CardController;
