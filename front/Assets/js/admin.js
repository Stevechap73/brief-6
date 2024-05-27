// Affichage de tous les posts
async function getAllPost() {
  let apiCall = await fetch("http://localhost:3003/post/all");
  let response = await apiCall.json();
  console.log(response);
  response.forEach((post) => {
    let imageUrlU1 = `http://localhost:3003/uploads/${post.picture_user}`;
    let imageUrlU2 = `http://localhost:3003/uploads/${post.picture_post}`;

    let postElement = document.createElement("div");
    postElement.classList.add("card", "mb-4");
    postElement.style.width = "50vw";
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
              <i class="fa-solid fa-heart heart" data-liked="false" data-count="0" style="font-size: 2rem; color: cornflowerblue;"></i>
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

    cards.appendChild(postElement);

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
    like.addEventListener("click", (e) => {
      // Récupération de l'état actuel et du compteur de likes
      let isLiked = like.getAttribute("data-liked") === "true";
      let heartCount = parseInt(like.getAttribute("data-count"));

      // Inversion de l'état du like et mise à jour du compteur
      if (isLiked) {
        like.setAttribute("data-liked", "false");
        like.style.color = "cornflowerblue";
        heartCount--;
      } else {
        like.setAttribute("data-liked", "true");
        like.style.color = "red";
        heartCount++;
      }

      // Mise à jour des attributs de données avec les nouvelles valeurs
      like.setAttribute("data-count", heartCount);
      updateHeartCount(heartCount);

      // Fonction de mise à jour du compteur de likes affiché
      function updateHeartCount(count) {
        console.log(`Nombre de likes: ${count}`);
        let heartCountElement = postElement.querySelector(
          `#heartCount-${post._id}`
        );
        if (heartCountElement) {
          heartCountElement.textContent = `${count}`;
        }
      }
    });
  });
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
      } else {
        console.log("Vous n'avez pas de chance, votre post n'est pas publié !");
        return;
      }
    } catch (error) {
      console.error("Erreur lors de la tentative d'enregistrement:", error);
    }
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

// Delete user par admin
async function deletePost(postId) {
  let token = window.localStorage.getItem("jwt");

  try {
    let apiCall = await fetch(`http://localhost:3003/post/delete/`, {
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

function logout() {
  localStorage.removeItem("jwt");
  window.location.href = "../../Views/auth/login.html";
}

getAllPost();
