const { Router } = require("express");
const OrderController = require("./order.controller");
const FreteController = require("./frete.controller");

const { rotaProtegida } = require("../../shared/middlewares/token.middleware");
const { validarUsuario, verificarEmailConfirmado } = require("../../shared/middlewares/user.middleware");
const validateStock = require("../../shared/middlewares/stock.middleware");
const validarPedido = require("../../shared/middlewares/validarPedido.middleware");
const validarCEP = require("../../shared/middlewares/validarCEP.middleware");
const validarPrevisaoEntrega = require("../../shared/middlewares/validarPrevisaoEntrega.middleware");
const {
  validarDadosPedido,
  validarAtualizacaoPedido,
} = require("../../shared/middlewares/order.middleware");

const router = Router();
const orderController = new OrderController();

router.post("/fretes", (req, res, next) =>
  FreteController.calcular(req, res, next)
);

router.use(rotaProtegida);
router.use(validarUsuario);
router.use(verificarEmailConfirmado);

router.post(
  "/",
  validarDadosPedido,
  validarCEP,
  validarPrevisaoEntrega,
  validarPedido,
  validateStock,
  (req, res, next) => orderController.create(req, res, next)
);

router.get("/", (req, res, next) =>
  orderController.getAll(req, res, next)
);

router.get("/:id", (req, res, next) =>
  orderController.getById(req, res, next)
);

router.put(
  "/:id",
  validarAtualizacaoPedido,
  (req, res, next) => orderController.update(req, res, next)
);

router.patch("/:id/status", (req, res, next) =>
  orderController.updateStatus(req, res, next)
);

router.delete("/:id", (req, res, next) =>
  orderController.delete(req, res, next)
);

module.exports = router;