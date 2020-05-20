const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const util = require("util");
const { JWT_SECRET } = require("../helpers/envChecker");
const Schema = mongoose.Schema;
const postSchema = new Schema(
  {
    title: { type: String, maxlength: 50, required: true },
    body: { type: String, minlength: 150, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    //full text search implementation for tags
    tags: { type: [{ type: String, maxlength: 10 }], index: true },
    img: { data: Buffer, contentType: String },
  },
  { timestamps: true }
);

//edit post
postSchema.statics.editPost = function (req) {
  this.updateOne({ _id: req.params.postId }, { $set: req.body }, function (
    err,
    post
  ) {
    console.log(post);

    if (err) throw new customError({ message: "error updating post" });
  });
};

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
