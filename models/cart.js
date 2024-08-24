import mongoose from "mongoose";
let validations = (type, extras) => {
  return {
    type,
    ...extras,
  };
};

const CartSchema = mongoose.Schema(
  {
    id: { ...validations(mongoose.Types.ObjectId, { ref: "Product"}) },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", CartSchema);
