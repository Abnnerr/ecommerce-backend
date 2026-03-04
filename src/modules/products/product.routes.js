const { Router } = require("express");
const ProductController = require("./product.controller");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");

const router = Router();

router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);

router.post("/", rotaProtegida, ProductController.create);
router.put("/:id", rotaProtegida, ProductController.update);
router.delete("/:id", rotaProtegida, ProductController.delete);

router.put("/:id/tamanhos", rotaProtegida, ProductController.atualizarTamanhos);

module.exports = router;