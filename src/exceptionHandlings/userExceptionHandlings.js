const mongoose = require("mongoose");
const { User } = require("../models/User");

const isExceptionCreateUser = async (username, name, age, email, res) => {
  // Check Username
  if (!username)
    return res.status(400).send({ error: "Username is required." });
  if (typeof username !== "string")
    return res.status(400).send({ error: "Username must be a string." });
  const existingUsername = await User.findOne({ username });
  if (existingUsername)
    return res
      .status(400)
      .send({ error: "The provided username already exists." });
  // Check Name
  if (!name || !name.first || !name.last) {
    return res
      .status(400)
      .send({ error: "Both first and last name are required." });
  }
  if (typeof name.first !== "string" || typeof name.last !== "string") {
    return res.status(400).send({ error: "Name must be a string." });
  }
  // Check Age
  if (!age) return res.status(400).send({ error: "Age is required." });
  if (typeof age !== "number")
    return res.status(400).send({ error: "Age must be a number." });
  // Check Email
  if (!email) return res.status(400).send({ error: "Email is required." });
  if (typeof email !== "string")
    return res.status(400).send({ error: "email must be a string." });
  const existingEmail = await User.findOne({ email });
  if (existingEmail)
    return res
      .status(400)
      .send({ error: "The provided email already exists." });
  return null;
};

const isExceptionReadAUser = async (userId, res) => {
  // Check ObjectId
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).send({ error: "The provided ObjectId is invalid." });
  }
  // Check if a User with the ObjectId exists.
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).send({ error: "User is not found." });
  }
  return null;
};

const isExceptionPutAUser = async (userId, myNewUserInfo, res) => {
  // Check ObjectId - Valid ObjectId? [v]
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).send({ error: "The provided User ID is invalid." });
  }
  // Check ObjectId - Matched User? [v]
  const myCurrentUserInfo = await User.findById(userId);
  if (!myCurrentUserInfo) {
    return res.status(400).send({ error: "User is not found." });
  }
  // Check Username - Duplicate Username? [v]
  if (
    myNewUserInfo.username &&
    myNewUserInfo.username !== myCurrentUserInfo.username
  ) {
    const globalDuplicateUsername = await User.findOne({
      username: myNewUserInfo.username,
    });
    if (globalDuplicateUsername) {
      return res
        .status(400)
        .send({ error: "The provided username already exists." });
    }
  }
  // Check Username - Type String? [v]
  if (myNewUserInfo.username && typeof myNewUserInfo.username !== "string") {
    return res.status(400).send({ error: "Username must be a string." });
  }
  // Check Name - Type String? [v]
  if (
    myNewUserInfo.name.first &&
    myNewUserInfo.name.last &&
    (typeof myNewUserInfo.name.first !== "string" ||
      typeof myNewUserInfo.name.last !== "string")
  ) {
    return res.status(400).send({ error: "Name must be a string." });
  }
  // Check Name - Both First and Last Name Exist? [v]
  if (
    myNewUserInfo.name &&
    (!myNewUserInfo.name.first || !myNewUserInfo.name.last)
  ) {
    return res
      .status(400)
      .send({ error: "Both first and last name are required." });
  }
  // Check Age - Type Number? [v]
  if (myNewUserInfo.age && typeof myNewUserInfo.age !== "number") {
    return res.status(400).send({ error: "Age must be a number." });
  }
  // Check Email - Duplicate Email? [v]
  if (myNewUserInfo.email && myNewUserInfo.email !== myCurrentUserInfo.email) {
    const globalDuplicateEmail = await User.findOne({
      email: myNewUserInfo.email,
    });
    if (globalDuplicateEmail) {
      return res
        .status(400)
        .send({ error: "The provided email already exists." });
    }
  }
  // Check Email - Type String? [v]
  if (myNewUserInfo.email && typeof myNewUserInfo.email !== "string") {
    return res.status(400).send({ error: "Email must be a string." });
  }
  return null;
};

const isExceptionDeleteAUser = async (userId, res) => {
  // Check ObjectId
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).send({ error: "The provided ObjectId is invalid." });
  }
  // Check if a User with the ObjectId exists.
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).send({ error: "User is not found." });
  }
  return null;
};

module.exports = {
  isExceptionCreateUser,
  isExceptionReadAUser,
  isExceptionPutAUser,
  isExceptionDeleteAUser,
};
