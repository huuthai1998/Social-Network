const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  avatar: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/social-network-7adcb.appspot.com/o/Avatar%2Fdefavata.jpg?alt=media&token=3a7cc52c-166c-407e-894b-fc63c8b56a73",
  },
});
module.exports = mongoose.model("User", userSchema);
