const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const handlebars = require("express-handlebars");

const app = express();
const router = express.Router();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs",
  })
);

app.use("/hello", require("./routes/main.route"));

app.use((req, res, next) => {
  res.status(404).send("NOT FOUND");
});

app.use(function (err, req, res, next) {
  const code = err.code || 500;
  console.log(code, err.message);
  res.status(code).send(err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (_) => {
  console.log(`Webapp is running at http://localhost:${PORT}`);
});
