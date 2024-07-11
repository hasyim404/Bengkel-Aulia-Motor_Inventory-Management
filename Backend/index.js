require("dotenv").config();
const express = require("express");
const FileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createServer } = require("http");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT;
const server = createServer(app);

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(FileUpload());
app.use(routes);

app.use("/", (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Server Running...",
    host: `${req.protocol}://${req.get("host")}/`,
  });
});

server.listen(PORT, () =>
  console.log(`Server already running at http://localhost:${PORT}`)
);
