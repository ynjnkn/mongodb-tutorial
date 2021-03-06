const { Router } = require("express");
const commentRouter = Router({ mergeParams: true });
const { isValidObjectId, startSession } = require("mongoose");
const { Blog, User, Comment } = require("../models/");

commentRouter.post("/", async (req, res) => {
  // const session = await startSession();
  try {
    let comment;
    // await session.withTransaction(async () => {
    const { blogId } = req.params;
    const { content, userId } = req.body;
    const [blog, user] = await Promise.all([
      Blog.findById(blogId, {}, {}),
      User.findById(userId, {}, {}),
    ]);
    // const [blog, user] = await Promise.all([
    //   Blog.findById(blogId, {}, { session }),
    //   User.findById(userId, {}, { session }),
    // ]);

    if (!blogId) return res.status(400).send({ error: "blogId is required." });
    if (!isValidObjectId(blogId))
      return res.status(400).send({ error: "The provided blogId is invalid." });
    if (!blog) return res.status(400).send({ error: "Blog is not found." });
    if (!userId) return res.status(400).send({ error: "userId is required." });
    if (!isValidObjectId(userId))
      return res.status(400).send({ error: "The provided userId is invalid." });
    if (!user) return res.status(400).send({ error: "User is not found" });
    if (!content)
      return res.status(400).send({ error: "Content is required." });
    if (typeof content !== "string")
      return res.status(400).send({ error: "Content must be a string." });
    if (!blog.isLive)
      return res.status(400).send({ error: "Blog is not available." });

    comment = new Comment({
      content,
      user,
      userFullName: `${user.name.first} ${user.name.last}`,
      blog: blogId,
    });
    //   await session.abortTransaction()

    // await Promise.all([
    //     comment.save(),
    //     Blog.updateOne({ _id: blogId }, { $push: { comments: comment } }), // 생성되는 comment가 속한 blog 객체에 내장
    // ]);

    // 백엔드 서버에서 내장된 comments 수정
    /*
    blog.commentsCount++;
    blog.comments.push(comment);
    if (blog.commentsCount > 3) {
      blog.comments.shift();
    }

    await Promise.all([
      // comment.save({ session }),
      comment.save(),
      blog.save(),
      //   Blog.updateOne(
      //     { _id: blogId },
      //     { $inc: { commentsCount: 1 } },
      //     { new: true }
      //   ),
    ]);
    */

    // });

    await Promise.all([
      comment.save(),
      Blog.updateOne(
        { _id: blogId },
        {
          $inc: { commentsCount: 1 },
          $push: { comments: { $each: [comment], $slice: -3 } },
        }
      ),
    ]);

    return res.status(200).send({ comment });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  } finally {
    // await session.endSession();
  }
});

commentRouter.get("/", async (req, res) => {
  try {
    let { page = 1 } = req.query;
    page = parseInt(page);
    const numOfCommentsPerPage = 3;
    const { blogId } = req.params;

    const comments = await Comment.find({ blog: blogId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * numOfCommentsPerPage) // 1페이지부터 시작
      .limit(numOfCommentsPerPage);

    return res.status(200).send({ comments });
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

    if (!content)
      return res.status(400).send({ error: "Content is required." });
    if (typeof content !== "string")
      return res.status(400).send({ error: "Content must be a string." });

    const [comment, blog] = await Promise.all([
      Comment.findOneAndUpdate({ _id: commentId }, { content }, { new: true }),
      Blog.updateOne(
        { "comments._id": commentId },
        { "comments.$.content": content }
      ),
    ]);

    return res.status(200).send({ comment });
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

    const [comment] = await Promise.all([
      Comment.findByIdAndDelete(commentId),
      //   Blog.updateOne(
      //     { "comments._id": commentId },
      //     { $pull: { comments: { _id: commentId } } }
      //   ),
      Blog.updateOne({ _id: blogId }, { $inc: { commentsCount: -1 } }),
    ]);

    if (!comment)
      return res
        .status(400)
        .send({ error: "The attempted comment is not found." });

    return res.status(200).send({ comment });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

module.exports = { commentRouter };
