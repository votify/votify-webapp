var express = require("express");
const secp256k1 = require("secp256k1");
const crypto = require("crypto");
const axios = require("axios");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/register", (req, res) => {
  res.render("register", { layout: "layout" });
});

router.post("/register", async (req, res) => {
  // const {type, data, signature, lock} // (hash) public + cmnd + ten +ngay thang nam sinh
  // const { data } = req.body;
  const data = { ...req.body };
  const { idnumber, fullname, birthday, birthmonth, birthyear } = data;

  const privKey = crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");

  const pubKey = secp256k1.publicKeyCreate(privKey);

  const dob = new Date(birthyear, birthmonth, birthday);
  const _data = {
    type: "users",
    data: { id: idnumber, name: fullname, dob: dob, pubKey },
    signature: null,
    lock: null,
  };
  const url = "https://blockchain-node-01.herokuapp.com/";
  await axios
    .post(url, { _data })
    .then((result) => {
      res.status(result.status).json(result, privKey);
    })
    .catch((err) => {
      res.status(200).json(err);
    });

  console.log(hash);

  a;
  res.status(200).json({ msg: "success" });
});

router.get("/check-register", (req, res) => {
  res.render("check-register", { layout: "layout" });
});

router.post("/check-register", (req, res) => {
  res.render("check-register", { layout: "layout" });
});

module.exports = router;
