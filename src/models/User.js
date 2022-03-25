const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    age: Number,
    email: String,
}, { timestamps: true });

const User = mongoose.model('user', userSchema);
module.exports = { User };