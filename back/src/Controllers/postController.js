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
    }
    if (!request.body.title || !request.body.body) {
      response.status(400).json({ error: "Des champs sont manquants" });
    }
    try {
      let post = new Posts(
        request.body.title,
        request.body.body,
        authData.id,
        authData.picture_user,
        request.body.picture_post,
        "published",
        new Date().toLocaleDateString("fr")
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
const deletePost = async (request, response) => {
  const token = await extractToken(request);
  jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      console.log(err);
      response
        .status(401)
        .json({ error: "Requête non autorisée : le Token n'est pas bon" });
      return;
    }

    let postId = new ObjectId(request.body._id);

    try {
      // Vérifiez si le post existe et récupérez les détails
      let post = await client
        .db("mingle_sphere")
        .collection("post")
        .findOne({ _id: postId });

      if (!post) {
        response.status(404).json({ error: "Post non trouvé" });
        return;
      }

      // Vérifiez si l'utilisateur est autorisé à supprimer le post
      if (post.user_id !== authData.id || authData.role_id !== 1) {
        response.status(403).json({ error: "Requête non autorisée" });
        return;
      }

      // Supprimez le post
      await client
        .db("mingle_sphere")
        .collection("post")
        .deleteOne({ _id: postId });

      response.status(200).json({ message: "Post supprimé avec succès" });
    } catch (e) {
      console.log(e);
      response.status(500).json({ error: "Une erreur est survenue" });
    }
  });
};

// Modifier un post
const updatePost = async (request, response) => {
  const token = await extractToken(request);
  jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      console.log(err);
      response
        .status(401)
        .json({ err: "Requête non autorisée le Token n'est pas bon" });
      return;
    }
    let postId = new ObjectId(request.params.id);
    let post = await client
      .db("mingle_sphere")
      .collection("post")
      .findOne({ _id: postId });
    console.log(post._id);
    console.log(postId);
    if (post._id !== postId) {
      response.status(404).json({ error: "Post non trouvé" });
      return;
    }

    // Vérifiez si l'utilisateur est autorisé à supprimer le post
    if (post.user_id !== authData.id || authData.role_id !== 1) {
      response.status(403).json({ error: "Requête non autorisée" });
      return;
    }

    try {
      let title = request.body.title;
      let body = request.body.body;
      let picture_post = request.body.picture_post;
      let result = await client
        .db("mingle_sphere")
        .collection("post")
        .updateOne({ _id: postId }, { $set: { title, body, picture_post } });
      if (result.modifiedCount === 1) {
        response.status(200).json({ msg: "Modification réussie" });
      } else {
        response.status(404).json({ msg: "Vous n'avez rien modifié" });
      }
    } catch (error) {
      console.log(error);
      response.status(501).json(error);
    }
  });
};

module.exports = {
  createPost,
  getAllPost,
  getMyPost,
  deletePost,
  updatePost,
};

// const deletePost2 = async (request, response) => {
// const token = await extractToken(request);
//   jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
//     if (err) {
//       console.log(err);
//       response
//         .status(401)
//         .json({ err: "Requête non autorisée le Token n'est pas bon" });
//       return;
//     }
//      if (authData.id !== !request.body.user_id) {
//     response.status(400).json({ error: "Le champs id est manquant" });
//     return;
//   }

//     // const password = request.body.password;
//     // const email = authData.email;
//     // const hash = await bcrypt.hash(password, 10);
//     // const sqlModifRequest = `UPDATE user SET password = ? WHERE email = ?`;

//     // const modifValues = [hash, email];
//     // const [rows] = await pool.execute(sqlModifRequest, modifValues);
//     // if (rows.affectedRows > 0) {
//     //   response
//     //     .status(201)
//     //     .json({ success: "Mofification mot de passe réussi" });
//     //   return;
//     // } else {
//     //   response.status(500).json({ error: "L'nscription a échoué" });
//     //   return;
//     // }
//   });
// };

//   if (!request.body.user_id) {
//     response.status(400).json({ error: "Le champs id est manquant" });
//     return;
//   }
//   let id = new ObjectId(request.body.id);

//   const token = await extractToken(request);

//   jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
//     if (err) {
//       console.log(err);
//       response
//         .status(401)
//         .json({ err: "Requête non autorisée le Token n'est pas bon" });
//       return;
//     }

//     let post = await client
//       .db("mingle_sphere")
//       .collection("post")
//       .find({ user_id: authData.id });
//     if (!post) {
//       response.status(401).json({ error: "Requête non autorisée" });
//       return;
//     }
//     if (authData.id !== post.user_id || authData.role_id !== "1") {
//       response.status(401).json({ error: "Requête non autorisée" });
//       return;
//     }
//     try {
//       await client
//         .db("mingle_sphere")
//         .collection("post")
//         .deleteOne({ _id: id });
//     } catch (e) {
//       console.log(e);
//       response.status(500).json(e);
//     }
//   });
// };
