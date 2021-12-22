const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const userControllers = require("../controllers/user-controllers");
const checkAuth = require("../middleware/check-auth");

router.post("/login", userControllers.login);
router.post(
  "/signup",
  [
    check("email").normalizeEmail().isEmail(),
    check("name").not().isEmpty(),
    check("password").isLength({ min: 6 }),
  ],
  userControllers.signup
);
router.get("/check", checkAuth, userControllers.checkAdmin);

module.exports = router;
