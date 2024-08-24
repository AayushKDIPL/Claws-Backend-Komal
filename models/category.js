import mongoose from "mongoose";

let validations = (type, extras) => {
  return {
    type,
    ...extras,
  };
};

const CategorySchema = mongoose.Schema(
  {
    name: { ...validations(String) },
    // image: { ...validations(String) },
    isActive: { ...validations(Boolean, { default: false }) },
    priority: { ...validations(Number, { required: true }) },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", CategorySchema);
