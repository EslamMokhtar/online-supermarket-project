const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const orderControllers = require("../controllers/order-controllers");

router.get("/:uid", checkAuth, orderControllers.getOrders);
router.post("/", orderControllers.submitOrders);

module.exports = router;
