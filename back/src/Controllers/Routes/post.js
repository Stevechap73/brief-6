const express = require("express");
const {
  createPost,
  getAllPost,
  getMyPost,
  deletePost,
} = require("../postController");
const { verifyToken } = require("../../Utils/extractToken");

const router = express.Router();

router.route("/createPost").post(createPost);
router.route("/all").get(getAllPost);
router.route("/myPost", verifyToken).get(getMyPost);
router.route("/delete", verifyToken).delete(deletePost);

module.exports = router;
