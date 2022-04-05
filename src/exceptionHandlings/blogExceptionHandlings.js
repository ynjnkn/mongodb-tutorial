const mongoose = require("mongoose");
const { User } = require("../models/User");

const isExceptionCreateABlog = async (title, content, isLive, userId, res) => {
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

module.exports = { isExceptionCreateABlog };
