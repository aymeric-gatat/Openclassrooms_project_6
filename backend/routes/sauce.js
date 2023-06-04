const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");

router.post("/sauces", sauceCtrl.postSauce);
router.get("/sauces", sauceCtrl.getAllSauce);

module.exports = router;
