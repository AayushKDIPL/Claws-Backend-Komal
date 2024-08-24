import mongoose from "mongoose";
let validations = (type, extras) => {
  return {
    type,
    ...extras,
  };
};

const newArrivalSchema = mongoose.Schema(
  {
    name: { ...validations(String) },
    description: { ...validations(String) },
    mrp: { ...validations(Number) },
    price: { ...validations(Number) },
    images: [{ ...validations(String) }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("New Arrival", newArrivalSchema);
