const md5 = require("md5");
const User = require("../model/User");

const registers = async (req, res) => {
  const { username, email, password, phonenumber } = req.body;
  try {
    let user = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (user) {
      res.status(200).json({
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
      newUser.save().then(() => {
        res.json({
          registerStatus: true,
          message: "Account Created successfully",
        });
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && user.password === md5(password)) {
      // Extract the _id from the user document and include it in the response
      res.json({
        loginStatus: true,
        message: "Login Successful",
        user: {
          id: user._id, // Explicitly add the _id field as id
          email: user.email,
          username: user.username,
          // add any other fields you want to return
        },
      });
    } else {
      res.status(200).json({
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
