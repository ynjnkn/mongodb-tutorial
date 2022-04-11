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
  isDeleteACommentException,
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
    // await Promise.all([
    //   comment.save(),
    //   Blog.findOneAndUpdate(
    //     { _id: blogId },
    //     { $push: { comments: comment } },
    //     {}
    //   ),
    // ]);
    await Promise.all([
      comment.save(),
      Blog.updateOne(
        { _id: blogId },
        { $inc: { commentsCount: 1 } },
        { new: true }
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
    let { page = 1 } = req.query;
    if (!page) throw new Error("Page is not defined for pagination.");
    const numOfCommentsPerPage = 3;
    if (await isReadAllCommentsExceptions(blogId, res)) {
      return;
    }
    const comments = await Comment.find({ blog: blogId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * numOfCommentsPerPage)
      .limit(numOfCommentsPerPage);
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

commentRouter.delete("/:commentId", async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    if (await isDeleteACommentException(commentId, res)) {
      return;
    }
    const [comment] = await Promise.all([
      Comment.findByIdAndDelete(commentId),
      Blog.findOneAndUpdate(
        { _id: blogId },
        { $inc: { commentsCount: -1 } },
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

module.exports = { commentRouter };
