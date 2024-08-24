import mongoose from "mongoose";

let validations = (type, extras) => {
  return {
    type,
    ...extras,
  };
};

const OrderSchema = mongoose.Schema(
  {
    productIds: [{ ...validations(mongoose.Types.ObjectId, { ref: "Product"}) }],
    userDetails: { ...validations(Object) },
    mode: {
      ...validations(String, {
        enum: ["ONLINE", "PAY_ON_DELIVERY"],
      }),
    },
    isPaid: { ...validations(Boolean, { default: false }) },
    isDelivered: { ...validations(Boolean, { default: false }) },
    totalAmount: { ...validations(Number) },
    orderId: { ...validations(String) },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
