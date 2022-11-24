const express = require("express");
const app = express();
const port = 4000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const route = require("./routes/indexRoute");

app.get("/", (req, res) => {
  res.send("thien");
});

//connect mongodb
mongoose.connect(process.env.MONGODB_SECRET, () => {
  console.log("Connected to MongoDB");
});

//app use
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(cookieParser());

//http logger to debug
app.use(morgan("combined"));

//route init
route(app);

app.listen(port, () => {
  console.log(`App listening on port : ${port}`);
});
