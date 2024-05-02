const User = require("../model/User");
const md5 = require("md5");

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

module.exports = { registers };
