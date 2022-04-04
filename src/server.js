// Dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Routers
const { userRouter } = require("./routes/userRouter");

// Environment Variables
const { MONGODB_URI, PORT } = process.env;

const server = async () => {
  try {
    // Check Environment Variables
    if (!MONGODB_URI) throw new Error("MONGODB_URI is undefined");
    if (!PORT) throw new Error("PORT is undefined");

    // Connect DB
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected");

    // Middlewares
    app.use(express.json());
    app.use("/users", userRouter);

    app.listen(PORT, async () => {
      console.log(`Server listening on Port ${PORT}`);
    });
  } catch (err) {
    console.log({ error: { name: err.name, message: err.message } });
  }
};

server();
