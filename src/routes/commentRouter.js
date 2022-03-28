const { Router } = require("express");
const commentRouter = Router({ mergeParams: true });
const { isValidObjectId } = require("mongoose");
const { Blog, User, Comment } = require("../models/");

commentRouter.post("/", async (req, res) => {
    try {
        const { blogId } = req.params;
        const { content, userId } = req.body;
        const [blog, user] = await Promise.all([
            Blog.findById(blogId),
            User.findById(userId),
        ]);

        if (!blogId)
            return res.status(400).send({ error: "blogId is required." });
        if (!isValidObjectId(blogId))
            return res.status(400).send({ error: "The provided blogId is invalid." });
        if (!blog)
            return res.status(400).send({ error: "Blog is not found." });
        if (!userId)
            return res.status(400).send({ error: "userId is required." });
        if (!isValidObjectId(userId))
            return res.status(400).send({ error: "The provided userId is invalid." });
        if (!user)
            return res.status(400).send({ error: "User is not found" });
        if (!content)
            return res.status(400).send({ error: "Content is required." });
        if (typeof (content) !== "string")
            return res.status(400).send({ error: "Content must be a string." });
        if (!blog.isLive)
            return res.status(400).send({ error: "Blog is not available." });

        let comment = new Comment({
            content, user, blog,
        });
        await comment.save();

        return res
            .status(200)
            .send({ comment });
    }
    catch (err) {
        console.log({ error: { name: err.name, message: err.message } });
        return res
            .status(500)
            .send({ error: { name: err.name, message: err.message } })
    }
});

commentRouter.get("/", async (req, res) => {
    try {
        const { blogId } = req.params;
        const comments = await Comment.find({ blog: blogId });
        return res
            .status(200)
            .send({ comments });
    }
    catch (err) {
        console.log({ error: { name: err.name, message: err.message } });
        return res
            .status(500)
            .send({ error: { name: err.name, message: err.message } })
    }
});

module.exports = { commentRouter };