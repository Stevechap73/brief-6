// Logout
function logout() {
  localStorage.removeItem("jwt");
  window.location.href = "../../Views/auth/login.html";
}

// Insertion d'un post
async function handleInsertPost() {
  let image = document.querySelector(".image");
  let title = document.querySelector(".title").value;
  let body = document.querySelector(".message").value;

  // insertion picture
  const formData = new FormData();
  formData.append("image", image.files[0]);

  const response = await fetch("http://localhost:3003/post/add/picture", {
    method: "POST",
    body: formData,
  });
  let data = await response.json();
  if (response.status === 200) {
    let uploadedImage = data.newFileName;
    console.log(uploadedImage);
    let user = {
      title: title,
      body: body,
      picture_post: uploadedImage,
    };
    console.log(user);
    // Insert du post
    try {
      let response = await fetch("http://localhost:3003/post/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify(user),
      });
      console.log(user);
      if (response.ok) {
        alert("Vous êtes un super génie, votre post est publié !");
        window.location.reload();
      } else {
        console.log("Vous n'avez pas de chance, votre post n'est pas publié !");
        return;
      }
    } catch (error) {
      console.error("Erreur lors de la tentative d'enregistrement:", error);
    }
  }
}

// Génération des cards pour affichage dans le front
let cards2 = document.querySelector(".cards2");

// Affichage des posts user
async function getMyPost2() {
  let token = window.localStorage.getItem("jwt");
  let apiCall = await fetch("http://localhost:3003/post/myPost", {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!apiCall.ok) {
    console.error(
      "Erreur lors de la récupération des posts:",
      apiCall.statusText
    );
    return;
  }
  let response = await apiCall.json();
  console.log(response);

  response.forEach((post) => {
    let imageUrlU1 = `http://localhost:3003/uploads/${post.picture_user}`;
    let imageUrlU2 = `http://localhost:3003/uploads/${post.picture_post}`;

    // Création de la card utilisateur
    let postElement1 = document.createElement("div");
    postElement1.classList.add("card", "ms-3");
    postElement1.style.width = "25rem";
    postElement1.innerHTML = `<div class="card" style="width: 18rem">
                                <img src="${imageUrlU1}" class="image card-img-top rounded-circle" alt="${post.user_name}" />
                                <div class="card-body">
                                  <h5 class="card-title title">${post.user_name}</h5>
                                  <p class="card-text">
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                  </p>
                                  <ul class="list-group list-group-flush text-center">
                                    <li class="list-group-item"></li>
                                    <li class="list-group-item">
                                      Following
                                      <p class="nbFollowing">35</p>
                                    </li>
                                    <li class="list-group-item">
                                      Followers
                                      <p class="nbFollowing">10</p>
                                    </li>
                                    <li class="list-group-item"></li>
                                  </ul>
                                  <a href="#" class="btn btn-primary">Go somewhere</a>
                                </div>
                              </div>`;
    document.getElementById("cards1").appendChild(postElement1);

    // Fin d'affchage

    let postElement = document.createElement("div");
    postElement.classList.add("card", "ms-3");
    postElement.style.width = "40rem";
    postElement.innerHTML += `
                        <div class="card-header d-flex justify-content-between">
                        <div class="d-inline">
                        <img src="${imageUrlU1}" class="card-img-top img-fluid rounded-circle" style="height: auto; width:50px" alt="Image ${post.user_name}" />
                        <h5 class="card-title d-inline ms-2">${post.user_name}</h5>
                        </div>
                        <p class="card-text d-inline ms-5">${post.status} le ${post.createdAt}</p>
                        </div>
                        <h5 class="card-title mt-3">${post.title}</h5>
                        <div class="card-body text-center">
                        <img src="${imageUrlU2}" class="card-img-top img-fluid" style="height: auto; width:300px" alt="Image ${post.user_post}" />
                        </div>
                        <div class="card-body">                       
                        
                        <p class="card-text">${post.body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                        <div>
                        <div>
                        <i class="fa-solid fa-heart heart heartColor" style="font-size: 2rem; color: cornflowerblue;"></i>
                        <p id="heartCount" class="d-inline">0</p>
                        </div>
                        </div>
                        <div>
                        <i class="fa-solid fa-comment comment" style="font-size: 2rem; color: cornflowerblue;"></i>
                        </div>
                        <div>
                        <button type="submit" class="btn btnDelet btn-outline-danger"><i class="fa-regular fa-trash-can"></i></button>
                       
                        <button
                        type="button"
                        class="btn btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#modalEdit"
                        data-bs-whatever="@mdo"
                      >
                        <i class="fa-solid fa-pencil"></i>
                      </button>
                      <div
                        class="modal fade"
                        id="modalEdit"
                        tabindex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div class="modal-dialog">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h1 class="modal-title fs-5" id="exampleModalLabel">
                                Modification d'un post
                              </h1>
                              <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div class="modal-body">
                              <form>
                                <div class="mb-3">
                                  <label for="recipient-name" class="col-form-label"
                                    >Titre du post :</label
                                  >
                                  <input
                                    type="text"
                                    class="form-control editTitle"
                                    id="recipient-name"
                                  />
                                </div>
                                <div class="mb-3">
                                  <label for="message-text" class="col-form-label"
                                    >Message :</label
                                  >
                                  <textarea
                                    class="form-control editMessage"
                                    id="message-text"
                                  ></textarea>
                                </div>
                                <div class="mb-3">
                                  <label for="image" class="col-form-label"
                                    >Image :</label
                                  >
                                  <input
                                    type="file"
                                    class="form-control editImage"
                                    id="image"
                                  />
                                </div>
                              </form>
                            </div>
                            <div class="modal-footer">
                              <button
                                type="button"
                                class="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Fermé
                              </button>
                              <button
                                type="button"
                                class="btn btn-primary btnEdit"
                              >
                                Modification du post
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      </div>
                      </div>
                      </div>`;

    cards2.appendChild(postElement);

    let deleteBtn = postElement.querySelector(`.btnDelet`);
    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      deletePost(post._id);
      window.location.reload();
    });
    let editBtn = postElement.querySelector(`.btnEdit`);
    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      updatePost(post._id);
    });
    let like = postElement.querySelector(`.heart`);
    let heartCount = 0;
    like.addEventListener("click", (e) => {
      like.classList.toggle("heartColor");
      if (like.classList.contains("heartColor")) {
        like.style.color = "cornflowerblue";
        heartCount--;
      } else {
        like.style.color = "red";
        heartCount++;
      }
      updateHeartCount();

      // Compte le nombre de like
      function updateHeartCount() {
        console.log(`Nombre de hearts: ${heartCount}`);
        let heartCountElement = document.querySelector("#heartCount");
        if (heartCountElement) {
          heartCountElement.textContent = `${heartCount}`;
        }
      }
    });
  });
}

