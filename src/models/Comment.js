const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    user: { type: ObjectId, required: true, ref: "user", index: true },
    userFullName: { type: String, required: true },
    blog: { type: ObjectId, required: true, ref: "blog" },
  },
  { timestamps: true }
);

const Comment = model("comment", commentSchema);
module.exports = { Comment, commentSchema };
