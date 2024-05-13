const express = require("express");
const app = express();
const cors = require("cors");
const { connect } = require("./Connections/mongodbConnection");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/Public"));
app.use(cors());
app.use(express.json());

// Connexion mongodb
connect(process.env.MONGODB_URL, (error) => {
  if (error) {
    console.log("Failed to connect");
    process.exit(-1);
  }
});

app.listen(process.env.PORT, () => {
  console.log("im listening on port", process.env.PORT);
});
