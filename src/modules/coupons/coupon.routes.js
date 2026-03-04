const { Router } = require("express");
const CouponController = require("./coupon.controller");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");

const router = Router();

router.use(rotaProtegida);

router.post("/", CouponController.create);
router.get("/", CouponController.findAll);
router.get("/:id", CouponController.findById);
router.put("/:id", CouponController.update);
router.delete("/:id", CouponController.delete);
router.post("/:id/validar", CouponController.validar);

module.exports = router;