// Express and Init
const express = require("express");
const app = express();
const config = require("./Config/config");

//Banco de dados
const mongoose = require("mongoose");
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(config.bd_url, options);
mongoose.set("useCreateIndex", true);
mongoose.connection.on("error", (err) => {
  console.log("Erro na conhexão com o banco de dados:\n" + err);
});
mongoose.connection.on("disconnected", () => {
  console.log("Aplicação desconectada do banco de dados!\n");
});
mongoose.connection.on("connected", () => {
  console.log("Aplicação conectada ao banco de dados!\n");
});
// Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Router
const skyRouter = require("./Router/skyRouter");
app.use("/", skyRouter);

app.listen(3000);
module.exports = app;
