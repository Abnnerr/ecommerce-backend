const { Router } = require("express");
const CategoryController = require("./category.controller");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");

const router = Router();

router.get("/", CategoryController.findAll);
router.get("/:id", CategoryController.findById);

router.post("/", rotaProtegida, CategoryController.create);
router.put("/:id", rotaProtegida, CategoryController.update);
router.delete("/:id", rotaProtegida, CategoryController.delete);

module.exports = router;
