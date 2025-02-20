const express = require("express");
const usersController = require("../controllers/users.controller");

const router = express.Router();

router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.get("/:id", usersController.getUserById);
router.get("/", usersController.getAllUsers);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;