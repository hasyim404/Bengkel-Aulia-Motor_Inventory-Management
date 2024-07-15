require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const FileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createServer } = require("http");
const routes = require("./routes");

const options = {
  key: fs.readFileSync(
    "/etc/letsencrypt/live/aulia-motor.suika.pw/privkey.pem"
  ),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/aulia-motor.suika.pw/fullchain.pem"
  ),
};

const app = express();
const PORT = process.env.PORT;
const DOMAIN = process.env.DOMAIN;
const server = createServer(app, options);

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
  console.log(`Website running:\nPORT : ${PORT}\nURL: ${DOMAIN}`)
);
