// Dependencies
const axios = require("axios");

// Environment Variables
const { DEV_SERVER_URI } = process.env;

const test = async () => {
  let {
    data: { blogs },
  } = await axios.get(`${DEV_SERVER_URI}/blogs`);
  console.dir({ "변경 전": blogs[0] }, { depth: 10 });
  blogs = await Promise.all(
    blogs.map(async (blog) => {
      const [blogUser, blogComments] = await Promise.all([
        axios.get(`${DEV_SERVER_URI}/users/${blog.user}`),
        axios.get(`${DEV_SERVER_URI}/blogs/${blog._id}/comments`),
      ]);
      blog.user = blogUser.data.user;
      blog.comments = await Promise.all(
        blogComments.data.comments.map(async (comment) => {
          const commentUser = await axios
            .get(`${DEV_SERVER_URI}/users/${comment.user}`)
            .then((response) => response.data.user)
            .catch((error) => {
              console.log({
                error: { name: error.name, message: error.message },
              });
            });
          comment.user = commentUser;
          return comment;
        })
      );
      return blog;
    })
  );
  console.dir({ "변경 후": blogs[0] }, { depth: 10 });
};

test();
