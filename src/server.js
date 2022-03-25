// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// DB
const MONGODB_URI = "mongodb+srv://admin:dAX3uRtkdhUdqx4o@mongodb-tutorial.d7woi.mongodb.net/BlogService?retryWrites=true&w=majority";

// Routers
const { userRouter } = require("./routes/userRouter");

// Middlewares
app.use(express.json());
app.use("/users", userRouter);

const server = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        // mongoose.set("debug", true);
        console.log("MongoDB Connected");

        app.listen(3000, () => console.log("Server listening on port 3000"));
    }
    catch (err) {
        console.log({ error: err.message });
    }
}

server();