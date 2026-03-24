const { Router } = require("express");
const { rotaProtegida } = require("../shared/middlewares/token.middleware");

const healthRoutes = require("../modules/health/health.routes");
const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/users/users.routes");
const categoryRoutes = require("../modules/categories/category.routes");
const productRoutes = require("../modules/products/product.routes");
const reviewRoutes = require("../modules/reviews/review.routes");
const orderRoutes = require("../modules/orders/order.routes");
const couponRoutes = require("../modules/coupons/coupon.routes");

// const applyCouponRoutes = require("../modules/coupons/associacoupon.routes");


const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);

router.use("/users", userRoutes);
router.use("/orders", rotaProtegida, orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/coupons", couponRoutes);
// router.use("/coupons/apply", applyCouponRoutes);

module.exports = router;
