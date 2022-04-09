// Dependencies
const mongoose = require("mongoose");

// Models
const { User, Blog, Comment } = require("../models");

const isPostACommentException = async (blogId, userId, content, res) => {
  // blogId?
  if (!blogId) {
    return res.status(400).send({ error: "blogId is required." });
  }
  // valid blogId?
  if (!mongoose.isValidObjectId(blogId)) {
    return res.status(400).send({ error: "The provided blogId is invalid." });
  }
  // matched blog?
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(400).send({ error: "Blog is not found." });
  }
  // userId?
  if (!userId) {
    return res.status(400).send({ error: "userId is required." });
  }
  // valid userId?
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).send({ error: "The provided userId is invalid." });
  }
  // matched user?
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).send({ error: "User is not found." });
  }
  // content?
  if (!content) {
    return res.status(400).send({ error: "Content is required." });
  }
  // content string?
  if (typeof content !== "string") {
    return res.status(400).send({ error: "Content must be a string." });
  }
  // blog.isLive true?
  if (blog.isLive !== true) {
    return res.status(400).send({ error: "Blog is not live." });
  }
  return null;
};

const isReadAllCommentsExceptions = async (blogId, res) => {
  // valid blogId?
  if (!mongoose.isValidObjectId(blogId)) {
    return res.status(400).send({ error: "The provided blogId is invalid." });
  }
  // matched blog?
  // matched blog가 없다면 해당 API가 존재할 필요도 없음 => 예외처리 불필요
  return null;
};

const isPatchACommentException = async (content, res) => {
  // content?
  if (!content) {
    return res.status(400).send({ error: "Content is required." });
  }
  // content string?
  if (typeof content !== "string") {
    return res.status(400).send({ error: "Content must be a string." });
  }
  return null;
};

const isDeleteACommentException = async (commentId, res) => {
  // valid commentId?
  if (!mongoose.isValidObjectId(commentId)) {
    return res
      .status(400)
      .send({ error: "The provided commentId is invalid." });
  }
  // matched comment?
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(400).send({ error: "Comment is not found." });
  }
  return null;
};

module.exports = {
  isPostACommentException,
  isReadAllCommentsExceptions,
  isPatchACommentException,
  isDeleteACommentException,
};
