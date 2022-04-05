// Dependencies
const { Router } = require("express");
const blogRouter = Router();

// Models
const { Blog } = require("../models/Blog");
const { User } = require("../models/User");

// Exception Handlings
const {
  isExceptionCreateABlog,
} = require("../exceptionHandlings/blogExceptionHandlings");

blogRouter.post("/", async (req, res) => {
  try {
    const { title, content, isLive, userId } = req.body;
    if (await isExceptionCreateABlog(title, content, isLive, userId, res)) {
      return;
    }
    const user = await User.findById(userId);
    let blog = new Blog({ ...req.body, user });
    await blog.save();
    return res.status(200).send({ blog });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

blogRouter.get("/", async (req, res) => {
  try {
    return res.status(200).send();
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

blogRouter.get("/:blogId", async (req, res) => {
  try {
    return res.status(200).send();
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

blogRouter.put("/:blogId", async (req, res) => {
  try {
    return res.status(200).send();
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

blogRouter.patch("/:blogId/live", async (req, res) => {
  try {
    return res.status(200).send();
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

module.exports = { blogRouter };
