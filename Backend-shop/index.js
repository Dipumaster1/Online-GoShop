const express = require("express");
const cors = require("cors");
const Connection = require("./Connection");
require("dotenv").config();
const Routes = require("./Routes/Route");
const { User, Shopkeeper, Executive } = require("./Model/UserModel/userModel");
const app = express();
app.use(express.json());
app.use(cors());
Connection();

app.use("/api", Routes);

app.listen(process.env.PORT_NO, () =>
  console.log("Server Started At:" + process.env.PORT_NO)
);
