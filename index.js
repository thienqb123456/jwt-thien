const express = require("express");
const app = express();
const port = 4000;
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

app.get("/", (req, res) => {
  res.send("thien");
});

app.listen(port, () => {
  console.log(`App listening on port : ${port}`);
});
