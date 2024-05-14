const { request, response } = require("express");
const { Posts } = require("../Model/posts");
const client = require("../Connections/mongodbConnection");
const { ObjectId } = require("bson");
const { extractToken } = require("../Utils/extractToken");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createPost = async (request, response) => {
  const token = await extractToken(request);

  jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      console.log(err);
      response
        .status(401)
        .json({ err: "Requête non autorisée le Token n'est pas bon" });
      return;
    } else {
      if (
        !request.body.title ||
        !request.body.body ||
        !request.body.user_id ||
        !request.body.status
      ) {
        response.status(400).json({ error: "Des champs sont manquants" });
      }
      try {
        let post = new Post(
          request.body.title,
          request.body.body,
          request.body.user_id,
          request.body.status,
          //   authData.id,
          new Date()
          //   "published"
        );
        let result = await client
          .db("mingle_sphere")
          .collection("post")
          .insertOne(post);
        response.status(200).json(result);
      } catch (e) {
        console.log(e);
        response.status(500).json(e);
      }
    }
  });
};

module.exports = {
  createPost,
};
