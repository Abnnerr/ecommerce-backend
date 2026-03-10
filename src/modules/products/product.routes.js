const { Router } = require("express");
const ProductController = require("./product.controller");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");

const router = Router();



router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);

router.post("/",  ProductController.create);
router.put("/:id",  ProductController.update);
router.delete("/:id",  ProductController.delete);

router.put("/:id/tamanhos",  ProductController.atualizarTamanhos);

router.put("/:id/cores", ProductController.atualizarCores);

module.exports = router;