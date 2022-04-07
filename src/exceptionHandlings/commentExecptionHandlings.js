// Dependencies
const mongoose = require("mongoose");

// Models
const { User } = require("../models/User");
const { Blog } = require("../models/Blog");

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
};

module.exports = { isPostACommentException };
