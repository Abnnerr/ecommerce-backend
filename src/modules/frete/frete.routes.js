const { Router } = require("express"); 
const FreteController = require("./frete.controller");


const router =  Router();

router.post("/", FreteController.calcularFrete);


module.exports = router;  