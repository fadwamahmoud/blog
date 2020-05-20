const mongoose = require("mongoose");
const express = require("express");
const app = express();
const uri =
  "mongodb+srv://fadwa:hugoandrose@todoapp-qpeei.mongodb.net/blog?retryWrites=true&w=majority";
const { DB_HOST, port } = require("./helpers/envChecker");
mongoose.connect(
  DB_HOST,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) {
      console.log(err);
      process.exit();
    }
    console.log("connected successfully");
    app.listen(port, () =>
      console.log(`listening at http://localhost:${port}`)
    );
  }
);

module.exports = app;
