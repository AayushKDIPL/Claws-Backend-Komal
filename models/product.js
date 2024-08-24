import mongoose from "mongoose";
let validations = (type, extras) => {
  return {
    type,
    ...extras,
  };
};

const ProductSchema = mongoose.Schema(
  {
    name: { ...validations(String) },
    description: { ...validations(String) },
    // mrp: { ...validations(Number, { default: false }) },
    colors:[{ ...validations(String, { default: false }) }],
    price: { ...validations(Number) },
    images: [{ ...validations(String) }],
    subcategory: { ...validations(mongoose.Types.ObjectId, { ref: "Subcategory"}) },
    // isActive: { ...validations(Boolean, { default: false }) },
    priority: { ...validations(Number, { required: true }) },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", ProductSchema);
