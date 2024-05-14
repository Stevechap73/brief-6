const express = require("express");
const { createPost } = require("../postController");
const { verifyToken } = require("../../Utils/extractToken");

const routerPost = express.Router();

routerPost.route("/createPost").post(createPost);

module.exports = routerPost;
