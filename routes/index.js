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
  const data = { ...req.body };
  const { idnumber, fullname, birthday, birthmonth, birthyear } = data;

  const { privKey, pubKey, _privKey, _pubKey, hash } = generateKeyPair(data);

  console.log("privKey", privKey);
  console.log("pubKey", pubKey);
  console.log('_privKey', _privKey);
  console.log('_pubKey', _pubKey);
  console.log(hash);

  const dob = new Date(birthyear, birthmonth, birthday);
  const _data = {
    type: "users",
    data: { id: idnumber, name: fullname, dob: dob, pubKey: [...pubKey] },
    signature: null,
    lock: null,
  };

  const url = `${baseURL}/action`;
  await axios
    .post(url, _data)
    .then((result) => {
      console.log("result: ", result.data);
      return res.status(200).json({ ...result.data, _privKey });
    })
    .catch((err) => {
      console.log('err', err)
      return res.status(400).json(err);
    });
});

router.get("/check-register", (req, res) => {
  res.render("check-register", { layout: "layout" });
});

router.post("/check-register", async (req, res) => {
  const data = { ...req.body };
  const { idnumber, fullname, birthday, birthmonth, birthyear } = data;

  const { privKey, pubKey, _privKey, _pubKey, hash } = generateKeyPair(data);
  const checkRegisteration = await didUserExist(_pubKey);
  console.log('checkRegisteration', checkRegisteration)

  if(checkRegisteration.address === false){
    res.status(400).json(checkRegisteration)
  }
  res.status(200).json(checkRegisteration)
});



module.exports = router;

//////////////////////////////////////////

const ArrayToStringHex = (array) => {
  return Array.from(array, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
};

const generateKeyPair = (data) => {
  const buffer = crypto
    .createHash("sha256")
    .update(JSON.stringify(JSON.stringify(data)))
    .digest();

  console.log('buffer', buffer);
  const hash = new Uint8Array(
    buffer.buffer,
    buffer.byteOffset,
    buffer.length / Uint8Array.BYTES_PER_ELEMENT
  );


  let privKey;
  do {
    privKey = hash;
  } while (!secp256k1.privateKeyVerify(privKey));

  const pubKey = secp256k1.publicKeyCreate(privKey);

  const _privKey = ArrayToStringHex(buffer);
  const _pubKey = ArrayToStringHex(pubKey);
  return { privKey, pubKey, _privKey, _pubKey, hash };
}

async function didUserExist(_pubKey) {
  return await axios.get(`${baseURL}/address/${_pubKey}`).then((result) => result.data)
}
