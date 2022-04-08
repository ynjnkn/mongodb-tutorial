// Dependencies
const axios = require("axios");

// Environment Variables
const { DEV_SERVER_URI } = process.env;

const getBlogsWithAxios = async () => {
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

const getBlogsWithPopulate = async () => {
  let {
    data: { blogs },
  } = await axios.get(`${DEV_SERVER_URI}/blogs`);
  //   console.dir(blogs[0], { depth: 5 });
};

const getBlogsWithPopulateLoadingTimeTest = async () => {
  console.log("getBlogsWithPopulateLoadingTimeTest() 실행");
  const numOfTests = 30;
  let sumLoadingTime = 0;
  for (let i = 0; i < numOfTests; i++) {
    const loadingStart = performance.now();
    await getBlogsWithPopulate();
    const loadingEnd = performance.now();
    const loadingTime = loadingEnd - loadingStart;
    sumLoadingTime += loadingTime;
    console.log(`${i + 1}번째 로딩 타임: ${loadingTime}ms`);
  }
  const avgLoadingTime = sumLoadingTime / numOfTests;
  console.log({ avgLoadingTime });
};

// getBlogsWithPopulate();
getBlogsWithPopulateLoadingTimeTest();
