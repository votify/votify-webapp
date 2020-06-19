var express = require("express");
const secp256k1 = require("secp256k1");
const crypto = require("crypto");
const axios = require("axios");
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

  /* const hash = crypto
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
  console.log(_data); */


  const buffer = crypto
    .createHash("sha256")
    .update(JSON.stringify(JSON.stringify(data)))
    .digest();

  console.log('buffer', buffer)
  const hash = new Uint8Array(
    buffer.buffer,
    buffer.byteOffset,
    buffer.length / Uint8Array.BYTES_PER_ELEMENT
  );

  const _privKey = ArrayToStringHex(buffer);
  console.log('_privKey', _privKey);

  console.log(hash);

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
    data: { id: idnumber, name: fullname, dob: dob, pubKey: [...pubKey] },
    signature: null,
    lock: null,
  };

  const url = `${baseURL}/action`;
  console.log("baseURL", baseURL);
  await axios
    .post(url, _data)
    .then((result) => {
      console.log("result: ", result.data);
      return res.status(200).json({...result.data, _privKey});
    })
    .catch((err) => {
      console.log('err', err)
      return res.status(400).json(err);
    });
});

router.get("/check-register", (req, res) => {
  res.render("check-register", { layout: "layout" });
});

router.post("/check-register", (req, res) => {
  res.render("check-register", { layout: "layout" });
});

const ArrayToStringHex = (array) => {
  return Array.from(array, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
};

module.exports = router;
