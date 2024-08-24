import newArrival from "../models/newArrival.js";
import { removeImage } from "../utils/common.js";

const NewArrivalController = {
  getProducts: async (req, res) => {
    try {
      // if (!req.query.page || !req.query.limit)
      //   throw new Error("Page, Limit is required !");

      const skipUsers = (req.query.page - 1) * req.query.limit;
      const ITEM_PER_PAGE = req.query.page * req.query.limit;

      const products = await newArrival.find({
        ...(req.query.subcategory),
      })
        .sort({ priority: -1 })
        .skip(skipUsers)
        .limit(req.query.limit);

      const totalProducts = await newArrival.find({
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
      let {
        name,
        description,
        mrp,
        price
      } = req.body;


      const images = req.files.images.map(file => file.filename);

      if (
        !name ||
        !description ||
        !mrp ||
        !price ||
        !images?.length
      )
        throw new Error(
          "name, priority, subcategory, description, mrp, price and images are reqired !"
        );

      const product = await newArrival.create({
        name,
        description,
        mrp,
        price,
        images
      });

      return res.status(200).json({ message: product });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      let params = { ...req.body };
      const updatedProduct = await newArrival.findByIdAndUpdate(
        req.params._id,
        params,
        { new: true }
      );

      return res.status(200).json({ message: updatedProduct });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      let product = await newArrival.findById(req.params._id);
      if (!product) throw new Error("Invalid call");
      removeImage("uploads/products/", newArrival.image);
      await newArrival.findByIdAndDelete(req.params._id);

      return res
        .status(200)
        .json({ message: "Deleted Successfully", status: true });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
};

export default NewArrivalController;
