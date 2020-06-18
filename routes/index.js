var express = require("express");
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

router.get("/votelist", (req, res) => {
  res.render("votelist", { layout: "layout" });

  const year = req.params['year'];
  const nameOfElection = req.params['name'];
});

router.get("/votelist/:id", (req, res) => {
  const id = req.params['id'];
  res.render("vote", { layout: "layout" });

  const year = req.params['year'];
  const nameOfElection = req.params['name'];
  const nominee = req.params['nominee'];
});

router.post("/votelist/:id", (req, res) => {
  const id = req.params['id'];
  res.render("vote", { layout: "layout" });

  const data = { ...req.body };

  const { year, name, nominee, privKey } = data;

  const convertedPrivKey = Buffer.from(privKey, 'utf8');

  const pubKey = secp256k1.publicKeyCreate(convertedPrivKey);

  const signObj = secp256k1.ecdsaSign(msg, convertedPrivKey)

  const _data = {
    data: { year: year, name: name, nominee: nominee },
    signature: signObj,
    address: pubKey,
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
