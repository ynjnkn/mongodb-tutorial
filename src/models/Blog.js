const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    isLive: { type: Boolean, required: false, default: false },
    user: { type: ObjectId, required: true, ref: "user" },
  },
  { timestamps: true }
);

const Blog = model("blog", blogSchema);
module.exports = { Blog };
