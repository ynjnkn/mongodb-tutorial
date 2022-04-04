const mongoose = require("mongoose");
const { User } = require("../models/User");

const isInvalidUserId = async (userId) => {
  if (!mongoose.isValidObjectId(userId)) {
    return { error: "The provided User ID is invalid." };
  }
  const user = await User.findById(userId);
  if (!user) {
    return { error: "User is not found." };
  }
  return null;
};

const isNotFoundUser = (user) => {
  if (!user) {
    return { error: "User is not found." };
  }
  return null;
};

const isWrongUsername = async (username) => {
  if (!username) return { error: "Username is required." };
  if (typeof username !== "string")
    return { error: "Username must be a string." };
  const existingUsername = await User.findOne({ username });
  if (existingUsername)
    return { error: "The provided username already exists." };
  return null;
};

const isWrongName = (name) => {
  if (!name || !name.first || !name.last) {
    return { error: "Both first and last name are required." };
  }
  if (typeof name.first !== "string" || typeof name.last !== "string") {
    return { error: "Name must be a string." };
  }
  return null;
};

const isWrongAge = (age) => {
  if (!age) return { error: "Age is required." };
  if (typeof age !== "number") return { error: "Age must be a number." };
  return null;
};

const isWrongEmail = async (email) => {
  if (!email) return { error: "Email is required." };
  if (typeof email !== "string") return { error: "email must be a string." };
  const existingEmail = await User.findOne({ email });
  if (existingEmail) return { error: "The provided email already exists." };
  return null;
};

module.exports = {
  isInvalidUserId,
  isNotFoundUser,
  isWrongUsername,
  isWrongName,
  isWrongAge,
  isWrongEmail,
};
