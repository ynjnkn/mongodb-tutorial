// Dependencies
const { Router } = require("express");
const blogRouter = Router();

// Models
const { User, Blog, Comment } = require("../models");

// Exception Handlings
const {
  isPostABlogException,
  isReadABlogException,
  isPutABlogException,
  isPatchABlogException,
} = require("../exceptionHandlings/blogExceptionHandlings");

blogRouter.post("/", async (req, res) => {
  try {
    const { title, content, isLive, userId } = req.body;
    if (await isPostABlogException(title, content, isLive, userId, res)) {
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
    let { page = 1 } = req.query;
    if (!page) throw new Error("Page is not defined for pagination.");
    page = parseInt(page);
    const numOfBlogsPerPage = 3;
    let blogs = await Blog.find({})
      .sort({ updatedAt: -1 })
      .skip((page - 1) * numOfBlogsPerPage)
      .limit(numOfBlogsPerPage);
    blogs = await Promise.all(
      blogs.map(async (blog) => {
        blog = blog.toObject();
        const commentCount = await Comment.find({
          blog: blog._id,
        }).countDocuments();
        return { ...blog, commentCount: commentCount };
      })
    );
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
    // const commentCount = await Comment.find({ blog: blogId }).countDocuments();
    // return res.status(200).send({ blog, commentCount });
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
