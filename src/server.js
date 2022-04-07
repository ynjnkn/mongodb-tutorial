// Dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Routers
const { userRouter, blogRouter, commentRouter } = require("./routes");

// Environment Variables
const { MONGODB_URI, PORT } = process.env;

const server = async () => {
  try {
    // Check Environment Variables
    if (!MONGODB_URI) throw new Error("MONGODB_URI is undefined");
    if (!PORT) throw new Error("PORT is undefined");

    // Connect DB
    await mongoose.connect(MONGODB_URI);
    mongoose.set("debug", false);
    console.log("MongoDB Connected");

    // Middlewares
    app.use(express.json());
    app.use("/users", userRouter);
    app.use("/blogs", blogRouter);
    app.use("/blogs/:blogId/comments", commentRouter);

    app.listen(PORT, async () => {
      console.log(`Server listening on Port ${PORT}`);
    });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
  }
};

server();
