const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    authorAvatar: {
      type: String,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const likeSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: { type: String },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    like: Boolean,
    author: {
      type: String,
    },
    authorAvatar: {
      type: String,
    },
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    likers: {
      type: [likeSchema],
      default: [],
      required: true,
    },
    likes: { type: Number, default: 0 },
    comments: { type: [commentSchema], default: [], required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", postSchema);
