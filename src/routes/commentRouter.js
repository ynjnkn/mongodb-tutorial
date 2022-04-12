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
      blog: blogId,
    });
    // await Promise.all([
    //   comment.save(),
    //   Blog.findOneAndUpdate(
    //     { _id: blogId },
    //     { $push: { comments: comment } },
    //     {}
    //   ),
    // ]);

    blog.commentsCount++;
    blog.comments.push(comment);
    if (blog.comments.length > 3) {
      blog.comments.shift();
    }
    await Promise.all([comment.save(), blog.save()]);
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
    const numOfCommentsPerPage = 3;
    if (await isDeleteACommentException(commentId, res)) {
      return;
    }

    // 댓글 삭제
    const comment = await Comment.findByIdAndDelete(commentId);
    // blog의 commentsCount 업데이트
    const blog = await Blog.findById(blogId);
    blog.commentsCount -= 1;
    await blog.save();
    // blog의 comments 업데이트
    let newlyNestedComments = await Comment.find({ blog: blogId })
      .sort({
        createdAt: -1,
      })
      .limit(numOfCommentsPerPage);
    newlyNestedComments = newlyNestedComments.reverse();
    blog.comments = newlyNestedComments;
    await blog.save();
    res.status(200).send({ comment });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
    return res
      .status(500)
      .send({ error: { name: err.name, message: err.message } });
  }
});

module.exports = { commentRouter };
