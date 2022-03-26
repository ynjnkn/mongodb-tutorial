const { Router } = require("express");
const commentRouter = Router({ mergeParams: true });
const { isValidObjectId } = require("mongoose");
const { Blog } = require("../models/Blog");
const { User } = require("../models/User");
const { Comment } = require("../models/Comment");

commentRouter.post("/", async (req, res) => {
    try {
        const { blogId } = req.params;
        console.log("blogId", blogId);
        res
            .status(200)
            .send({ blogId });
    }
    catch (err) {
        console.log({ error: { name: err.name, message: err.message } });
        res
            .status(500)
            .send({ error: { name: err.name, message: err.message } })
    }
});

commentRouter.get("/", async (req, res) => {
    try {
        res
            .status(200)
            .send();
    }
    catch (err) {
        console.log({ error: { name: err.name, message: err.message } });
        res
            .status(500)
            .send({ error: { name: err.name, message: err.message } })
    }
});

module.exports = { commentRouter };