// Dependencies
const { Router } = require("express");
const commentRouter = Router({ mergeParams: true });

// Models
const { Blog } = require("../models/Blog");
const { User } = require("../models/User");

// Exception Handlings

commentRouter.post("/", async (req, res) => {
  try {
    const { blogId } = req.params;
    res.status(200).send();
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

commentRouter.get("/", async (req, res) => {
  try {
    res.status(200).send();
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

commentRouter.patch("/", async (req, res) => {
  try {
    res.status(200).send();
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

commentRouter.delete("/", async (req, res) => {
  try {
    res.status(200).send();
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

module.exports = { commentRouter };
