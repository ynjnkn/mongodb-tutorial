const { Router } = require("express");
const userRouter = Router();
const mongoose = require("mongoose");
const { User, Blog, Comment } = require("../models/");

userRouter.post("/", async (req, res) => {
  try {
    let { username, name } = req.body;
    if (!username) {
      return res.status(400).send({ error: "Username is required." });
    }
    if (!name || !name.first || !name.last) {
      return res
        .status(400)
        .send({ error: "Both first and last name are required." });
    }
    const user = new User(req.body);
    await user.save();
    return res.status(201).send({ user });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ users });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

userRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ error: "invalid userId" });
    const user = await User.findOne({ _id: userId });
    return res.status(200).send({ user });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

userRouter.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, name, age, email } = req.body;
    const [firstName, lastName] = [name.first, name.last];

    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ error: "invalid userId" });
    if (!username)
      return res.status(400).send({ error: "Username is required." });
    if (typeof username !== "string")
      return res.status(400).send({ error: "Username must be a string." });
    // 나머지 name, age, email에 대해서도 1) 해당 값들이 있는지 2) 데이터 타입이 올바른지 확인 필요

    // let user = await User.findById(userId);
    const [user] = await Promise.all([
      User.findOneAndUpdate(
        { _id: userId },
        {
          username: username,
          "name.first": firstName,
          "name.last": lastName,
          age: age,
          email: email,
        },
        { new: true }
      ),
      Blog.updateMany(
        { "user._id": userId },
        {
          "user.username": username,
          "user.name": name,
        }
      ),
      Blog.updateMany(
        {},
        { "comments.$[comment].userFullName": `${firstName} ${lastName}` },
        { arrayFilters: [{ "comment.user": userId }] }
      ),
      Comment.updateMany(
        { user: userId },
        { userFullName: `${firstName} ${lastName}` }
      ),
    ]);

    return res.status(200).send({ user });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

userRouter.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ error: "invalid userId" });
    const [user] = await Promise.all([
      User.findOneAndDelete({ _id: userId }),
      Blog.deleteMany({ "user._id": userId }),
      Blog.updateMany(
        { "comments.user": userId },
        { $pull: { comments: { user: userId } } }
      ),
      Comment.deleteMany({ user: userId }),
    ]);
    if (!user) {
      return res.status(400).send({ error: "invalid userId" });
    }
    return res.status(200).send({ user });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

module.exports = { userRouter };
