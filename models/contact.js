import mongoose from "mongoose";
let validations = (type, extras) => {
  return {
    type,
    ...extras,
  };
};

const ContactSchema = mongoose.Schema(
  {
    name: { ...validations(String) },
    number: { ...validations(String) },
    email: { ...validations(String) },
    message: { ...validations(String) },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Contact", ContactSchema);
