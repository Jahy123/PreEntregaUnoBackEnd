const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true,
  },
  age: {
    type: Number,
    // required: true,
  },
  rol: {
    type: String,
    default: "user",
  },
  cart: { type: Schema.Types.ObjectId, ref: "Cart" },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
