const crypto = require("crypto");
const User = require("../models/UserModel");
const { generateToken } = require("../middlewares/isAuthenticated");
const { loginRateLimiter } = require("../middlewares/RateLimits");

// Hash password function
const hashPassword = (password) => {
  const newPassword = crypto.createHash("sha256").update(password.toString()).digest("hex");
  return newPassword;
};

// Register user
exports.registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = hashPassword(password.toString());
    const newUser = new User({ username, password: hashedPassword,email });
    await newUser.save();

    const token = generateToken({
      id: newUser._id,
      username: newUser.username,
      role: newUser.role,
    });

    res.cookie("authToken", token, { httpOnly: true });

    newUser.password = undefined;

    return res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        user: newUser,
        token,
      });

  } catch (error) {
    console.log("Error registering user: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Error registering user", error });
  }
};

// Login user
exports.loginUser = [loginRateLimiter,async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = hashPassword(password);
    const user = await User.findOne({
      username,
      password: hashedPassword,
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = generateToken({
      id: user._id,
      username: user.username,
      role: user.role,
    });

    user.password = undefined;

    return res
      .status(200)
      .json({ success: true, message: "User logged in successfully", token,user });

  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error logging in user", error });
  }
}];

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, password } = req.body;
    const hashedPassword = password ? hashPassword(password) : undefined;
    const updatedData = { username };
    if (hashedPassword) {
      updatedData.password = hashedPassword;
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating user", error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    return res
      .status(200)
      .json({ success: false, message: "User deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error deleting user", error });
  }
};
