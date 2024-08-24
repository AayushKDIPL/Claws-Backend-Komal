import mongoose from "mongoose";

let validations = (type, extras) => {
  return {
    type,
    ...extras,
  };
};

const userSchema = mongoose.Schema(
  {
    name: { ...validations(String) },
    email: { ...validations(String, { lowercase: true }) },
    role: {
      ...validations(String, {
        enum: ["ADMIN", "USER"],
        default: "USER"
      }),
    },
    password: { ...validations(String) },
    tokenVersion: { ...validations(Number, { default: 0 }) },
    resetToken: String,
    expireToken: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);