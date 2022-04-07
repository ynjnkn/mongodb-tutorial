// Dependencies
const mongoose = require("mongoose");

// Models
const { User, Blog } = require("../models");

const isPostABlogException = async (title, content, isLive, userId, res) => {
  if (!title) {
    return res.status(400).send({ error: "Title is required." });
  }
  if (typeof title !== "string") {
    return res.status(400).send({ error: "Title must be a string." });
  }
  if (!content) {
    return res.status(400).send({ error: "Content is required." });
  }
  if (typeof content !== "string") {
    return res.status(400).send({ error: "Content must be string." });
  }
  if (isLive && typeof isLive !== "boolean") {
    return res.status(400).send({ error: "isLive must be a boolean." });
  }
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).send({ error: "The provided ObjectId is invalid." });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).send({ error: "User is not found." });
  }
  return null;
};

const isReadABlogException = async (blogId, res) => {
  if (!mongoose.isValidObjectId(blogId)) {
    return res.status(400).send({ error: "The provided ObjectId is invalid." });
  }
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(400).send({ error: "Blog is not found." });
  }
  return null;
};

const isPutABlogException = async (blogId, title, content, res) => {
  // Valid ObjectId?
  if (!mongoose.isValidObjectId(blogId)) {
    return res.status(400).send({ error: "The provided ObjectId is invalid." });
  }
  // Matched Blog?
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(400).send({ error: "Blog is not found." });
  }
  // Title String?
  if (title && typeof title !== "string") {
    return res.status(400).send({ error: "Title must be a string." });
  }
  // Content String?
  if (content && typeof content !== "string") {
    return res.status(400).send({ error: "Content must be a string." });
  }
  return null;
};

const isPatchABlogException = async (blogId, res) => {
  // Valid ObjectId?
  if (!mongoose.isValidObjectId(blogId)) {
    return res.status(400).send({ error: "The provided ObjectId is invalid." });
  }
  // Matched Blog?
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(400).send({ error: "Blog is not found." });
  }
  return null;
};

module.exports = {
  isPostABlogException,
  isReadABlogException,
  isPutABlogException,
  isPatchABlogException,
};
