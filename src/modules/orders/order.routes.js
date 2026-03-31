const { Router } = require("express");
const OrderController = require("./order.controller");
const FreteController = require("./frete.controller");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");
const { verifyAccess } = require("../../shared/middlewares/access.middleware");

// Middlewares de validação para criação de pedido
const validarUsuario = require("../../middlewares/validarUsuario.middleware");
const validarCEP = require("../../middlewares/validarCEP.middleware");
const validarCupom = require("../../middlewares/validarCupom.middleware");
const validarDesconto = require("../../middlewares/validarDesconto.middleware");
const validarPrevisaoEntrega = require("../../middlewares/validarPrevisaoEntrega.middleware");
const validarPedido = require("../../middlewares/validarPedido.middleware");

const router = Router();

router.post("/fretes", FreteController.calcular);


router.use(rotaProtegida);

router.post(
    "/",
    validarUsuario,
    // validarCEP,
    validarCupom,
    validarDesconto,
    validarPrevisaoEntrega,
    validarPedido,
    OrderController.create
);

// router.get("/", verifyAccess, OrderController.findAll);

router.get("/:id", OrderController.findById);
// router.put("/:id/status", verifyAccess, OrderController.updateStatus);
router.delete("/:id", OrderController.delete);

module.exports = router;