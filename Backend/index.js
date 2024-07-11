const express = require("express");
const FileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createServer } = require("http");
const routes = require("./routes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 1023;
const server = createServer(app);

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(FileUpload());
app.use(routes);

app.use("/testing", (req, res) => {
  return res.send("Server Running~");
});

server.listen(PORT, () =>
  console.log(`Server already running at http://localhost:${PORT}`)
);
