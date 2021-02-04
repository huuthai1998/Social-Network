var User = require("../models/user");
var express = require("express");
const { createToken, isAuthenticate, checkPassword } = require("../utils/auth");
var router = express.Router();

router.get("/profile/:id", async (req, res) => {
  try {
    User.findById(req.params.id).then((data) => res.send(data));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

router.put("/:id", isAuthenticate, checkPassword, async (req, res) => {
  const { name, username, address, email, newPassword } = req.body;
  try {
    if (newPassword === undefined)
      await User.findOneAndUpdate(
        { username },
        { $set: { name, username, address, email } }
      ).then((data) => res.send(data));
    else {
      await User.findOneAndUpdate(
        { username },
        { $set: { password: newPassword } }
      ).then((data) => res.send(data));
    }
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
});

router.put("/avatar/:id", isAuthenticate, async (req, res) => {
  const { avatar } = req.body;
  console.log(avatar);
  try {
    await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { avatar } }
    ).then((data) => {
      data.avatar = avatar;
      res.send(data);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
});

router.get("/verifyLogin", isAuthenticate, (req, res) => {
  res.send({ isAuth: true });
});

router.post("/signIn", async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [
        { email: req.body.username, password: req.body.password },
        { username: req.body.username, password: req.body.password },
      ],
    });
    if (user) {
      res.send({
        _id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        isAdmin: user.isAdmin,
        address: user.address,
        token: createToken(user),
        avatar: user.avatar,
      });
    } else {
      res.status(401).send({});
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post("/signUp", async (req, res) => {
  try {
    let user = {
      ...req.body,
      isAdmin: false,
    };
    const { _doc } = await User.create(user);
    user = { ..._doc, token: createToken(req.body) };
    console.log(user);
    res.status(201).send(user);
  } catch (err) {
    console.log(err);
    res.status(401).send({ msg: err.message });
  }
});

module.exports = router;
