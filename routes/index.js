var express = require("express");
var fetch = require("node-fetch");
const axios = require("axios");
const { response } = require("express");
const secp256k1 = require("secp256k1");
const crypto = require("crypto");
const createError = require("http-errors");
var router = express.Router();

const { server } = require("../config/config.json");
const { baseURL } = server;
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

  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(JSON.stringify(data)))
    .digest();

  let privKey;
  do {
    privKey = hash;
  } while (!secp256k1.privateKeyVerify(privKey));
  console.log("privKey", privKey);

  const pubKey = secp256k1.publicKeyCreate(privKey);
  console.log("pubKey", pubKey);

  const dob = new Date(birthyear, birthmonth, birthday);
  const _data = {
    type: "users",
    data: { id: idnumber, name: fullname, dob: dob, pubKey },
    signature: null,
    lock: null,
  };
  console.log(_data);
  const url = `${baseURL}/action`;
  console.log("baseURL", baseURL);
  await axios
    .post(url, _data)
    .then((result) => {
      console.log("result", result);
      res.status(200).json({ success: true }, result, privKey);
    })
    .catch((err) => {
      // throw err;
      // console.log(err);
      // throw new createError(err.response.status, err.response.statusText);
      res.status(err.response.status).json(err.response.statusText);
    });
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
         title: "Election List",
         layout: "layout",
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
         title: "Election List",
         layout: "layout",
         elections: data,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        next(error);
      });
});

router.post("/votelist/:id", async (req, res) => {
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
  .post(url, _data)
  .then((result) => {
    console.log("result", result);
    res.status(200).json({ success: true }, result, convertedPrivKey);
  })
  .catch((err) => {
    res.status(err.response.status).json(err.response.statusText);
  });

  console.log(hash);
  res.status(200).json({ msg: "success" });
  
});

module.exports = router;
