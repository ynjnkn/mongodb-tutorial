const axios = require("axios");

const SERVER_URI = "http://localhost:3000";

const test = async () => {
    const loadingStart = performance.now();
    let { data: { blogs } } = await axios.get(`${SERVER_URI}/blogs`);
    blogs = await Promise.all(
        blogs.map(async blog => {
            const [responseUser, responseComments] = await Promise.all([
                await axios.get(`${SERVER_URI}/users/${blog.user}`),
                await axios.get(`${SERVER_URI}/blogs/${blog._id}/comments`)
            ]);
            blog.user = responseUser.data.user;
            blog.comments = await Promise.all(
                responseComments.data.comments.map(async comment => {
                    const { data: { user } } = await axios.get(`${SERVER_URI}/users/${comment.user}`);
                    comment.user = user;
                    return comment;
                }));
            return blog;
        }));
    const loadingEnd = performance.now();
    const loadingTime = loadingEnd - loadingStart;
    return loadingTime;
};

const testGroup = async () => {
    let sum = 0;
    const numOfTests = 5;
    for (let i = 0; i < numOfTests; i++) {
        sum += await test();
        console.log(`${i + 1}번째 테스트 실행`);
    };
    const avgLoadingTime = sum / numOfTests;
    console.log("avgLoadingTime", avgLoadingTime);
}

// test();
// testGroup();