// Affichage des posts user
// async function getMyPost() {
//   let token = window.localStorage.getItem("jwt");
//   let apiCall = await fetch("http://localhost:3003/post/myPost", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json; charset=utf-8",
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   if (!apiCall.ok) {
//     console.error(
//       "Erreur lors de la récupération des posts:",
//       apiCall.statusText
//     );
//     return;
//   }
//   let response = await apiCall.json();
//   console.log(response);

//   if (response.length > 0) {
//     let user = response[0]; // Prendre les informations de l'utilisateur à partir du premier post
//     let imageUrlU1 = `http://localhost:3003/uploads/${user.picture_user}`;

//     // Création de la carte utilisateur
//     let userCard = document.createElement("div");
//     userCard.classList.add("card", "ms-3");
//     userCard.style.width = "40rem";
//     userCard.innerHTML = `
//       <div class="card" style="width: 18rem">
//         <img src="${imageUrlU1}" class="image card-img-top rounded-circle" style="height: auto; width:50px" alt="${user.user_name}" />
//         <div class="card-body">
//           <h5 class="card-title title">${user.user_name}</h5>
//           <p class="card-text">
//             Some quick example text to build on the card title and make up the
//             bulk of the card's content.
//           </p>
//           <ul class="list-group list-group-flush text-center">
//             <li class="list-group-item"></li>
//             <li class="list-group-item">
//               Following
//               <p class="nbFollowing">35</p>
//             </li>
//             <li class="list-group-item">
//               Followers
//               <p class="nbFollowing">10</p>
//             </li>
//             <li class="list-group-item"></li>
//           </ul>
//           <a href="#" class="btn btn-primary">Go somewhere</a>
//         </div>
//       </div>
//       <div class="card-body" id="postsContainer">
//         <!-- Les posts de l'utilisateur seront ajoutés ici -->
//       </div>`;

//     cards2.appendChild(userCard);

//     let postsContainer = document.getElementById("postsContainer");

//     response.forEach((post) => {
//       let imageUrlU2 = `http://localhost:3003/uploads/${post.picture_post}`;

//       let postElement = document.createElement("div");
//       postElement.classList.add("card", "mb-3");
//       postElement.style.width = "100%";
//       postElement.innerHTML = `
//         <div class="card-header d-flex justify-content-between">
//           <div class="d-inline">
//             <img src="${imageUrlU1}" class="card-img-top img-fluid rounded-circle" style="height: auto; width:50px" alt="Image ${post.user_name}" />
//             <h5 class="card-title d-inline ms-2">${post.user_name}</h5>
//           </div>
//           <p class="card-text d-inline ms-5">${post.status} le ${post.createdAt}</p>
//         </div>
//         <h5 class="card-title mt-3">${post.title}</h5>
//         <div class="card-body text-center">
//           <img src="${imageUrlU2}" class="card-img-top img-fluid" style="height: auto; width:300px" alt="Image ${post.user_post}" />
//         </div>
//         <div class="card-body">
//           <p class="card-text">${post.body}</p>
//         </div>
//         <div class="card-footer d-flex justify-content-between">
//           <div>
//             <div>
//               <i class="fa-solid fa-heart heart heartColor" style="font-size: 2rem; color: cornflowerblue;"></i>
//               <p id="heartCount-${post._id}" class="d-inline">0</p>
//             </div>
//           </div>
//           <div>
//             <i class="fa-solid fa-comment comment" style="font-size: 2rem; color: cornflowerblue;"></i>
//           </div>
//           <div>
//             <button type="submit" class="btn btnDelet btn-outline-danger"><i class="fa-regular fa-trash-can"></i></button>
//             <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalEdit-${post._id}" data-bs-whatever="@mdo">
//               <i class="fa-solid fa-pencil"></i>
//             </button>
//           </div>
//         </div>

//         <!-- Modal pour la modification du post -->
//         <div class="modal fade" id="modalEdit-${post._id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//           <div class="modal-dialog">
//             <div class="modal-content">
//               <div class="modal-header">
//                 <h1 class="modal-title fs-5" id="exampleModalLabel">Modification d'un post</h1>
//                 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//               </div>
//               <div class="modal-body">
//                 <form>
//                   <div class="mb-3">
//                     <label for="recipient-name" class="col-form-label">Titre du post :</label>
//                     <input type="text" class="form-control editTitle" id="recipient-name" />
//                   </div>
//                   <div class="mb-3">
//                     <label for="message-text" class="col-form-label">Message :</label>
//                     <textarea class="form-control editMessage" id="message-text"></textarea>
//                   </div>
//                   <div class="mb-3">
//                     <label for="image" class="col-form-label">Image :</label>
//                     <input type="file" class="form-control editImage" id="image" />
//                   </div>
//                 </form>
//               </div>
//               <div class="modal-footer">
//                 <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermé</button>
//                 <button type="button" class="btn btn-primary btnEdit">Modification du post</button>
//               </div>
//             </div>
//           </div>
//         </div>`;

//       postsContainer.appendChild(postElement);

//       let deleteBtn = postElement.querySelector(`.btnDelet`);
//       deleteBtn.addEventListener("click", (e) => {
//         e.preventDefault();
//         deletePost(post._id);
//         window.location.reload();
//       });

//       let editBtn = postElement.querySelector(`.btnEdit`);
//       editBtn.addEventListener("click", (e) => {
//         e.preventDefault();
//         updatePost(post._id);
//       });

//       let like = postElement.querySelector(`.heart`);
//       let heartCount = 0;
//       like.addEventListener("click", (e) => {
//         like.classList.toggle("heartColor");
//         if (like.classList.contains("heartColor")) {
//           like.style.color = "cornflowerblue";
//           heartCount++;
//         } else {
//           like.style.color = "red";
//           heartCount--;
//         }
//         updateHeartCount();

//         // Compte le nombre de like
//         function updateHeartCount() {
//           console.log(`Nombre de hearts: ${heartCount}`);
//           let heartCountElement = postElement.querySelector(
//             `#heartCount-${post._id}`
//           );
//           if (heartCountElement) {
//             heartCountElement.textContent = `${heartCount}`;
//           }
//         }
//       });
//     });
//   }
// }
async function getMyPost() {
  let token = window.localStorage.getItem("jwt");
  let apiCall = await fetch("http://localhost:3003/post/myPost", {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!apiCall.ok) {
    console.error(
      "Erreur lors de la récupération des posts:",
      apiCall.statusText
    );
    return;
  }
  let response = await apiCall.json();
  console.log(response);

  if (response.length > 0) {
    let user = response[0]; // Prendre les informations de l'utilisateur à partir du premier post
    let imageUrlU1 = `http://localhost:3003/uploads/${user.picture_user}`;

    // Création de la carte utilisateur
    let userCard = document.createElement("div");
    // userCard.classList.add("card", "ms-5");
    // userCard.style.width = "20rem";
    userCard.innerHTML = `
      <div class="card " style="width: 18rem; margin-left:100px;">
      <div class="card-header d-flex justify-content-between">
        <div class="d-inline">
        <img src="${imageUrlU1}" class="image card-img-top rounded-circle text-center" style="height: auto; width:50px" alt="${user.user_name}" />
        <h5 class="card-title title d-inline ms-4">Utilisateur ${user.user_name}</h5>
        </div>
        </div>
        <div class="card-body">
         <div class=" d-flex align-items-center  justify-content-center">
          <h6 class="card-text">
            Posts publiés
          </h6>
          </div>
          <ul class="list-group list-group-flush text-center">
            <li class="list-group-item"></li>
            <li class="list-group-item">
              Abonnements
              <p class="nbFollowing">35</p>
            </li>
            <li class="list-group-item">
              Abonnés
              <p class="nbFollowing">10</p>
            </li>
            <li class="list-group-item"></li>
          </ul>
          <a href="#" class="btn btn-primary">Aller quelque part</a>
        </div>
      </div>`;

    cards2.appendChild(userCard);

    // Conteneur pour les posts
    let postsContainer = document.createElement("div");
    postsContainer.classList.add("posts-container");
    cards2.appendChild(postsContainer);

    response.forEach((post) => {
      let imageUrlU2 = `http://localhost:3003/uploads/${post.picture_post}`;

      let postElement = document.createElement("div");
      postElement.classList.add("card", "mb-4");
      postElement.style.width = "130%";
      postElement.innerHTML = `
        <div class="card-header d-flex justify-content-between">
          <div class="d-inline">
            <img src="${imageUrlU1}" class="card-img-top img-fluid rounded-circle" style="height: auto; width:50px" alt="Image ${post.user_name}" />
            <h5 class="card-title d-inline ms-2">${post.user_name}</h5>
          </div>
          <p class="card-text d-inline ms-5">${post.status} le ${post.createdAt}</p>
        </div>
        <h5 class="card-title mt-3 ms-3">${post.title}</h5>
        <div class="card-body text-center">
          <img src="${imageUrlU2}" class="card-img-top img-fluid" style="height: auto; width:300px" alt="Image ${post.user_post}" />
        </div>
        <div class="card-body">
          <p class="card-text">${post.body}</p>
        </div>
        <div class="card-footer d-flex justify-content-between">
          <div>
            <div>
              <i class="fa-solid fa-heart heart heartColor" style="font-size: 2rem; color: cornflowerblue;"></i>
              <p id="heartCount-${post._id}" class="d-inline">0</p>
            </div>
          </div>
          <div>
            <i class="fa-solid fa-comment comment" style="font-size: 2rem; color: cornflowerblue;"></i>
          </div>
          <div>
            <button type="submit" class="btn btnDelet btn-outline-danger"><i class="fa-regular fa-trash-can"></i></button>
            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalEdit-${post._id}" data-bs-whatever="@mdo">
              <i class="fa-solid fa-pencil"></i>
            </button>
          </div>
        </div>

        <!-- Modal pour la modification du post -->
        <div class="modal fade" id="modalEdit-${post._id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Modification d'un post</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form>
                  <div class="mb-3">
                    <label for="recipient-name" class="col-form-label">Titre du post :</label>
                    <input type="text" class="form-control editTitle" id="recipient-name" />
                  </div>
                  <div class="mb-3">
                    <label for="message-text" class="col-form-label">Message :</label>
                    <textarea class="form-control editMessage" id="message-text"></textarea>
                  </div>
                  <div class="mb-3">
                    <label for="image" class="col-form-label">Image :</label>
                    <input type="file" class="form-control editImage" id="image" />
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                <button type="button" class="btn btn-primary btnEdit">Modifier le post</button>
              </div>
            </div>
          </div>
        </div>`;

      postsContainer.appendChild(postElement);

      let deleteBtn = postElement.querySelector(`.btnDelet`);
      deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        deletePost(post._id);
        window.location.reload();
      });

      let editBtn = postElement.querySelector(`.btnEdit`);
      editBtn.addEventListener("click", (e) => {
        e.preventDefault();
        updatePost(post._id);
        window.location.reload();
      });

      let like = postElement.querySelector(`.heart`);
      let heartCount = 0;
      like.addEventListener("click", (e) => {
        like.classList.toggle("heartColor");
        if (like.classList.contains("heartColor")) {
          like.style.color = "cornflowerblue";
          heartCount++;
        } else {
          like.style.color = "red";
          heartCount--;
        }
        updateHeartCount();

        // Compte le nombre de likes
        function updateHeartCount() {
          console.log(`Nombre de likes: ${heartCount}`);
          let heartCountElement = postElement.querySelector(
            `#heartCount-${post._id}`
          );
          if (heartCountElement) {
            heartCountElement.textContent = `${heartCount}`;
          }
        }
      });
    });
  }
}

