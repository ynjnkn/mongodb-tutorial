// Dependencies
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middlewares
app.use(express.json());

// DB
const MONGODB_URI = "mongodb+srv://admin:dAX3uRtkdhUdqx4o@mongodb-tutorial.d7woi.mongodb.net/BlogService?retryWrites=true&w=majority";

const server = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB Connected");

        const users = [{
            user1: {
                name: "Selina Kyle",
                age: "31",
            }
        }]

        app.get("/users", function (req, res) {
            return res.json({
                users,
            });
        })

        app.post("/users", function (req, res) {
            users.push({
                name: req.body.name,
                age: req.body.age,
            })
            return res.send({
                success: true,
            })
        })

        app.listen(3000, function () {
            console.log("Server listening on port 3000");
        });
    }
    catch (error) {
        console.log({ error });
    }
}

server();