// Import Dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { generateFakeData } = require("../faker2");

// Import DB
const MONGODB_URI =
  "mongodb+srv://admin:dAX3uRtkdhUdqx4o@mongodb-tutorial.d7woi.mongodb.net/BlogService?retryWrites=true&w=majority";

// Import Routers
const { userRouter, blogRouter, commentRouter } = require("./routes");

const server = async () => {
  try {
    // Connect DB
    await mongoose.connect(MONGODB_URI);
    // mongoose.set("debug", true);
    console.log("MongoDB Connected");

    // Connect Middlewares
    app.use(express.json());
    app.use("/users", userRouter);
    app.use("/blogs", blogRouter);
    app.use("/blogs/:blogId/comments", commentRouter);

    app.listen(3000, async () => {
      console.log("Server listening on port 3000");
      console.time("generateFakeData() Elapsed Time");
      await generateFakeData(10, 2, 10);
      console.timeEnd("generateFakeData() Elapsed Time");
    });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
  }
};

server();
