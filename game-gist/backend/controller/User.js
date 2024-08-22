const md5 = require("md5");
const User = require("../model/User");

const registers = async (req, res) => {
  const { username, email, password, phonenumber } = req.body;

  if (!username || !email || !password || !phonenumber) {
    return res
      .status(400)
      .json({ registerStatus: false, message: "All fields are required" });
  }

  try {
    let user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (user) {
      return res.status(200).json({
        registerStatus: false,
        message: "Email or Username already exists",
      });
    } else {
      const newUser = new User({
        email,
        username,
        password: md5(password),
        phonenumber,
      });

      await newUser.save();

      res.status(201).json({
        registerStatus: true,
        message: "Account Created successfully",
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ loginStatus: false, message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (user && user.password === md5(password)) {
      res.status(200).json({
        loginStatus: true,
        message: "Login Successful",
        user: {
          userId: user._id,
          email: user.email,
          username: user.username,
        },
      });
    } else {
      res.status(401).json({
        loginStatus: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registers, login };
