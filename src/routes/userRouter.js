// Dependencies
const { Router } = require("express");
const userRouter = Router();

// Models
const { User } = require("../models/User");

// Exception Handlings
const {
  isCreateAUserException,
  isReadAUserException,
  isPutAUserException,
  isDeleteAUserException,
} = require("../exceptionHandlings/userExceptionHandlings");

userRouter.post("/", async (req, res) => {
  try {
    const { username, name, age, email } = req.body;
    await isCreateAUserException(username, name, age, email, res);
    if (await isCreateAUserException(username, name, age, email, res)) {
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
    if (await isPutAUserException(userId, myNewUserInfo, res)) {
      return;
    }
    const user = await User.findByIdAndUpdate(userId, myNewUserInfo, {
      new: true,
    });
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
