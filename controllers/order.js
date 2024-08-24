import Order from "../models/order.js";
import Razorpay from "razorpay";
import Product from "../models/product.js";
import crypto from "crypto";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

const OrdersController = {
  getOrders: async (req, res) => {
    try {
      // if (!req.query.page || !req.query.limit)
      //   throw new Error("Page, Limit is required !");

      const skipUsers = (req.query.page - 1) * req.query.limit;
      const ITEM_PER_PAGE = req.query.page * req.query.limit;

      const orders = await Order.find({
        ...(req.query.isDelivered
          ? { isDelivered: req.query.isDelivered === "true" ? true : false }
          : {}),
        ...(req.query.isPaid
          ? { isPaid: req.query.isPaid === "true" ? true : false }
          : {}),
        ...(req.query.mode ? { mode: req.query.mode } : {}),
      })
        .sort({ priority: -1, createdAt: -1 })
        .skip(skipUsers)
        .limit(req.query.limit);

      const totalOrders = await Order.find({
        ...(req.query.isDelivered
          ? { isDelivered: req.query.isDelivered === "true" ? true : false }
          : {}),
        ...(req.query.isPaid
          ? { isPaid: req.query.isPaid === "true" ? true : false }
          : {}),
        ...(req.query.mode ? { mode: req.query.mode } : {}),
      }).count();

      res.status(200).send({
        succss: true,
        message: orders,
        totalOrders,
        hasNextPage: ITEM_PER_PAGE < totalOrders,
        hasPreviousPage: req.query.page > 1,
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  },
  getOrder: async (req, res) => {
    try {
      const data = await Order.findById(req.params._id);
      return res.status(200).json({ message: data });
    } catch (error) {
      res.status(400).json({ message: err.message });
    }
  },
  createOrder: async (req, res) => {
    try {
      const { productIds, userDetails, mode } = req.body;

      if (!productIds || !userDetails || !mode)
        throw new Error("productIds, userDetails and mode is required !");

      let products = await Product.find({
        _id: { $in: productIds },
      });

      const totalAmount = products.reduce((accumulator, currentProduct) => {
        return accumulator + +currentProduct.price;
      }, 0);

      if (mode === "ONLINE") {
        const options = {
          amount: totalAmount * 100,
          currency: "INR",
        };

        const response = await razorpay.orders.create(options);

        await Order.create({
          productIds,
          userDetails,
          mode,
          orderId: response.id,
          totalAmount,
        });

        return res
          .status(201)
          .json({ orderId: response.id, currency: "INR", totalAmount });
      } else {
        await Order.create({
          productIds,
          userDetails,
          mode,
          totalAmount,
        });
      }
      return res.status(201).json({ message: "Order created successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  updateOrder: async (req, res) => {
    try {
      let params = { ...req.body };

      const updatedOrder = await Order.findByIdAndUpdate(
        req.params._id,
        params,
        { new: true }
      );

      return res.status(200).json({ message: updatedOrder, status: true });
    } catch (error) {
      res.status(400).json({ message: err.message });
    }
  },
  paymentVerification: async (req, res) => {
    try {
      const { paymentId, orderId, razorpaySignature } = req.body;

      if (!paymentId || !orderId || !razorpaySignature)
        throw new Error(
          "paymentId, orderId or razorpaySignature is missing in body!"
        );

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(orderId + "|" + paymentId)
        .digest("hex");

      if (expectedSignature !== razorpaySignature)
        throw new Error("Payment Not Verifed! Something went wrong");

      await Order.findOneAndUpdate(
        {
          orderId,
        },
        {
          isPaid: true,
        }
      );

      res.status(200).json({ message: "your payment is verified" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
};

export default OrdersController;
