const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

const url = process.env.DB_URL;
mongoose.connect(url).then(() => console.log("Connected!"));

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new HttpError(
      "We cannot find an account with that email address",
      401
    );
    return next(error);
  }
  let match;
  try {
    match = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new HttpError("Can't login, try again", 500);
    return next(error);
  }
  if (!match) {
    const error = new HttpError("Invalid email or password", 401);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        admin: user.admin,
        email: user.email,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Logging in failed, try again later", 500);
    return next(error);
  }
  res.status(200).json({ user, token });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs passed!", 422);
    return next(error);
  }
  const { name, email, password } = req.body;
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user, try again", 500);
    return next(error);
  }
  const hasUser = await User.findOne({ email });

  if (hasUser) {
    const error = new HttpError("Email already exists!", 422);
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    orders: [],
  });
  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError(
      "Can't create user right now, try again later",
      500
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: newUser.id,
        name: newUser.name,
        admin: newUser.admin,
        email: newUser.email,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Can't create user right now, try again later",
      500
    );
    return next(error);
  }
  res.status(201).json({ userId: newUser.id, token });
};

const checkAdmin = (req, res, next) => {
  if (req.userData.admin) {
    return res.status(200).json({ admin: true });
  }
  res.status(200).json({ admin: false });
};
exports.checkAdmin = checkAdmin;
exports.login = login;
exports.signup = signup;
