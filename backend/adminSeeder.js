const bcrypt = require("bcryptjs");
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    // Check admin already exists
    const adminExists = await User.findOne({
      email: "admin@gmail.com",
    });

    if (adminExists) {
      console.log("Admin already exists");
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      "admin123",
      salt
    );

    // Create admin
    await User.create({
      name: "Admin",

      email: "admin@gmail.com",

      password: hashedPassword,

      role: "admin",

      isVerified: true,
    });

    console.log("Admin created successfully");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = seedAdmin;