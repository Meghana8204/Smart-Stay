const express = require("express");

const {
  createPaymentOrder,
  verifyPayment,
} = require("../controller/paymentController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/create-order",
  protect,
  createPaymentOrder
);

router.post(
  "/verify-payment",
  protect,
  verifyPayment
);

module.exports = router;