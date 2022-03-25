// Dependencies
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// DB
const MONGODB_URI = "mongodb+srv://admin:dAX3uRtkdhUdqx4o@mongodb-tutorial.d7woi.mongodb.net/BlogService?retryWrites=true&w=majority";
const { User } = require('./models/User');

// Middlewares
app.use(express.json());

const server = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB Connected");

        app.post("/users", async (req, res) => {
            try {
                let { username, name } = req.body;
                if (!username) {
                    return res
                        .status(400)
                        .send({ err: "Username is required." });
                }
                if (!name || !name.first || !name.last) {
                    return res
                        .status(400)
                        .send({ err: "Both first and last name are required." });
                }
                const user = new User(req.body);
                await user.save();
                return res
                    .status(201)
                    .send({ user })
            }
            catch (err) {
                return res
                    .status(500)
                    .send({ error: err.message });
            }
        });

        app.get("/users", async (req, res) => {
            try {
                const users = await User.find({});
                return res
                    .status(200)
                    .json({ users });
            }
            catch (err) {
                return res
                    .status(500)
                    .send({ error: err.message });
            }
        });

        app.get("/users/:userId", async (req, res) => {
            try {
                const { userId } = req.params;
                if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId" });
                const user = await User.findOne({ _id: userId });
                res
                    .status(200)
                    .send({ user });
            }
            catch (err) {
                res
                    .status(500)
                    .send({ error: err.message });
            }
        });

        app.delete("/users/:userId", async (req, res) => {
            try {
                const { userId } = req.params;
                if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId" });
                const user = await User.findOneAndDelete({ _id: userId });
                res
                    .status(200)
                    .send({ user });
            }
            catch (err) {
                res
                    .status(500)
                    .send({ error: err.message });
            }
        });

        app.listen(3000, () => console.log("Server listening on port 3000"));
    }
    catch (err) {
        console.log({ error: err.message });
    }
}

server();