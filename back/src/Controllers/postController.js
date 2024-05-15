const { request, response } = require("express");
const { Posts } = require("../Model/posts");
const client = require("../Connections/mongodbConnection");
const { ObjectId } = require("bson");
const { extractToken } = require("../Utils/extractToken");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Ajout d'un post (message)
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
      if (!request.body.title || !request.body.body) {
        response.status(400).json({ error: "Des champs sont manquants" });
      }
      try {
        let post = new Posts(
          request.body.title,
          request.body.body,
          authData.id,
          "published",
          //   authData.id,
          new Date().toLocaleDateString("fr")
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

// Afficher tous les posts
const getAllPost = async (request, response) => {
  console.log("played");

  let post = await client.db("mingle_sphere").collection("post").find();
  let apiResponse = await post.toArray();
  response.status(200).json(apiResponse);
};

// Afficher mes posts
const getMyPost = async (request, response) => {
  const token = await extractToken(request);

  jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      console.log(err);
      response
        .status(401)
        .json({ err: "Requête non autorisée le Token n'est pas bon" });
      return;
    } else {
      let post = await client
        .db("mingle_sphere")
        .collection("post")
        .find({ user_id: authData.id });
      let apiResponse = await post.toArray();
      response.status(200).json(apiResponse);
    }
  });
};

// Supprimer un post

// Modifier un post

module.exports = {
  createPost,
  getAllPost,
  getMyPost,
};
