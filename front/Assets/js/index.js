// let jwt = window.localStorage.getItem("jwt");
// if (!jwt || jwt === "undefined" || jwt.length < 20) {
//   window.location.href = "../../Views/auth/login.html";
// }

function logout() {
  localStorage.removeItem("jwt");
  window.location.href = "../../Views/auth/login.html";
}

function pageRegister() {
  window.location.href = "./Views/auth/register.html";
}

function pageLogin() {
  window.location.href = "./Views/auth/login.html";
}

function pageRegister3() {
  window.location.href = "../../Views/auth/register.html";
}

function pageAddEquipment() {
  window.location.href = "./insertEquipment.html";
}

// // affiche les équipements disponible à la location
// let cards = document.querySelector(".cards");

// async function getAllEquipment() {
//   let apiCall = await fetch("http://localhost:3003/equipment/all");
//   let response = await apiCall.json();
//   console.log(response);
//   console.log(response.result);
//   response.result.forEach((equipment) => {
//     let imageUrl = `http://localhost:3003/uploads/${equipment.image}`;
//     console.log(imageUrl);
//     cards.innerHTML += `<div class="card ms-3" style="width: 25rem;">
//                         <img src="${imageUrl}" class="card-img-top img-fluid" style="height: auto" alt="Image ${equipment.name}" />
//                         <div class="card-body">
//                         <h5 class="card-title">${equipment.name}</h5>
//                         <p class="card-text">${equipment.description}</p>
//                         <h6 class="card-title">Prix de la location : ${equipment.price} €/jour</h6>
//                         <p class="card-text">${equipment.disponibilite}</p>
//                         <a href="" class="btn btn-primary">Supprimer</a>
//                         <a href="" class="btn btn-primary">Modifer</a>
//                         </div>
//                         </div>`;
//   });
// }

// getAllEquipment();

// affiche les équipements avec bouton sup et update disponible à la location

let cards = document.querySelector(".cards");
// async function getAllPost2() {
//   let apiCall = await fetch("http://localhost:3003/post/all");
//   let response = await apiCall.json();
//   console.log(response);
//   response.forEach((post) => {
//     let imageUrl = `http://localhost:3003/uploads/${post.picture_id}`;
//     let imageUrl2 = `http://localhost:3003/uploads/${post.picture_id}`;
//     cards.innerHTML += `<div class="card ms-3" style="width: 25rem;">
//                         <img src="${imageUrl}" class="card-img-top img-fluid rounded-circle" style="height: auto" alt="Image ${post.user_name}" />
//                         <div class="card-header">${post.user_id} ${imageUrl2}
//                         Featured
//                         </div>
//                         <div class="card-body">
//                         <h5 class="card-title">${post.title}</h5>
//                         <p class="card-text">${post.body}</p>
//                         </div>
//                         <i class="bi bi-chat-heart-fill" style="font-size: 2rem; color: cornflowerblue;"></i>
//                         <a href="" class="btn btnDelet btn-primary">Supprimer</a>
//                         <a href="" class="btn btnEdit btn-danger">Modifer</a>
//                         </div>`;
//   });

//   let bi = document.querySelector(`.btnDelet-${post.id}`);
//   bi.addEventListener("click", () => {
//     deleteEquipment(post.id);
//   });

//   let btn = document.querySelector(`.btnEdit-${post.id}`);
//   btn.addEventListener("click", () => {
//     deleteEquipment(post.id);
//   });

//   let btn2 = document.querySelector(`.btnEdit-${post.id}`);
//   btn2.addEventListener("click", () => {
//     UpdateEquipment(post.id, post);
//   });
// }

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
              <!-- Modification ici : ajout des attributs de données pour stocker l'état du like et le nombre de likes -->
              <i class="fa-solid fa-heart heart" data-liked="false" data-count="0" style="font-size: 2rem; color: cornflowerblue;"></i>
              <p id="heartCount-${post._id}" class="d-inline">0</p>
            </div>
          </div>
          <div>
            <i class="fa-solid fa-comment comment" style="font-size: 2rem; color: cornflowerblue;"></i>
          </div>
        </div>
    `;

    cards.appendChild(postElement);

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

getAllPost();
