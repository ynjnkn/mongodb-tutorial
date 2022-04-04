// Dependencies
const { Router } = require("express");
const userRouter = Router();
const mongoose = require("mongoose");

// Models
const { User } = require("../models/User");

userRouter.post("/", async (req, res) => {
  try {
    let { username, name } = req.body;
    if (!username)
      return res.status(400).send({ error: "Username is required." });
    if (!name || !name.first || !name.last)
      return res
        .status(400)
        .send({ error: "Both first and last name are required." });
    const user = new User(req.body);
    await user.save();
    return res.status(201).send({ user });
  } catch (error) {
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
  } catch (error) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

module.exports = { userRouter };
