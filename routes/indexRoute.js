const authRouter = require("./authRoute");
const userRouter = require("./userRoute");

function route(app) {
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
}

module.exports = route;
