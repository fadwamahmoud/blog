const express = require("express");
const router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const util = require("util");
const { JWT_SECRET } = require("../helpers/envChecker");
const { compare } = require("../helpers/hashing");
const verifyUser = require("../helpers/verification");
const Post = require("../Models/postModel");
const User = require("../Models/userModel");

const customError = require("../helpers/customError");
const {
  addPostRules,
  getPostRules,
  validate,
  deletePostRules,
} = require("../middleware/validator");

//get: 1 post, all posts
router.get(["/:postId", "/"], async (req, res, next) => {
  try {
    if (req.params.postId) {
      const post = await Post.findOne({ _id: req.params.postId });
      return res.status(200).send(post.toJSON());
    }
    //todo pagination
    const allPosts = await Post.find();
    return res.status(200).send(allPosts);
  } catch (error) {
    next(error);
  }
});

//post
router.post("/", addPostRules(), validate, async (req, res, next) => {
  try {
    const {
      body: { title, body, img, tags },
    } = req;

    const user = await verifyUser(req);

    if (!user) {
      throw new customError({ message: "unauthorized" });
    } else {
      const newPost = new Post({
        userId: user._id,
        title: title,
        body: body,
        tags: tags,
        //todo img
      });
      const createdPost = await newPost.save();
      //add todo id to user todos array
      User.pushPostId(user._id, createdPost.id);

      return res.status(201).send(createdPost.toJSON());
    }
  } catch (error) {
    next(error);
  }
});

//edit
router.patch("/:postId", addPostRules(), validate, async (req, res, next) => {
  try {
    const user = await verifyUser(req);
    if (!user) {
      throw new customError({ message: "unauthorized" });
    }
    Post.editPost(req);
    //profile is returned with the all posts including edited one
    return res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

//delete
//delete
router.delete(
  "/:postId",
  deletePostRules(),
  validate,
  async (req, res, next) => {
    try {
      const user = await verifyUser(req);
      //delete from posts array
      User.pullPostId(user._id, req.params.postId);
      //todo handle mutiple deletions of same post
      Post.deleteOne({ _id: req.params.postId }, function (err, post) {
        if (err) throw new customError({ message: "could not delete post" });
        return res.status(200).send(post);
      });
    } catch (error) {
      next(error);
    }
  }
);
module.exports = router;
