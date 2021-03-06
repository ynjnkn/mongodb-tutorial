const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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
    age: { type: Number, index: true },
    email: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const User = model("user", userSchema);
module.exports = { User };
