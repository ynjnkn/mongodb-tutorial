// Dependencies
const { Router } = require("express");
const commentRouter = Router({ mergeParams: true });

// Models
const { Blog } = require("../models/Blog");
const { User } = require("../models/User");
const { Comment } = require("../models/Comment");

// Exception Handlings
const {
  isPostACommentException,
  isReadAllCommentsExceptions,
} = require("../exceptionHandlings/commentExecptionHandlings");

commentRouter.post("/", async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content, userId } = req.body;
    if (await isPostACommentException(blogId, userId, content, res)) {
      return;
    }
    const [user, blog] = await Promise.all([
      User.findById(userId),
      Blog.findById(blogId),
    ]);
    let comment = new Comment({
      content,
      user,
      blog,
    });
    await comment.save();
    res.status(200).send({ comment });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

commentRouter.get("/", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (await isReadAllCommentsExceptions(blogId, res)) {
      return;
    }
    const comments = await Comment.find({ blog: blogId });
    res.status(200).send({ comments });
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
