const express = require("express");

const {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  getProfile,
  adminDashboard
} = require("../controller/authController");

const { updateUserProfile } = require("../controller/userController");

const {protect,
    authorizeRoles
} = require("../middleware/authMiddleware")

const validate = require(
  "../middleware/validationMiddleware"
);

const {
  registerValidation,
  loginValidation,
} = require(
  "../validators/authValidator"
);

const router = express.Router();

router.post(
  "/register",

  registerValidation,

  validate,

  registerUser
);

router.post("/verify-otp", verifyOTP);

router.post("/resend-otp", resendOTP);

router.post(
  "/login",

  loginValidation,

  validate,

  loginUser
);

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateUserProfile);

router.get(
  "/admin-dashboard",
  protect,
  authorizeRoles("admin"),
  adminDashboard
);

module.exports = router;
