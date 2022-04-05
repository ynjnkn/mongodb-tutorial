// Dependencies
const { Router } = require("express");
const blogRouter = Router();

// Models
const { Blog } = require("../models/Blog");
const { User } = require("../models/User");

// Exception Handlings
const {
  isCreateABlogException,
  isReadABlogException,
  isPutABlogException,
  isPatchABlogException,
} = require("../exceptionHandlings/blogExceptionHandlings");

blogRouter.post("/", async (req, res) => {
  try {
    const { title, content, isLive, userId } = req.body;
    if (await isCreateABlogException(title, content, isLive, userId, res)) {
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
    const blogs = await Blog.find({});
    return res.status(200).send({ blogs });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

blogRouter.get("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (await isReadABlogException(blogId, res)) {
      return;
    }
    const blog = await Blog.findById(blogId);
    return res.status(200).send({ blog });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

blogRouter.put("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, content } = req.body;
    if (await isPutABlogException(blogId, title, content, res)) {
      return;
    }
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { title, content },
      { new: true }
    );
    return res.status(200).send({ blog });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

blogRouter.patch("/:blogId/live", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (await isPatchABlogException(blogId, res)) {
      return;
    }
    let blog = await Blog.findById(blogId);
    if (blog.isLive === true) {
      blog.isLive = false;
    } else {
      blog.isLive = true;
    }
    await blog.save();
    return res.status(200).send({ blog });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

module.exports = { blogRouter };
