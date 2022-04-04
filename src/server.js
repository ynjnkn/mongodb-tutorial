const express = require("express");
const app = express();

const { userRouter } = require("./routes/userRouter");

app.use(express.json());
app.use("/users", userRouter);

app.listen(3000, async () => {
  console.log("Server listening on Port 3000");
});