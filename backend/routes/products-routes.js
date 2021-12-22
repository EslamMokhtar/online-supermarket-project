const express = require("express");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");
const productsControllers = require("../controllers/product-controllers");
const router = express.Router();

router.get("/:pid", productsControllers.getProductsById);
router.get("/", productsControllers.getProducts);
router.use(checkAuth);
router.delete("/:pid", productsControllers.removeProduct);
router.post(
  "/",
  [check("title").not().isEmpty(), check("title").isLength({ min: 3 })],
  productsControllers.createProduct
);
router.patch(
  "/:pid",
  [check("title").not().isEmpty()],
  productsControllers.updateProduct
);

module.exports = router;
