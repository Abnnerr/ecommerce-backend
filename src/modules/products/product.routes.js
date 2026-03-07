const { Router } = require("express");
const ProductController = require("./product.controller");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");
const { validarProduto } = require("../../shared/middlewares/product.middleware");

const router = Router();

router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);

router.post(
  "/",
  rotaProtegida,
  validarProduto,
  ProductController.create
);

router.put(
  "/:id",
  rotaProtegida,
  validarProduto,
  ProductController.update
);

router.delete("/:id", rotaProtegida, ProductController.delete);

router.put(
  "/:id/tamanhos",
  rotaProtegida,
  ProductController.atualizarTamanhos
);

router.put(
  "/:id/cores",
  rotaProtegida,
  ProductController.atualizarCores
);

module.exports = router;