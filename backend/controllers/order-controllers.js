const mongoose = require("mongoose");
const User = require("../models/user");
const Order = require("../models/order");
const Product = require("../models/product");
const HttpError = require("../models/http-error");

const url = process.env.DB_URL;
mongoose.connect(url).then(() => console.log("Connected!"));

const getOrders = async (req, res, next) => {
  const uid = req.params.uid;
  let orders;
  if (req.userData.admin) {
    try {
      orders = await Order.find({})
        .sort({ createdAt: -1 })
        .populate("creator", "name email");
    } catch (err) {
      const error = new HttpError("Can't get orders", 500);
      return next(error);
    }

    return res.status(200).json({ orders });
  }

  try {
    orders = await Order.find({ creator: uid })
      .sort({ createdAt: -1 })
      .populate("creator", "name email");
  } catch (err) {
    const error = new HttpError("Can't get order", 500);
    return next(error);
  }
  res.status(200).json({ orders });
};

const submitOrders = async (req, res, next) => {
  const { id, items, total } = req.body;
  let result;
  let check = false;

  const arrayOfIdsForCheck = [];
  items.map((item) =>
    arrayOfIdsForCheck.push(mongoose.Types.ObjectId(item.id))
  );
  const productsForCheck = await Product.find({
    _id: { $in: arrayOfIdsForCheck },
  });
  items.map((item, index) => {
    productsForCheck[index].quantity =
      productsForCheck[index].quantity - item.quantity;
    if (productsForCheck[index].quantity < 1) {
      check = true;
    }
  });

  if (check) {
    const error = new HttpError(
      "Can't submit the order, insufficient quantity",
      422
    );
    return next(error);
  }

  try {
    const creator = await User.findOne({ _id: mongoose.Types.ObjectId(id) });
    const newOrder = new Order({
      creator: mongoose.Types.ObjectId(creator),
      items,
      total,
    });

    creator.orders.push(newOrder);
    await creator.save();
    result = await newOrder.save();
    const arrayOfIds = [];
    items.map((item) => arrayOfIds.push(mongoose.Types.ObjectId(item.id)));
    const products = await Product.find({ _id: { $in: arrayOfIds } });
    items.map((item, index) => {
      products[index].quantity = products[index].quantity - item.quantity;
      products[index].save();
    });
  } catch (err) {
    const error = new HttpError(
      "Can't submit the order, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ result });
};

exports.getOrders = getOrders;
exports.submitOrders = submitOrders;
