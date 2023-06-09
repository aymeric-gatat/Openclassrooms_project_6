const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sauceCtrl = require("../controllers/sauce");

router.get("/", auth, sauceCtrl.getAllSauce);
router.post("/", auth, multer, sauceCtrl.postSauce);
router.get("/id", auth, sauceCtrl.getSauce);
router.put(`/id`, auth, multer, sauceCtrl.putSauce);
router.delete("/id", auth, sauceCtrl.deleteSauce);
router.get("/", auth, sauceCtrl.getAllSauce);

module.exports = router;
