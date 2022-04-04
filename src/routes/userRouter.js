const { Router } = require("express");
const userRouter = Router();

const users = [];

userRouter.get("/", async (req, res) => {
  return res.send({ users });
});

userRouter.post("/", async (req, res) => {
  const user = req.body;
  users.push(user);
  return res.send({ users });
});

module.exports = { userRouter };
