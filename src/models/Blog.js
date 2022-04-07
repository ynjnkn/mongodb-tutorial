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

blogSchema.virtual("comments", {
  ref: "comment",
  localField: "_id",
  foreignField: "blog",
});
blogSchema.set("toObject", { virtuals: true });
blogSchema.set("toJSON", { virtuals: true });

const Blog = model("blog", blogSchema);
module.exports = { Blog };
