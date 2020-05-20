const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const customError = require("../helpers/customError");
const User = require("../Models/userModel");
const { JWT_SECRET } = require("../helpers/envChecker");
const { compare } = require("../helpers/hashing");
const {
  userRegistrationRules,
  validate,
  existenceValidator,
} = require("../middleware/validator");

//get user profile

router.get("/:id", async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId });
  if (!user)
    throw new customError({
      message: "user does not exist",
      status: 404,
    });
  else {
    const instance = _.omit(user.toJSON(), "password");
    //todo check if user has token to view/not view follow button
    //todo populate
    return res.status(200).send(instance);
  }
});

//register
router.post(
  "/register",
  userRegistrationRules("username", "password"),
  validate,
  async (req, res, next) => {
    try {
      const {
        body: { username, password, name },
      } = req;
      const newUser = new User({
        username: username,
        password: password,
        name: name,
      });
      //sanitize
      const createdUser = await newUser.save();
      const instance = _.omit(createdUser.toJSON(), "password");
      return res.status(201).send(instance);
    } catch (error) {
      next(error);
    }
  }
);

//login
router.post(
  "/login",
  existenceValidator("username", "password"),
  async (req, res, next) => {
    const {
      body: { username, password },
    } = req;
    try {
      const user = await User.findOne({ username });
      if (!user)
        throw new customError({
          message: "user does not exist",
          status: 404,
        });

      const isMatch = await compare(password, user.password);

      if (isMatch) {
        //generate token
        jwt.sign(
          { username },
          JWT_SECRET,
          { expiresIn: "60 days" },
          (err, token) => {
            if (err) throw new customError({ message: "problem signing in" });
            return res.status(200).send(token);
          }
        );
      } else {
        throw new Error("either un or pw is wrong");
      }
    } catch (Error) {
      next(Error.message);
    }
  }
);
module.exports = router;
