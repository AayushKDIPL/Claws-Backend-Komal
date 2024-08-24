import Subcategory from "../models/subcategory.js";
import {removeImage } from '../utils/common.js'
import Product from "../models/product.js";

const SubcategoryController = {
  getSubCategories: async (req, res) => {
    try {
      // Calculate pagination parameters
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      const ITEM_PER_PAGE = page * limit;
  
      // Find and populate subcategories
      const subCategories = await Subcategory.find({
        ...(req.query.category ? { category: req.query.category } : {}),
      })
        .sort({ priority: -1 })
        .skip(skip)
        .limit(limit)
        .populate('category');  // Populate category field
  
      // Count total subcategories
      const totalSubCategories = await Subcategory.countDocuments({
        ...(req.query.category ? { category: req.query.category } : {}),
      });
  
      // Respond with data
      res.status(200).send({
        success: true,
        message: subCategories,
        totalSubCategories,
        hasNextPage: ITEM_PER_PAGE < totalSubCategories,
        hasPreviousPage: page > 1,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },  
  getSubCategory: async (req, res) => {
    try {
      const data = await Subcategory.findById(req.params._id);
      if(!data) throw new Error("Subcategory not found");
      
      return res.status(200).json({ message: data });
    } catch (error) {
      res.status(400).json({ message: err.message });
    }
  },
  addSubCategory: async (req, res) => {
    try {
      let { name, isActive, priority, category } = req.body;
      console.log(req.body);

      // if (!req?.files?.file) throw new Error("Image Upload Error");
      // const { filename } = req?.files?.file[0];

      if (!name || !priority) throw new Error("name, priority, category is reqired !");

      const subcategory = await Subcategory.create({
        name,
        isActive,
        priority,
        category,
        // image: filename,
      });

      return res.status(200).json({ message: subcategory });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  updateSubCategory: async (req, res) => {
    try {
      let params = { ...req.body };
      if (req?.files?.file) {
        const { filename } = req?.files?.file[0];
        let subCategory = await Subcategory.findById(req.params.id);
  
        if (!subCategory) throw new Error("Invalid call");
        removeImage("uploads/subcategory/", subCategory.image);
        params["image"] = filename;
      }
  
      const updatedSubCategory = await Subcategory.findByIdAndUpdate(
        req.params.id,
        params,
        { new: true }
      );
  
      return res.status(200).json({ message: updatedSubCategory});
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  deleteSubCategory: async (req, res) => {
    try {
      let subcategory = await Subcategory.findById(req.params.id);
      if (!subcategory) throw new Error("Invalid call");
      removeImage("uploads/subcategory/", subcategory.image);
      await Subcategory.findByIdAndDelete(req.params.id);
  
      const products = await Product.find({subcategory: subcategory._id});
      products.map((prd)=>removeImage("uploads/products/", prd.image));

      await Product.deleteMany({ subcategory: subcategory._id });

      return res
        .status(200)
        .json({ message: "Deleted Successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

export default SubcategoryController;
