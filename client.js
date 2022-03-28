const axios = require("axios");

const SERVER_URI = "http://localhost:3000";

const test = async () => {
    let { data: { blogs } } = await axios.get(`${SERVER_URI}/blogs`);
    blogs = await Promise.all(
        blogs.map(async blog => {
            const [responseUser, responseComments] = await Promise.all([
                await axios.get(`${SERVER_URI}/users/${blog.user}`),
                await axios.get(`${SERVER_URI}/blogs/${blog._id}/comments`)
            ])
            blog.user = responseUser.data.user;
            blog.comments = await Promise.all(
                responseComments.data.comments.map(async comment => {
                    const { data: { user } } = await axios.get(`${SERVER_URI}/users/${comment.user}`);
                    comment.user = user;
                    return comment;
                }));
            return blog;
        }));
}

test();