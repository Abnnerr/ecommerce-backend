const { Router } = require("express");

const healthRoutes = require("../modules/health/health.routes");
const orderRoutes = require("../modules/orders/order.routes");
const couponRoutes = require("../modules/coupons/coupon.routes");
const productRoutes = require("../modules/products/product.routes");
const userRoutes = require("../modules/users/users.routes");
const produtoRoutes = require("../modules/products/product.routes");
const categoryRoutes = require("../modules/categories/category.routes");
const reviewRoutes = require("../modules/reviews/review.routes");
const authRoutes = require("../modules/auth/auth.routes");


const router = Router();

router.use("/health", healthRoutes);
router.use("/orders", orderRoutes);
router.use("/coupons", couponRoutes);
router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/produtos", produtoRoutes);
router.use("/reviews", reviewRoutes);
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);




module.exports = router;
