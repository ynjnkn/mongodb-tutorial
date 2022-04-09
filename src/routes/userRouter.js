// Dependencies
const { Router } = require("express");
const userRouter = Router();

// Models
const { User, Blog, Comment } = require("../models");

// Exception Handlings
const {
  isPostAUserException,
  isReadAUserException,
  isPutAUserException,
  isDeleteAUserException,
} = require("../exceptionHandlings/userExceptionHandlings");

userRouter.post("/", async (req, res) => {
  try {
    const { username, name, age, email } = req.body;
    if (await isPostAUserException(username, name, age, email, res)) {
      return;
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
    return res.status(200).send({ users });
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
    if (await isReadAUserException(userId, res)) {
      return;
    }
    const user = await User.findById(userId);
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
    const myNewUserInfo = req.body;
    const { username, name, age, email } = myNewUserInfo;
    let firstName, lastName;
    if (name) {
      [firstName, lastName] = [name.first, name.last];
    }
    if (await isPutAUserException(userId, myNewUserInfo, res)) {
      return;
    }
    const [user] = await Promise.all([
      // User 업데이트
      User.findByIdAndUpdate(userId, myNewUserInfo, {
        new: true,
      }),
      // Blog 업데이트 (username, name)
      Blog.updateMany(
        { "user._id": userId },
        {
          "user.username": username,
          "user.name": name,
        },
        {}
      ),
      // Blog의 Comment 업데이트 (userFullName)
      Blog.updateMany(
        {},
        { "comments.$[comment].userFullName": `${firstName} ${lastName}` },
        { arrayFilters: [{ "comment.user": userId }] }
      ),
      // Comment 업데이트 (userFullName)
      Comment.updateMany(
        { user: userId },
        { userFullName: `${firstName} ${lastName}` },
        {}
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
    if (await isDeleteAUserException(userId, res)) {
      return;
    }
    const user = await User.findByIdAndDelete(userId);
    return res.status(200).send({ user });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

module.exports = {
  userRouter,
};
