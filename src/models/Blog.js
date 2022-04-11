const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const { commentSchema } = require("./Comment");

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    isLive: { type: Boolean, required: false, default: false },
    user: {
      _id: { type: ObjectId, required: true, ref: "user", index: true },
      username: { type: String, required: true },
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
      },
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

blogSchema.index({ "user._id": 1, updatedAt: 1 });
blogSchema.index({ title: "text" });

/*
// blogSchema에 comments 키가 있으므로 virtual이 필요 없음
blogSchema.virtual("comments", {
  ref: "comment",
  localField: "_id",
  foreignField: "blog",
});
blogSchema.set("toObject", { virtuals: true });
blogSchema.set("toJSON", { virtuals: true });
*/

const Blog = model("blog", blogSchema);
module.exports = { Blog };
