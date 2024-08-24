import mongoose from "mongoose";

let validations = (type, extras) => {
  return {
    type,
    ...extras,
  };
};

const SubCategorySchema = mongoose.Schema(
  {
    name: { ...validations(String) },
    // image: { ...validations(String) },
    isActive: { ...validations(Boolean, { default: false }) },
    priority: { ...validations(Number, { required: true }) },
    category: { ...validations(mongoose.Types.ObjectId, { ref: "Category"}) },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Subcategory", SubCategorySchema);
