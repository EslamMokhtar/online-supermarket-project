const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Product = require("../models/product");
const HttpError = require("../models/http-error");

const url =
process.env.DB_URL;

mongoose.connect(url).then(() => console.log("Connected!"));
const getProductsById = (req, res, next) => {
  const pid = req.params.pid;
  const product = products.findOne((product) => product.id === pid);

  if (!product) {
    const error = new HttpError(
      "Could not find a product for provided id.",
      404
    );
    return next(error);
  }
  res.status(200).json({ product });
};

const getProducts = async (req, res, next) => {
  const products = await Product.find({});
  if (products.length < 1) {
    const error = new HttpError("Products not found!", 404);
    return next(error);
  }

  res.status(200).json({ products });
};

const removeProduct = async (req, res, next) => {
  const pid = req.params.pid;
  const hasProduct = await Product.findOne({ _id: pid });
  if (!req.userData.admin) {
    const error = new HttpError("You not authorized", 404);
    return next(error);
  }
  if (!hasProduct) {
    const error = new HttpError(
      "Could not find a product for provided id.",
      404
    );
    return next(error);
  }
  await Product.deleteOne({ _id: pid });
  res.status(200).json({ message: `${hasProduct.title} deleted` });
};

const createProduct = async (req, res, next) => {
  if (!req.userData.admin) {
    const error = new HttpError("You not authorized", 404);
    return next(error);
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs passed!", 422);
    return next(error);
  }
  const {
    title,
    price,
    quantity,
    category,
    image,
    production,
    expire,
    freshness,
  } = req.body;
  // products.push({ id: products.length + 1, name });
  const createdProduct = new Product({
    title,
    price,
    quantity,
    category,
    image,
    production,
    expire,
    freshness,
  });
  const result = await createdProduct.save();
  res.status(201).json({ message: `${createdProduct.title} created`, result });
};

const updateProduct = async (req, res, next) => {
  if (!req.userData.admin) {
    const error = new HttpError("You not authorized", 404);
    return next(error);
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs passed!", 422);
    return next(error);
  }
  const pid = req.params.pid;
  const {
    title,
    price,
    quantity,
    category,
    image,
    production,
    expire,
    freshness,
  } = req.body;
  let updatedProduct;
  try {
    updatedProduct = await Product.findByIdAndUpdate(pid, {
      title,
      price,
      quantity,
      category,
      image,
      production,
      expire,
      freshness,
    });
  } catch (err) {
    const error = new HttpError("Could not update Product", 500);
    return next(error);
  }
  try {
    await updatedProduct.save();
  } catch (err) {
    const error = new HttpError("Could not update Product", 500);
    return next(error);
  }
  res.status(200).json({ message: `${updatedProduct.title} updated` });
};
exports.getProductsById = getProductsById;
exports.getProducts = getProducts;
exports.removeProduct = removeProduct;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
