const express = require("express");
const cors = require("cors");
const { createServer } = require("https");
const routes = require("./routes");
const path = require("path");
const FileUpload = require("express-fileupload");
const fs = require("fs");
const bodyParser = require("body-parser");
require("dotenv").config();

const PORT = process.env.PORT;
const METHOD = process.env.METHOD;
const DOMAIN = process.env.DOMAIN;

const options = {
  key: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/privkey.pem`),
  cert: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/fullchain.pem`),
};

const app = express();
const server = createServer(options, app);

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(FileUpload());
app.use(routes);

app.use("/api", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is online...",
  });
});

app.use(express.static(path.join(__dirname, "../Frontend/dist")));
app.use("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "../Frontend/dist", "index.html"));
});

server.listen(PORT, () =>
  console.log(`Website running:\nPORT : ${PORT}\nURL: ${METHOD}${DOMAIN}`)
);
