// Dependencies
const { Router } = require("express");
const userRouter = Router();
const mongoose = require("mongoose");

// Models
const { User } = require("../models/User");

// Exception Handlings
const {
  isInvalidUserId,
  isNotFoundUser,
  isWrongUsername,
  isWrongName,
  isWrongAge,
  isWrongEmail,
} = require("../exceptionHandlings/userExceptionHandlings");

userRouter.post("/", async (req, res) => {
  try {
    let { username, name, age, email } = req.body;

    if (await isWrongUsername(username)) {
      return res.status(400).send(await isWrongUsername(username));
    }
    if (isWrongName(name)) {
      return res.status(400).send(isWrongName(name));
    }
    if (isWrongAge(age)) {
      return res.status(400).send(isWrongAge(age));
    }
    if (await isWrongEmail(email)) {
      return res.status(400).send(await isWrongEmail(email));
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
    if (await isInvalidUserId(userId)) {
      return res.status(400).send(await isInvalidUserId(userId));
    }
    const user = await User.findById(userId);
    if (isNotFoundUser(user)) {
      return res.status(400).send(isNotFoundUser(user));
    }
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
    const myCurrentUserInfo = await User.findById(userId);

    // userId가 유효한지 확인
    if (await isInvalidUserId(userId)) {
      return res.status(400).send(await isInvalidUserId(userId));
    }
    // username 중복 확인 (단, 자신의 기존 username은 괜찮음)
    if (
      myNewUserInfo.username &&
      myNewUserInfo.username !== myCurrentUserInfo.username
    ) {
      const globalDuplicateUsername = await User.findOne({
        username: myNewUserInfo.username,
      });
      if (globalDuplicateUsername) {
        return res
          .status(400)
          .send({ error: "The provided username already exists." });
      }
    }
    // email 중복 확인 (단, 자신의 기존 email은 괜찮음)
    if (
      myNewUserInfo.email &&
      myNewUserInfo.email !== myCurrentUserInfo.email
    ) {
      const globalDuplicateEmail = await User.findOne({
        email: myNewUserInfo.email,
      });
      if (globalDuplicateEmail) {
        return res
          .status(400)
          .send({ error: "The provided email already exists." });
      }
    }
    // 새로운 username이 있는 경우? string인지 확인
    if (myNewUserInfo.username && typeof myNewUserInfo.username !== "string") {
      return res.status(400).send({ error: "Username must be a string." });
    }
    // 새로운 name이 있는 경우? string인지 확인
    if (
      myNewUserInfo.name.first &&
      myNewUserInfo.name.last &&
      (typeof myNewUserInfo.name.first !== "string" ||
        typeof myNewUserInfo.name.last !== "string")
    ) {
      return res.status(400).send({ error: "Name must be a string." });
    }
    // 새로운 age가 있는 경우? number인지 확인
    if (myNewUserInfo.age && typeof myNewUserInfo.age !== "number") {
      return res.status(400).send({ error: "Age must be a number." });
    }
    // 새로운 email이 있는 경우? string인지 확인
    if (myNewUserInfo.email && typeof myNewUserInfo.email !== "string") {
      return res.status(400).send({ error: "Email must be a string." });
    }
    // 새로운 name이 있는 경우? first, last 둘 다 있는지 확인
    if (
      myNewUserInfo.name &&
      (!myNewUserInfo.name.first || !myNewUserInfo.name.last)
    ) {
      return res
        .status(400)
        .send({ error: "Both first and last name are required." });
    }

    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });

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
    if (await isInvalidUserId(userId)) {
      return res.status(400).send({ error: "User is not found." });
    }
    const user = await User.findByIdAndDelete(userId);
    if (isNotFoundUser(user)) {
      return res.status(400).send({ error: "User is not found." });
    }
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
