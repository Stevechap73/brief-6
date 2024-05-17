const validator = require("validator");

const verifRegister = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // const role_id = req.body.role_id;
  const user_name = req.body.user_name;
  // const picture_user = req.body.picture_user;

  //  vérification du body
  if (!validator.isEmail(email)) {
    return res.json({
      message: "Votre mail n'est pas conforme voir ex : example@exemple.com",
    });
  }
  if (!validator.isAlphanumeric(password)) {
    return res.json({
      message:
        "Votre mot de passe ne doit contenir que des lettres et des chiffres",
    });
  }
  // if (!validator.isNumeric(role_id)) {
  //   return res.json({ message: "Role ne doit contenir que des chiffres" });
  // }
  if (!validator.isAlpha(user_name)) {
    return res.json({ message: "Nom doit contenir que des lettres" });
  }

  req.email = email;
  req.password = password;
  // req.role_id = role_id;
  req.user_name = user_name;
  next();
};

module.exports = { verifRegister };
