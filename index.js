const express = require("express");
const app = require("./connection");
var cors = require("cors");
const userAPI = require("./APIs/userAPI");
const postAPI = require("./APIs/postAPI");
//body parsing
app.use(express.json());
app.use(cors());
app.use("/user", userAPI);
app.use("/post", postAPI);

// client.connect((err) => {
//   if (err) client.close("connnection closed");
//   app.listen(
//     process.env.port,
//     console.log(`listening at http://localhost:${process.env.port}`)
//   );
// });
