const axios = require("axios");
const { DEV_SERVER_URI } = process.env;
const blogId = "624fb1fe82cd0430ac74a3d7";

const readABlog = async () => {
  const blog = await axios
    .get(`${DEV_SERVER_URI}/blogs/${blogId}`)
    .then((response) => response.data.blog)
    .catch((error) => {
      console.log({
        error: { name: error.name, message: error.message },
      });
    });
  return blog;
};

const getReadABlogLoadingTime = async () => {
  const numOfTests = 10;
  let sumLoadingTime = 0;
  for (let i = 0; i < numOfTests; i++) {
    const loadingStart = performance.now();
    await readABlog();
    const loadingEnd = performance.now();
    const loadingTime = loadingEnd - loadingStart;
    sumLoadingTime += loadingTime;
    console.log(`${i + 1}번째 로딩 타임: ${loadingTime}ms`);
  }
  const avgLoadingTime = sumLoadingTime / numOfTests;
  console.log({ avgLoadingTime });
};

getReadABlogLoadingTime();
