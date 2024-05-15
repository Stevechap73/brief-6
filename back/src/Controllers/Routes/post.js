const express = require("express");
const { createPost, getAllPost, getMyPost } = require("../postController");
const { verifyToken } = require("../../Utils/extractToken");

const router = express.Router();

router.route("/createPost").post(createPost);
router.route("/all").get(getAllPost);
router.route("/myPost").get(getMyPost);

module.exports = router;
