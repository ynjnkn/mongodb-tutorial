const { Schema, model, Types } = require("mongoose");
const { commentSchema } = require("./Comment");

const blogSchema = new Schema(
  {
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
      _id: {
        type: Types.ObjectId,
        required: true,
        ref: "user",
      },
      username: {
        type: String,
        required: true,
      },
      name: {
        first: {
          type: String,
          required: true,
        },
        last: {
          type: String,
          required: true,
        },
      },
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

blogSchema.index({ "user._id": 1, updateAt: 1 });
blogSchema.index({ title: "text", content: "text" });

// blogSchema.virtual("comments", {
//     ref: "comment",
//     localField: "_id",
//     foreignField: "blog",
// });
// blogSchema.set("toObject", { virtuals: true });
// blogSchema.set("toJSON", { virtuals: true });

const Blog = model("blog", blogSchema);
module.exports = { Blog };
