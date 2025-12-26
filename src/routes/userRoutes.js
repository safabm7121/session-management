import { Router } from "express";
import * as UserController from "../controllers/userController.js";
import { requireAuth } from "../auth/authMiddleware.js";

const router = Router();
router.get("/", requireAuth, UserController.getAllUsers);
router.get("/:id", requireAuth, UserController.getUserById);
router.delete("/:id", requireAuth, UserController.deleteUser);

export default router;
