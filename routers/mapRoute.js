const express = require("express");
const  router = express.Router();
const mailcontrol = require("../control/mailControl");


router.get("/all",mailcontrol.getList);
router.post("/filter",mailcontrol.getfilter);
router.post("/store",mailcontrol.store);

module.exports = router;    