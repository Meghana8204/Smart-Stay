const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const otpGenerator = require("otp-generator");

const asyncHandler = require(
  "express-async-handler"
);

const sendEmail = require(
  "../utils/sendEmail"
);

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const generateOTP = () =>
  otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

const getOTPExpireTime = () =>
  new Date(Date.now() + 5 * 60 * 1000);

// Register User
const registerUser = asyncHandler(
  async (req, res) => {
    const {
      name,
      email,
      password,
    } = req.body;

    // Check existing user
    const userExists =
      await User.findOne({ email });

    if (userExists) {
      res.status(400);

      throw new Error(
        "User already exists"
      );
    }

    // Hash password
    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    // Generate OTP
    const generatedOTP =
      generateOTP();

    // OTP expiry
    const otpExpireTime =
      getOTPExpireTime();

    // Create user
    await User.create({
      name,

      email,

      password:
        hashedPassword,

      role: "customer",

      otp: generatedOTP,

      otpExpire:
        otpExpireTime,
    });

    // Send OTP email
    await sendEmail(
      email,

      "Email Verification OTP",

      `<h2>Your OTP is ${generatedOTP}</h2>`
    );

    res.status(201).json({
      success: true,

      message:
        "OTP sent to email",
    });
  }
);

const resendOTP = asyncHandler(
  async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      res.status(404);

      throw new Error(
        "User not found"
      );
    }

    if (user.isVerified) {
      res.status(400);

      throw new Error(
        "Email is already verified"
      );
    }

    const generatedOTP =
      generateOTP();

    user.otp = generatedOTP;

    user.otpExpire =
      getOTPExpireTime();

    await user.save();

    await sendEmail(
      email,

      "Email Verification OTP",

      `<h2>Your new OTP is ${generatedOTP}</h2>`
    );

    res.status(200).json({
      success: true,

      message:
        "New OTP sent to email",
    });
  }
);

// Verify OTP
const verifyOTP = asyncHandler(
  async (req, res) => {
    const { email, otp } =
      req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      res.status(404);

      throw new Error(
        "User not found"
      );
    }

    if (user.otp !== otp) {
      res.status(400);

      throw new Error(
        "Invalid OTP"
      );
    }

    if (
      user.otpExpire <
      Date.now()
    ) {
      res.status(400);

      throw new Error(
        "OTP Expired"
      );
    }

    user.isVerified = true;

    user.otp = "";

    user.otpExpire = null;

    await user.save();

    res.status(200).json({
      success: true,

      message:
        "Email verified successfully",

      token: generateToken(
        user._id
      ),
    });
  }
);

// Login User
const loginUser = asyncHandler(
  async (req, res) => {
    const {
      email,
      password,
    } = req.body;

    // Check user
    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      res.status(404);

      throw new Error(
        "User not found"
      );
    }

    // Check verification
    if (!user.isVerified) {
      res.status(400);

      throw new Error(
        "Please verify your email first"
      );
    }

    // Compare password
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      res.status(400);

      throw new Error(
        "Invalid credentials"
      );
    }

    // Generate token
    const token =
      generateToken(user._id);

    res.status(200).json({
      success: true,

      token,

      user: {
        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,
      },
    });
  }
);

// Get Profile
const getProfile = asyncHandler(
  async (req, res) => {
    res.status(200).json({
      success: true,

      user: req.user,
    });
  }
);

// Admin Dashboard
const adminDashboard =
  asyncHandler(
    async (req, res) => {
      res.status(200).json({
        success: true,

        message:
          "Welcome Admin",
      });
    }
  );

module.exports = {
  registerUser,

  verifyOTP,

  resendOTP,

  loginUser,

  getProfile,

  adminDashboard,
};
