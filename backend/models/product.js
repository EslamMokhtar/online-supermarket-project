const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  production: { type: Date, required: true },
  expire: { type: Date, required: true },
});

module.exports = mongoose.model("Product", productSchema);
