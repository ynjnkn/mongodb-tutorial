const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
    },
    age: { type: Number },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const User = model("user", userSchema);
module.exports = { User };
