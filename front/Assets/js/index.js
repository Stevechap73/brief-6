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

async function getAllPost() {
  let apiCall = await fetch("http://localhost:3003/post/all");
  let response = await apiCall.json();
  console.log(response);
  response.forEach((post) => {
    let imageUrl = `http://localhost:3003/uploads/${post.picture_id}`;
    console.log(imageUrl);
    cards.innerHTML += `<div class="card ms-3" style="width: 25rem;">
                        <img src="${imageUrl}" class="card-img-top img-fluid" style="height: auto" alt="Image ${post.user_name}" />
                        <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${post.body}</p>
                        </div>
                        </div>`;
  });
  //  <a href="" class="btn btnDelet btn-primary">Supprimer</a>
  //  <a href="" class="btn btnEdit btn-primary">Modifer</a>
  // let btn = document.querySelector(`.btnDelet-${post.id}`);
  // btn.addEventListener("click", () => {
  //   deleteEquipment(post.id);
  // });

  // let btn2 = document.querySelector(`.btnEdit-${post.id}`);
  // btn2.addEventListener("click", () => {
  //   UpdateEquipment(post.id, post);
  // });
}

getAllPost();
