// Import Dependencies
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Import DB
const MONGODB_URI = "mongodb+srv://admin:dAX3uRtkdhUdqx4o@mongodb-tutorial.d7woi.mongodb.net/BlogService?retryWrites=true&w=majority";

// Import Routers
const { userRouter } = require("./routes/userRouter");
const { blogRouter } = require("./routes/blogRouter");

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

        app.listen(3000, () => console.log("Server listening on port 3000"));
    }
    catch (err) {
        console.log({ error: { name: err.name, message: err.message } });
    }
}

server();