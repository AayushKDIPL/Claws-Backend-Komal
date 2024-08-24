import express from "express";
import OrdersController from "../controllers/order.js";

export const router = express.Router();

router.get("/", OrdersController.getOrders);
router.get("/:_id", OrdersController.getOrder);// Done
router.post("/create", OrdersController.createOrder);// Done
router.patch("/:_id", OrdersController.updateOrder);// Done
router.post("/payment/verify", OrdersController.paymentVerification);


