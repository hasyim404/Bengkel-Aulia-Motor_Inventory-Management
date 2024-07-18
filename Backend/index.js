require("dotenv").config();
process.env.OPENSSL_CONF;
const METHOD = process.env.METHOD;

const express = require("express");
const cors = require("cors");
const { createServer } = require(METHOD);
const routes = require("./routes");
const path = require("path");
const FileUpload = require("express-fileupload");
const fs = require("fs");
const bodyParser = require("body-parser");

const PORT = process.env.PORT;
const DOMAIN = process.env.DOMAIN;

// If Running Local, disable options
const options = {
  key: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/privkey.pem`),
  cert: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/fullchain.pem`),
};

const app = express();
const server = createServer(options, app); // If Running Local, disable options

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

server.listen(PORT, () => {
  if (process.env.HOSTING === "true") {
    console.log(
      `# Website running (Hosting) #\n- PORT : ${PORT}\n- URL: ${METHOD}://${DOMAIN}`
    );
  } else {
    console.log(
      `# Website running (Local) #\n- PORT : ${PORT}\n- URL: ${METHOD}://${DOMAIN}:${PORT}`
    );
  }
});
