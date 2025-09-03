const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

// Load JWT secret from .env or fallback
const JWT_SECRET = process.env.JWT_SECRET || "masynctechKey";

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

const usersController = {
  //! Register
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Step 1: Validate required fields
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }
    console.log("Working");

    // Step 2: Check for existing user (by email or username)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    console.log("find one passed");
    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      res.status(400);
      throw new Error(`${field} already exists`);
    }

    // Step 3: Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      // Step 4: Create user
      const userCreated = await User.create({
        email,
        username,
        password: hashedPassword,
      });

      // Step 5: Send success response
      res.status(201).json({
        id: userCreated._id,
        username: userCreated.username,
        email: userCreated.email,
      });
    } catch (error) {
      // Step 6: Handle any DB/server errors
      console.error("❌ Error creating user:", error);
      res.status(500).json({
        message: "Server error while creating user",
        error: error.message || error,
      });
    }
  }),

  //! Login
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401);
      throw new Error("Invalid login credentials");
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login Success",
      token,
      id: user._id,
      username: user.username,
      email: user.email,
    });
  }),

  //! Profile
  profile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  }),

  //! Change Password
  changeUserPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;

    const user = await User.findById(req.user);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  }),

  //! Update User Profile
  updateUserProfile: asyncHandler(async (req, res) => {
    const { username, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      { username, email },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({
      message: "User profile updated successfully",
      updatedUser,
    });
  }),
};

module.exports = usersController;
