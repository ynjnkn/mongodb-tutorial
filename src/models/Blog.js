const { Schema, model, Types } = require("mongoose");

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    isLive: {
        type: Boolean,
        required: true,
        default: false,
    },
    user: {
        type: Types.ObjectId,
        required: true,
        ref: "user",
    },
}, { timestamps: true });

const Blog = model("blog", blogSchema);
module.exports = { Blog };