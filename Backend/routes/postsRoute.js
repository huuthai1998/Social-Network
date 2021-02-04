var User = require("../models/user");
var Post = require("../models/post");
var express = require("express");
const { isAuthenticate } = require("../utils/auth");
var router = express.Router();

router.get("/", async (req, res) => {
  try {
    Post.find({}).then(async (data) => {
      for (var i = 0; i < data.length; ++i) {
        const author = await User.findOne({ _id: data[i].user });
        data[i].authorAvatar = author.avatar;
        data[i].like =
          data[i].likers.find(
            (l) => String(l.userID) === String(req.query.user)
          ) !== undefined;
        for (var j = 0; j < data[i].comments.length; ++j) {
          const commentator = await User.findOne({
            _id: data[i].comments[j].user,
          });
          data[i].comments[j].authorAvatar = commentator.avatar;
        }
      }
      res.send(data);
    });
  } catch (err) {
    console.log(err.message);
    res.status(404).send(err.message);
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    console.log(req.query);
    Post.find({ user: req.params.id }).then(async (data) => {
      for (var i = 0; i < data.length; ++i) {
        const author = await User.findOne({ _id: data[i].user });
        data[i].authorAvatar = author.avatar;
        data[i].like =
          data[i].likers.find(
            (l) => String(l.userID) === String(req.query.user)
          ) !== undefined;
        for (var j = 0; j < data[i].comments.length; ++j) {
          const commentator = await User.findOne({
            _id: data[i].comments[j].user,
          });
          data[i].comments[j].authorAvatar = commentator.avatar;
        }
      }
      res.send(data);
    });
  } catch (err) {
    console.log(err.message);
    res.status(404).send(err.message);
  }
});

router.get("/:id", isAuthenticate, async (req, res) => {
  try {
    const _id = req.params.id;
    Post.find({ user: _id }).then((data) => res.send(data));
  } catch (err) {
    console.log(err.message);
    res.status(404).send(err.message);
  }
});

router.post("/", isAuthenticate, async (req, res) => {
  try {
    var post = await Post.create(req.body.post);
    res.send(post);
  } catch (err) {
    console.log(err.message);
    res.status(404).send(err.message);
  }
});

router.put("/like/:id", isAuthenticate, async (req, res) => {
  try {
    const { likes, likers } = req.body;
    await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { likers, likes } }
    );
    res.send({ message: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(404).send(err.message);
  }
});

router.put("/:id", isAuthenticate, async (req, res) => {
  try {
    const data = await Post.findOneAndUpdate(
      { _id: req.params.id },
      req.body.post,
      { new: true }
    );
    data.like = req.body.post.like;
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

router.post("/comments/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    post.comments.push(req.body.comment);
    await post.save();
    res.send(post);
  } catch (err) {
    console.log(err);
    res.send({ msg: err.message });
  }
});

module.exports = router;
