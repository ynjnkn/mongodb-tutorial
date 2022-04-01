const { faker } = require("@faker-js/faker");
const { User } = require("./src/models");
const axios = require("axios");
const URI = "http://localhost:3000";

generateFakeData = async (userCount, blogsPerUser, commentsPerUser) => {
  try {
    if (typeof userCount !== "number" || userCount < 1)
      throw new Error("userCount must be a positive integer");
    if (typeof blogsPerUser !== "number" || blogsPerUser < 1)
      throw new Error("blogsPerUser must be a positive integer");
    if (typeof commentsPerUser !== "number" || commentsPerUser < 1)
      throw new Error("commentsPerUser must be a positive integer");
    let users = [];
    let blogs = [];
    let comments = [];

    // fake user 데이터 생성
    for (let i = 0; i < userCount; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const userName = `${firstName.toLowerCase()}${lastName.toLowerCase()}${parseInt(
        Math.random() * 10000
      )}`;
      users.push(
        new User({
          username: userName,
          name: {
            first: firstName,
            last: lastName,
          },
          age: 10 + parseInt(Math.random() * 50),
          email: `${userName}@${faker.internet.email().split("@")[1]}`,
        })
      );
    }

    console.log("fake data inserting to database...");

    await User.insertMany(users);
    console.log(`${users.length} fake users generated!`);

    // fake blog 데이터 생성
    users.map((user) => {
      for (let i = 0; i < blogsPerUser; i++) {
        blogs.push(
          axios.post(`${URI}/blogs`, {
            title: faker.lorem.words(),
            content: faker.lorem.paragraphs(),
            isLive: true,
            userId: user.id,
          })
        );
      }
    });

    let newBlogs = await Promise.all(blogs);
    console.log(`${newBlogs.length} fake blogs generated!`);

    // fake comment 데이터 생성
    users.map((user) => {
      for (let i = 0; i < commentsPerUser; i++) {
        let index = Math.floor(Math.random() * blogs.length);
        comments.push(
          axios.post(`${URI}/blogs/${newBlogs[index].data.blog._id}/comments`, {
            content: faker.lorem.sentence(),
            userId: user._id,
          })
        );
      }
    });

    await Promise.all(comments);
    console.log(`${comments.length} fake comments generated!`);
    console.log("COMPLETE!!");
  } catch (err) {
    console.log({
      error: {
        name: err.name,
        message: err.message,
      },
    });
  }
};

module.exports = { generateFakeData };
