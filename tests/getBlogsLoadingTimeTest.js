const axios = require("axios");
// const SERVER_URI = "https://ynjnkn.shop";
const SERVER_URI = "http://localhost:3000";

const getBlogs = async () => {
  const blogs = await axios
    .get(`${SERVER_URI}/blogs`)
    .then((response) => {
      response.data.blogs;
    })
    .catch((error) => {
      console.log({
        error: { name: error.name, message: error.message },
      });
    });
  return blogs;
};

const calculateLoadingTimeOfGettingBlogs = async () => {
  const numOfTests = 100;
  let sumLoadingTime = 0;
  for (let i = 0; i < numOfTests; i++) {
    const loadingStart = performance.now();
    await getBlogs();
    const loadingEnd = performance.now();
    const loadingTime = loadingEnd - loadingStart;
    sumLoadingTime += loadingTime;
    console.log(`[${i + 1}/${numOfTests}] ${loadingTime}ms`);
  }
  console.log("=== TEST COMPLETE ===");
  const avgLoadingTime = sumLoadingTime / numOfTests;
  console.log({ avgLoadingTime });
};

calculateLoadingTimeOfGettingBlogs();
