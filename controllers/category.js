import Category from "../models/category.js";
import Subcategory from "../models/subcategory.js";
import {removeImage } from '../utils/common.js'
import Product from "../models/product.js"

const CategoryController = {
  getCategories: async (req, res) => {
    try {
      // if (!req.query.page || !req.query.limit)
      //   throw new Error("Page or Limit is required !");

      const skipUsers = (req.query.page - 1) * req.query.limit;
      const ITEM_PER_PAGE = req.query.page * req.query.limit;

      const categories = await Category.find()
        .sort({ priority: -1 })
        .skip(skipUsers)
        .limit(req.query.limit);

      const totalCategories = await Category.find().count();

      res.status(200).send({
        succss: true,
        message: categories,
        totalCategories,
        hasNextPage: ITEM_PER_PAGE < totalCategories,
        hasPreviousPage: req.query.page > 1,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getCategory: async (req, res) => {
    try {
      const data = await Category.findById(req.params._id);
      if(!data) throw new Error("Category not found");
      
      return res.status(200).json({ message: data });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  addCategory: async (req, res) => {
    try {
      let { name, isActive, priority } = req.body;

      // if (!req?.files?.file) throw new Error("Image Upload Error");
      // const { filename } = req?.files?.file[0];

      if (!name || !priority)
        throw new Error("name, priority and image is reqired !");

      const category = await Category.create({
        name,
        isActive,
        priority,
        // image: filename,
      });

      return res.status(200).json({ message: category });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      let params = { ...req.body };
      // if (req?.files?.file) {
      //   const { filename } = req?.files?.file[0];
      //   let category = await Category.findById(req.params.id);
  
      //   if (!category) throw new Error("Invalid call");
      //   removeImage("uploads/category/", category.image);
      //   params["image"] = filename;
      // }
  
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params._id,
        params,
        { new: true }
      );
  
      return res.status(200).json({ message: updatedCategory});
    } catch (error) {
      res.status(400).json({ message: err.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      let category = await Category.findById(req.params._id);
      if (!category) throw new Error("Invalid call");
      removeImage("uploads/category/", category.image);
      await Category.findByIdAndDelete(req.params.id);

      const subcategories = await Subcategory.find({category: category._id});
      await Promise.all(subcategories.map(async (subcat) => {
        removeImage("uploads/subcategory/", subcat.image);
        const products = await Product.find({subcategory: subcat._id});
        products.map((prd)=>removeImage("uploads/products/", prd.image));

        await Product.deleteMany({ subcategory: subcat._id });
      }))
      await Subcategory.deleteMany({category: category._id});

      return res
        .status(200)
        .json({ message: "Deleted Successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

export default CategoryController;
