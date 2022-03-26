const { Router } = require("express");
const blogRouter = Router();
const { isValidObjectId } = require("mongoose");
const { Blog, User } = require("../models/");

blogRouter.post("/", async (req, res) => {
    try {
        const { title, content, isLive, userId } = req.body;
        if (!title)
            return res.status(400).send({ error: "Title is required." });
        if (typeof (title) !== "string")
            return res.status(400).send({ error: "Title must be a string." });
        if (!content)
            return res.status(400).send({ error: "Content is required." });
        if (typeof (content) !== "string")
            return res.status(400).send({ error: "Content must be a string." });
        if (isLive && isLive !== "boolean")
            return res.status(400).send({ error: "isLive must be a boolean." });
        if (!isValidObjectId(userId))
            return res.status(400).send({ error: "userId is invalid." });
        let user = await User.findById(userId);
        if (!user)
            return res.status(400).send({ error: "User is not found." });

        let blog = new Blog({
            ...req.body, user
        });
        await blog.save();

        return res
            .status(200)
            .send({ blog });
    }
    catch (err) {
        console.log({ error: { name: err.name, message: err.message } })
        return res
            .status(500)
            .send({ error: { name: err.name, message: err.message } });
    }
});

blogRouter.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find({});
        return res
            .status(200)
            .send({ blogs });
    }
    catch (err) {
        console.log({ error: { name: err.name, message: err.message } })
        return res
            .status(500)
            .send({ error: { name: err.name, message: err.message } });
    }
});

blogRouter.get("/:blogId", async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send({ error: "blogId is not valid." });
        const blog = await Blog.findById(blogId);
        return res
            .status(200)
            .send({ blog });
    }
    catch (err) {
        console.log({ error: { name: err.name, message: err.message } })
        return res
            .status(500)
            .send({ error: { name: err.name, message: err.message } });
    }
});

blogRouter.put("/:blogId", async (req, res) => {
    try {
        const { blogId } = req.params;
        const { title, content } = req.body;

        if (!isValidObjectId(blogId))
            return res.status(400).send({ error: "blogId is invalid." });
        if (!title)
            return res.status(400).send({ error: "Title is required." });
        if (typeof (title) !== "string")
            return res.status(400).send({ error: "Title must be a string." });
        if (!content)
            return res.status(400).send({ error: "Content is required." });
        if (typeof (content) !== "string")
            return res.status(400).send({ error: "Content must be a string." });

        const blog = await Blog.findByIdAndUpdate(blogId, {
            $set: {
                title, content
            }
        }, { new: true });

        return res
            .status(200)
            .send({ blog });
    }
    catch (err) {
        console.log({ error: { name: err.name, message: err.message } })
        return res
            .status(500)
            .send({ error: { name: err.name, message: err.message } });
    }
});

blogRouter.patch("/:blogId/live", async (req, res) => {
    try {
        console.log("req.body", req.body);
        const { blogId } = req.params;
        const { isLive } = req.body;
        if (!isValidObjectId(blogId))
            return res.status(400).send({ error: "blogId is invalid." });
        if (isLive === undefined)
            return res.status(400).send({ error: "isLive is required." });
        if (typeof (isLive) !== "boolean")
            return res.status(400).send({ error: "isLive must be a boolean." });
        const blog = await Blog.findByIdAndUpdate(blogId, { isLive }, { new: true });
        return res
            .status(200)
            .send({ blog });
    }
    catch (err) {
        console.log({ error: { name: err.name, message: err.message } })
        return res
            .status(500)
            .send({ error: { name: err.name, message: err.message } });
    }
});

module.exports = { blogRouter };