// Fonction pour supprimer un post
async function deletePost(postId) {
  let token = window.localStorage.getItem("jwt");

  try {
    let apiCall = await fetch(`http://localhost:3003/post/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ _id: postId }),
    });
    // if (apiCall.ok) {
    //   console.log("Post supprimé avec succès");
    //   // Supprimez le post du DOM
    //   document.querySelector(`.btnDelet-${postId}`).closest(".card").remove();
    // } else {
    //   let errorResponse = await apiCall.json();
    //   console.error(
    //     "Erreur lors de la suppression du post:",
    //     errorResponse.error
    //   );
    // }
  } catch (error) {
    console.error("Erreur lors de la suppression du post:", error);
  }
}

// Modification d'un post
async function updatePost(postId) {
  let token = window.localStorage.getItem("jwt");

  // Récupérer les nouvelles valeurs des champs
  let newTitle = document.querySelector(".editTitle").value;
  let newMessage = document.querySelector(".editMessage").value;
  let newImageFile = document.querySelector(".editImage").files[0];

  // Préparer les données de mise à jour
  let updates = {};
  if (newTitle) updates.title = newTitle;
  if (newMessage) updates.body = newMessage;

  if (newImageFile) {
    // Télécharger l'image si une nouvelle image est sélectionnée
    const formData = new FormData();
    formData.append("image", newImageFile);

    const imageResponse = await fetch(
      "http://localhost:3003/post/add/picture",
      {
        method: "POST",
        body: formData,
      }
    );

    let imageData = await imageResponse.json();

    if (imageResponse.status === 200) {
      updates.picture_post = imageData.newFileName;
    } else {
      console.error("Échec du téléchargement de l'image:", imageData);
      return;
    }
  }

  // Vérifier si des modifications doivent être appliquées
  if (Object.keys(updates).length === 0) {
    console.log("Aucune modification détectée.");
    return;
  }

  // Envoyer la requête de mise à jour
  let request = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  };

  let apiRequest = await fetch(
    `http://localhost:3003/post/update/${postId}`,
    request
  );
  let result = await apiRequest.json();

  if (apiRequest.status === 200) {
    console.log("Post mis à jour avec succès:", result);
    window.location.reload();
  } else {
    console.error("Échec de la mise à jour du post:", result);
  }
}

getMyPost();
