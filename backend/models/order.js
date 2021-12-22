const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    items: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        _id: { required: false },
      },
    ],
    total: { type: Number, required: true },
  },
  { timestamps: { createdAt: "createdAt" } }
);

module.exports = mongoose.model("Order", orderSchema);
