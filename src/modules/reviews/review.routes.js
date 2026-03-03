const { Router } = require("express");
const ReviewController = require("./review.controller");

const router = Router();

router.post("/", ReviewController.create);
router.get("/", ReviewController.findAll);
router.get("/:id", ReviewController.findById);
router.patch("/:id", ReviewController.update);
router.delete("/:id", ReviewController.delete);

module.exports = router;
