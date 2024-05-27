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

let cards = document.querySelector(".cards");

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
