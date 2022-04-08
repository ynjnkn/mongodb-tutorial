// Dependencies
const { Router } = require("express");
const commentRouter = Router({ mergeParams: true });

// Models
const { User, Blog, Comment } = require("../models");

// Exception Handlings
const {
  isPostACommentException,
  isReadAllCommentsExceptions,
  isPatchACommentException,
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
      userFullName: `${user.name.first} ${user.name.last}`,
      blog,
    });
    await Promise.all([
      comment.save(),
      Blog.findOneAndUpdate(
        { _id: blogId },
        { $push: { comments: comment } },
        {}
      ),
    ]);
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
    const comments = await Comment.find({ blog: blogId }).limit(20);
    res.status(200).send({ comments });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

commentRouter.patch("/:commentId", async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const { content } = req.body;
    if (await isPatchACommentException(content, res)) {
      return;
    }
    const [comment, blog] = await Promise.all([
      Comment.findByIdAndUpdate(commentId, { content }, { new: true }),
      Blog.findOneAndUpdate(
        { "comments._id": commentId },
        { "comments.$.content": content },
        {}
      ),
    ]);
    res.status(200).send({ comment });
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
