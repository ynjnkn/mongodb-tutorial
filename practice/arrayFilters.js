const mongoose = require("mongoose");

const run = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/test");
    await mongoose.connection.dropDatabase();
    console.log("MongoDB Connected");

    const BlogPost = mongoose.model(
      "BlogPost",
      new mongoose.Schema({
        title: String,
        comments: [{ _id: false, author: String, text: String }],
      }),
      "BlogPost"
    );

    // Insert 2 docs
    await BlogPost.create({
      title: "A Node.js Perspective on MongoDB 3.6: Array Filters",
      comments: [
        { author: "Foo", text: "This is awesome!" },
        { author: "Bar", text: "Where are the upgrade docs?" },
      ],
    });

    await BlogPost.create({
      title: "What's New in Mongoose 5: Improved Connections",
      comments: [
        { author: "Bar", text: "Thanks!" },
        { author: "Bar", text: "Sorry for double post" },
      ],
    });

    ///*
    // author가 "Bar"인 comment에 대해서
    // author를 "Bar" => "Baz"로 변경
    const filter = { "comments.author": "Bar" };
    const updateWithArrayFilters = {
      $set: { "comments.$[comment].author": "Baz" },
    };
    const updateWithoutArrayFilters = {
      $set: { "comments.$[].author": "Baz" },
    };
    const optionsWithArrayFilters = {
      arrayFilters: [{ "comment.author": "Bar" }],
    };
    const optionsWithoutArrayFilters = {};
    await BlogPost.updateMany(
      filter,
      updateWithArrayFilters,
      optionsWithArrayFilters
    );
    //*/
    const docs = await BlogPost.find();
    console.log(docs.map((doc) => doc.comments));
  } catch (error) {
    console.log({ error: { name: error.name, message: error.message } });
  }
};

run();
