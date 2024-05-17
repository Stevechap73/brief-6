async function handleRegister() {
  let image = document.querySelector(".image");
  let email = document.querySelector(".email").value;
  let password = document.querySelector(".password").value;
  let name = document.querySelector(".name").value;

  // insertion picture
  const formData = new FormData();
  formData.append("image", image.files[0]);

  const response = await fetch("http://localhost:3003/user/add/picture", {
    method: "POST",
    body: formData,
  });
  let data = await response.json();
  if (response.status === 200) {
    let uploadedImage = data.newFileName;
    console.log(uploadedImage);
    let user = {
      email: email,
      password: password,
      user_name: name,
      picture_user: uploadedImage,
    };
    console.log(user.name);

    try {
      let response = await fetch("http://localhost:3003/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(user),
      });
      console.log(user);
      if (response.ok) {
        alert(" tu es fort l'utilisateur est enregistré avec succès.");
        window.location.href = "./login.html";
      } else {
        console.log(" tu es pas bon l'utilisateur n'est pas enregistré.");
        return;
      }
    } catch (error) {
      console.error("Erreur lors de la tentative d'enregistrement:", error);
    }
  }
}

async function handleLogin() {
  let email = document.querySelector(".email").value;
  let password = document.querySelector(".password").value;

  let user = {
    identifier: email,
    password: password,
  };

  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(user),
  };

  let apiRequest = fetch("http://localhost:3003/user/login", request);
  let response = await apiRequest;
  let data = await response.json();
  console.log(response);
  if (response.status === 200) {
    let jwt = data.jwt;
    let role = data.role;
    window.localStorage.setItem("jwt", jwt);
    console.log(jwt);
    console.log(role);
    if (role === "admin") {
      window.location.href = "../../Views/admin/admin.html";
    } else {
      window.location.href = "../../Views/user/user.html";
    }
  } else {
    alert("Mauvais identifiants");
  }
}

// async function handleLogin() {
//   let email = document.querySelector(".email").value;
//   let password = document.querySelector(".password").value;

//   let user = {
//     identifier: email,
//     password: password,
//   };
//   let request = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json; charset=utf-8",
//     },
//     body: JSON.stringify(user),
//   };
//   let apiRequest = fetch("http://localhost:3003/user/login", request);
//   let response = await apiRequest;
//   let data = await response.json();
//   console.log(response);
//   if (response.status === 200) {
//     let jwt = data.jwt;
//     let role = data.role;
//     window.localStorage.setItem("jwt", jwt);
//     console.log(role);
//     if (role === "admin") {
//       window.location.href = "../../VieWs/admin/admin.html";
//     } else {
//       window.location.href = "../../Views/user/user.html";
//     }
//   } else {
//     alert("Mauvais identifiants");
//   }
// }

// async function handleRegister() {
//   let image = document.querySelector(".image");
//   let email = document.querySelector(".email").value;
//   let password = document.querySelector(".password").value;
//   let name = document.querySelector(".name").value;

//   // insertion picture
//   const formData = new FormData();
//   formData.append("image", image.files[0]);

//   const response = await fetch("http://localhost:3003/user/add/picture", {
//     method: "POST",
//     body: formData,
//   });
//   let data = await response.json();
//   if (response.status === 200) {
//     let uploadedImage = data.newFileName;

//     let user = {
//       email: email,
//       password: password,
//       name: name,
//       image: uploadedImage,
//     };

//     let request = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json; charset=utf-8",
//       },
//       body: JSON.stringify(user),
//     };
//     const Response = await fetch(
//       "http://localhost:3003/user/register",
//       request
//     ).then((res) => {
//       if (res.status === 201) {
//         alert("inserted");
//       }
//     });
//   }
// }
