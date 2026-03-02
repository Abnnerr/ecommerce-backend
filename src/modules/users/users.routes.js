const router = require("express").Router();
const Controller = require("./users.controller");

const usersController = new Controller();

router.post("/", (req, res, next) => usersController.create(req, res, next));
router.post("/login", (req, res, next) => usersController.login(req, res, next));

router.get("/confirm", (req, res, next) =>
  usersController.confirmEmail(req, res, next),
);

router.get("/", (req, res, next) => usersController.getAll(req, res, next));
router.get("/:id", (req, res, next) => usersController.getById(req, res, next));

router.patch("/:id", (req, res, next) =>
  usersController.update(req, res, next),
);

router.delete("/:id", (req, res, next) =>
  usersController.delete(req, res, next),
);

module.exports = router;
