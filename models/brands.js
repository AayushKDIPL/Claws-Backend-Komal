import mongoose from "mongoose";
let validations = (type, extras) => {
  return {
    type,
    ...extras,
  };
};

const BrandsSchema = mongoose.Schema(
  {
    images: [{ ...validations(String) }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Brands", BrandsSchema);
