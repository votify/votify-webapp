var express = require("express");
const { response } = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/register", (req, res) => {
  res.render("register", { layout: "layout" });
});

router.post("/register", (req, res) => {
});

router.get("/check-register", (req, res) => {
  res.render("check-register", { layout: "layout" });
});

router.post("/check-register", (req, res) => {
  res.render("check-register", { layout: "layout" });
});

router.get("/votelist", function (req, res, next) {
  fetch("https://blockchain-node-01.herokuapp.com/elections",{
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      for (let index = 0; index < data.length; index++)
      {
        data[index].deadline = moment(data[index].deadline).format(
          "MMM Do, YYYY"
        );
      }
      res.render("votelist", {
         layout: "layout",
         title = "Election List",
         elections: data,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        next(error);
      });
});

router.get("/votelist/:id", function (req, res, next) {
  const id = req.params['id'];
  fetch("https://blockchain-node-01.herokuapp.com/elections",{
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      for (let index = 0; index < data.length; index++)
      {
        data[index].deadline = moment(data[index].deadline).format(
          "MMM Do, YYYY"
        );
      }
      res.render("vote", {
         layout: "layout",
         title = "Election List",
         elections: data,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        next(error);
      });
});

router.post("/votelist/:id", (req, res) => {
  const id = req.params['id'];
  res.render("vote", { layout: "layout" });

  const data = { ...req.body };

  const { year, name, nominee, privKey } = data;

  const convertedPrivKey = Buffer.from(privKey, 'utf8');

  const signObj = secp256k1.ecdsaSign(msg, convertedPrivKey)

  const _data = {
    type:"vote",
    data: { year: year, name: name, nominee: nominee },
    signature: signObj,
  };

  const url = "https://blockchain-node-01.herokuapp.com/";
  await axios
    .post(url, { _data })
    .then((result) => {
      res.status(result.status).json(result, convertedPrivKey);
    })
    .catch((err) => {
      res.status(200).json(err);
    });

  console.log(hash);

  a;
  res.status(200).json({ msg: "success" });
  
});

module.exports = router;
