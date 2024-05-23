const express = require("express");
const {
  createPost,
  getAllPost,
  getMyPost,
  deletePost,
  updatePost,
} = require("../postController");
const { verifyToken } = require("../../Utils/extractToken");

const router = express.Router();

router.route("/createPost").post(createPost);
router.route("/all").get(getAllPost);
router.route("/myPost", verifyToken).get(getMyPost);
router.route("/delete", verifyToken).delete(deletePost);
router.route("/update/:id", verifyToken).patch(updatePost);

module.exports = router;
