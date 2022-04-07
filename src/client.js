// Dependencies
const axios = require("axios");

// Environment Variables
const { DEV_SERVER_URI } = process.env;
console.log({ DEV_SERVER_URI });

const test = async () => {
  let {
    data: { blogs },
  } = await axios.get(`${DEV_SERVER_URI}/blogs`);
  console.log("변경 전", blogs[0]);
  blogs = await Promise.all(
    blogs.map(async (blog) => {
      const blogUser = await axios.get(`${DEV_SERVER_URI}/users/${blog.user}`);
      const blogComments = await axios.get(
        `${DEV_SERVER_URI}/blogs/${blog._id}/comments`
      );
      blog.user = blogUser.data.user;
      blog.comments = blogComments.data.comments;
      return blog;
    })
  );
  console.log("변경 후", blogs[0]);
};

test();
