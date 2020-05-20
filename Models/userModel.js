const mongoose = require("mongoose");
const { hash } = require("../helpers/hashing");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    maxlength: 20,
    minlength: 5,
    required: true,
    unique: true,
    trim: true,
  },
  name: String,
  password: { type: String, minlength: 8, required: true },
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  img: { data: Buffer, contentType: String },
});

//presave
userSchema.pre("save", async function (next) {
  const userdoc = this;
  //hashing
  const hashed = await hash(userdoc.password);
  userdoc.password = hashed;
  console.log("this is presave");
  next();
});
//instance methods
userSchema.statics.checkForUser = async function (username) {
  return this.findOne({ username }).count() > 0;
};
userSchema.statics.pushPostId = function (userId, postId) {
  return this.updateOne(
    { _id: userId },
    { $push: { posts: postId } },
    //todo nmodified instead of error?
    (err, user) => {
      if (err)
        throw new customError({
          message: "could not add to users posts",
          status: 500,
        });
    }
  );
};
userSchema.statics.pullPostId = function (userId, postId) {
  return this.updateOne(
    { _id: userId },
    { $pull: { posts: postId } },
    //todo nmodified instead of error?
    (err, user) => {
      if (err)
        throw new customError({
          message: "could not delete post from user",
          status: 500,
        });
    }
  );
};

//todo find following list for user

const User = mongoose.model("User", userSchema);
module.exports = User;
