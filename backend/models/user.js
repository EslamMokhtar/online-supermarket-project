const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
  orders: [{ type: mongoose.Types.ObjectId, required: true, ref: "Order" }],
});
// userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
