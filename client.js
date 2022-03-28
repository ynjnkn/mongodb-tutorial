const axios = require("axios");

const test = async () => {
    let { data: { blogs } } = await axios.get("http://localhost:3000/blogs");
    console.log("변경 전", blogs[0]);
    blogs = await Promise.all(blogs.map(async blog => {
        const responseUser = await axios.get(`http://localhost:3000/users/${blog.user}`);
        const responseComments = await axios.get(`http://localhost:3000/blogs/${blog._id}/comments`);
        blog.user = responseUser.data.user;
        blog.comments = responseComments.data.comments;
        return blog;
    }));
    console.log("변경 후", blogs[0]);
}

test();