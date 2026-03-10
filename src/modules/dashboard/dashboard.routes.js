const { Router } = require("express");
const DashBoardController = require("./dashboard.controller");

const router = Router()


router.get("/", DashBoardController.findAll)



module.exports = router;