const express = require("express");
const router = express.Router();
const { validate } = require("../middlewares/validate");
const { userSchema } = require("../utils/schemas");
const UserController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware"); 

router.get("/", UserController.getAllUser);
router.get("/:id", UserController.getUserById);
router.patch("/:id", authMiddleware, UserController.updateUser);
router.delete("/:id", authMiddleware, UserController.deleteUser);

router.post("/register", validate(userSchema), UserController.register);
router.post("/login", UserController.login);
router.post("/change-password", authMiddleware, UserController.changePassword);

module.exports = router;

