const axios = require("axios");

const SERVER_URI = "http://localhost:3000";

const testAxios = async () => {
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
};

const testPopulate = async () => {
    let { data: { blogs } } = await axios.get(`${SERVER_URI}/blogs`);
    // blogs = await Promise.all(
    // blogs.map(async blog => {
    //     const [responseUser, responseComments] = await Promise.all([
    //         await axios.get(`${SERVER_URI}/users/${blog.user}`),
    //         await axios.get(`${SERVER_URI}/blogs/${blog._id}/comments`)
    //     ]);
    //     blog.user = responseUser.data.user;
    //     blog.comments = await Promise.all(
    //         responseComments.data.comments.map(async comment => {
    //             const { data: { user } } = await axios.get(`${SERVER_URI}/users/${comment.user}`);
    //             comment.user = user;
    //             return comment;
    //         }));
    //     return blog;
    // })
    // );
};

const calculateTestAxiosLoadingTime = async () => {
    console.log("calculateTestAxiosLoadingTime() 실행");
    const numOfTests = 5;
    let sumLoadingTime = 0;
    for (let i = 0; i < numOfTests; i++) {
        const loadingStart = performance.now();
        await testAxios();
        const loadingEnd = performance.now();
        const loadingTime = loadingEnd - loadingStart;
        sumLoadingTime += loadingTime;
        console.log(`${i + 1}번째 테스트 로딩 타임: ${loadingTime}ms`);
    };
    const avgLoadingTime = sumLoadingTime / numOfTests;
    console.log("avgLoadingTime", avgLoadingTime);
}

const calculateTestPopulateLoadingTime = async () => {
    console.log("calculateTestPopulateLoadingTime() 실행");
    const numOfTests = 1;
    let sumLoadingTime = 0;
    for (let i = 0; i < numOfTests; i++) {
        const loadingStart = performance.now();
        await testPopulate();
        const loadingEnd = performance.now();
        const loadingTime = loadingEnd - loadingStart;
        sumLoadingTime += loadingTime;
        console.log(`${i + 1}번째 테스트 로딩 타임: ${loadingTime}ms`);
    };
    const avgLoadingTime = sumLoadingTime / numOfTests;
    console.log("avgLoadingTime", avgLoadingTime);
}

calculateTestPopulateLoadingTime();