const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userSchema = require("../schemas/userSchema");
const User = mongoose.model("User", userSchema);

router.post("/signUp", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
      status: req.body.status,
    });
    const userData = await newUser.save();
    res.status(200).json({
      message: "user sign up successful",
      userData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (user && user.length > 0) {
      const isValidPass = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (isValidPass) {
        const token = jwt.sign(
          {
            userName: user[0].userName,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1hr" }
        );
        res.status(200).json({
          message: "authentication successful",
          access_Token: token,
        });
      } else {
        throw new Error("authentication failed!");
      }
    } else {
      res.status(500).json({
        message: "user is not found",
      });
    }
  } catch (err) {
    res.status(401).json({
      message: err.message,
    });
  }
});

module.exports = router;
