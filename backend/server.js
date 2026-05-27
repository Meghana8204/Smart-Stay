const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const hotelRoutes = require("./routes/hotelRoutes");
const roomRoutes = require("./routes/roomRoutes")
const bookingRoutes = require("./routes/bookingRoutes")
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishlistRoutes = require(
  "./routes/wishlistRoutes"
);

const {
  notFound,
  errorHandler,
} = require(
  "./middleware/errorMiddleware"
);

const connectDB = require("./config/db");
const seedAdmin = require("./adminSeeder");
const authRoutes = require("./routes/authRoutes");

connectDB();
seedAdmin();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));



app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use(
  "/api/wishlist",
  wishlistRoutes
)

app.get("/", (req, res) => {
  res.send("SmartStay API Running");
});

app.use(notFound);

app.use(errorHandler);





const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});